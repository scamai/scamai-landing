"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, CheckCircle, Lock } from "lucide-react";
import WaitlistForm from "./WaitlistForm";

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
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stats = [
  ["$65B", "lost to scams in the US last year"],
  ["1 in 3", "Americans over 60 targeted annually"],
  ["100%", "coverage if a scam slips past us"],
] as const;

const trustBadges = [
  { icon: "🔒", label: "Top Privacy" },
  { icon: "🛡️", label: "Insurance-Backed" },
  { icon: "✅", label: "Always Protected" },
];

const steps = [
  {
    step: "01",
    icon: "🫥",
    title: "Remove Your Personal Info — Online and on the Dark Web",
    desc: "Scammers buy your name, phone number, and address from data broker websites — and trade it on the dark web. We scrub your information from all of them, making you much harder to find and target before any scam even starts.",
    tag: "Proactive Defense",
  },
  {
    step: "02",
    icon: "🔍",
    title: "Monitor Data Breaches That Affect You",
    desc: "When companies get hacked, your data can leak. We continuously scan for breaches that include your information and send you a plain-English alert right away — so you always know what's been exposed and what to do next.",
    tag: "Stay Informed",
  },
  {
    step: "03",
    icon: "📡",
    title: "Watch Over Your Calls, Texts, and Emails",
    desc: "We monitor your incoming calls, texts, and emails for active scam attempts — flagging suspicious activity and stopping fraudsters before they can reach you.",
    tag: "Active Shield",
  },
  {
    step: "04",
    icon: "🛡️",
    title: "Cover You When the Unfortunate Happens",
    desc: "Even with the best protection, no system is perfect. That's why every scam.ai member is backed by our Scam Protection Guarantee. If you suffer a financial loss from a scam while you're with us, you may be eligible for reimbursement — backed by a licensed insurance partner.",
    tag: "Full Safety Net",
  },
];

const coverageItems = [
  { label: "Romance & impersonation scams", note: "Covered" },
  { label: "Fake IRS & Medicare calls", note: "Covered" },
  { label: "Gift card & wire transfer fraud", note: "Covered" },
  { label: "Phishing & identity theft", note: "Covered" },
];

const problemStats = [
  {
    stat: "$3.4B",
    label: "Stolen from Americans 60+ last year",
    sub: "More than any other age group",
  },
  {
    stat: "1 in 5",
    label: "Seniors loses money to fraud",
    sub: "Most never report it out of shame",
  },
  {
    stat: "400%",
    label: "Rise in AI-generated scam calls",
    sub: "Voices now sound exactly like family",
  },
];

const features = [
  {
    icon: "📰",
    title: "Weekly Scam Newsletter",
    desc: "Every week we send you a plain-English summary of the newest scams going around. When you know what to look for, scammers lose their power over you.",
  },
  {
    icon: "🤝",
    title: "Live Support Network",
    desc: "Something feels off? Call us. Our support team is here when you're not sure if a call, text, or email is a scam. You are never alone in figuring it out.",
  },
  {
    icon: "🫥",
    title: "Personal Info Removal",
    desc: "Scammers buy your name, address, and phone number from data brokers online. We scrub it from hundreds of those databases — so you become much harder to target in the first place.",
  },
];

export default function ScamInsurancePage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Announcement bar */}
      <div className="bg-[#245FFF] text-white text-center py-2.5 px-4 text-sm font-medium tracking-wide">
        Never worry about scams again — early birds get their first 3 months free
      </div>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-5 sm:px-10 pt-20 pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden"
        >
          <div className="mt-[-80px] h-[600px] w-[800px] rounded-full bg-[#245FFF]/12 blur-[140px]" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden"
        >
          <div className="mt-[40px] h-[300px] w-[400px] rounded-full bg-[#245FFF]/10 blur-[80px]" />
        </div>

        <AnimatedSection className="relative z-10 flex flex-col items-center">
          <p className="mb-5 text-[10px] font-semibold tracking-[0.16em] uppercase text-gray-400">
            For Families &amp; Seniors
          </p>

          <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-6">
            Never Worry About{" "}
            <span className="text-[#245FFF]">Scams Again.</span>
          </h1>

          <p className="max-w-lg text-base sm:text-lg text-gray-300 leading-relaxed mb-6">
            scam.ai blocks scam calls, texts, and emails before they ever reach
            you — and backs it up with a money-back guarantee if anything gets
            through.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {trustBadges.map(({ icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#93c5fd] border border-[#245FFF]/25 bg-[#245FFF]/10 px-3 py-1.5 rounded-full"
              >
                {icon} {label}
              </span>
            ))}
          </div>

          <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl p-6 shadow-[0_0_60px_rgba(36,95,255,0.1)]">
            <WaitlistForm />
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            <span>No credit card. No spam. Unsubscribe anytime.</span>
          </div>
        </AnimatedSection>
      </section>

      {/* Stats */}
      <AnimatedSection>
        <section className="border-y border-white/10">
          <div className="max-w-4xl mx-auto px-5 sm:px-10 py-10 flex flex-wrap justify-center gap-10 text-center">
            {stats.map(([stat, label]) => (
              <div key={stat} className="min-w-[150px]">
                <p className="text-3xl font-bold tracking-tight text-[#245FFF]">
                  {stat}
                </p>
                <p className="text-sm text-gray-400 mt-1.5">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-5 sm:px-10 py-14 sm:py-24">
        <AnimatedSection className="text-center mb-16">
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-gray-400 mb-4">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Four Layers of Protection
          </h2>
          <p className="text-gray-300 text-base max-w-md mx-auto leading-relaxed">
            While you live your life, scam.ai works in the background — removing
            your exposure, watching for threats, and backing you up if anything
            goes wrong.
          </p>
        </AnimatedSection>

        <div className="flex flex-col gap-4">
          {steps.map((item, i) => (
            <AnimatedSection key={item.step} delay={i * 0.1}>
              <div className="relative flex gap-5 md:gap-8">
                {i < 3 && (
                  <div className="absolute left-[22px] top-[52px] bottom-[-20px] w-px bg-gradient-to-b from-[#245FFF]/40 to-transparent" />
                )}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full bg-[#245FFF]/15 border border-[#245FFF]/30 flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1 mb-4 hover:border-[#245FFF]/30 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <span className="shrink-0 text-xs font-semibold text-[#245FFF] border border-[#245FFF]/25 bg-[#245FFF]/10 px-2.5 py-1 rounded-full">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Privacy trust bar */}
        <AnimatedSection delay={0.2}>
          <div className="mt-8 bg-white/5 border border-white/10 rounded-xl px-6 py-4 flex flex-wrap justify-center gap-x-8 gap-y-2">
            {[
              "🔒 Your conversations stay private",
              "🛡️ We are deeply privacy-aware",
              "👁️ You are always in control",
            ].map((item) => (
              <span key={item} className="text-xs text-gray-400">
                {item}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Insurance — hero-weight centerpiece */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#245FFF]/20 via-[#245FFF]/10 to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[700px] w-[700px] rounded-full bg-[#245FFF]/20 blur-[140px]" />
        </div>
        <div className="absolute inset-0 border-y border-[#245FFF]/20" />

        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-10 py-14 sm:py-28 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#245FFF]/20 border-2 border-[#245FFF]/50 mb-8 shadow-[0_0_40px_rgba(36,95,255,0.4)]">
              <Shield className="w-10 h-10 text-[#245FFF]" />
            </div>

            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#93c5fd] mb-5">
              Our Boldest Promise
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.05]">
              Protected by Technology.{" "}
              <span className="text-[#93c5fd]">Backed by Insurance.</span>
            </h2>

            <p className="text-lg text-gray-300 leading-relaxed mb-4 max-w-xl mx-auto">
              Most apps just try to help. We go further. If a scammer gets
              through our protection while you&apos;re a member, you may be
              eligible for reimbursement of your financial loss — backed by a
              real insurance partner, with no runaround.
            </p>
            <p className="text-base text-gray-400 mb-12 max-w-lg mx-auto">
              That&apos;s how proud we are of what we&apos;ve built.
            </p>
          </AnimatedSection>

          {/* Coverage cards */}
          <AnimatedSection delay={0.15}>
            <div className="grid sm:grid-cols-2 gap-3 text-left mb-10">
              {coverageItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 bg-[#245FFF]/10 border border-[#245FFF]/25 rounded-xl px-4 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#93c5fd] shrink-0" />
                    <span className="text-sm text-white">{item.label}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#93c5fd] shrink-0">
                    {item.note}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                "✅ Backed by licensed insurance",
                "✅ No fighting for your money",
              ].map((item) => (
                <span key={item} className="text-sm text-[#93c5fd] font-medium">
                  {item}
                </span>
              ))}
            </div>

            <p className="text-xs text-gray-500 leading-relaxed max-w-xl mx-auto">
              ¹ We are partnering with a licensed insurance company to cover scam
              losses for our members. Coverage is subject to the terms and
              conditions of the insurance contract provided upon enrollment.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Fear / The Problem */}
      <section className="max-w-5xl mx-auto px-5 sm:px-10 py-14 sm:py-24">
        <AnimatedSection className="text-center mb-14">
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-gray-400 mb-4">
            The Reality
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-5">
            Scammers Are Coming for You.
            <br className="hidden md:block" /> Every Single Day.
          </h2>
          <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
            They call pretending to be your bank. They text pretending to be your
            grandchild. They send emails pretending to be the IRS. And they are
            getting better at it every month.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {problemStats.map((item) => (
              <div
                key={item.stat}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
              >
                <p className="text-4xl font-bold tracking-tight text-[#245FFF] mb-2">
                  {item.stat}
                </p>
                <p className="text-sm font-semibold text-white mb-1">
                  {item.label}
                </p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="bg-[#245FFF]/[0.08] border border-[#245FFF]/20 rounded-xl px-6 py-5 text-center">
            <p className="text-base text-gray-300 leading-relaxed">
              The worst part?{" "}
              <strong className="text-white">
                They already have your phone number, your address, and your name.
              </strong>{" "}
              It&apos;s sitting in databases that anyone can buy for a few
              dollars. That&apos;s why scam.ai doesn&apos;t just block scammers —
              we fight them on every front.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Full Protection — 3 pillars */}
      <section className="border-t border-white/10">
        <div className="max-w-5xl mx-auto px-5 sm:px-10 py-14 sm:py-24">
          <AnimatedSection className="text-center mb-14">
            <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-gray-400 mb-4">
              Complete Protection
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              More Than Just an App
            </h2>
            <p className="text-gray-300 text-base max-w-lg mx-auto leading-relaxed">
              scam.ai surrounds you with a full shield — so scammers can&apos;t
              find you, can&apos;t reach you, and can&apos;t fool you.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-7 hover:border-[#245FFF]/30 transition-colors h-full">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative border-t border-white/10 px-5 sm:px-10 py-14 sm:py-24 text-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <div className="h-[400px] w-[500px] rounded-full bg-[#245FFF]/10 blur-[120px]" />
        </div>
        <AnimatedSection className="relative z-10 max-w-md mx-auto">
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-gray-400 mb-4">
            Join the waitlist
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Never Worry About Scams Again.
          </h2>
          <p className="text-gray-300 text-base mb-7 leading-relaxed">
            One subscription covers everything — blocking, insurance, education,
            and support. Join now and lock in your first 3 months free.
          </p>

          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-semibold text-[#93c5fd] border border-[#245FFF]/25 bg-[#245FFF]/10 px-3 py-1 rounded-full whitespace-nowrap">
              🎁 First 3 months free*
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-[0_0_60px_rgba(36,95,255,0.08)]">
            <WaitlistForm />
          </div>
          <p className="mt-3 text-xs text-gray-500">
            * Free trial applies to first 3 months of paid subscription after
            launch.
          </p>
        </AnimatedSection>
      </section>

      {/* Disclaimers */}
      <section className="border-t border-white/10 py-12 px-5 sm:px-10">
        <div className="max-w-3xl mx-auto space-y-4 text-xs text-gray-500 leading-relaxed">
          <p>
            <span className="text-gray-400">¹ Insurance coverage.</span>{" "}
            scam.ai is not a licensed insurance provider. Loss reimbursement
            under the Scam Protection Guarantee is facilitated through a
            partnership with a licensed insurance carrier. Coverage is subject to
            the terms, conditions, exclusions, and limits set forth in the
            applicable insurance contract, which will be provided to members upon
            enrollment.
          </p>
          <p>
            <span className="text-gray-400">² Statistics.</span> Figures cited
            are based on publicly available data from the FTC, FBI IC3, and AARP
            Fraud Watch Network. Actual results may vary.
          </p>
          <p>
            <span className="text-gray-400">³ Waitlist.</span> Joining the
            waitlist does not constitute enrollment in any insurance plan or
            guarantee access to the scam.ai application. By submitting your
            email, you agree to receive product updates from scam.ai. You may
            unsubscribe at any time.
          </p>
          <p>
            <span className="text-gray-400">⁴ Early adopter offer.</span> The
            &quot;first 3 months free&quot; offer applies exclusively to waitlist
            members and to the first 3 months of a paid subscription following
            general product launch. scam.ai reserves the right to modify this
            offer at any time before launch.
          </p>
          <p>
            <span className="text-gray-400">⁵ App functionality.</span>{" "}
            scam.ai operates as an on-device screening tool and does not
            guarantee detection of all fraudulent activity. Performance may vary
            by device and operating system.
          </p>
        </div>
      </section>
    </main>
  );
}
