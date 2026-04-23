import { NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { upsertUser } from "@/lib/db/users";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs")
);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();
    if (!credential || typeof credential !== "string") {
      return NextResponse.json({ error: "Missing credential" }, { status: 400 });
    }

    const { payload } = await jwtVerify(credential, GOOGLE_JWKS, {
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      audience: GOOGLE_CLIENT_ID,
    });

    const email = payload.email as string;
    const name = (payload.name as string) ?? null;
    const avatarUrl = (payload.picture as string) ?? null;

    if (!email) {
      return NextResponse.json({ error: "No email in token" }, { status: 400 });
    }

    const user = await upsertUser({ email, name, avatarUrl, provider: "google" });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatar_url,
      plan: user.plan,
    });

    const res = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        plan: user.plan,
      },
    });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    console.error("[google-onetap] error:", err);
    const message = err instanceof Error ? err.message : "Auth failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
