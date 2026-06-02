import { NextResponse } from "next/server";

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
// Backend ALLOWED_ORIGINS was extended to include https://scam.ai +
// http://localhost:3000 so the cross-origin /ws/offer + /ws/ice-candidate POSTs
// from this site pass CORS (see backend/faceswap-server/.env on Aries).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPSTREAM =
  process.env.FACESWAP_TOKEN_UPSTREAM || "https://liveface.app/api/session-token";

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

export async function POST() {
  try {
    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
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
