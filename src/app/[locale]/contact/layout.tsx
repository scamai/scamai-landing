import { generatePageMetadata, pageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import PageSchema from '@/components/seo/PageSchema';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/contact',
    ...pageMetadata.contact,
  });
}

const contactFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How quickly can I get started?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can start using ScamAI in minutes. Sign up for a free account at app.scam.ai, get your API key, and make your first API call. We provide SDKs and documentation to help you integrate quickly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer custom solutions for enterprises?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We offer custom integrations, on-premise deployments, dedicated support, and volume discounts for enterprise customers. Contact our sales team to discuss your specific needs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What regions do you operate in?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ScamAI operates globally with data centers in the US, EU, and APAC. We\'re GDPR compliant and can help you meet regional data residency requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'What\'s your SLA for enterprise customers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enterprise customers receive 99.9% uptime SLA, priority support with guaranteed response times, and dedicated account management. Contact sales for details.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I try before committing to a paid plan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely! We offer 200 free images per month with no credit card required. You can test our API, explore the dashboard, and evaluate accuracy before upgrading.',
      },
    },
  ],
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Reality Inc.',
  alternateName: 'ScamAI',
  url: 'https://scam.ai',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2150 Shattuck Ave., Penthouse Suite #1300',
    addressLocality: 'Berkeley',
    addressRegion: 'CA',
    postalCode: '94704',
    addressCountry: 'US',
  },
  email: 'contact@scam.ai',
};

export default async function ContactLayout({
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
        path="/contact"
        breadcrumbs={[{ name: 'Contact' }]}
        speakable
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactFaqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {children}
    </>
  );
}
