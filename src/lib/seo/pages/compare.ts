export type CompareEntry = {
  slug: string;
  competitor: string;             // "Hive AI"
  competitorUrl: string;
  short: string;                   // grid/hero
  positioning: string;             // 1-2 paragraph positioning
  tldr: { scamai: string; competitor: string };
  rows: Array<{
    feature: string;
    scamai: string;
    competitor: string;
    edge: "scamai" | "competitor" | "tie";
  }>;
  bestFor: { scamai: string; competitor: string };
  published: string;
};

export const COMPARE_ENTRIES: CompareEntry[] = [
  {
    slug: "scamai-vs-hive",
    competitor: "Hive AI",
    competitorUrl: "https://thehive.ai",
    short: "ScamAI Eva V1.6 vs Hive — in-house SOTA model, free consumer tier, vs Hive's enterprise API.",
    positioning:
      "Hive AI is a well-established enterprise content-moderation platform with strong traction among large social platforms and trust & safety teams. ScamAI Eva V1.6 competes on three axes: accuracy (95% across 120+ generator types, with published benchmarks), price (free consumer tier with 2 anonymous scans, $9/month paid — vs Hive's enterprise-only pricing), and transparency (public research hub + honest uncertainty bucket).",
    tldr: {
      scamai: "Best for: journalists, consumers, platforms that want published benchmarks and a public-facing API.",
      competitor: "Best for: enterprise trust & safety teams already on multi-signal Hive stacks (text moderation, NSFW, etc.).",
    },
    rows: [
      { feature: "Consumer free tier",  scamai: "2 anon scans + 20/mo registered",  competitor: "No consumer tier",               edge: "scamai" },
      { feature: "Starter paid",         scamai: "$9/mo unlimited",                   competitor: "Enterprise custom contract",    edge: "scamai" },
      { feature: "API starter",          scamai: "$99/mo · 10K scans",                competitor: "Enterprise custom",             edge: "scamai" },
      { feature: "Published accuracy",   scamai: "95% across 120+ types",             competitor: "Not publicly benchmarked",      edge: "scamai" },
      { feature: "Latency (p50)",        scamai: "< 2s",                              competitor: "< 1s",                           edge: "competitor" },
      { feature: "Multi-modal (NSFW, text, violence)", scamai: "Images/video only",   competitor: "Full stack",                    edge: "competitor" },
      { feature: "Public research hub",  scamai: "Yes — /research",                   competitor: "Limited public detail",          edge: "scamai" },
      { feature: "SOC 2 Type II",        scamai: "Yes",                               competitor: "Yes",                            edge: "tie" },
    ],
    bestFor: {
      scamai: "Journalists, parents, dating apps, newsrooms, and any team that wants a free consumer tier for its users plus an inexpensive API.",
      competitor: "Large platforms needing a consolidated moderation stack that also handles text, NSFW, and violence classifiers.",
    },
    published: "2026-04-17",
  },
  {
    slug: "scamai-vs-sensity",
    competitor: "Sensity AI",
    competitorUrl: "https://sensity.ai",
    short: "ScamAI Eva V1.6 vs Sensity — open benchmarks and a consumer tier vs Sensity's enterprise deepfake-specialist platform.",
    positioning:
      "Sensity is a well-respected European enterprise deepfake-detection platform with strong KYC and dating-app customers. ScamAI positions as a faster, cheaper alternative with public benchmarks and a free consumer tier — especially strong for teams that want to give their end-users verification tools directly.",
    tldr: {
      scamai: "Best for: teams wanting a consumer-visible free tier + a public API + published benchmarks.",
      competitor: "Best for: European enterprise compliance teams with existing Sensity contracts.",
    },
    rows: [
      { feature: "Consumer free tier",  scamai: "2 anon scans + 20/mo registered",  competitor: "No",                            edge: "scamai" },
      { feature: "Starter paid",         scamai: "$9/mo unlimited",                   competitor: "Enterprise only",               edge: "scamai" },
      { feature: "API starter",          scamai: "$99/mo · 10K scans",                competitor: "Custom enterprise",             edge: "scamai" },
      { feature: "Published accuracy",   scamai: "95% across 120+ types",             competitor: "Selective case studies",         edge: "scamai" },
      { feature: "EU data residency",    scamai: "Available",                         competitor: "Default",                        edge: "competitor" },
      { feature: "KYC integrations",     scamai: "General API",                       competitor: "Deep KYC product",               edge: "competitor" },
      { feature: "Public research hub",  scamai: "Yes — /research",                   competitor: "Limited public papers",          edge: "scamai" },
    ],
    bestFor: {
      scamai: "Product teams that want deepfake detection as a feature their users see directly, plus a developer API.",
      competitor: "Enterprise compliance / KYC teams in EU markets that need white-glove contracting.",
    },
    published: "2026-04-17",
  },
  {
    slug: "scamai-vs-ai-or-not",
    competitor: "AI or Not",
    competitorUrl: "https://www.aiornot.com",
    short: "ScamAI Eva V1.6 vs AI or Not — higher benchmarked accuracy on modern generators vs a simpler consumer tool.",
    positioning:
      "AI or Not is a popular, low-friction consumer AI-detection tool. ScamAI competes by publishing exact accuracy benchmarks (95% across 120+ named generator types), providing a heatmap + signal breakdown in the paid tier, and a developer API that's self-serve. AI or Not is faster to use if you just want a binary answer; ScamAI gives you the reasoning behind the answer.",
    tldr: {
      scamai: "Best for: users who want to see *why* the verdict was made — heatmap, signal breakdown, confidence.",
      competitor: "Best for: the absolute fastest one-click binary check.",
    },
    rows: [
      { feature: "Consumer free tier",  scamai: "2 anon scans + 20/mo registered",  competitor: "Per-scan credits",              edge: "scamai" },
      { feature: "Published accuracy",   scamai: "95% across 120+ types",             competitor: "Not publicly benchmarked",      edge: "scamai" },
      { feature: "Heatmap + signal breakdown", scamai: "Paid tier",                  competitor: "No",                             edge: "scamai" },
      { feature: "Latency (p50)",        scamai: "< 2s",                              competitor: "< 2s",                           edge: "tie" },
      { feature: "Self-serve API",       scamai: "$99/mo · 10K",                      competitor: "Custom",                         edge: "scamai" },
      { feature: "Mobile-first UX",      scamai: "Yes",                               competitor: "Yes",                            edge: "tie" },
    ],
    bestFor: {
      scamai: "Users who want a verdict with evidence they can share with a newsroom, an insurer, or a platform.",
      competitor: "Users who just want a fast, no-nonsense binary check.",
    },
    published: "2026-04-17",
  },
];

export function getCompareBySlug(slug: string): CompareEntry | null {
  return COMPARE_ENTRIES.find((e) => e.slug === slug) ?? null;
}
