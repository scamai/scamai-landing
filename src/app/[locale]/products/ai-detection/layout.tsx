import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import PageSchema from '@/components/seo/PageSchema';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/products/ai-detection',
    ...pageMetadata.aiDetection,
  });
}

const aiDetectionProductSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'ScamAI AI Detection',
  description:
    'Detect AI-generated images and deepfake videos with 95.3% accuracy. Real-time processing under 4 seconds. Supports face swaps, GANs, and diffusion model outputs.',
  url: 'https://scam.ai/en/products/ai-detection',
  brand: { '@type': 'Organization', name: 'ScamAI' },
  category: 'Security Software',
  image: 'https://scam.ai/en/opengraph-image',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '0',
    highPrice: '0.05',
    priceCurrency: 'USD',
    offerCount: 2,
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Tier',
        price: '0',
        priceCurrency: 'USD',
        description: '200 free images per month with Eva-v1-Fast model',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Pay-as-you-go',
        price: '0.05',
        priceCurrency: 'USD',
        description: '$0.05 per image analyzed with Eva-v1-Fast',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '0.05',
          priceCurrency: 'USD',
          unitText: 'per image',
        },
      },
    ],
  },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Detection Accuracy', value: '95.3%' },
    { '@type': 'PropertyValue', name: 'Processing Time', value: 'Under 4 seconds' },
    { '@type': 'PropertyValue', name: 'Supported Formats', value: 'JPG, PNG, GIF, WebP, MP4, MOV, AVI' },
    { '@type': 'PropertyValue', name: 'Compliance', value: 'SOC 2 Type II, GDPR' },
  ],
};

const aiDetectionFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How accurate is ScamAI image and video deepfake detection?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ScamAI achieves 95.3% accuracy for image and video deepfake detection using the Eva-v1 model. Eva-v1-Fast processes in under 2 seconds for high-throughput use cases, while Eva-v1-Pro processes in under 4 seconds for maximum accuracy with lower false positives.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of deepfakes can ScamAI detect in images and videos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ScamAI detects face swaps, GAN-generated images, diffusion model outputs (Stable Diffusion, DALL-E, Midjourney, Flux), video deepfakes with frame-by-frame and temporal analysis, synthetic faces, and 4K video manipulation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What image and video formats does ScamAI support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ScamAI supports JPG, PNG, GIF, and WebP image formats, and MP4, MOV, and AVI video formats. 4K video analysis is supported with frame-by-frame deepfake detection.',
      },
    },
    {
      '@type': 'Question',
      name: 'How fast is ScamAI deepfake detection?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Eva-v1-Fast processes images in under 2 seconds, suitable for real-time content moderation and high-volume KYC screening. Eva-v1-Pro processes in under 4 seconds for forensic-grade analysis and high-stakes identity verification.',
      },
    },
  ],
};

export default async function AIDetectionLayout({
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
        path="/products/ai-detection"
        breadcrumbs={[
          { name: 'Products', path: '/products' },
          { name: 'AI Detection' },
        ]}
        speakable
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiDetectionProductSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiDetectionFaqSchema) }}
      />
      {children}
    </>
  );
}
