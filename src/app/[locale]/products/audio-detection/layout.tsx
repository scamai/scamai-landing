import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import PageSchema from '@/components/seo/PageSchema';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    locale,
    path: '/products/audio-detection',
    ...pageMetadata.audioDetection,
  });
}

const audioDetectionProductSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'ScamAI Audio Detection',
  description:
    'Detect synthetic voices, voice clones, and AI-generated speech with 98.5% accuracy. Real-time audio stream analysis under 3 seconds. Prevents vishing and audio fraud.',
  url: 'https://scam.ai/en/products/audio-detection',
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
        description: '200 free analyses per month with Eva-v1-Fast model',
        availability: 'https://schema.org/InStock',
      },
      {
        '@type': 'Offer',
        name: 'Pay-as-you-go',
        price: '0.05',
        priceCurrency: 'USD',
        description: '$0.05 per audio file analyzed',
        availability: 'https://schema.org/InStock',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '0.05',
          priceCurrency: 'USD',
          unitText: 'per audio file',
        },
      },
    ],
  },
  additionalProperty: [
    { '@type': 'PropertyValue', name: 'Detection Accuracy', value: '98.5%' },
    { '@type': 'PropertyValue', name: 'Processing Time', value: 'Under 3 seconds' },
    { '@type': 'PropertyValue', name: 'Supported Formats', value: 'MP3, WAV, M4A, FLAC, OGG' },
    { '@type': 'PropertyValue', name: 'Compliance', value: 'SOC 2 Type II, GDPR' },
  ],
};

const audioDetectionFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How accurate is ScamAI voice clone and audio deepfake detection?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ScamAI achieves 98.5% accuracy for voice clone detection, identifying synthetic voices from platforms like ElevenLabs, PlayHT, Resemble AI, and Azure TTS. Processing time is under 3 seconds per audio file.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of audio deepfakes can ScamAI detect?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ScamAI detects voice clones (ElevenLabs, Resemble AI, PlayHT, Azure TTS), text-to-speech generated audio, audio deepfakes, spliced or manipulated audio recordings, and real-time synthetic voice streams.',
      },
    },
    {
      '@type': 'Question',
      name: 'What audio formats does ScamAI support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ScamAI supports MP3, WAV, M4A, FLAC, and OGG audio formats. Real-time audio stream analysis is also available for live call monitoring and voice authentication.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can ScamAI detect voice phishing (vishing) attacks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. ScamAI audio detection is used by call centers, banks, and financial services to identify voice phishing attacks in real-time. It detects cloned voices attempting to impersonate executives, customers, or authority figures.',
      },
    },
  ],
};

export default async function AudioDetectionLayout({
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
        path="/products/audio-detection"
        breadcrumbs={[
          { name: 'Products', path: '/products' },
          { name: 'Audio Detection' },
        ]}
        speakable
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(audioDetectionProductSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(audioDetectionFaqSchema) }}
      />
      {children}
    </>
  );
}
