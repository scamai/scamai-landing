import { Metadata } from "next";
import ShareClient from "./ShareClient";

const BASE = process.env.NEXTAUTH_URL || "https://scam.ai";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ session_id: string }>;
}): Promise<Metadata> {
  const { session_id } = await params;
  const shareUrl = `${BASE}/share/${session_id}`;
  const title = "I deepfaked myself in 30 seconds — scam.ai";
  const description =
    "Watch a real-time deepfake created in half a minute. This is why on-device detection matters.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: shareUrl,
      siteName: "scam.ai",
      type: "video.other",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ session_id: string }>;
}) {
  const { session_id } = await params;

  let videoUrl: string | null = null;
  try {
    const res = await fetch(`${BASE}/api/share/${session_id}`, { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { url?: string };
      videoUrl = data.url ?? null;
    }
  } catch { /* render client fallback */ }

  return <ShareClient sessionId={session_id} initialVideoUrl={videoUrl} />;
}
