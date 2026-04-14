import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import PageSchema from '@/components/seo/PageSchema';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/pricing',
    ...pageMetadata.pricing,
  });
}

const pricingSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'ScamAI Pricing',
  description: 'Transparent pricing for ScamAI deepfake detection platform. Start free with 200 images per month.',
  url: 'https://scam.ai/en/pricing',
  mainEntity: {
    '@type': 'Product',
    name: 'ScamAI Platform',
    brand: { '@type': 'Organization', name: 'ScamAI' },
    description: 'All-in-one AI Trust Platform for detecting synthetic media and deepfakes in real-time.',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Tier',
        price: '0',
        priceCurrency: 'USD',
        description: '200 free images per month. Includes GenAI detection, deepfake analysis, Eva-v1-Fast model, API access, and dashboard analytics. No credit card required.',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '0',
          priceCurrency: 'USD',
          unitText: 'per month',
          description: '200 images included',
        },
      },
      {
        '@type': 'Offer',
        name: 'Self-Serve (Pay-as-you-go)',
        price: '0.05',
        priceCurrency: 'USD',
        description: '$0.05 per image. Flexible pay-as-you-go for teams of all sizes. Includes GenAI detection, deepfake analysis, Eva-v1-Fast model, and API access.',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '0.05',
          priceCurrency: 'USD',
          unitText: 'per image',
        },
      },
      {
        '@type': 'Offer',
        name: 'Adaptive Defense Add-on',
        price: '0.008',
        priceCurrency: 'USD',
        description: 'Real-time GenAI, deepfake, and injection attack detection.',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '0.008',
          priceCurrency: 'USD',
          unitText: 'per image',
        },
      },
      {
        '@type': 'Offer',
        name: 'Active Liveness Add-on',
        price: '0.008',
        priceCurrency: 'USD',
        description: 'Verify real human presence and prevent deepfake spoofing.',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '0.008',
          priceCurrency: 'USD',
          unitText: 'per image',
        },
      },
      {
        '@type': 'Offer',
        name: 'Enterprise',
        priceCurrency: 'USD',
        description: 'Custom pricing for 2,000+ images/month. Includes Eva-v1-Pro model, Thinking (advanced reasoning), volume discounts, priority support, dedicated account manager, and custom integration.',
        availability: 'https://schema.org/InStock',
        url: 'https://cal.com/scamai/15min',
      },
    ],
  },
};

export default async function PricingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <>
      <PageSchema
        locale={locale}
        path="/pricing"
        breadcrumbs={[{ name: 'Pricing' }]}
        speakable
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      {children}
    </>
  );
}
