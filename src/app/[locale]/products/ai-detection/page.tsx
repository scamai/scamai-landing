"use client";

import { Bento33, Bento45, Bento55 } from "@/components/bento";
import { BentoV1_8 } from "@/components/bento-v1";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useState, Suspense } from "react";

function BentoSkeleton() {
  return (
    <div className="w-full h-full rounded-xl bg-white/[0.02] border border-gray-800/40 flex items-center justify-center animate-pulse">
      <div className="w-16 h-16 rounded-full bg-white/[0.03]" />
    </div>
  );
}
import { Link } from "@/i18n/navigation";
import { getIndustryBySlug } from "@/lib/solutions/industries";
import { getArticleBySlug } from "@/lib/learn/articles";
import { aiDetectionSolutionLinks, aiDetectionLearnLinks, aiDetectionCompareLink } from "@/lib/internal-links";

// Animated Section Component
function AnimatedSection({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function AIDetectionPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="landing-section relative overflow-hidden bg-black" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingTop: '90px',
        backgroundImage: 'url(/vision.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative z-10 w-full max-w-4xl px-8 sm:px-10 lg:px-8">
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5 lg:space-y-6">
            <AnimatedSection delay={0.2}>
              <p className="text-[10px] font-semibold text-gray-400 tracking-[0.15em] uppercase sm:text-xs">
                AI DETECTION
              </p>
            </AnimatedSection>
            
            <AnimatedSection delay={0.3}>
              <h1 className="text-3xl font-bold leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl max-w-3xl px-2 sm:px-0">
                Detect deepfakes in images and videos
              </h1>
            </AnimatedSection>
            
            <AnimatedSection delay={0.4}>
              <div className="max-w-2xl text-sm leading-[1.7] text-gray-300 sm:text-base sm:leading-relaxed lg:text-lg px-4 sm:px-0" data-speakable>
                <p className="text-center">
                  Scam AI&apos;s Eva-v1 models detect <span className="font-semibold text-white">synthetic media</span>, <span className="font-semibold text-white">manipulated faces</span>, and <span className="font-semibold text-white">deepfake videos</span> with <span className="font-semibold text-white">95.3% accuracy</span> in under 4 seconds. Supports face swaps, GAN-generated images, and diffusion model outputs including Stable Diffusion, DALL-E, Midjourney, and Flux.
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.5}>
              <div className="pt-4 sm:pt-3">
                <a
                  href="https://app.scam.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rainbow-button inline-block"
                >
                  <span className="rainbow-button-inner">
                    Try AI Detection
                  </span>
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-section relative overflow-hidden bg-black">
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 lg:max-w-7xl py-20 sm:py-24 lg:py-32">
          {/* Section Title */}
          <AnimatedSection>
            <div className="text-center mb-16 lg:mb-20">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4 sm:text-[10px] lg:mb-6">
                ADVANCED CAPABILITIES
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1]">
                Powerful Visual <span className="text-[#245FFF]">Analysis</span>
              </h2>
            </div>
          </AnimatedSection>

          {/* Feature 1: Face Manipulation Detection - Bento on Right */}
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 lg:mb-28">
              <div className="lg:pl-12 flex flex-col justify-center" style={{ minHeight: '400px' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs lg:mb-6">
                  FACE DETECTION
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-[1.15] lg:mb-6">
                  Face Manipulation Detection
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4" data-speakable>
                  Identify face swaps, expression changes, and facial attribute manipulations with <span className="font-semibold text-white">95.3% accuracy</span> using advanced neural network analysis. Detects outputs from leading generation tools including Stable Diffusion, DALL-E, Midjourney, and Flux.
                </p>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  Eva-v1-Fast processes in <span className="font-semibold text-white">under 2 seconds</span> for real-time moderation. Eva-v1-Pro delivers forensic-grade results in <span className="font-semibold text-white">under 4 seconds</span> for KYC and legal evidence.
                </p>
              </div>
              <div className="relative flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="w-full max-w-[400px]" style={{ height: '400px', transform: 'scale(1.2)' }}>
                  <Suspense fallback={<BentoSkeleton />}><Bento45 /></Suspense>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Feature 2: Video Analysis - Bento on Left */}
          <AnimatedSection delay={0.2}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 lg:mb-28">
              <div className="order-2 lg:order-1 relative flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="w-full max-w-[400px]" style={{ height: '400px', transform: 'scale(1.2)' }}>
                  <Suspense fallback={<BentoSkeleton />}><Bento33 /></Suspense>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex flex-col justify-center" style={{ minHeight: '400px' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs lg:mb-6">
                  VIDEO ANALYSIS
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-[1.15] lg:mb-6">
                  Video Frame Analysis
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-4">
                  Analyze every frame of video content to detect inconsistencies, temporal artifacts, and synthetic generation patterns across time.
                </p>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  Works seamlessly with <span className="font-semibold text-white">JPG, PNG, GIF, WebP, MP4, MOV, AVI</span> and all major image and video formats.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Feature 3: Detailed Reports - Bento on Right */}
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24 lg:mb-28">
              <div className="lg:pl-12 flex flex-col justify-center" style={{ minHeight: '400px' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs lg:mb-6">
                  COMPREHENSIVE INSIGHTS
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-[1.15] lg:mb-6">
                  Detailed Analysis Reports
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  Receive comprehensive reports with confidence scores, manipulated region heatmaps, and visual evidence markers for investigation. Our RESTful API provides seamless integration into your existing workflows and platforms.
                </p>
              </div>
              <div className="relative flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="w-full max-w-[400px]" style={{ height: '400px', transform: 'scale(1.2)' }}>
                  <Suspense fallback={<BentoSkeleton />}><Bento55 /></Suspense>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Feature 4: Integration - Bento on Left */}
          <AnimatedSection delay={0.2}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1 relative flex items-center justify-center" style={{ minHeight: '400px' }}>
                <div className="w-full max-w-[400px]" style={{ height: '400px', transform: 'scale(1.2)' }}>
                  <Suspense fallback={<BentoSkeleton />}><BentoV1_8 /></Suspense>
                </div>
              </div>
              <div className="order-1 lg:order-2 flex flex-col justify-center" style={{ minHeight: '400px' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs lg:mb-6">
                  EASY INTEGRATION
                </p>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-[1.15] lg:mb-6">
                  Simple API Integration
                </h3>
                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                  Integrate deepfake detection into your platform with just a few lines of code. Our developer-friendly API includes comprehensive documentation, SDKs, and 24/7 support to get you up and running quickly.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="landing-section relative overflow-hidden bg-black" style={{
        backgroundImage: 'url(/session4.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 lg:max-w-7xl py-20 sm:py-24 lg:py-32">
          <AnimatedSection>
            <div className="text-center mb-16 lg:mb-20">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-4 sm:text-[10px] lg:mb-6">
                REAL-WORLD APPLICATIONS
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1]">
                Trusted across <span className="text-[#245FFF]">industries</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <AnimatedSection delay={0.1}>
              <div className="rounded-2xl border border-gray-800/50 bg-gray-900/40 backdrop-blur-sm p-8 lg:p-10 h-full">
                <h3 className="mb-4 text-2xl sm:text-3xl font-bold text-white">Social Media Platforms</h3>
                <p className="mb-6 text-base sm:text-lg text-gray-300 leading-relaxed">
                  Protect your users from manipulated content and deepfake campaigns. Automatically flag suspicious media before it spreads.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start text-base sm:text-lg">
                    <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Content moderation automation</span>
                  </li>
                  <li className="flex items-start text-base sm:text-lg">
                    <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>User-generated content verification</span>
                  </li>
                  <li className="flex items-start text-base sm:text-lg">
                    <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Misinformation prevention</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="rounded-2xl border border-gray-800/50 bg-gray-900/40 backdrop-blur-sm p-8 lg:p-10 h-full">
                <h3 className="mb-4 text-2xl sm:text-3xl font-bold text-white">Financial Services</h3>
                <p className="mb-6 text-base sm:text-lg text-gray-300 leading-relaxed">
                  Prevent identity fraud and KYC bypass attempts with advanced deepfake detection during onboarding and verification.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start text-base sm:text-lg">
                    <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>KYC verification enhancement</span>
                  </li>
                  <li className="flex items-start text-base sm:text-lg">
                    <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Identity fraud prevention</span>
                  </li>
                  <li className="flex items-start text-base sm:text-lg">
                    <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Document authenticity checks</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="rounded-2xl border border-gray-800/50 bg-gray-900/40 backdrop-blur-sm p-8 lg:p-10 h-full">
                <h3 className="mb-4 text-2xl sm:text-3xl font-bold text-white">Media & Publishing</h3>
                <p className="mb-6 text-base sm:text-lg text-gray-300 leading-relaxed">
                  Verify the authenticity of visual content before publication to maintain credibility and avoid spreading misinformation.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start text-base sm:text-lg">
                    <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Fact-checking workflows</span>
                  </li>
                  <li className="flex items-start text-base sm:text-lg">
                    <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Source verification</span>
                  </li>
                  <li className="flex items-start text-base sm:text-lg">
                    <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Editorial integrity protection</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="rounded-2xl border border-gray-800/50 bg-gray-900/40 backdrop-blur-sm p-8 lg:p-10 h-full">
                <h3 className="mb-4 text-2xl sm:text-3xl font-bold text-white">E-commerce & Dating</h3>
                <p className="mb-6 text-base sm:text-lg text-gray-300 leading-relaxed">
                  Build trust on your platform by ensuring profile photos and product images are authentic and unmanipulated.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start text-base sm:text-lg">
                    <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Profile verification</span>
                  </li>
                  <li className="flex items-start text-base sm:text-lg">
                    <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Product image authenticity</span>
                  </li>
                  <li className="flex items-start text-base sm:text-lg">
                    <svg className="w-5 h-5 text-[#245FFF] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Scam prevention</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQAccordion />

      {/* CTA Section */}
      <section className="landing-section relative overflow-hidden bg-black">
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 py-20 sm:py-24 lg:py-32">
          <AnimatedSection>
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.1]">
                Start detecting deepfakes today
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                <span className="font-semibold text-white">200 free images per month</span>. No credit card required.
              </p>
              <a
                href="https://app.scam.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="rainbow-button inline-block"
              >
                <span className="rainbow-button-inner">
                  Get Started Free
                </span>
              </a>
              <p className="mt-6 text-sm text-gray-400">
                Also need audio deepfake detection?{" "}
                <Link href="/products/audio-detection" className="text-[#245FFF] hover:underline">
                  Explore Voice Clone Detection →
                </Link>
              </p>
              <p className="mt-2 text-sm text-gray-400">
                View{" "}
                <Link href="/pricing" className="text-[#245FFF] hover:underline">
                  pricing plans
                </Link>{" "}
                starting at $0.05/image.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Built on published research:{" "}
                <Link href="/research/papers/deepfake-detectors-in-reality" className="text-gray-400 hover:text-[#245FFF] transition-colors">
                  Do deepfake detectors work in reality?
                </Link>
                {" "}·{" "}
                <Link href="/research/papers/open-source-ai-detection-benchmark" className="text-gray-400 hover:text-[#245FFF] transition-colors">
                  Open-source detector benchmark
                </Link>
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="mt-14 mx-auto max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-4 text-center">Industry Solutions & Learning</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {aiDetectionSolutionLinks.map((slug) => {
                  const sol = getIndustryBySlug(slug);
                  if (!sol) return null;
                  return (
                    <Link key={slug} href={`/solutions/${slug}`} className="group rounded-lg border border-gray-800/50 bg-white/[0.02] px-4 py-3 hover:border-[#245FFF]/30 transition-colors flex items-center justify-between">
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{sol.name}</span>
                      <svg className="w-4 h-4 text-gray-700 group-hover:text-[#245FFF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  );
                })}
                {aiDetectionLearnLinks.map((slug) => {
                  const article = getArticleBySlug(slug);
                  if (!article) return null;
                  return (
                    <Link key={slug} href={`/learn/${slug}`} className="group rounded-lg border border-gray-800/50 bg-white/[0.02] px-4 py-3 hover:border-[#245FFF]/30 transition-colors flex items-center justify-between">
                      <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{article.title}</span>
                      <svg className="w-4 h-4 text-gray-700 group-hover:text-[#245FFF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  );
                })}
                <Link href={`/compare/${aiDetectionCompareLink}`} className="group rounded-lg border border-gray-800/50 bg-white/[0.02] px-4 py-3 hover:border-[#245FFF]/30 transition-colors flex items-center justify-between">
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Scam AI vs Reality Defender</span>
                  <svg className="w-4 h-4 text-gray-700 group-hover:text-[#245FFF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}

const aiFaqs = [
  {
    question: "How accurate is Scam AI image and video deepfake detection?",
    answer: "Scam AI achieves 95.3% accuracy for image and video deepfake detection using the Eva-v1 model. Eva-v1-Fast processes in under 2 seconds for high-throughput use cases, while Eva-v1-Pro processes in under 4 seconds for maximum accuracy with lower false positives.",
  },
  {
    question: "What types of deepfakes can Scam AI detect in images and videos?",
    answer: "Scam AI detects face swaps, GAN-generated images, diffusion model outputs (Stable Diffusion, DALL-E, Midjourney, Flux), video deepfakes with frame-by-frame and temporal analysis, synthetic faces, and 4K video manipulation.",
  },
  {
    question: "What image and video formats does Scam AI support?",
    answer: "Scam AI supports JPG, PNG, GIF, and WebP image formats, and MP4, MOV, and AVI video formats. 4K video analysis is supported with frame-by-frame deepfake detection.",
  },
  {
    question: "How fast is Scam AI deepfake detection?",
    answer: "Eva-v1-Fast processes images in under 2 seconds, suitable for real-time content moderation and high-volume KYC screening. Eva-v1-Pro processes in under 4 seconds for forensic-grade analysis and high-stakes identity verification.",
  },
  {
    question: "Is there a free deepfake detector I can try?",
    answer: "Yes. Scam AI includes 200 free image analyses per month — no credit card required. Sign up at app.scam.ai to get instant access to the deepfake detector with the Eva-v1-Fast model. Upgrade to pay-as-you-go ($0.05/image) or Enterprise when your volume grows.",
  },
  {
    question: "Can I integrate deepfake detection into my app via API?",
    answer: "Yes. Scam AI provides a REST API that integrates in under 10 minutes. Make a POST request with your image URL, receive a JSON response with is_deepfake boolean, confidence score, and model used. SDKs for Python and JavaScript are available.",
  },
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="landing-section relative overflow-hidden bg-black" aria-label="Frequently Asked Questions">
      <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-8 py-20 sm:py-24 lg:py-32">
        <div className="text-center mb-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#245FFF] mb-4 sm:text-xs">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-[1.1]">
            AI Image Detection Questions
          </h2>
        </div>
        <div className="space-y-4">
          {aiFaqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-800 overflow-hidden transition-colors duration-300 hover:border-gray-700"
              style={{ background: openIndex === index ? "rgba(36, 95, 255, 0.03)" : "rgba(17, 24, 39, 0.3)" }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-start justify-between text-left transition-colors hover:bg-gray-800/30"
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-semibold text-white pr-8 leading-relaxed">{faq.question}</span>
                <motion.svg
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5 text-[#245FFF] flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      <p className="text-gray-300 leading-relaxed" data-speakable>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
