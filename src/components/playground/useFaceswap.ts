"use client";

// ─── useFaceswap — native real-time face-swap client ────────────────────────
//
// A lean, self-contained port of faker-100's WebRTC signaling flow (extracted
// from services/connection/{WebSocketManager,WebRTCManager}.ts + FaceSwapService
// .ts). It speaks the SAME wire protocol the production engine uses, so it
// connects to the live backend (api.liveface.app → faker-100 GPU server on
// Aries) with zero backend forks. Deliberately omits the paying-app concerns
// (billing loop, posthog, adaptive bitrate, multi-brand) — this is an anonymous
// trial demo for the Computex booth.
//
// Flow:
//   1. POST /api/faceswap-token {trial_uuid}  → { token, user_uuid, brand_id }
//      (trial_uuid persists in localStorage — the backend's cumulative trial
//      budget is keyed on it, so it must survive reloads)
//   2. WS  {WS}/ws/status?token&user_uuid  → server sends {type:'identity'}
//   3. GET /api/turn-credentials           → ICE servers (Cloudflare TURN)
//   4. RTCPeerConnection + addTrack(camera) + ontrack(remote swapped stream)
//   5. POST {HTTP}/ws/offer  (SDP + target_face_b64) → answer → setRemoteDesc
//      · 503 = GPU circuit breaker (NOT the queue) → countdown + auto-retry
//      · 200 {status:'queued'} = real queue → wait for WS control push
//      · promotion {type:'control', action:'start_connection'} → FRESH PC
//        (backend drops all ICE trickled while queued) + re-offer
//   6. trickle ICE via POST {HTTP}/ws/ice-candidate
//   7. phase='live' only on evidence of real decoded frames (not ontrack)
//   8. switch face live via WS {type:'config_update', config:{target_face_b64}}

import { useCallback, useEffect, useRef, useState } from "react";

const WS_BASE = process.env.NEXT_PUBLIC_FACESWAP_WS || "wss://api.liveface.app";
const HTTP_BASE = WS_BASE.replace(/^wss:\/\//, "https://").replace(/^ws:\/\//, "http://");
const WS_STATUS_URL = `${WS_BASE.replace(/\/$/, "")}/ws/status`;

const CONNECT_TIMEOUT_MS = 15_000;
const OFFER_TIMEOUT_MS = 30_000;
// Offer accepted → first decoded frame. Shorter than faker-100's 30s because a
// booth demo visitor won't stare at a spinner that long anyway.
const FIRST_FRAME_TIMEOUT_MS = 20_000;
// Real queue (HTTP 200 status:'queued') hard cap — promotion is server-pushed
// and normally arrives in well under this; past 180s assume the push was lost.
const QUEUE_WAIT_TIMEOUT_MS = 180_000;
// connectionState 'disconnected' self-heal window. Browsers routinely bounce
// disconnected→connected on transient jitter (Wi-Fi handover, captive portal
// blips); erroring instantly killed perfectly recoverable sessions. A 30s demo
// doesn't warrant the full ICE-restart machinery the main app has
// (WebRTCManager.attemptIceRestart) — the grace window alone is the cure here:
// anything that doesn't self-heal in 5s won't recover within demo timescale.
const ICE_GRACE_MS = 5_000;
// 503 circuit-breaker auto-retries before giving up with a manual-retry error.
const MAX_BUSY_RETRIES = 2;
const DEFAULT_BUSY_RETRY_S = 10;

// ─── Stable trial identity ────────────────────────────────────────────────
// The backend enforces a cumulative per-trial_uuid budget; a fresh uuid per
// run would reset it every time. Persist one uuid per browser (mirrors
// faker-100's cookie-persisted trial_user_uuid + utils/trialUuidGuard.ts).
const PLAYGROUND_UUID_KEY = "scamai_playground_uuid";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let inMemoryUuid = ""; // fallback when localStorage is unavailable (private mode)

function mintUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // RFC 4122 v4 fallback for ancient runtimes (mirrors trialUuidGuard.ts).
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getPlaygroundUuid(): string {
  try {
    const existing = localStorage.getItem(PLAYGROUND_UUID_KEY);
    if (existing && UUID_RE.test(existing)) return existing;
  } catch {
    /* localStorage unavailable */
  }
  if (!inMemoryUuid) inMemoryUuid = mintUuid();
  try {
    localStorage.setItem(PLAYGROUND_UUID_KEY, inMemoryUuid);
  } catch {
    /* private mode — in-memory uuid still stable for this page load */
  }
  return inMemoryUuid;
}

export type FaceswapPhase =
  | "idle"
  | "connecting"
  | "queued"
  | "busy" // GPU circuit breaker (503) — auto-retrying, NOT in the queue
  | "live"
  | "ended"
  | "error";

export interface FaceswapState {
  phase: FaceswapPhase;
  status: string;
  error: string;
  remoteStream: MediaStream | null;
  hasFirstFrame: boolean;
  queuePosition: number | null;
  // Seconds until the next automatic offer retry while phase === 'busy'.
  busyRetryIn: number | null;
  // Non-fatal hint, e.g. a target photo with no detectable face. The live
  // session keeps running on the previous face; the UI shows a dismissible toast.
  faceWarning: string;
}

const NO_FACE_HINT = "No face detected in that photo — try a clear, front-facing one.";
const isNoFaceError = (s: string) =>
  /no[_ ]?face|front-facing|no face detected|face.*not.*found/i.test(s || "");

const BUSY_EXHAUSTED_MSG =
  "The demo is at full capacity right now. Give it a minute, then try again.";

interface StartArgs {
  targetFaceB64: string;
  localStream: MediaStream;
}

export function useFaceswap() {
  const [state, setState] = useState<FaceswapState>({
    phase: "idle",
    status: "",
    error: "",
    remoteStream: null,
    hasFirstFrame: false,
    queuePosition: null,
    busyRetryIn: null,
    faceWarning: "",
  });

  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const clientIdRef = useRef<string>("");
  const tokenRef = useRef<string>("");
  const brandIdRef = useRef<string>("");
  const userUuidRef = useRef<string>("");
  const targetFaceRef = useRef<string>("");
  const cancelledRef = useRef<boolean>(false);
  // Holds the function that (re)posts the SDP offer — re-invoked by the busy
  // (503) auto-retry on the SAME PeerConnection.
  const postOfferRef = useRef<(() => Promise<void>) | null>(null);
  // Holds the queue-promotion path: fresh PC + re-offer. The backend drops all
  // ICE trickled pre/while-queued and expects a NEW ufrag on promotion, so
  // re-offering on the old PC would poison ICE pairing.
  const promoteRef = useRef<(() => Promise<void>) | null>(null);
  // Mirror of state.phase for timers/WS handlers (state is stale in closures).
  const phaseRef = useRef<FaceswapPhase>("idle");
  const hasFirstFrameRef = useRef<boolean>(false);
  // Timers — all cleared in stop() so an unmount mid-queue/mid-busy can't fire.
  const iceGraceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstFrameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queueWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busyTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const busyRetriesRef = useRef<number>(0);
  const notQueuedRetriedRef = useRef<boolean>(false);
  // Tears down the hidden first-frame probe <video> (see armFirstFrameDetection).
  const frameProbeCleanupRef = useRef<(() => void) | null>(null);

  const patch = useCallback((p: Partial<FaceswapState>) => {
    if (p.phase) phaseRef.current = p.phase;
    setState((s) => ({ ...s, ...p }));
  }, []);

  // ─── Teardown ─────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    cancelledRef.current = true;
    postOfferRef.current = null;
    promoteRef.current = null;
    if (iceGraceTimerRef.current) {
      clearTimeout(iceGraceTimerRef.current);
      iceGraceTimerRef.current = null;
    }
    if (firstFrameTimerRef.current) {
      clearTimeout(firstFrameTimerRef.current);
      firstFrameTimerRef.current = null;
    }
    if (queueWatchdogRef.current) {
      clearTimeout(queueWatchdogRef.current);
      queueWatchdogRef.current = null;
    }
    if (busyTickRef.current) {
      clearInterval(busyTickRef.current);
      busyTickRef.current = null;
    }
    frameProbeCleanupRef.current?.();
    frameProbeCleanupRef.current = null;
    try {
      wsRef.current?.close(1000, "client stop");
    } catch {
      /* swallow */
    }
    wsRef.current = null;
    try {
      pcRef.current?.close();
    } catch {
      /* swallow */
    }
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    clientIdRef.current = "";
  }, []);

  useEffect(() => () => stop(), [stop]);

  // Terminal failure: surface the error, then tear everything down so no
  // timer/probe/WS outlives the session (start-path errors already did this;
  // async paths — promotion, busy retry, watchdogs — route through here too).
  const failSession = useCallback(
    (message: string) => {
      if (cancelledRef.current) return;
      patch({ phase: "error", error: message, busyRetryIn: null });
      stop();
    },
    [patch, stop]
  );

  // ─── Queue-wait watchdog ──────────────────────────────────────────────────
  // The real queue (HTTP 200 status:'queued') resolves via a server WS push;
  // if that push is lost (backend restart, WS hiccup) the old code waited
  // forever. Armed ONCE on entering the queue (position updates don't reset
  // it); cleared on promotion / not_queued / stop.
  const clearQueueWatchdog = useCallback(() => {
    if (queueWatchdogRef.current) {
      clearTimeout(queueWatchdogRef.current);
      queueWatchdogRef.current = null;
    }
  }, []);

  const armQueueWatchdog = useCallback(() => {
    if (queueWatchdogRef.current) return; // already armed — hard cap, no reset
    queueWatchdogRef.current = setTimeout(() => {
      queueWatchdogRef.current = null;
      if (cancelledRef.current || phaseRef.current !== "queued") return;
      failSession("The line didn't move for 3 minutes — the demo is unusually busy. Please try again later.");
    }, QUEUE_WAIT_TIMEOUT_MS);
  }, [failSession]);

  // ─── First-frame detection + watchdog ─────────────────────────────────────
  // ontrack fires at SDP-apply time, BEFORE any RTP — flipping phase='live'
  // there started the 30s demo countdown on a black screen. We only go live on
  // evidence of real decoded frames (canonical: FaceSwapService wires
  // FPSMonitor's hidden-video first-frame callback). Three detectors race on
  // a hidden probe <video>, first one wins (markLive is idempotent):
  //   · requestVideoFrameCallback — per-composited-frame, strongest signal
  //   · timeupdate / currentTime>0 — fires on hidden videos too (rVFC can be
  //     starved when the element isn't composited)
  //   · track 'unmute' — first RTP; Safari fallback
  const armFirstFrameWatchdog = useCallback(() => {
    if (firstFrameTimerRef.current) clearTimeout(firstFrameTimerRef.current);
    firstFrameTimerRef.current = setTimeout(() => {
      firstFrameTimerRef.current = null;
      if (cancelledRef.current || hasFirstFrameRef.current) return;
      failSession(
        "Connected, but no video arrived. A firewall or VPN may be blocking the stream — try a different network, then run it again."
      );
    }, FIRST_FRAME_TIMEOUT_MS);
  }, [failSession]);

  const armFirstFrameDetection = useCallback(
    (stream: MediaStream, track: MediaStreamTrack) => {
      frameProbeCleanupRef.current?.();

      const probe = document.createElement("video");
      probe.muted = true;
      probe.playsInline = true;
      probe.style.display = "none";
      probe.srcObject = stream;
      document.body.appendChild(probe);
      probe.play().catch(() => {
        /* autoplay block can't happen on a muted, hidden video */
      });

      let disposed = false;
      const cleanup = () => {
        if (disposed) return;
        disposed = true;
        probe.ontimeupdate = null;
        track.onunmute = null;
        probe.srcObject = null;
        probe.remove();
      };
      frameProbeCleanupRef.current = cleanup;

      const markLive = () => {
        if (disposed) return;
        cleanup();
        frameProbeCleanupRef.current = null;
        if (cancelledRef.current || hasFirstFrameRef.current) return;
        hasFirstFrameRef.current = true;
        if (firstFrameTimerRef.current) {
          clearTimeout(firstFrameTimerRef.current);
          firstFrameTimerRef.current = null;
        }
        patch({
          phase: "live",
          hasFirstFrame: true,
          status: "",
          queuePosition: null,
          busyRetryIn: null,
        });
      };

      type RVFCVideo = HTMLVideoElement & {
        requestVideoFrameCallback?: (cb: () => void) => number;
      };
      (probe as RVFCVideo).requestVideoFrameCallback?.(() => markLive());
      probe.ontimeupdate = () => {
        if (probe.currentTime > 0) markLive();
      };
      track.onunmute = () => markLive();
    },
    [patch]
  );

  // ─── ICE candidate trickle (cross-origin POST, CORS-allowlisted) ──────────
  const sendIceCandidate = useCallback((candidate: RTCIceCandidate) => {
    const clientId = clientIdRef.current;
    if (!clientId) return;
    fetch(`${HTTP_BASE}/ws/ice-candidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(brandIdRef.current ? { "X-Brand-Id": brandIdRef.current } : {}),
        ...(tokenRef.current ? { Authorization: `Bearer ${tokenRef.current}` } : {}),
      },
      body: JSON.stringify({ candidate, client_id: clientId }),
    }).catch(() => {
      /* non-fatal — late candidates after session cleanup 404, expected */
    });
  }, []);

  const fetchTurn = useCallback(async (): Promise<RTCConfiguration> => {
    try {
      const res = await fetch("/api/turn-credentials", { signal: AbortSignal.timeout(8_000) });
      if (res.ok) {
        const data = await res.json();
        if (data?.iceServers) return { iceServers: data.iceServers };
      }
    } catch {
      /* fall through to STUN */
    }
    return { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
  }, []);

  // ─── PeerConnection factory ───────────────────────────────────────────────
  // Used by start() AND the queue-promotion / not_queued paths, which must
  // rebuild a FRESH PC (new ICE ufrag) because the backend dropped everything
  // trickled while queued (canonical: WebRTCManager.createConnection — close
  // the old PC first, or every retry leaks one until Chrome's ~500 cap).
  const buildPeerConnection = useCallback(
    async (localStream: MediaStream): Promise<RTCPeerConnection> => {
      const old = pcRef.current;
      if (old) {
        old.ontrack = null;
        old.onicecandidate = null;
        old.onconnectionstatechange = null;
        try {
          old.close();
        } catch {
          /* idempotent */
        }
        pcRef.current = null;
      }
      // A pending grace timer belongs to the old PC — drop it.
      if (iceGraceTimerRef.current) {
        clearTimeout(iceGraceTimerRef.current);
        iceGraceTimerRef.current = null;
      }

      const iceConfig = await fetchTurn();
      const pc = new RTCPeerConnection(iceConfig);
      pcRef.current = pc;

      pc.ontrack = (event) => {
        if (pcRef.current !== pc) return; // stale PC (replaced on promotion)
        const remote = event.streams[0] ?? new MediaStream([event.track]);
        // Low-latency: don't let the jitter buffer grow on bursty GPU cadence.
        try {
          (event.receiver as RTCRtpReceiver & { jitterBufferTarget?: number }).jitterBufferTarget = 0;
        } catch {
          /* unsupported browser — default behavior */
        }
        // Wire the stream now, but DON'T flip phase='live' yet — that waits
        // for evidence of real frames (see armFirstFrameDetection above).
        patch({ remoteStream: remote });
        if (!hasFirstFrameRef.current) armFirstFrameDetection(remote, event.track);
      };

      pc.onicecandidate = (event) => {
        if (pcRef.current !== pc) return; // stale generation — don't trickle
        if (event.candidate) sendIceCandidate(event.candidate);
      };

      pc.onconnectionstatechange = () => {
        if (pcRef.current !== pc || cancelledRef.current) return;
        const st = pc.connectionState;
        if (st === "connected") {
          // Self-healed within grace — recover silently.
          if (iceGraceTimerRef.current) {
            clearTimeout(iceGraceTimerRef.current);
            iceGraceTimerRef.current = null;
          }
          return;
        }
        if (st === "failed") {
          // Terminal: no candidate pair left — no grace can save it.
          failSession("Connection lost. Please try again.");
          return;
        }
        if (st === "disconnected") {
          // Transient by design (see ICE_GRACE_MS comment) — give it 5s to
          // bounce back to 'connected' before declaring the session dead.
          if (iceGraceTimerRef.current) return; // grace already running
          iceGraceTimerRef.current = setTimeout(() => {
            iceGraceTimerRef.current = null;
            if (cancelledRef.current || pcRef.current !== pc) return;
            const cur = pc.connectionState;
            if (cur === "connected") return; // healed during grace
            failSession("Connection lost. Please try again.");
          }, ICE_GRACE_MS);
        }
      };

      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      return pc;
    },
    [armFirstFrameDetection, failSession, fetchTurn, patch, sendIceCandidate]
  );

  // ─── 503 circuit-breaker auto-retry ───────────────────────────────────────
  // 503 = the backend's GPU breaker REFUSED the offer; the client was never
  // enqueued and no control:start_connection push will ever come (the old code
  // patched phase='queued' here → infinite spinner). Count down retry_after,
  // then re-post the offer on the same PC; cap at MAX_BUSY_RETRIES.
  const scheduleBusyRetry = useCallback(
    (seconds: number) => {
      if (busyTickRef.current) clearInterval(busyTickRef.current);
      let remaining = Math.max(1, Math.round(seconds));
      patch({ phase: "busy", busyRetryIn: remaining, status: "", queuePosition: null });
      busyTickRef.current = setInterval(() => {
        if (cancelledRef.current) {
          if (busyTickRef.current) clearInterval(busyTickRef.current);
          busyTickRef.current = null;
          return;
        }
        remaining -= 1;
        if (remaining > 0) {
          patch({ busyRetryIn: remaining });
          return;
        }
        if (busyTickRef.current) clearInterval(busyTickRef.current);
        busyTickRef.current = null;
        patch({ phase: "connecting", busyRetryIn: null, status: "Retrying…" });
        postOfferRef.current?.().catch((e) => {
          failSession((e as Error).message || "Could not start the demo.");
        });
      }, 1000);
    },
    [failSession, patch]
  );

  // ─── Status WebSocket: resolves with the server-assigned client_id ────────
  const openStatusWs = useCallback(
    (token: string, userUuid: string): Promise<string> =>
      new Promise((resolve, reject) => {
        let url = `${WS_STATUS_URL}?token=${encodeURIComponent(token)}`;
        if (userUuid) url += `&user_uuid=${encodeURIComponent(userUuid)}`;

        let ws: WebSocket;
        try {
          ws = new WebSocket(url);
        } catch (e) {
          reject(new Error(`WebSocket create failed: ${(e as Error).message}`));
          return;
        }
        wsRef.current = ws;

        const timeout = setTimeout(() => {
          try {
            ws.close();
          } catch {
            /* swallow */
          }
          reject(new Error("Connection timed out. Check your network and retry."));
        }, CONNECT_TIMEOUT_MS);

        ws.onopen = () => patch({ status: "Setting up your session…" });

        ws.onclose = (ev) => {
          clearTimeout(timeout);
          if (ev.code === 4001) {
            if (!cancelledRef.current) {
              patch({ phase: "error", error: "Session expired — please reload and try again." });
            }
            reject(new Error("Session token rejected"));
          }
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          if (!cancelledRef.current) {
            reject(new Error("Couldn't reach the server. Check your connection."));
          }
        };

        ws.onmessage = (ev) => {
          let data: Record<string, unknown>;
          try {
            data = JSON.parse(ev.data as string);
          } catch {
            return;
          }
          switch (data.type) {
            case "identity": {
              const clientId = data.client_id as string | undefined;
              if (!clientId) {
                reject(new Error("Backend identity message missing client_id"));
                return;
              }
              clearTimeout(timeout);
              clientIdRef.current = clientId;
              // Send minimal device info (backend keys session UUID off it).
              try {
                ws.send(
                  JSON.stringify({
                    type: "device_info",
                    client_id: clientId,
                    device_info: {
                      userUuid,
                      deviceType: "desktop",
                      source: "scamai-computex-playground",
                    },
                  })
                );
              } catch {
                /* swallow */
              }
              patch({ status: "Starting secure connection…" });
              resolve(clientId);
              break;
            }
            case "status_update": {
              if (data.status === "queued") {
                const pos = typeof data.position === "number" ? data.position : null;
                patch({ phase: "queued", queuePosition: pos, status: "Demo is busy — you're in line…" });
                armQueueWatchdog();
              } else if (data.status === "not_queued") {
                // Server says we're NOT in its queue (e.g. queue state lost
                // across a backend restart) — waiting for a promotion push
                // would spin forever. Re-POST the offer once, on a fresh PC
                // (same reason as promotion: our queued-era ICE was dropped).
                if (
                  phaseRef.current === "queued" &&
                  !cancelledRef.current &&
                  !notQueuedRetriedRef.current &&
                  promoteRef.current
                ) {
                  notQueuedRetriedRef.current = true;
                  clearQueueWatchdog();
                  promoteRef.current().catch((e) => {
                    failSession((e as Error).message || "Could not start the demo.");
                  });
                }
              }
              break;
            }
            case "control": {
              // Promoted out of the queue → fresh PC + re-offer (the backend
              // dropped every ICE candidate we trickled while queued and
              // expects a new ufrag — see promoteRef).
              if (data.action === "start_connection" && !cancelledRef.current && promoteRef.current) {
                promoteRef.current().catch((e) => {
                  failSession((e as Error).message || "Could not start the demo.");
                });
              }
              break;
            }
            case "config_update_result": {
              // Backend rejects a face switch when the new target has no
              // detectable face. Non-fatal: keep the current swap, hint the user.
              if (data.status === "error" && !cancelledRef.current) {
                patch({ faceWarning: NO_FACE_HINT });
              }
              break;
            }
            case "error": {
              if (data.error_type === "TIME_EXPIRED") {
                patch({ phase: "ended", status: "" });
                stop();
              } else if (!cancelledRef.current) {
                const msg =
                  typeof data.message === "string" && data.message ? data.message : "Backend error.";
                // A "no face" verdict is user-input, not a connection failure —
                // don't tear the session down, just surface a dismissible hint.
                if (isNoFaceError(msg) || isNoFaceError(String(data.error_type))) {
                  patch({ faceWarning: NO_FACE_HINT });
                } else {
                  patch({ phase: "error", error: msg });
                }
              }
              break;
            }
          }
        };
      }),
    [armQueueWatchdog, clearQueueWatchdog, failSession, patch, stop]
  );

  // ─── Main entry: connect + start the live swap ────────────────────────────
  const start = useCallback(
    async ({ targetFaceB64, localStream }: StartArgs) => {
      cancelledRef.current = false;
      targetFaceRef.current = targetFaceB64;
      localStreamRef.current = localStream;
      hasFirstFrameRef.current = false;
      busyRetriesRef.current = 0;
      notQueuedRetriedRef.current = false;
      patch({
        phase: "connecting",
        error: "",
        status: "Warming up the swap engine…",
        hasFirstFrame: false,
        remoteStream: null,
        queuePosition: null,
        busyRetryIn: null,
        faceWarning: "",
      });

      try {
        // 1) token (server-side proxy; trial_uuid keys the backend's
        //    cumulative trial budget — see getPlaygroundUuid)
        const tokRes = await fetch("/api/faceswap-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trial_uuid: getPlaygroundUuid() }),
        });
        if (!tokRes.ok) throw new Error("Could not start the demo (token).");
        const { token, user_uuid, brand_id } = (await tokRes.json()) as {
          token: string;
          user_uuid: string;
          brand_id: string;
        };
        tokenRef.current = token;
        userUuidRef.current = user_uuid;
        brandIdRef.current = brand_id || "";
        if (cancelledRef.current) return;

        // 2) status WS → client_id (stored in clientIdRef by the handler)
        await openStatusWs(token, user_uuid);
        if (cancelledRef.current) return;

        // 3) PC + ICE config (shared factory — also used on queue promotion)
        await buildPeerConnection(localStream);
        if (cancelledRef.current) return;

        // 5) offer (re-postable for the busy auto-retry)
        const postOffer = async () => {
          const current = pcRef.current;
          if (!current || cancelledRef.current) return;
          // Roll back any pending local offer before re-negotiating (the 503
          // busy auto-retry re-enters here while the PC is still in
          // have-local-offer; queue promotion does NOT — it builds a fresh PC).
          if (current.signalingState === "have-local-offer") {
            await current.setLocalDescription({ type: "rollback" });
          }
          const offer = await current.createOffer();
          await current.setLocalDescription(offer);

          const controller = new AbortController();
          const t = setTimeout(() => controller.abort(), OFFER_TIMEOUT_MS);
          let res: Response;
          try {
            res = await fetch(`${HTTP_BASE}/ws/offer`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(brandIdRef.current ? { "X-Brand-Id": brandIdRef.current } : {}),
                Authorization: `Bearer ${tokenRef.current}`,
              },
              body: JSON.stringify({
                sdp: offer.sdp,
                type: offer.type,
                client_id: clientIdRef.current,
                token: tokenRef.current,
                face_swap_config: {
                  target_face_b64: targetFaceRef.current,
                  enhance: false,
                  mouth_mask: false,
                },
              }),
              signal: controller.signal,
            });
          } finally {
            clearTimeout(t);
          }

          if (res.status === 503) {
            // GPU circuit breaker — NOT the queue (the backend never enqueues
            // breaker-blocked offers; body is {reason:'server_busy',
            // retry_after, queue_position:null} + Retry-After header).
            // Patching 'queued' here waited for a promotion push that can
            // never come. Auto-retry after retry_after instead.
            if (busyRetriesRef.current >= MAX_BUSY_RETRIES) {
              throw new Error(BUSY_EXHAUSTED_MSG);
            }
            busyRetriesRef.current += 1;
            let retryAfter = 0;
            try {
              const body = (await res.clone().json()) as { retry_after?: unknown };
              if (typeof body?.retry_after === "number" && body.retry_after > 0) {
                retryAfter = body.retry_after;
              }
            } catch {
              /* non-JSON 503 (nginx) — fall through to header */
            }
            if (!retryAfter) {
              const header = Number(res.headers.get("Retry-After"));
              if (Number.isFinite(header) && header > 0) retryAfter = header;
            }
            scheduleBusyRetry(Math.min(retryAfter || DEFAULT_BUSY_RETRY_S, 120));
            return;
          }
          if (!res.ok) {
            let detail = "";
            try {
              const body = await res.clone().json();
              detail = String(body?.error ?? body?.message ?? "");
            } catch {
              /* non-JSON body */
            }
            if (res.status === 422 || isNoFaceError(detail)) throw new Error(NO_FACE_HINT);
            throw new Error(`Server error (${res.status}). Please try again.`);
          }

          const answer = await res.json();
          if (answer.status === "queued") {
            // Real queue (HTTP 200): the server WILL push control:
            // start_connection when a slot frees. Capture queue_position so
            // the UI shows the position immediately, before the WS
            // status_update arrives; arm the 180s no-promotion watchdog.
            const pos = typeof answer.queue_position === "number" ? answer.queue_position : null;
            patch({ phase: "queued", status: "Demo is busy — you're in line…", queuePosition: pos });
            armQueueWatchdog();
            return;
          }
          if (!answer?.sdp || answer.type !== "answer") {
            throw new Error("The server returned an invalid response. Please retry.");
          }
          if (cancelledRef.current || pcRef.current !== current) return;
          if (current.signalingState !== "have-local-offer") return;
          await current.setRemoteDescription(new RTCSessionDescription(answer));
          patch({ status: "AI model loaded. Your face is on the way…" });
          // Offer accepted — if no real frame lands within 20s, fail loud
          // instead of silently burning the demo on a black screen.
          armFirstFrameWatchdog();
        };

        // Queue promotion / not_queued recovery: FRESH PeerConnection (reuse
        // the already-granted camera stream — never re-getUserMedia), then
        // re-offer with the SAME client_id. Mirrors FaceSwapService.
        // retryFromQueue → WebRTCManager.createConnection at this demo's scale.
        const promote = async () => {
          const stream = localStreamRef.current;
          if (!stream || cancelledRef.current) return;
          clearQueueWatchdog();
          patch({ phase: "connecting", status: "Your turn — connecting…", queuePosition: null });
          await buildPeerConnection(stream);
          if (cancelledRef.current) return;
          await postOffer();
        };

        postOfferRef.current = postOffer;
        promoteRef.current = promote;
        await postOffer();
      } catch (err) {
        if (cancelledRef.current) return;
        patch({ phase: "error", error: (err as Error).message || "Could not start the demo." });
        stop();
      }
    },
    [
      armFirstFrameWatchdog,
      armQueueWatchdog,
      buildPeerConnection,
      clearQueueWatchdog,
      openStatusWs,
      patch,
      scheduleBusyRetry,
      stop,
    ]
  );

  // ─── Switch target face live (no reconnect) ───────────────────────────────
  const setFace = useCallback((targetFaceB64: string) => {
    targetFaceRef.current = targetFaceB64;
    patch({ faceWarning: "" }); // clear any prior no-face hint on a new attempt
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN && clientIdRef.current) {
      ws.send(
        JSON.stringify({
          type: "config_update",
          client_id: clientIdRef.current,
          config: { target_face_b64: targetFaceB64 },
        })
      );
    }
  }, [patch]);

  return { state, start, stop, setFace };
}
