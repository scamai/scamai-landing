"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { trackCTA, trackEvent } from "@/lib/analytics";

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1.0] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type ResearchPaper = {
  title: string;
  authors?: string;
  link?: string;
  coming?: boolean;
};

type ResearchCategory = {
  category: string;
  tags: string[];
  papers: ResearchPaper[];
};

const researchCategories: ResearchCategory[] = [
  {
    category: "Document Forgery",
    tags: ["Document Forgery", "Benchmark"],
    papers: [
      {
        title: "DOCFORGE-BENCH: A Comprehensive Benchmark for Document Forgery Detection and Analysis",
        authors: "Zengqi Zhao, Weidi Xia, Peter Wei, Yan Zhang, Yiyi Zhang, Jane Mo, Tiannan Zhang, Yuanqin Dai, Zexi Chen, Simiao Ren",
        link: "https://arxiv.org/abs/2603.01433",
      },
      {
        title: "AIForge-Doc: A Benchmark for Detecting AI-Forged Tampering in Financial and Form Documents",
        authors: "Jiaqi Wu, Yuchen Zhou, Muduo Xu, Zisheng Liang, Simiao Ren, Jiayu Xue, Meige Yang, Siying Chen, Jingheng Huan",
        link: "https://arxiv.org/abs/2602.20569",
      },
      {
        title: "Can Multi-modal (reasoning) LLMs detect document manipulation?",
        authors: "Zisheng Liang, Kidus Zewde, Rudra Pratap Singh, Disha Patil, Zexi Chen, Jiayu Xue, Yao Yao, Yifei Chen, Qinzhe Liu, Simiao Ren",
        link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=n4B3bH4AAAAJ&sortby=pubdate&citation_for_view=n4B3bH4AAAAJ:2KloaMYe4IUC",
      },
      { title: "Can fully synthetic AI-generated financial documents fool humans?", coming: true },
    ],
  },
  {
    category: "Age Estimation",
    tags: ["Age Estimation", "Benchmark"],
    papers: [
      {
        title: "Can a Teenager Fool an AI? Evaluating Low-Cost Cosmetic Attacks on Age Estimation Systems",
        authors: "Xingyu Shen, Tommy Duong, Xiaodong An, Zengqi Zhao, Zebang Hu, Haoyu Hu, Ziyou Wang, Finn Guo, Simiao Ren",
        link: "https://arxiv.org/abs/2602.19539",
      },
      {
        title: "Out of the box age estimation through facial imagery: A Comprehensive Benchmark of Vision-Language Models vs. out-of-the-box Traditional Architectures",
        authors: "Simiao Ren, Xingyu Shen, Ankit Raj, Albert Dai, Caroline Zhang, Yuan Xu, Zexi Chen, Siqi Wu, Chen Gong, Yuxin Zhang",
        link: "https://arxiv.org/abs/2602.07815",
      },
    ],
  },
  {
    category: "AI-Generated Detection",
    tags: ["AI Detection", "Benchmark"],
    papers: [
      {
        title: "How well are open sourced AI-generated image detection models out-of-the-box: A comprehensive benchmark study",
        authors: "Simiao Ren, Yuchen Zhou, Xingyu Shen, Kidus Zewde, Tommy Duong, George Huang, Neo Tiangratanakul, Dennis Ng, En Wei, Jiayu Xue",
        link: "https://arxiv.org/abs/2602.07814",
      },
      { title: "Survey on the development of AI-generated and deepfake detection", coming: true },
    ],
  },
  {
    category: "Deepfake Detection",
    tags: ["Deepfake Detection"],
    papers: [
      {
        title: "Do deepfake detectors work in reality?",
        authors: "Simiao Ren, Disha Patil, Kidus Zewde, Dennis Ng, Hengwei Xu, Shengkai Jiang, Ramini Desai, Ning-Yau Cheng, Yining Zhou, Ragavi Muthukrishnan",
        link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=n4B3bH4AAAAJ&sortby=pubdate&citation_for_view=n4B3bH4AAAAJ:tKAzc9rXhukC",
      },
      {
        title: "Can Multi-modal (reasoning) LLMs work as deepfake detectors?",
        authors: "Simiao Ren, Yao Yao, Kidus Zewde, Zisheng Liang, Ning-Yau Cheng, Xiaoou Zhan, Qinzhe Liu, Yifei Chen, Hengwei Xu",
        link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=n4B3bH4AAAAJ&sortby=pubdate&citation_for_view=n4B3bH4AAAAJ:ZfRJV9d4-WMC",
      },
    ],
  },
  {
    category: "Interview Tech",
    tags: ["Interview", "Gaze Estimation"],
    papers: [
      { title: "Reading gaze estimation dataset for robust cheating identification", coming: true },
    ],
  },
];

type Dataset = {
  name: string;
  id: string;
  link: string;
};

const datasets: Dataset[] = [
  {
    id: "rwfs",
    name: "Real-World Faceswap Dataset (RWFS)",
    link: "https://drive.google.com/file/d/1A-RPa61f5ROJ0ovcXWW1fNFZgunaAOyd/view?usp=sharing",
  },
  {
    id: "aiforge-doc",
    name: "AI-edit document forgery dataset (AIForge-Doc)",
    link: "https://drive.google.com/file/d/1M1GZAdpdRPqlGJe9lJpLkmnxAEh4y1k1/view",
  },
  {
    id: "age-estimation",
    name: "Adversarial age estimation attack dataset",
    link: "https://drive.google.com/file/d/1QcbykqEs2zkknZexgkzWxGltWDE9smbr/view?usp=sharing",
  },
  {
    id: "gpt4o-receipt",
    name: "Fully-synthetic AI-generated receipt (GPT-4o-receipt)",
    link: "https://drive.google.com/file/d/1Q7Qa-0jkjLXDjzrluFExOgVKmQn_a40T/view?usp=sharing",
  },
  {
    id: "gaze-estimation",
    name: "Simulated gaze estimation for reading dataset",
    link: "https://drive.google.com/file/d/17O4W0xdxijDaq2H21BkfKAAxgvC2Fhip/view?usp=sharing",
  },
];

const stats = [
  { label: "Research Papers", value: `${researchCategories.reduce((sum, c) => sum + c.papers.length, 0)}` },
  { label: "Research Areas", value: `${researchCategories.length}` },
  { label: "Open Datasets", value: `${datasets.length}` },
  { label: "Coming Soon", value: `${researchCategories.reduce((sum, c) => sum + c.papers.filter(p => p.coming).length, 0)}` },
];

/* ── Dataset Access Modal ─────────────────────────────────────── */

const DATASET_ACCESS_KEY = "scamai_dataset_access";

function getStoredEmail(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem(DATASET_ACCESS_KEY);
    return raw ? JSON.parse(raw).email ?? "" : "";
  } catch {
    return "";
  }
}

function storeEmail(email: string) {
  localStorage.setItem(DATASET_ACCESS_KEY, JSON.stringify({ email, ts: Date.now() }));
}

function DatasetAccessModal({
  dataset,
  onClose,
}: {
  dataset: Dataset;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessLink, setAccessLink] = useState("");

  useEffect(() => {
    const stored = getStoredEmail();
    if (stored) setEmail(stored);
  }, []);

  const handleSubmit = useCallback(async () => {
    setError("");
    if (!agreed) {
      setError("Please agree to the data usage terms.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/dataset-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, datasetId: dataset.id, agreed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      storeEmail(email);
      trackEvent({
        action: "dataset_access",
        category: "research",
        label: `${dataset.name} | ${email}`,
      });
      setAccessLink(data.link);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [agreed, email, dataset]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-gray-800/60 bg-[#0e0e11] p-6 sm:p-8 shadow-2xl"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
          </svg>
        </button>

        {accessLink ? (
          /* ── Success: show download link ── */
          <div className="text-center py-4">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Access Granted</h3>
            <p className="text-sm text-gray-400 mb-5">
              {dataset.name}
            </p>
            <a
              href={accessLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#245FFF] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1d4acc]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Open in Google Drive
            </a>
            <button
              onClick={onClose}
              className="mt-4 block mx-auto text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-[#245FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                <h3 className="text-lg font-semibold text-white">Access Dataset</h3>
              </div>
              <p className="text-sm text-gray-400">
                <span className="text-gray-300 font-medium">{dataset.name}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Enter your email and agree to our terms to access the dataset.
              </p>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="dataset-email" className="block text-xs font-medium text-gray-400 mb-1.5">
                Email address
              </label>
              <input
                id="dataset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="you@university.edu"
                className="w-full rounded-lg border border-gray-800/60 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#245FFF]/50 focus:bg-white/[0.05]"
              />
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-3 mb-5 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-700 bg-white/[0.03] text-[#245FFF] accent-[#245FFF] cursor-pointer"
              />
              <span className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                I agree to use this dataset solely for non-commercial research purposes. I will cite the
                associated publication in any resulting work and will not redistribute the data.
              </span>
            </label>

            {error && <p className="text-xs text-red-400 mb-4">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#245FFF] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1d4acc] disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  Continue
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function ResearchPage() {
  const [activeDataset, setActiveDataset] = useState<Dataset | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence>
        {activeDataset && (
          <DatasetAccessModal
            dataset={activeDataset}
            onClose={() => setActiveDataset(null)}
          />
        )}
      </AnimatePresence>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 sm:px-8 pb-14 sm:pb-20" style={{ paddingTop: '180px' }}>
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#245FFF] mb-3 sm:text-[10px] lg:mb-4">
                RESEARCH
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-4 lg:mb-6">
                Advancing the science of{" "}
                <span className="text-[#245FFF]">AI trust</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl">
                Our research focuses on deepfake detection, synthetic media forensics, and adversarial
                robustness. We publish our findings to advance the field and keep our customers ahead of
                emerging threats.
              </p>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection delay={0.15}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 lg:mt-14">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-gray-800/60 bg-white/[0.02] p-4 sm:p-5"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </section>

        <div className="section-divider" />

        {/* Papers */}
        <section className="mx-auto max-w-6xl px-4 sm:px-8 py-14 sm:py-20">
          <AnimatedSection>
            <div className="mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                Publications & Reports
              </h2>
              <p className="text-sm text-gray-500">
                Research from the ScamAI team across deepfake detection, document forgery, age estimation, and more.
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-6">
            {researchCategories.map((cat, catIndex) => (
              <AnimatedSection key={cat.category} delay={0.08 * (catIndex + 1)}>
                <div className="rounded-xl sm:rounded-2xl border border-gray-800/60 bg-white/[0.02] p-5 sm:p-7">
                  {/* Category header */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {cat.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#245FFF]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#245FFF]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-4">
                    {cat.category}
                  </h3>

                  {/* Paper list */}
                  <ul className="space-y-4">
                    {cat.papers.map((paper) => (
                      <li key={paper.title} className="flex items-start gap-3 group">
                        <svg className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          {paper.coming ? (
                            <span className="text-sm leading-snug text-gray-500 italic">
                              <span className="inline-block rounded bg-white/5 border border-gray-800/60 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 not-italic mr-2">
                                Coming
                              </span>
                              {paper.title}
                            </span>
                          ) : paper.link ? (
                            <>
                              <a
                                href={paper.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm leading-snug text-gray-300 hover:text-[#245FFF] transition-colors"
                              >
                                {paper.title}
                                <svg className="inline-block w-3 h-3 ml-1.5 -mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                              {paper.authors && (
                                <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{paper.authors}</p>
                              )}
                            </>
                          ) : (
                            <span className="text-sm leading-snug text-gray-300">{paper.title}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* Datasets */}
        <section className="mx-auto max-w-6xl px-4 sm:px-8 py-14 sm:py-20">
          <AnimatedSection>
            <div className="mb-8 lg:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
                Datasets
              </h2>
              <p className="text-sm text-gray-500 max-w-xl">
                Curated datasets to help researchers benchmark detection models.
                Provide your email and agree to our terms to receive access.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map((dataset, index) => (
              <AnimatedSection key={dataset.name} delay={0.08 * (index + 1)}>
                <div className="group flex flex-col h-full rounded-xl sm:rounded-2xl border border-gray-800/60 bg-white/[0.02] p-5 sm:p-6 transition-all duration-300 hover:border-[#245FFF]/20 hover:bg-white/[0.04]">
                  <div className="flex items-start gap-3 flex-1">
                    <svg className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-[#245FFF] transition-colors">
                      {dataset.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => setActiveDataset(dataset)}
                    className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-gray-800/60 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-white transition-all hover:border-[#245FFF]/30 hover:bg-[#245FFF]/5 hover:text-[#245FFF]"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Get Access
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 sm:px-8 py-14 sm:py-20">
          <AnimatedSection>
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Interested in collaborating?
              </h2>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                We partner with academic institutions and industry labs on deepfake detection research.
              </p>
              <a
                href="https://cal.com/scamai/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#245FFF] px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-[#1d4acc]"
              >
                Get in touch
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </AnimatedSection>
        </section>
      </main>
    </div>
  );
}
