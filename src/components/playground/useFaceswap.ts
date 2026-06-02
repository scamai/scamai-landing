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
//   1. POST /api/faceswap-token            → { token, user_uuid, brand_id }
//   2. WS  {WS}/ws/status?token&user_uuid  → server sends {type:'identity'}
//   3. GET /api/turn-credentials           → ICE servers (Cloudflare TURN)
//   4. RTCPeerConnection + addTrack(camera) + ontrack(remote swapped stream)
//   5. POST {HTTP}/ws/offer  (SDP + target_face_b64) → answer → setRemoteDesc
//   6. trickle ICE via POST {HTTP}/ws/ice-candidate
//   7. switch face live via WS {type:'config_update', config:{target_face_b64}}

import { useCallback, useEffect, useRef, useState } from "react";

const WS_BASE = process.env.NEXT_PUBLIC_FACESWAP_WS || "wss://api.liveface.app";
const HTTP_BASE = WS_BASE.replace(/^wss:\/\//, "https://").replace(/^ws:\/\//, "http://");
const WS_STATUS_URL = `${WS_BASE.replace(/\/$/, "")}/ws/status`;

const CONNECT_TIMEOUT_MS = 15_000;
const OFFER_TIMEOUT_MS = 30_000;

export type FaceswapPhase =
  | "idle"
  | "connecting"
  | "queued"
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
  // Non-fatal hint, e.g. a target photo with no detectable face. The live
  // session keeps running on the previous face; the UI shows a dismissible toast.
  faceWarning: string;
}

const NO_FACE_HINT = "No face detected in that photo — try a clear, front-facing one.";
const isNoFaceError = (s: string) =>
  /no[_ ]?face|front-facing|no face detected|face.*not.*found/i.test(s || "");

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
  // Holds the function that (re)posts the SDP offer — re-invoked when the
  // server promotes us out of the queue via {type:'control', start_connection}.
  const postOfferRef = useRef<(() => Promise<void>) | null>(null);

  const patch = useCallback((p: Partial<FaceswapState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  // ─── Teardown ─────────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    cancelledRef.current = true;
    postOfferRef.current = null;
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
              }
              break;
            }
            case "control": {
              // Promoted out of the queue → (re)send the offer.
              if (data.action === "start_connection" && postOfferRef.current) {
                postOfferRef.current().catch((e) => {
                  if (!cancelledRef.current) patch({ phase: "error", error: (e as Error).message });
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
    [patch, stop]
  );

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

  // ─── Main entry: connect + start the live swap ────────────────────────────
  const start = useCallback(
    async ({ targetFaceB64, localStream }: StartArgs) => {
      cancelledRef.current = false;
      targetFaceRef.current = targetFaceB64;
      localStreamRef.current = localStream;
      patch({
        phase: "connecting",
        error: "",
        status: "Warming up the swap engine…",
        hasFirstFrame: false,
        remoteStream: null,
        queuePosition: null,
        faceWarning: "",
      });

      try {
        // 1) token (server-side proxy)
        const tokRes = await fetch("/api/faceswap-token", { method: "POST" });
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

        // 2) status WS → client_id
        const clientId = await openStatusWs(token, user_uuid);
        if (cancelledRef.current) return;

        // 3) PC + ICE config
        const iceConfig = await fetchTurn();
        if (cancelledRef.current) return;
        const pc = new RTCPeerConnection(iceConfig);
        pcRef.current = pc;

        pc.ontrack = (event) => {
          const remote = event.streams[0] ?? new MediaStream([event.track]);
          // Low-latency: don't let the jitter buffer grow on bursty GPU cadence.
          try {
            (event.receiver as RTCRtpReceiver & { jitterBufferTarget?: number }).jitterBufferTarget = 0;
          } catch {
            /* unsupported browser — default behavior */
          }
          patch({ remoteStream: remote, hasFirstFrame: true, phase: "live", status: "", queuePosition: null });
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) sendIceCandidate(event.candidate);
        };

        pc.onconnectionstatechange = () => {
          const st = pc.connectionState;
          if ((st === "failed" || st === "disconnected") && !cancelledRef.current) {
            patch({ phase: "error", error: "Connection lost. Please try again." });
          }
        };

        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        // 5) offer (re-postable for queue promotion)
        const postOffer = async () => {
          const current = pcRef.current;
          if (!current || cancelledRef.current) return;
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
            patch({ phase: "queued", status: "Demo is busy — you're in line…" });
            return; // server will send control:start_connection when a slot frees
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
            // Capture queue_position from the offer response so the UI shows
            // the correct position immediately, before the WS status_update arrives.
            const pos = typeof answer.queue_position === "number" ? answer.queue_position : null;
            patch({ phase: "queued", status: "Demo is busy — you're in line…", queuePosition: pos });
            return;
          }
          if (!answer?.sdp || answer.type !== "answer") {
            throw new Error("The server returned an invalid response. Please retry.");
          }
          if (cancelledRef.current || pcRef.current !== current) return;
          if (current.signalingState !== "have-local-offer") return;
          await current.setRemoteDescription(new RTCSessionDescription(answer));
          patch({ status: "AI model loaded. Your face is on the way…" });
        };

        postOfferRef.current = postOffer;
        await postOffer();
      } catch (err) {
        if (cancelledRef.current) return;
        patch({ phase: "error", error: (err as Error).message || "Could not start the demo." });
        stop();
      }
    },
    [fetchTurn, openStatusWs, patch, sendIceCandidate, stop]
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
