import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import PageSchema from '@/components/seo/PageSchema';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/products/ai-detection',
    ...pageMetadata.aiDetection,
  });
}

const aiDetectionProductSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Scam AI AI Detection',
  description:
    'Detect AI-generated images and deepfake videos with 95.3% accuracy. Real-time processing under 4 seconds. Supports face swaps, GANs, and diffusion model outputs.',
  url: 'https://scam.ai/en/products/ai-detection',
  brand: { '@type': 'Organization', name: 'Scam AI' },
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
      name: 'How accurate is Scam AI image and video deepfake detection?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Scam AI achieves 95.3% accuracy for image and video deepfake detection using the Eva-v1 model. Eva-v1-Fast processes in under 2 seconds for high-throughput use cases, while Eva-v1-Pro processes in under 4 seconds for maximum accuracy with lower false positives.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of deepfakes can Scam AI detect in images and videos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Scam AI detects face swaps, GAN-generated images, diffusion model outputs (Stable Diffusion, DALL-E, Midjourney, Flux), video deepfakes with frame-by-frame and temporal analysis, synthetic faces, and 4K video manipulation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What image and video formats does Scam AI support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Scam AI supports JPG, PNG, GIF, and WebP image formats, and MP4, MOV, and AVI video formats. 4K video analysis is supported with frame-by-frame deepfake detection.',
      },
    },
    {
      '@type': 'Question',
      name: 'How fast is Scam AI deepfake detection?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Eva-v1-Fast processes images in under 2 seconds, suitable for real-time content moderation and high-volume KYC screening. Eva-v1-Pro processes in under 4 seconds for forensic-grade analysis and high-stakes identity verification.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free deepfake detector I can try?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Scam AI includes 200 free image analyses per month — no credit card required. Sign up at app.scam.ai to get instant access to the deepfake detector with the Eva-v1-Fast model. Upgrade to pay-as-you-go ($0.05/image) or Enterprise when your volume grows.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I integrate deepfake detection into my app via API?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Scam AI provides a REST API that integrates in under 10 minutes. Make a POST request with your image URL, receive a JSON response with is_deepfake boolean, confidence score, and model used. SDKs for Python and JavaScript are available, with full documentation at scam.ai/en/resources/documentation.',
      },
    },
  ],
};

export default async function AIDetectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
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
