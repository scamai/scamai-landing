// Translatable strings (tagline, comparison-row labels, prose value cells,
// advantages, faqs) live in the `compareContent.<slug>.*` message namespace and
// are resolved per-locale in compare/[competitor]/page.tsx. This file keeps only
// non-translatable structural data: slug, competitor name (proper noun),
// scamaiWins flags, pure-data value cells (numbers, prices, models, standards),
// plus English description/keywords/metaDescription used as SEO fallbacks.

export type ComparisonRow = {
  // value cells: a literal string for pure-data cells, or null when the cell is
  // prose and resolved from translations (compareContent.<slug>.comparisonRows.<i>.<side>)
  scamai: string | null;
  competitor: string | null;
  scamaiWins: boolean;
};

export type Competitor = {
  slug: string;
  name: string;
  description: string;
  comparison: ComparisonRow[];
  // counts drive how many indexed advantage/faq translation keys to read
  advantagesCount: number;
  faqsCount: number;
  keywords: string[];
  metaDescription: string;
};

export const competitors: Competitor[] = [
  {
    slug: 'reality-defender',
    name: 'Reality Defender',
    description:
      'Reality Defender is an enterprise deepfake detection platform targeting large organizations with annual contracts. Scam AI offers comparable detection accuracy with transparent per-image pricing, a free tier, and self-serve API access — making it accessible to teams of all sizes.',
    comparison: [
      { scamai: '98.2% (Eva-v1)', competitor: null, scamaiWins: true },
      { scamai: 'Under 4 seconds', competitor: null, scamaiWins: true },
      { scamai: '200 images/month', competitor: null, scamaiWins: true },
      { scamai: '$0.05/image, pay-as-you-go', competitor: null, scamaiWins: true },
      { scamai: 'Under 10 minutes', competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: false },
      { scamai: 'Yes (98.5% accuracy)', competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: false },
      { scamai: null, competitor: null, scamaiWins: false },
      { scamai: '10+ arXiv papers', competitor: null, scamaiWins: true },
    ],
    advantagesCount: 4,
    faqsCount: 4,
    keywords: [
      'Scam AI vs Reality Defender',
      'Reality Defender alternative',
      'Reality Defender comparison',
      'deepfake detection Reality Defender',
      'Reality Defender pricing',
    ],
    metaDescription:
      'Scam AI vs Reality Defender: $0.05/image vs annual contracts, 200 free images vs none, 10-min API setup vs custom onboarding. Full comparison.',
  },
  {
    slug: 'sensity',
    name: 'Sensity AI',
    description:
      'Sensity AI (now part of iProov) focuses on deepfake intelligence analytics and biometric liveness verification. Scam AI provides a broader synthetic media detection API covering images, video, audio, and documents — with transparent pricing and self-serve access.',
    comparison: [
      { scamai: '98.2% (Eva-v1)', competitor: null, scamaiWins: true },
      { scamai: '200 images/month', competitor: null, scamaiWins: true },
      { scamai: '$0.05/image, pay-as-you-go', competitor: null, scamaiWins: true },
      { scamai: 'Yes, under 10 minutes', competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: false },
      { scamai: 'Yes (98.5% accuracy)', competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: false },
      { scamai: '10+ arXiv papers', competitor: null, scamaiWins: true },
    ],
    advantagesCount: 4,
    faqsCount: 4,
    keywords: [
      'Scam AI vs Sensity AI',
      'Sensity AI alternative',
      'Sensity deepfake detection comparison',
      'Sensity AI pricing',
      'deepfake detection Sensity',
    ],
    metaDescription:
      'Scam AI vs Sensity AI: images, video, audio, and documents in one API. $0.05/image vs enterprise contracts, 200 free/month. Full comparison.',
  },
  {
    slug: 'hive',
    name: 'Hive Moderation',
    description:
      'Hive Moderation is a general-purpose AI content moderation platform covering NSFW, spam, hate speech, and AI-generated detection. Scam AI specializes specifically in deepfakes and synthetic media fraud — offering higher accuracy and faster processing for identity verification, KYC, and anti-fraud use cases.',
    comparison: [
      { scamai: '98.2% (Eva-v1)', competitor: null, scamaiWins: true },
      { scamai: '200 images/month', competitor: null, scamaiWins: true },
      { scamai: '$0.05/image', competitor: null, scamaiWins: true },
      { scamai: 'Under 4 seconds', competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: 'Yes (98.5% accuracy)', competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: false },
      { scamai: null, competitor: null, scamaiWins: false },
      { scamai: null, competitor: null, scamaiWins: true },
    ],
    advantagesCount: 4,
    faqsCount: 4,
    keywords: [
      'Scam AI vs Hive Moderation',
      'Hive Moderation alternative',
      'Hive deepfake detection comparison',
      'deepfake detection Hive',
      'Hive Moderation pricing',
    ],
    metaDescription:
      'Scam AI vs Hive Moderation: 98.2% deepfake detection vs general moderation. Voice clone + document forgery detection Hive lacks. $0.05/image.',
  },
  {
    slug: 'microsoft-azure',
    name: 'Microsoft Azure AI Content Safety',
    description:
      'Microsoft Azure AI Content Safety is a broad content safety platform for detecting harmful content across text and images. Scam AI is purpose-built for deepfake detection and synthetic media fraud — delivering higher accuracy on deepfake-specific attack vectors with identity verification and voice clone detection.',
    comparison: [
      { scamai: '98.2% (Eva-v1)', competitor: null, scamaiWins: true },
      { scamai: '200 images/month', competitor: null, scamaiWins: false },
      { scamai: '$0.05/image deepfake', competitor: null, scamaiWins: false },
      { scamai: 'Under 10 minutes', competitor: null, scamaiWins: true },
      { scamai: 'Purpose-built Eva-v1', competitor: null, scamaiWins: true },
      { scamai: 'Yes (98.5% accuracy)', competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: false },
      { scamai: '10+ arXiv papers', competitor: null, scamaiWins: true },
    ],
    advantagesCount: 4,
    faqsCount: 4,
    keywords: [
      'Scam AI vs Microsoft Azure deepfake',
      'Azure AI Content Safety alternative',
      'Azure deepfake detection comparison',
      'deepfake detection Azure',
      'Microsoft Azure synthetic media',
    ],
    metaDescription:
      'Scam AI vs Azure AI Content Safety: purpose-built 98.2% deepfake detection vs general safety classifier. Voice clone + document forgery included.',
  },
  {
    slug: 'aws-rekognition',
    name: 'AWS Rekognition',
    description:
      'AWS Rekognition is a general computer vision service for face detection, object recognition, and content moderation. Scam AI is purpose-built for deepfake detection — delivering higher accuracy on synthetic media fraud with voice clone detection and document forgery capabilities not available in Rekognition.',
    comparison: [
      { scamai: '98.2% (Eva-v1)', competitor: null, scamaiWins: true },
      { scamai: 'Yes, Eva-v1', competitor: null, scamaiWins: true },
      { scamai: '200 images/month', competitor: 'AWS Free Tier (12 months)', scamaiWins: false },
      { scamai: '$0.05/image', competitor: null, scamaiWins: false },
      { scamai: 'Yes (98.5% accuracy)', competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: 'SOC 2 Type II', competitor: null, scamaiWins: false },
      { scamai: '10+ arXiv papers', competitor: null, scamaiWins: true },
    ],
    advantagesCount: 4,
    faqsCount: 4,
    keywords: [
      'Scam AI vs AWS Rekognition',
      'AWS Rekognition deepfake detection',
      'Rekognition alternative deepfake',
      'deepfake detection AWS',
      'AWS Rekognition comparison',
    ],
    metaDescription:
      'Scam AI vs AWS Rekognition: dedicated deepfake detection model vs general face analysis, plus voice clone and document forgery detection not available in Rekognition.',
  },
  {
    slug: 'truepic',
    name: 'Truepic',
    description:
      'Truepic focuses on content credentials and cryptographic photo provenance (C2PA standard) — verifying that images were captured by a real camera at a specific place and time. Scam AI takes a different approach, using AI to detect synthetic manipulation in any image or audio file regardless of provenance metadata.',
    comparison: [
      { scamai: null, competitor: 'C2PA cryptographic provenance', scamaiWins: false },
      { scamai: null, competitor: 'No — requires C2PA camera integration', scamaiWins: true },
      { scamai: '98.2% (Eva-v1)', competitor: null, scamaiWins: true },
      { scamai: '200 images/month', competitor: null, scamaiWins: true },
      { scamai: 'Yes (98.5% accuracy)', competitor: null, scamaiWins: true },
      { scamai: 'Under 10 minutes', competitor: null, scamaiWins: true },
      { scamai: null, competitor: 'Only future C2PA-signed images', scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
    ],
    advantagesCount: 4,
    faqsCount: 4,
    keywords: [
      'Scam AI vs Truepic',
      'Truepic alternative',
      'Truepic deepfake comparison',
      'C2PA vs deepfake detection',
      'content credentials vs deepfake detection',
    ],
    metaDescription:
      'Scam AI vs Truepic: AI deepfake detection on any image vs C2PA provenance needing camera hardware. Works retroactively, no metadata required.',
  },
  {
    slug: 'deepware',
    name: 'Deepware',
    description:
      'Deepware is a free consumer-facing deepfake scanner for individual users to check videos online. Scam AI is an enterprise API platform for organizations integrating deepfake detection into products, KYC workflows, and fraud prevention systems at scale.',
    comparison: [
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: '98.2% (Eva-v1)', competitor: null, scamaiWins: true },
      { scamai: 'Under 4 seconds SLA', competitor: null, scamaiWins: true },
      { scamai: '200 images/month API', competitor: null, scamaiWins: false },
      { scamai: 'Yes (98.5% accuracy)', competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: '99.9% uptime SLA', competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
      { scamai: null, competitor: null, scamaiWins: true },
    ],
    advantagesCount: 4,
    faqsCount: 4,
    keywords: [
      'Scam AI vs Deepware',
      'Deepware alternative enterprise',
      'Deepware API comparison',
      'deepfake detection Deepware',
      'enterprise deepfake API',
    ],
    metaDescription:
      'Scam AI vs Deepware: production API with 99.9% SLA and SOC 2 vs free consumer scanner. Enterprise KYC integration + voice clone detection.',
  },
];

export function getCompetitorBySlug(slug: string): Competitor | undefined {
  return competitors.find((c) => c.slug === slug);
}

export function getAllCompetitorSlugs(): string[] {
  return competitors.map((c) => c.slug);
}
