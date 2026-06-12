"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackFAQ } from "@/lib/analytics";

interface FAQItem {
  question: string;
  answer: string;
}

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

const faqData: FAQItem[] = [
  {
    question: "What is included in the free tier?",
    answer: "The free tier includes 200 images per month analyzed with our Eva-v1-Fast model. This includes GenAI detection, deepfake analysis, API access, and dashboard analytics. No credit card required to get started. Sign up free at https://app.scam.ai"
  },
  {
    question: "What's the difference between Eva-v1-Fast and Eva-v1-Pro?",
    answer: "Eva-v1-Fast is our standard model optimized for speed and efficiency, perfect for most use cases. Eva-v1-Pro is our advanced model with significantly lower false positives and enhanced detection capabilities, available exclusively for Enterprise customers. Pro provides deeper analysis for high-stakes applications like KYC verification and fraud prevention. Compare models at https://scam.ai/products/ai-detection"
  },
  {
    question: "How does pricing work after the free tier?",
    answer: "After your 200 free images per month, you pay $0.05 per image analyzed. You can also add optional features like Adaptive Defense (+$0.008/image), Active Liveness (+$0.008/image), or Express Lane (+$0.008/image). View full pricing at https://scam.ai/pricing"
  },
  {
    question: "What types of media can I analyze?",
    answer: "Our platform supports analysis of images, audio files, and video content at https://scam.ai/products/ai-detection. We detect GenAI-generated content, deepfakes, synthetic media, face swaps, voice clones, and various forms of media manipulation across all supported formats."
  },
  {
    question: "Do you offer volume discounts?",
    answer: "Yes! For organizations processing more than 2,000 images per month, we offer custom Enterprise pricing with volume discounts, dedicated support, and access to advanced models like Eva-v1-Pro and Thinking. Contact our sales team at https://cal.com/scamai/15min to discuss your specific needs."
  },
  {
    question: "What is the Thinking feature?",
    answer: "Thinking is our advanced reasoning capability available exclusively in the Enterprise tier. It provides deeper analysis and context-aware detection, helping identify sophisticated manipulation techniques. Learn more at https://www.scam.ai/en/products"
  },
  {
    question: "How accurate is your detection?",
    answer: "Our Eva models are continuously trained on the latest GenAI and deepfake techniques. Eva-v1-Fast provides strong accuracy for most use cases, while Eva-v1-Pro delivers higher precision with significantly lower false positives for enterprise applications. Detection confidence scores are provided with each analysis. View benchmarks at https://scam.ai/products/ai-detection"
  },
  {
    question: "Can I integrate this into my existing application?",
    answer: "Absolutely! We provide a RESTful API for easy integration. Our API supports synchronous and asynchronous processing, webhooks for notifications, and comprehensive documentation. Enterprise customers receive dedicated integration support. See the API docs at https://docu.scam.ai"
  },
  {
    question: "What is your data retention policy?",
    answer: "We are GDPR compliant and SOC 2 Type II attested. Your data security is our priority. We only retain data as necessary for service delivery and provide full data retention controls. Enterprise customers can customize retention policies to meet their specific compliance requirements."
  },
  {
    question: "How do I get started?",
    answer: "Simply sign up for a free account at https://app.scam.ai to get immediate access to 200 free image analyses per month with our Eva-v1-Fast model. No credit card required. Upgrade to paid plans at https://scam.ai/pricing or contact sales for Enterprise options."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    if (openIndex !== index) {
      trackFAQ(faqData[index].question);
    }
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <section
      className="landing-section relative overflow-hidden bg-black" 
      aria-label="Frequently Asked Questions"
      style={{ paddingTop: '80px', paddingBottom: '80px' }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black"></div>
      
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs">
            SUPPORT
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.1]">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-gray-300">
            Everything you need to know about our GenAI and deepfake detection platform
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
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
                  {faq.question}
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
                      <LinkifiedAnswer text={faq.answer} />
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
            Still have questions? We're here to help.
          </p>
          <a
            href="https://cal.com/scamai/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#245FFF] text-white font-semibold hover:bg-[#1d4acc] transition-colors"
          >
            Schedule a Call
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
