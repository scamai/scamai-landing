import { Metadata } from "next";
import ShareClient from "./ShareClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ session_id: string }>;
}): Promise<Metadata> {
  const { session_id } = await params;
  const title = "I deepfaked myself in 30 seconds — scam.ai";
  const description =
    "Watch a real-time deepfake created in half a minute. This is why on-device detection matters.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://scam.ai/share/${session_id}`,
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
  return <ShareClient sessionId={session_id} />;
}
