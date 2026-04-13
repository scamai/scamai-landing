# Deepfake Threat in Numbers: The 2025-2026 Prevalence Report

**Edition:** 16 | **Date:** April 2026 | **Focus:** Consumer Deepfake Prevalence & Statistics

---

## The Deepfake Threat in Numbers: What 2025-2026 Data Actually Shows

**1 in 4 adults** has been targeted by an AI deepfake scam. That's not a prediction — that's McAfee's Q4 2024 data, and the problem has only accelerated since.

Deepfakes have crossed from niche cybersecurity concern to mass-market criminal weapon. Here's what the data actually shows — with sources — so you know exactly what you're up against.

---

## Executive Summary

The numbers are unambiguous:

- **1 in 4 adults** (25%) has been targeted by an AI deepfake scam ([McAfee, Q4 2024](https://www.mcafee.com))
- **$16.6 billion** in cyber crime losses reported to FBI IC3 in 2024 — up 33% from $12.5B in 2023 ([IC3 Annual Report 2024](https://www.ic3.gov))
- **2.2%** of adults globally report being victims of deepfake pornography — that's approximately **~176 million people** worldwide ([arXiv:2402.01721](https://arxiv.org/abs/2402.01721), 16,000+ respondents, 10 countries)
- **5.86%** of election-related images in the 2025 Canadian federal election were deepfakes ([arXiv:2512.13915](https://arxiv.org/abs/2512.13915))
- **1.8%** of survey respondents reported creating deepfake content without consent ([arXiv:2402.01721](https://arxiv.org/abs/2402.01721))
- **59.6%** — that's how much audio deepfake detection accuracy drops on real-world replayed audio vs. clean test conditions ([arXiv:2510.19414](https://arxiv.org/abs/2510.19414))

This report compiles the latest authoritative data on deepfake prevalence, organized by threat category, with source links so you can verify everything.

---

## The Scale of the Problem

### Cyber Crime Losses: $16.6 Billion in 2024

The FBI IC3 received **880,418 complaints** in 2024 with total losses of **$16.6 billion**. AI-enabled fraud was the primary driver of the 33% year-over-year increase. For context:

- 2020: $4.2 billion
- 2021: $6.9 billion
- 2022: $10.3 billion
- 2023: $12.5 billion
- **2024: $16.6 billion**

That's a **4x increase in five years**. Deepfakes — particularly audio deepfake business email compromise (BEC) scams and synthetic identity fraud — are now the largest single driver of this growth.

### Where Deepfakes Appear

**Dating Apps and Social Media**
The most personal deepfake threat: non-consensual synthetic intimate imagery (NSII). The global survey found **2.2% of adults** report being victims of deepfake pornography — with **1.8%** also admitting to creating such content without consent.

Translation: If your dating app has 1 million users, approximately **22,000 have been victims** of deepfake intimate image abuse. Most never report it.

**Video Call Scams**
Audio deepfakes now fool voice authentication systems at alarming rates. Detection models that achieve near-perfect accuracy in lab conditions drop to **59.6% accuracy** when evaluated on real-world replayed audio (microphone capture → transmission → replay). In plain terms: the voice verification your bank uses may not catch a recording played through a phone.

McAfee documented cases of audio deepfakes used to impersonate executives during live video calls, resulting in fraudulent wire transfers. One company lost **$243,000** in a single call.

**Misinformation and Social Media**
In the 2025 Canadian federal election, **5.86%** of election-related images were deepfakes ([arXiv:2512.13915](https://arxiv.org/abs/2512.13915)). While harmful deepfakes reached only 0.12% of total views, each individual deepfake piece generated **higher engagement** than authentic content — the algorithm amplified the fakes.

AI-generated misinformation was also found to be "significantly more likely to go viral" despite originating from smaller accounts ([arXiv:2505.10266](https://arxiv.org/abs/2505.10266)).

---

## The Detection Gap

### Why Detection Tools Fail

The **59.6% accuracy drop** on replayed audio isn't a bug — it's a fundamental limitation. Here's why:

1. **Lab conditions vs. real world**: Detection models train on clean, high-quality samples. Real-world audio passes through microphone capture, lossy compression, phone transmission, and speaker playback — each step degrades the signal the detector looks for.

2. **Closed-set vs. open-set**: Most detection models are trained to identify a fixed set of known AI generators. When a new generator releases, accuracy crashes until the model is retrained.

3. **Adversarial adaptation**: As detection improves, generation methods adapt. The same research showing 1.7% equal error rate (EER) on standard benchmarks showed dramatically worse performance against commercially available voice cloning tools used by scammers.

### What Actually Works

Multi-modal verification — checking audio, video, and metadata simultaneously — significantly outperforms any single method. The 2025 Canadian election study noted that **most deepfakes that evaded detection shared a common feature: they had been compressed and re-uploaded** before distribution, which degrades forensic traces.

Practical implication: a deepfake that survives one platform's compression cycle (Instagram re-upload, for example) will be harder for downstream detectors to catch.

---

## The 2025-2026 Landscape

### What's New This Year

**Detection models are improving but attackers are keeping pace.** Equal error rates on audio deepfake detection have reached **1.7%** in optimal lab conditions — but the gap between lab and field remains massive. The 59.6% accuracy drop on replayed audio is the industry dirty secret nobody wants to publish in big bold numbers.

**Synthetic identity fraud is accelerating.** FBI IC3 2024 data shows AI-enabled synthetic identity fraud as the fastest-growing segment of identity theft. The combination of deepfake video for onboarding and AI-generated documents for verification is overwhelming legacy KYC systems.

**Consumer targeting is personal.** McAfee's "Global Taxonomy of Deepfake Scams" found that personal relationship scams — impersonating family members, romantic partners, or colleagues — generated the highest conversion rates. Audio deepfakes of family members in distress ("Mom, I'm in trouble, wire me money") are now a documented attack pattern.

### Who Is Most at Risk

The McAfee data shows **1 in 4 adults** targeted, but risk is not evenly distributed:

- **Adults 35-54**: Highest rates of financial deepfake targeting (BEC, investment scams)
- **Young adults 18-34**: Highest rates of intimate image deepfake victimization
- **Elderly**: Highest per-incident dollar losses when targeted
- **Small business owners**: Disproportionately targeted by executive impersonation scams

---

## What You Can Do

### For Consumers

1. **Verify before you trust.** If someone claims to be a family member, friend, or colleague in distress over a call or video — hang up and call them directly on a number you know is real.

2. **Watch for the uncanny.** Deepfakes still show artifacts: unnatural blinking, inconsistent lighting, slightly waxy skin, audio that doesn't match lip movements. But these are disappearing fast.

3. **Report.** FBI IC3 (ic3.gov), FTC (reportfraud.ftc.gov), and the platform where the deepfake appeared. The 2.2% victimization rate almost certainly undercounts because most victims don't know reporting is possible.

4. **Use a deepfake detector.** Reality AI (ScamAI's enterprise sibling) provides free and paid detection tools for images, video, and audio. Bookmark [scam.ai/freetrial](https://scam.ai) if you deal with sensitive content.

### For Platforms and Organizations

1. **Deploy multi-modal verification.** No single detection method is sufficient. Layer audio, video, and metadata analysis.

2. **Compress once, not multiple times.** If you must analyze user content, analyze the original before any platform re-encoding — forensic traces degrade with each compression cycle.

3. **Monitor for re-uploaded content.** The Canadian election study found deepfakes that evaded initial detection were often re-compressed versions of fakes that had already passed through one platform.

---

## The Bottom Line

**1 in 4 adults has been targeted. $16.6 billion was lost to cyber crime. 2.2% of adults globally have been victims of deepfake pornography.**

These aren't projections or forecasts. They're the current state of the threat landscape. The 59.6% detection accuracy gap tells you that the tools you're relying on — your bank's voice verification, your video call authentication, your content moderation — may not be catching what you think they are.

The threat is personal, financial, and accelerating.

---

## Sources

| Source | Key Statistic | Link |
|--------|--------------|------|
| FBI IC3 Annual Report 2024 | $16.6B losses, 880K complaints | [ic3.gov](https://www.ic3.gov) |
| McAfee Q4 2024 | 1 in 4 adults targeted by deepfake scam | [mcafee.com](https://www.mcafee.com) |
| arXiv:2402.01721 (NSII Survey) | 2.2% victimization, 1.8% perpetration, 16K respondents | [arXiv](https://arxiv.org/abs/2402.01721) |
| arXiv:2512.13915 (Canadian Election) | 5.86% deepfakes in election images | [arXiv](https://arxiv.org/abs/2512.13915) |
| arXiv:2505.10266 (X Misinformation) | AI misinformation more viral | [arXiv](https://arxiv.org/abs/2505.10266) |
| arXiv:2510.19414 (Audio Detection) | 59.6% accuracy drop on replayed audio | [arXiv](https://arxiv.org/abs/2510.19414) |
| arXiv:2506.09606 (Audio EER) | 1.7% equal error rate (optimal conditions) | [arXiv](https://arxiv.org/abs/2506.09606) |

---

*Deepfake Weekly · scam.ai · April 2026 · [Subscribe](https://scam.ai/newsletter) · [Report a deepfake](https://ic3.gov)*
