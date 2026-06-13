// ─── Industry structural data ───
// Translatable display text lives in the `solutionsContent.<slug>.*` message
// namespace (see src/messages/*.json), resolved per-locale in the page/layout
// via next-intl. This file holds ONLY non-translatable structural data:
// slug, stat.value (the number), relatedProduct, keywords (SEO), and the
// array shapes (counts) the page needs to iterate the translated fields.

export type Industry = {
  slug: string;
  // stat.value is the raw number/figure shown in the hero badge (not translated).
  stat: { value: string };
  // How many capabilities / use cases / faqs exist for this industry.
  // The page resolves each entry's text from the message namespace by index.
  capabilitiesCount: number;
  useCasesCount: number;
  // Number of bullets per use case (index-aligned with useCases).
  useCaseBullets: number[];
  faqsCount: number;
  relatedProduct: 'ai' | 'audio' | 'both';
  // SEO keywords — passed to generateMetadata, not rendered as visible copy.
  keywords: string[];
};

export const industries: Industry[] = [
  {
    slug: 'fintech',
    stat: { value: '340%' },
    capabilitiesCount: 4,
    useCasesCount: 4,
    useCaseBullets: [3, 3, 3, 3],
    faqsCount: 5,
    relatedProduct: 'both',
    keywords: [
      'deepfake detection fintech',
      'KYC deepfake protection',
      'financial fraud deepfake',
      'synthetic identity detection',
      'deepfake KYC API',
      'voice clone banking fraud',
    ],
  },
  {
    slug: 'dating',
    stat: { value: '70%+' },
    capabilitiesCount: 4,
    useCasesCount: 4,
    useCaseBullets: [3, 3, 3, 3],
    faqsCount: 5,
    relatedProduct: 'both',
    keywords: [
      'dating app deepfake detection',
      'fake profile detection API',
      'catfishing prevention',
      'AI-generated profile photos',
      'romance scam prevention',
      'synthetic face detection dating',
    ],
  },
  {
    slug: 'call-centers',
    stat: { value: '$12.5B' },
    capabilitiesCount: 4,
    useCasesCount: 4,
    useCaseBullets: [3, 3, 3, 3],
    faqsCount: 5,
    relatedProduct: 'audio',
    keywords: [
      'voice clone detection call centers',
      'vishing prevention',
      'call center fraud detection',
      'voice phishing detection API',
      'synthetic voice call center',
      'real-time audio deepfake detection',
    ],
  },
  {
    slug: 'kyc',
    stat: { value: '95.3%' },
    capabilitiesCount: 4,
    useCasesCount: 4,
    useCaseBullets: [3, 3, 3, 3],
    faqsCount: 5,
    relatedProduct: 'ai',
    keywords: [
      'KYC deepfake API',
      'identity verification deepfake',
      'deepfake KYC bypass prevention',
      'synthetic identity detection KYC',
      'liveness check deepfake',
      'AI identity fraud detection',
    ],
  },
  {
    slug: 'media',
    stat: { value: '3,000%' },
    capabilitiesCount: 4,
    useCasesCount: 4,
    useCaseBullets: [3, 3, 3, 3],
    faqsCount: 5,
    relatedProduct: 'both',
    keywords: [
      'deepfake detection media',
      'content authentication newsroom',
      'AI-generated image detection news',
      'media verification API',
      'deepfake news detection',
      'synthetic media journalism',
    ],
  },
  {
    slug: 'insurance',
    stat: { value: '280%' },
    capabilitiesCount: 4,
    useCasesCount: 4,
    useCaseBullets: [3, 3, 3, 3],
    faqsCount: 5,
    relatedProduct: 'both',
    keywords: [
      'deepfake insurance fraud',
      'AI claims fraud detection',
      'insurance photo fraud AI',
      'synthetic media insurance',
      'claims document forgery detection',
      'AI-edited photo insurance',
    ],
  },
  {
    slug: 'hr',
    stat: { value: '1 in 14' },
    capabilitiesCount: 4,
    useCasesCount: 4,
    useCaseBullets: [3, 3, 3, 3],
    faqsCount: 5,
    relatedProduct: 'both',
    keywords: [
      'remote interview deepfake detection',
      'video interview verification',
      'HR deepfake detection',
      'hiring fraud detection',
      'deepfake job interview',
      'AI voice interview fraud',
    ],
  },
  {
    slug: 'government',
    stat: { value: '47' },
    capabilitiesCount: 4,
    useCasesCount: 4,
    useCaseBullets: [3, 3, 3, 3],
    faqsCount: 5,
    relatedProduct: 'both',
    keywords: [
      'deepfake detection government',
      'public sector synthetic media',
      'government deepfake API',
      'election deepfake detection',
      'disinformation AI detection',
      'deepfake political video',
    ],
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}

export function getAllIndustrySlugs(): string[] {
  return industries.map((i) => i.slug);
}
