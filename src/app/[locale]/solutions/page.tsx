import { generatePageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/seo';
import { Link } from '@/i18n/navigation';
import { industries } from '@/lib/solutions/industries';
import {
  Landmark,
  Heart,
  Phone,
  ScanFace,
  Newspaper,
  ShieldCheck,
  Users,
  Building2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  return generatePageMetadata({
    locale,
    path: '/solutions',
    title: 'Deepfake Detection Solutions by Industry',
    description:
      'Scam AI deepfake detection solutions for fintech, KYC, dating apps, call centers, media, insurance, HR, and government. Purpose-built for your industry.',
    keywords: [
      'deepfake detection by industry',
      'KYC deepfake protection',
      'fintech deepfake API',
      'dating app deepfake detection',
      'voice clone detection call centers',
      'deepfake solutions',
    ],
    dateModified: '2026-05-23',
  });
}

const industryIcons: Record<string, LucideIcon> = {
  fintech: Landmark,
  dating: Heart,
  'call-centers': Phone,
  kyc: ScanFace,
  media: Newspaper,
  insurance: ShieldCheck,
  hr: Users,
  government: Building2,
};

export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative px-4 sm:px-6 pb-20" style={{ paddingTop: '140px' }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-4 sm:text-xs">
              SOLUTIONS
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
              Deepfake detection for <span className="text-[#245FFF]">every industry</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Scam AI adapts to the specific fraud patterns, compliance requirements, and workflow needs of your industry.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/solutions/${industry.slug}`}
                className="group rounded-2xl border border-gray-800/60 bg-white/[0.02] p-7 hover:border-[#245FFF]/40 hover:bg-[#245FFF]/[0.03] transition-all duration-200"
              >
                {(() => {
                  const Icon = industryIcons[industry.slug];
                  return Icon ? (
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-800 bg-white/[0.03]">
                      <Icon className="h-5 w-5 text-[#245FFF]" strokeWidth={1.5} />
                    </div>
                  ) : null;
                })()}
                <h2 className="text-lg font-bold text-white mb-2 group-hover:text-[#245FFF] transition-colors">
                  {industry.name}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {industry.metaDescription}
                </p>
                <span className="text-xs font-semibold text-[#245FFF] flex items-center gap-1">
                  Learn more
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-sm text-gray-500 mb-6">
              Don&apos;t see your industry?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://app.scam.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="rainbow-button inline-block"
              >
                <span className="rainbow-button-inner">Try Free — 200 images/month</span>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border border-gray-700 rounded-lg hover:border-[#245FFF]/50 transition-colors duration-200"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
