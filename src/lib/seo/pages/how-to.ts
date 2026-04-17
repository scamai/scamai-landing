export type HowToStep = { t: string; d: string };

export type HowToEntry = {
  slug: string;
  title: string;            // "How to spot a deepfake"
  short: string;            // grid/hero summary
  intro: string;            // first paragraph
  steps: HowToStep[];       // ordered steps
  extra?: string;           // optional extra paragraph
  published: string;
  categories: string[];
};

export const HOW_TO_ENTRIES: HowToEntry[] = [
  {
    slug: "spot-a-deepfake",
    title: "How to spot a deepfake in 2026",
    short: "A practical checklist to catch face-swap, voice-clone, and Sora-class video deepfakes.",
    intro:
      "Deepfakes in 2026 are dramatically harder to spot by eye than they were in 2023. The cues you can still rely on are behavioral (does the person say something implausible?), contextual (is the source trustworthy?), and technical (does an AI-detection tool flag it?). Here's a checklist you can run in under 30 seconds.",
    steps: [
      { t: "Check the source", d: "Is it from the actual person's verified account, or is someone sharing a screenshot? Screenshots strip context." },
      { t: "Reverse image / video search", d: "Run the image through Google Images or TinEye. If it appears on unrelated forums first, suspect." },
      { t: "Look at hands, ears, teeth", d: "These are where diffusion models still struggle — extra fingers, fused teeth, asymmetric earrings." },
      { t: "Look at hairlines and jawlines", d: "Face-swap deepfakes often show subtle seams where the swap boundary is." },
      { t: "Check lip-sync in video", d: "Scrub frame-by-frame. If mouth movements lag audio by even a few frames, it's likely a clone." },
      { t: "Run it through ScamAI", d: "Drop the image on scam.ai — Eva V1.6 gives a verdict in under 2 seconds with a shareable public URL." },
    ],
    extra:
      "If the stakes matter (journalism, court evidence, major financial decisions), don't rely on a single signal. Run the detection, cross-reference with a reverse image search, and verify the source directly. Eva's verdict is a strong signal, not a substitute for due diligence.",
    published: "2026-04-17",
    categories: ["detection", "evergreen", "verification-basics"],
  },
  {
    slug: "verify-whatsapp-forward",
    title: "How to verify a suspicious WhatsApp forward",
    short: "Step-by-step for checking images forwarded to you on WhatsApp, Messenger, or Telegram.",
    intro:
      "WhatsApp forwards are the #1 channel for misinformation in India, Brazil, Indonesia, and Nigeria. The platform strips EXIF metadata and compresses heavily, making detection harder — but still possible. Here's how to run a 60-second check before forwarding.",
    steps: [
      { t: "Tap-hold and save the image", d: "You need the file, not a screenshot. Screenshots lose resolution." },
      { t: "Open scam.ai", d: "Free, no signup for the first 2 checks." },
      { t: "Paste or upload the image", d: "Drag-drop, Cmd+V paste, or tap to select." },
      { t: "Read the confidence", d: "Eva returns a verdict + confidence in ~2 seconds. Low confidence (< 70%) means uncertain — don't forward." },
      { t: "Check the share URL", d: "Every scan gets a permanent scam.ai/scan/[id] URL you can share back to the group." },
    ],
    extra:
      "If the message claims an emergency, a political event, or a safety warning — and it arrives unsolicited — assume it's suspicious until verified. Most misinformation preys on urgency.",
    published: "2026-04-17",
    categories: ["whatsapp", "misinformation", "everyday-use"],
  },
  {
    slug: "check-if-photo-is-ai-generated",
    title: "How to check if a photo is AI-generated",
    short: "The simplest way to tell whether an image came from a camera or a model.",
    intro:
      "There are three layers to verify an image: metadata, visual tells, and a dedicated AI-detection tool. Any single layer can lie, but all three together are reliable.",
    steps: [
      { t: "Check the EXIF metadata", d: "Real camera photos carry EXIF tags (camera model, ISO, shutter). AI-generated images usually have none. But: any upload through social media strips EXIF, so absence isn't proof." },
      { t: "Look for the uncanny", d: "Unnaturally perfect skin, symmetrical defects, floating earrings, melted hands. If multiple details feel 'off,' it's probably AI." },
      { t: "Reverse image search", d: "If the image doesn't exist anywhere else online (or only exists on AI-art forums), it's likely a fresh generation." },
      { t: "Run a detection model", d: "ScamAI Eva V1.6 scores the image against 120+ generator types in under 2 seconds. 95% accuracy." },
    ],
    published: "2026-04-17",
    categories: ["detection", "evergreen", "metadata"],
  },
  {
    slug: "detect-face-swap-deepfake",
    title: "How to detect a face-swap deepfake",
    short: "Face-swap deepfakes have specific giveaways — here's what to look for.",
    intro:
      "Face-swap deepfakes (DeepFaceLab, FaceSwap, Roop) paste a target face over a source video. They differ from fully-synthetic video (Sora, Veo) because the underlying body and background are real. This creates seam artifacts that Eva and trained eyes can catch.",
    steps: [
      { t: "Watch the jawline under motion", d: "Head turns expose face-swap seams. Pause and look at the transition between face and neck." },
      { t: "Check the eyes", d: "Face-swap models often inherit the source's blink pattern. If someone never blinks — or blinks too regularly — suspect." },
      { t: "Lighting mismatch", d: "The swapped face often has different shadows than the scene. Look at the nose-shadow direction vs. the body's shadows." },
      { t: "Teeth and tongue", d: "Many face-swap models don't generate interior-mouth detail well. Teeth can look pasted." },
      { t: "Run ScamAI", d: "Eva V1.6 includes dedicated face-swap signal detection. Confidence + region heatmap in ~2 seconds." },
    ],
    published: "2026-04-17",
    categories: ["face-swap", "detection", "video"],
  },
  {
    slug: "verify-news-photo-is-real",
    title: "How to verify a breaking-news photo is real",
    short: "For journalists and engaged citizens — a fast verification protocol for news images.",
    intro:
      "Breaking news is the highest-stakes environment for image verification. Pressure to publish first collides with risk of amplifying fake content. The protocol below is what fact-checkers at AFP, AP, and Reuters actually use — compressed into a 3-minute check.",
    steps: [
      { t: "Verify the source", d: "Is the uploader a known, verified account? Or an unverified one created in the last 30 days?" },
      { t: "Reverse image search", d: "Run through Google Images AND TinEye AND Yandex. Yandex is particularly strong for Eastern European sources." },
      { t: "Geo-locate the image", d: "Match visible landmarks, street signs, shadows (time of day) to the claimed location. Compare with Google Street View." },
      { t: "Timestamp verification", d: "Does the weather in the image match the weather records for the claimed date and location?" },
      { t: "Run AI-detection", d: "ScamAI for AI-generated or manipulated images. Separately: check for edited-region flags in Eva's signal breakdown." },
      { t: "Publish your work", d: "When you publish the verdict, link to the scam.ai/scan/[id] URL so readers can see the evidence themselves." },
    ],
    published: "2026-04-17",
    categories: ["journalism", "verification", "breaking-news"],
  },
];

export function getHowToBySlug(slug: string): HowToEntry | null {
  return HOW_TO_ENTRIES.find((e) => e.slug === slug) ?? null;
}

export function getHowToRelated(slug: string, max = 3): HowToEntry[] {
  const me = getHowToBySlug(slug);
  if (!me) return HOW_TO_ENTRIES.slice(0, max);
  const scored = HOW_TO_ENTRIES.filter((e) => e.slug !== slug).map((e) => ({
    entry: e,
    overlap: e.categories.filter((c) => me.categories.includes(c)).length,
  }));
  scored.sort((a, b) => b.overlap - a.overlap);
  return scored.slice(0, max).map((s) => s.entry);
}
