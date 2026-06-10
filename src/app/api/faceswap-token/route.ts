import { NextRequest, NextResponse } from "next/server";

// ─── Faceswap demo session-token proxy ──────────────────────────────────────
//
// The Computex playground reuses the live faceswap engine (faker-100 backend on
// Aries, fronted by api.liveface.app). To mint an anonymous trial session token
// WITHOUT shipping the shared SESSION_TOKEN_SECRET into this repo, we proxy the
// upstream brand's public /api/session-token endpoint server-side (no CORS, no
// secret here). The returned token is HMAC-signed by the upstream and accepted
// by the WebRTC backend; we additionally decode its (unencrypted, base64url)
// payload to surface the brand_id the client must echo back as X-Brand-Id.
//
// Upstream contract (faker-100 app/api/session-token/route.ts):
//   - body.context === 'playground' → mints tier='demo' (sub-capped on the GPU,
//     back of the admission queue, never billed). Without it the empty-body
//     POST minted tier='trial' and scam.ai sessions competed with PAYING
//     liveface users for GPU slots.
//   - body.trial_uuid (RFC 4122 string) → consumed as the token's user_uuid,
//     keying the backend's cumulative per-trial budget. The client persists it
//     in localStorage so the budget survives reloads; we forward it verbatim.
//   - per-IP rate limiter reads x-forwarded-for (first entry) / x-real-ip —
//     we forward the END-USER's IP so all scam.ai visitors don't collapse
//     into this function's single egress-IP bucket.
//
// Backend ALLOWED_ORIGINS was extended to include https://scam.ai +
// http://localhost:3000 so the cross-origin /ws/offer + /ws/ice-candidate POSTs
// from this site pass CORS (see backend/faceswap-server/.env on Aries).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPSTREAM =
  process.env.FACESWAP_TOKEN_UPSTREAM || "https://liveface.app/api/session-token";

// RFC 4122 shape (mirrors faker-100 utils/trialUuidGuard.ts) — anything else
// is dropped so garbage can't flow into the upstream's uuid-typed columns.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Token format (faker-100 lib/face-token.ts): <base64url(JSON payload)>.<hex sig>
function decodeBrandId(token: string): string {
  try {
    const payloadB64 = token.split(".")[0];
    const json = Buffer.from(payloadB64, "base64url").toString("utf8");
    const claims = JSON.parse(json) as { brand_id?: string };
    return typeof claims.brand_id === "string" ? claims.brand_id : "";
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    // Client-persisted trial identity (see useFaceswap getPlaygroundUuid).
    // Invalid/missing → omit; the upstream mints a fresh uuid (budget resets,
    // but the token still works).
    let trialUuid = "";
    try {
      const body = (await req.json()) as { trial_uuid?: unknown };
      if (typeof body?.trial_uuid === "string" && UUID_RE.test(body.trial_uuid)) {
        trialUuid = body.trial_uuid;
      }
    } catch {
      /* empty / non-JSON body — proceed without trial_uuid */
    }

    // End-user IP (Vercel sets x-forwarded-for / x-real-ip on the way in).
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "";

    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(ip ? { "x-forwarded-for": ip } : {}),
      },
      body: JSON.stringify({
        context: "playground",
        ...(trialUuid ? { trial_uuid: trialUuid } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      return NextResponse.json(
        { error: "UPSTREAM_TOKEN_FAILED", status: upstream.status, detail: detail.slice(0, 200) },
        { status: 502 }
      );
    }

    const data = (await upstream.json()) as {
      token?: string;
      user_uuid?: string;
      type?: string;
    };

    if (!data.token || !data.user_uuid) {
      return NextResponse.json({ error: "UPSTREAM_BAD_PAYLOAD" }, { status: 502 });
    }

    return NextResponse.json(
      {
        token: data.token,
        user_uuid: data.user_uuid,
        type: data.type ?? "trial",
        brand_id: decodeBrandId(data.token),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    const e = err as Error;
    return NextResponse.json(
      { error: "TOKEN_PROXY_ERROR", message: e.message },
      { status: 502 }
    );
  }
}
