import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: session.userId,
      email: session.email,
      name: session.name,
      avatarUrl: session.avatarUrl,
      plan: session.plan,
    },
  });
}
