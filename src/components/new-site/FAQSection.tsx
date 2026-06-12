"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { trackFAQ } from "@/lib/analytics";

// Convert plain-text answers to React elements with linkified URLs
function LinkifiedAnswer({ text }: { text: string }) {
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(urlRegex)) {
    const before = text.slice(lastIndex, match.index);
    if (before) parts.push(<span key={`t-${lastIndex}`}>{before}</span>);
    const href = match[1];
    parts.push(
      <a key={`l-${match.index}`} href={href} target="_blank" rel="noopener noreferrer" className="text-[#245FFF] hover:underline">
        {href.replace(/^https?:\/\//, "")}
      </a>
    );
    lastIndex = match.index! + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return <p className="text-gray-300 leading-relaxed">{parts}</p>;
}

// Stable ids — visible text resolved via t() at render time
const faqIds = [
  "freeTier",
  "fastVsPro",
  "pricingAfterFree",
  "mediaTypes",
  "volumeDiscounts",
  "thinking",
  "accuracy",
  "integration",
  "dataRetention",
  "getStarted",
] as const;

export default function FAQSection() {
  const t = useTranslations("landing.faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    if (openIndex !== index) {
      trackFAQ(t(`items.${faqIds[index]}.question`));
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <section
      className="landing-section relative overflow-hidden bg-black"
      aria-label={t("sectionAriaLabel")}
      style={{ paddingTop: '80px', paddingBottom: '80px' }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black"></div>
      
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.1]">
            {t("heading")}
          </h2>
          <p className="text-base sm:text-lg text-gray-300">
            {t("subheading")}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqIds.map((id, index) => (
            <div
              key={id}
              className="rounded-2xl border border-gray-800 overflow-hidden transition-colors duration-300 hover:border-gray-700"
              style={{ background: openIndex === index ? 'rgba(36, 95, 255, 0.03)' : 'rgba(17, 24, 39, 0.3)' }}
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-4 py-4 sm:px-8 sm:py-6 flex items-start justify-between text-left transition-colors hover:bg-gray-800/30"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="text-base sm:text-lg font-semibold text-white pr-8 leading-relaxed">
                  {t(`items.${id}.question`)}
                </span>
                <motion.svg
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-6 h-6 text-[#245FFF] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 sm:px-8 sm:pb-8">
                      <LinkifiedAnswer text={t(`items.${id}.answer`)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-6">
            {t("contact.prompt")}
          </p>
          <a
            href="https://cal.com/scamai/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#245FFF] text-white font-semibold hover:bg-[#1d4acc] transition-colors"
          >
            {t("contact.cta")}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
    </>
  );
}
