"use client";

import { useTranslations } from "next-intl";

export default function DocumentationPage() {
  const t = useTranslations("documentationPage");

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#66b3ff]">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mb-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mb-8 text-lg text-gray-300">
            {t("hero.subtitle")}
          </p>
          <a
            href="https://app.scam.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="rainbow-button inline-block"
          >
            <span className="rainbow-button-inner">
              {t("hero.cta")}
            </span>
          </a>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-3xl font-bold sm:text-4xl">
            {t("quickStart.title")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#66b3ff]/10 text-[#66b3ff] font-bold text-xl">
                1
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{t("quickStart.steps.signUp.title")}</h3>
              <p className="text-gray-300">
                {t("quickStart.steps.signUp.description")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#66b3ff]/10 text-[#66b3ff] font-bold text-xl">
                2
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{t("quickStart.steps.makeCall.title")}</h3>
              <p className="text-gray-300">
                {t("quickStart.steps.makeCall.description")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#66b3ff]/10 text-[#66b3ff] font-bold text-xl">
                3
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{t("quickStart.steps.getResults.title")}</h3>
              <p className="text-gray-300">
                {t("quickStart.steps.getResults.description")}
              </p>
            </div>
          </div>

          {/* Code Example */}
          <div className="rounded-lg border border-gray-800 bg-[#0b0b0b] p-8">
            <h3 className="mb-4 text-xl font-bold text-white">{t("quickStart.example.title")}</h3>
            <div className="bg-black/60 text-green-400 p-6 rounded-lg font-mono text-sm border border-gray-700 overflow-x-auto">
              <div className="mb-4">
                <span className="text-gray-500"># Detect deepfakes in an image</span>
              </div>
              <div>curl -X POST https://api.scam.ai/v1/detect \</div>
              <div className="ml-4">-H "Authorization: Bearer YOUR_API_KEY" \</div>
              <div className="ml-4">-F "file=@image.jpg"</div>
              <div className="mt-6 mb-4">
                <span className="text-gray-500"># Response</span>
              </div>
              <div>{'{'}</div>
              <div className="ml-4">"is_synthetic": false,</div>
              <div className="ml-4">"confidence": 0.98,</div>
              <div className="ml-4">"processing_time_ms": 3200,</div>
              <div className="ml-4">"model": "Eva-v1"</div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-24 px-4 sm:px-6 bg-gray-900/20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-3xl font-bold sm:text-4xl">
            {t("endpoints.title")}
          </h2>
          <div className="space-y-6">
            {/* Image Detection */}
            <div className="rounded-lg border border-gray-800 bg-[#0b0b0b] p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded font-mono text-sm font-semibold">
                  POST
                </span>
                <code className="text-[#66b3ff]">/v1/detect/image</code>
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{t("endpoints.image.title")}</h3>
              <p className="mb-4 text-gray-300">
                {t("endpoints.image.description")}
              </p>
              <div className="text-sm text-gray-400">
                <p><strong className="text-white">{t("endpoints.labels.rateLimit")}</strong> 100 requests/minute</p>
                <p><strong className="text-white">{t("endpoints.labels.maxFileSize")}</strong> 10MB</p>
                <p><strong className="text-white">{t("endpoints.labels.supportedFormats")}</strong> JPG, PNG, GIF, WebP</p>
              </div>
            </div>

            {/* Audio Detection */}
            <div className="rounded-lg border border-gray-800 bg-[#0b0b0b] p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded font-mono text-sm font-semibold">
                  POST
                </span>
                <code className="text-[#66b3ff]">/v1/detect/audio</code>
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{t("endpoints.audio.title")}</h3>
              <p className="mb-4 text-gray-300">
                {t("endpoints.audio.description")}
              </p>
              <div className="text-sm text-gray-400">
                <p><strong className="text-white">{t("endpoints.labels.rateLimit")}</strong> 100 requests/minute</p>
                <p><strong className="text-white">{t("endpoints.labels.maxFileSize")}</strong> 50MB</p>
                <p><strong className="text-white">{t("endpoints.labels.supportedFormats")}</strong> MP3, WAV, M4A, FLAC</p>
              </div>
            </div>

            {/* Video Detection */}
            <div className="rounded-lg border border-gray-800 bg-[#0b0b0b] p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded font-mono text-sm font-semibold">
                  POST
                </span>
                <code className="text-[#66b3ff]">/v1/detect/video</code>
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{t("endpoints.video.title")}</h3>
              <p className="mb-4 text-gray-300">
                {t("endpoints.video.description")}
              </p>
              <div className="text-sm text-gray-400">
                <p><strong className="text-white">{t("endpoints.labels.rateLimit")}</strong> 50 requests/minute</p>
                <p><strong className="text-white">{t("endpoints.labels.maxFileSize")}</strong> 100MB</p>
                <p><strong className="text-white">{t("endpoints.labels.supportedFormats")}</strong> MP4, MOV, AVI, WebM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-3xl font-bold sm:text-4xl">
            {t("sdks.title")}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-6 text-center">
              <h3 className="mb-2 text-lg font-bold text-white">Python</h3>
              <p className="mb-4 text-sm text-gray-400">pip install scamai</p>
              <code className="text-xs text-gray-500">{t("sdks.comingSoon")}</code>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-6 text-center">
              <h3 className="mb-2 text-lg font-bold text-white">Node.js</h3>
              <p className="mb-4 text-sm text-gray-400">npm install scamai</p>
              <code className="text-xs text-gray-500">{t("sdks.comingSoon")}</code>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-6 text-center">
              <h3 className="mb-2 text-lg font-bold text-white">Go</h3>
              <p className="mb-4 text-sm text-gray-400">go get scamai</p>
              <code className="text-xs text-gray-500">{t("sdks.comingSoon")}</code>
            </div>

            <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-6 text-center">
              <h3 className="mb-2 text-lg font-bold text-white">Ruby</h3>
              <p className="mb-4 text-sm text-gray-400">gem install scamai</p>
              <code className="text-xs text-gray-500">{t("sdks.comingSoon")}</code>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-24 px-4 sm:px-6 bg-gray-900/20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-3xl font-bold sm:text-4xl">
            {t("bestPractices.title")}
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-gray-800 bg-[#0b0b0b] p-6">
              <h3 className="mb-4 text-xl font-bold text-white">{t("bestPractices.errorHandling.title")}</h3>
              <p className="text-gray-300">
                {t("bestPractices.errorHandling.description")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-800 bg-[#0b0b0b] p-6">
              <h3 className="mb-4 text-xl font-bold text-white">{t("bestPractices.rateLimiting.title")}</h3>
              <p className="text-gray-300">
                {t("bestPractices.rateLimiting.description")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-800 bg-[#0b0b0b] p-6">
              <h3 className="mb-4 text-xl font-bold text-white">{t("bestPractices.fileOptimization.title")}</h3>
              <p className="text-gray-300">
                {t("bestPractices.fileOptimization.description")}
              </p>
            </div>

            <div className="rounded-lg border border-gray-800 bg-[#0b0b0b] p-6">
              <h3 className="mb-4 text-xl font-bold text-white">{t("bestPractices.cachingResults.title")}</h3>
              <p className="text-gray-300">
                {t("bestPractices.cachingResults.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/contact"
              className="rainbow-button inline-block"
            >
              <span className="rainbow-button-inner">
                {t("cta.contactSupport")}
              </span>
            </a>
            <a
              href="https://app.scam.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg border border-gray-700 bg-gray-800 px-8 py-3 font-semibold text-white hover:bg-gray-700 transition-colors"
            >
              {t("cta.getApiKey")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
