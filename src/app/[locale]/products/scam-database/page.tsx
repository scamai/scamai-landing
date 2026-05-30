import { Link } from '@/i18n/navigation';

export default function ScamDatabasePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative mx-auto max-w-4xl px-4 sm:px-8 pb-20" style={{ paddingTop: '180px' }}>

        <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] text-[#245FFF] mb-4">
          Product
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
          Scam Database
        </h1>

        <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-4 max-w-2xl">
          A searchable threat intelligence database of known scam patterns, deepfake signatures, and synthetic media examples — built to help organizations identify fraud before it reaches their users.
        </p>

        <p className="text-base text-gray-500 leading-relaxed mb-12 max-w-2xl">
          The Scam Database aggregates real-world fraud incidents, AI-generated media signatures, and scam campaign patterns. Cross-reference detections against known threat actors and fraud typologies in real time via API.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          <div className="rounded-xl border border-gray-800/60 bg-white/[0.02] p-6">
            <h2 className="text-sm font-semibold text-white mb-2">Threat Intelligence Feed</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Real-time updates with newly identified scam patterns, deepfake campaigns, and synthetic identity fraud signals.
            </p>
          </div>
          <div className="rounded-xl border border-gray-800/60 bg-white/[0.02] p-6">
            <h2 className="text-sm font-semibold text-white mb-2">Pattern Matching API</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Submit media or metadata to cross-reference against the scam database and receive a match confidence score.
            </p>
          </div>
          <div className="rounded-xl border border-gray-800/60 bg-white/[0.02] p-6">
            <h2 className="text-sm font-semibold text-white mb-2">Fraud Trend Reports</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Weekly summaries of emerging fraud typologies, targeted industries, and geographic scam activity.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[#245FFF]/20 bg-[#245FFF]/[0.04] p-6 sm:p-8 mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#245FFF] mb-2">Coming Soon</p>
          <h2 className="text-xl font-bold text-white mb-3">Scam Database is in development</h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xl">
            We are building the Scam Database with data from our detection platform and research pipeline. Enterprise early access is available — contact us to join the preview.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://app.scam.ai"
              className="inline-flex items-center gap-2 rounded-full bg-[#245FFF] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1d4acc]"
            >
              Get early access
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition-all hover:border-[#245FFF]/40"
            >
              Contact sales
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800/60 pt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Related products</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products/ai-detection"
              className="text-sm text-gray-300 hover:text-[#245FFF] transition-colors"
            >
              AI Image &amp; Video Detection →
            </Link>
            <Link
              href="/products/audio-detection"
              className="text-sm text-gray-300 hover:text-[#245FFF] transition-colors"
            >
              Voice Clone Detection →
            </Link>
          </div>
        </div>

      </section>
    </main>
  );
}
