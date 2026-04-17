const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.scam.ai";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ScamAI",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://x.com/scamai",
      "https://www.linkedin.com/company/scamai",
    ],
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "ScamAI Eva V1.6",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Web",
    description:
      "Free AI image verification tool. Detects deepfakes and AI-generated images across 120+ generator types with 95% accuracy in under 2 seconds.",
    url: SITE_URL,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1200",
    },
  };
}

export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function breadcrumbSchema(path: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: path.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      item: `${SITE_URL}${p.url}`,
    })),
  };
}

export function scanResultSchema(slug: string, verdict: string, confidence: number) {
  return {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    url: `${SITE_URL}/scan/${slug}`,
    datePublished: new Date().toISOString(),
    author: { "@type": "Organization", name: "ScamAI" },
    claimReviewed: "Image authenticity verdict",
    reviewRating: {
      "@type": "Rating",
      ratingValue: verdict === "likely_real" ? 5 : verdict === "likely_ai_manipulated" ? 1 : 3,
      bestRating: 5,
      worstRating: 1,
      alternateName:
        verdict === "likely_real"
          ? `Likely real (${confidence}% confidence)`
          : verdict === "likely_ai_manipulated"
            ? `Likely AI-manipulated (${confidence}% confidence)`
            : `Uncertain (${confidence}% confidence)`,
    },
  };
}

export function howToSchema(input: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    url: `${SITE_URL}${input.url}`,
    step: input.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: `${SITE_URL}${input.url}`,
    datePublished: input.datePublished,
    dateModified: input.datePublished,
    author: {
      "@type": "Organization",
      name: input.author ?? "ScamAI",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "ScamAI",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
  };
}

export function claimReviewSchema(input: {
  url: string;
  claim: string;
  verdict: string;
  rating: 1 | 2 | 3 | 4 | 5;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    url: `${SITE_URL}${input.url}`,
    datePublished: input.datePublished,
    author: { "@type": "Organization", name: "ScamAI" },
    claimReviewed: input.claim,
    reviewRating: {
      "@type": "Rating",
      ratingValue: input.rating,
      bestRating: 5,
      worstRating: 1,
      alternateName: input.verdict,
    },
  };
}

export function jsonLdProps(data: unknown) {
  return {
    type: "application/ld+json" as const,
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}
