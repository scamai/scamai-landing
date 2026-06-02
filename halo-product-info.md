# Halo — Product Brief for scam.ai Website

> This document is a reference for building the Halo product page on scam.ai.
> It contains factual product information, positioning, technical details, and
> copy guidance. Use it as the source of truth; adapt tone and layout to fit
> the site's design system.

---

## One-Liner

Halo watches your video calls and tells you if someone on the call is a deepfake.

## Tagline Options

- Real-time deepfake detection for video calls. On your device. Nothing leaves your laptop.
- Know who's real on every call.
- AI faceswap detection that runs silently in the background — no cloud, no latency, no trust required.

---

## What Halo Is

Halo is a Windows desktop application that monitors live video meetings for AI-generated faceswaps and deepfakes. It runs entirely on the user's device — no video frames, screenshots, or biometric data ever leave the machine.

When a user joins a Zoom, Teams, Google Meet, or other supported video call, Halo automatically begins analyzing the faces visible in the meeting window. Each participant receives a real-time verdict: **Safe**, **Suspicious**, or **Deepfake**. If a deepfake is detected, the user gets an immediate alert.

Halo is built for people who take calls where identity matters — executives, finance teams, legal, HR, anyone who could be targeted by a video impersonation attack.

## The Problem Halo Solves

Real-time AI faceswap technology has reached the point where someone can join a video call looking like your CEO, your colleague, or your client — and you cannot tell by looking. These attacks are being used for:

- **CEO fraud / business email compromise via video** — an attacker joins a call impersonating a company executive and authorizes wire transfers, shares credentials, or directs employees to take actions
- **Recruitment fraud** — fake candidates use faceswaps during interviews to impersonate someone with legitimate credentials
- **Social engineering** — impersonating a known contact on a video call to extract sensitive information
- **Due diligence fraud** — impersonating principals during investment meetings or legal proceedings

The common thread: the victim sees a familiar face and trusts it. Halo breaks that assumption by checking every face on every call, continuously, in real time.

## How It Works (User Experience)

1. **Install Halo** on a Windows PC (supports both Snapdragon ARM64 and x86/x64)
2. **Halo sits in the system tray**, silent and invisible until needed
3. **Join any video call** — Zoom, Teams, Meet, WebEx, or others
4. **Halo automatically detects the meeting** and starts monitoring. No manual action required.
5. **Every face on the call is analyzed in real time.** Each person gets a colored verdict:
   - **Green (Safe)** — this face appears genuine
   - **Amber (Suspicious)** — anomalies detected, worth attention
   - **Red (Deepfake)** — this face is likely AI-generated or swapped
6. **If a deepfake is detected**, a desktop notification fires immediately
7. **After the call**, a session summary shows what happened — which participants were flagged, when alerts fired, overall meeting safety status
8. **Meeting history** is stored locally so users can review past calls

The user does nothing except install it. Halo handles meeting detection, frame capture, face detection, AI inference, verdict display, and alerting — all automatically.

## How It Works (Technical)

### Architecture

Halo is a native Windows desktop application (WPF, .NET 9) with a Python ML inference backend running as a subprocess. The two communicate over a binary IPC protocol (stdin/stdout).

```
User's video call
       |
       v
  Meeting detection (process scanning, window title matching)
       |
       v
  Screen capture (Windows Graphics Capture for Teams, PrintWindow for others)
       |
       v
  Face detection (RetinaFace ONNX model, ~2.8ms per frame on NPU)
       |
       v
  Per-face deepfake analysis (two AI models in ensemble)
       |
       v
  Score calibration + temporal smoothing
       |
       v
  Verdict (Safe / Suspicious / Deepfake) displayed per participant
```

### Detection Models

Halo uses an ensemble of two complementary AI models for faceswap detection, plus a face detector:

| Model | Architecture | Input | Role | NPU Latency |
|---|---|---|---|---|
| **RetinaFace** | RetinaFace FP16 | 380x380 | Face detection — finds every face in the frame | ~2.8 ms |
| **MFF-MoE** | 7-expert Mixture of Experts (ConvNeXtV2 + EfficientNet ensemble) | 512x512 face crop | Primary deepfake detector — high accuracy, robust to variation | ~228 ms |
| **SelfBlended** | EfficientNet-B4 | 380x380 face crop | Secondary detector — fast, catches different signal types | ~4.1 ms |

The ensemble approach means both models must agree before a verdict is issued. This dramatically reduces false positives compared to a single-model approach.

**Full pipeline latency: ~235ms per frame** (on Snapdragon NPU). This means Halo analyzes every face on the call roughly 4 times per second.

### On-Device AI Acceleration

Halo is optimized for Qualcomm Snapdragon X-series processors with a dedicated NPU (Neural Processing Unit). On Snapdragon hardware:

- AI inference runs on the NPU via Qualcomm's QNN (Qualcomm Neural Network) runtime
- **3.5x faster than CPU inference** — 235ms vs 800ms+ per frame
- The CPU remains free for the video call itself — no performance impact on the meeting
- Warm start in ~1 second (pre-compiled neural network context cached on disk)

On non-Snapdragon Windows PCs, Halo falls back to CPU inference. Slower (~800ms per frame) but fully functional.

### Supported Meeting Applications

**Native desktop apps:**
- Zoom
- Microsoft Teams (classic and new/2023+)
- Cisco WebEx
- Skype
- Slack (huddles)
- GoTo Meeting
- Tencent Meeting
- DingTalk
- Lark / Feishu

**Browser-based meetings** (Chrome, Edge, Firefox, Brave, Opera):
- Google Meet
- Zoom Web Client
- Teams Web
- WebEx Web
- Tencent Meeting Web

Halo detects meetings by scanning running processes and window titles — it works with any meeting app without requiring plugins, browser extensions, or API integrations.

### Privacy Architecture

This is a core differentiator and should be prominent on the page:

- **100% on-device processing.** No video frames, face images, or biometric data ever leave the user's machine. Not to ScamAI's servers, not to any cloud, not anywhere.
- **No cloud dependency for detection.** Halo works fully offline once installed. No internet connection required during meetings.
- **No recording.** Halo analyzes live frames in memory and discards them. It does not record, store, or transmit meeting video.
- **Local-only data.** Detection history, session summaries, and settings are stored in a local SQLite database on the user's machine.
- **No account required** for core functionality. Google sign-in is available for identity (future features) but is not required to use Halo.
- **Telemetry is off by default.** Anonymous, opt-in only. If enabled, only crash reports and anonymous usage events are sent (via Sentry). No meeting content, no face data, no PII.

### Model Security

Halo's AI models are protected against extraction and tampering:

- Models are encrypted at rest (AES-256-GCM) and decrypted only in process memory during runtime
- Calibration thresholds (the values that determine Safe/Suspicious/Deepfake boundaries) are sealed in encrypted bytecode
- .NET assemblies are obfuscated in release builds
- A dedicated backend service handles decryption key issuance, gated behind Google OIDC authentication

---

## Design Philosophy

Halo's design follows the principle of **calm authority**: it's a security tool that doesn't perform security theater.

- **Quiet when nothing's happening.** The UI is an empty canvas at rest. No animated dashboards, no fake-busy indicators, no anxiety-inducing decorations.
- **Color only when something matters.** Green means safe. Red means deepfake. Amber means pay attention. Grey means unknown. That's the entire color language.
- **No jargon.** Users see "Safe" and "Deepfake", not "score: 0.87" or "MFF-MoE ensemble confidence". The app speaks in plain language.
- **Ambient, not demanding.** Halo sits in the system tray. It doesn't interrupt unless there's a real finding. Most users will see green every day and nothing else — that's success.

### Visual Identity

- **Palette:** Warm stone neutrals (Tailwind stone palette). Not clinical white, not anxious dark. Calm and warm.
- **Brand mark:** A shield-with-check glyph in indigo-to-violet gradient — the one spot of color in the chrome. Halo wears its brand color exactly once.
- **Typography:** System fonts (Segoe UI Variable on Windows). Zero font downloads, native rendering.
- **Verdict colors (sacred):**
  - Green = Safe
  - Amber = Suspicious
  - Red = Deepfake confirmed (never used for decoration or general "danger")
  - Grey = Unknown / inactive

---

## Key Product Facts (for copy accuracy)

Use these when writing specific claims on the page:

| Claim | Verified Number | Source |
|---|---|---|
| NPU inference speedup | 3.5x faster than CPU | Benchmarked on Snapdragon X2 SC8480XP |
| Full pipeline latency (NPU) | ~235ms per frame | MFF-MoE (228ms) + SelfBlended (4.1ms) + RetinaFace (2.8ms) |
| Full pipeline latency (CPU) | ~800ms per frame | CPU-only fallback mode |
| Face detection speed (NPU) | ~2.8ms | RetinaFace FP16 on QNN |
| Ensemble AUC (standard eval) | 0.9665 (FP16 ONNX) | 397-sample benchmark |
| Ensemble AUC (PyTorch reference) | 0.9873 | FP32 GPU baseline |
| QDC test set accuracy | 10/10, AUC 1.0 | Qualcomm Development Cloud test frames |
| Warm start time | ~1 second | Pre-compiled NPU context, vs 77s cold compile |
| Supported meeting apps | 10+ native + browser-based | See full list above |
| Data that leaves the device | None | Zero network calls during detection |
| Models in the ensemble | 2 detectors + 1 face finder | MFF-MoE, SelfBlended, RetinaFace |
| Total model experts | 7 (in MFF-MoE alone) | ConvNeXtV2-Tiny x2, EfficientNet-B4 x2, B5 x2, B6 x1 |

### Claims to Avoid

These are either not yet shipped, not yet validated at scale, or could be misleading:

- Do not claim "100% accuracy" — no deepfake detector is perfect. AUC 0.97 is strong but not infallible.
- Do not claim "works on Mac/Linux" — Windows only.
- Do not claim "detects all types of AI manipulation" — Halo detects faceswaps and AI-generated face replacements. It does not detect voice cloning, lip sync manipulation without face replacement, or non-face AI generation (yet).
- Do not claim "enterprise-ready" unless you're specific about what that means — there is no centralized admin console, no fleet deployment, no MDM integration in MVP.
- Do not reference Pro tier, subscription pricing, or upgrade flows — these do not exist in MVP.
- Do not say "real-time" without qualification — the detection loop runs at ~4 fps on NPU, which is continuous monitoring but not frame-by-frame video analysis at 30fps.

---

## Target Audiences

### Primary: Security-Conscious Professionals

- Executives who take external video calls (board meetings, investor calls, partner meetings)
- Finance teams who receive instructions via video (wire transfer approvals, deal confirmations)
- HR / recruiting teams conducting video interviews
- Legal professionals in depositions, client meetings, or deal closings
- IT / security teams evaluating tools for their organization

### Secondary: Tech-Forward Individuals

- Professionals in crypto/web3 who are frequently targeted
- Public figures or high-net-worth individuals
- Anyone who has seen deepfake scam stories and wants protection

### Messaging by Audience

**For executives / finance:**
"You verify wire instructions by email. You verify contracts with signatures. Why don't you verify the face on the other end of the call?"

**For security teams:**
"Halo deploys on Windows endpoints. All detection is local — no video leaves the network. No cloud dependency. Snapdragon NPU acceleration for production-grade latency."

**For individuals:**
"You can't tell a deepfake from a real face. Halo can. It watches your calls and tells you plainly when something is wrong."

---

## Competitive Positioning

### What Makes Halo Different

1. **Fully on-device.** Most competitors send frames to a cloud API. Halo's entire inference pipeline runs locally. This matters for privacy, latency, and compliance.

2. **Multi-model ensemble.** Two complementary neural networks (7-expert MoE + EfficientNet classifier) that must agree. Single-model detectors have higher false positive rates.

3. **Snapdragon NPU acceleration.** Purpose-built for the new generation of ARM64 Windows PCs. 3.5x faster inference than CPU, with zero impact on meeting performance because the NPU is a dedicated chip.

4. **Works across all major meeting apps.** No plugins, no browser extensions, no API keys. Halo monitors at the OS level — any meeting app with a visible window works.

5. **Calm, ambient UX.** Not a security dashboard. Not an enterprise admin panel. A quiet tool that sits in the tray and speaks up only when it matters.

---

## Platform & Requirements

| Requirement | Detail |
|---|---|
| **OS** | Windows 10/11 |
| **Architecture** | ARM64 (Snapdragon, primary) or x86/x64 (fallback) |
| **NPU acceleration** | Qualcomm Snapdragon X Elite / X2 Elite (optional, CPU fallback available) |
| **RAM** | 4 GB minimum (model loading) |
| **Disk** | ~1 GB for models + application |
| **Internet** | Not required for detection. Required only for initial sign-in (if used) and auto-updates. |
| **Meeting apps** | Works with any meeting app that has a visible window — no plugins required |

---

## Installation & Updates

- **Installer:** Standard Windows installer (Inno Setup .exe). No admin rights required for per-user install.
- **Auto-updates:** Delta updates via Velopack. The app checks for updates on launch and applies them silently on next restart.
- **First launch:** Models are bundled in the installer. No additional downloads required. NPU context compilation happens once on first inference (~1 minute for the large model), then cached for instant startup.

---

## Company Context

- **Company:** ScamAI (scam.ai)
- **Product name:** Halo
- **Internal codename:** DeepfakeGuard (used in code namespaces and file paths; never user-facing)
- **GitHub:** github.com/scamai/snap_dragon_packaging (private)
- **Current version:** v2.3.22

---

## Copy Tone Guidance

- **Direct, not breathless.** "Halo detects deepfakes on your video calls" — not "Revolutionary AI-powered next-generation deepfake defense platform."
- **Factual, not vague.** "235ms per frame on Snapdragon NPU" — not "blazing fast AI inference."
- **Honest about scope.** "Detects AI faceswaps in video calls" — not "protects against all AI threats."
- **Confident, not anxious.** The product works. State what it does plainly. Don't oversell the threat to justify the product.
- **No jargon in user-facing copy.** Say "the chip's AI accelerator" not "QNN Execution Provider on Hexagon HTP." Technical details belong in a dedicated section for security teams, not the hero.
- **No marketing vocabulary.** Avoid: "revolutionary", "cutting-edge", "state-of-the-art", "next-gen", "powered by", "leveraging", "seamless". Say what it does.

---

## Suggested Page Structure

This is a suggestion — adapt to the site's existing layout patterns:

1. **Hero** — One-liner + visual (app screenshot or illustration). "Know who's real on every call."
2. **The Problem** — 2-3 sentences on why this matters. Brief, not fear-mongering.
3. **How It Works** — 3-step visual: Install → Join a call → See who's real. Keep it simple.
4. **Privacy** — Prominent section. "Nothing leaves your device." This is the differentiator.
5. **Supported Apps** — Logo grid of Zoom, Teams, Meet, WebEx, etc.
6. **Technical Details** (expandable or separate section) — For security teams: architecture, model details, performance numbers, platform requirements.
7. **CTA** — Waitlist, download, or whatever the current acquisition path is.

---

## Assets Needed (not included in this document)

The website build will need:

- [ ] App screenshots (dashboard in monitoring state, tray icon, session summary, settings)
- [ ] Halo logo / brand mark (shield-with-check, indigo gradient)
- [ ] Meeting app logos (Zoom, Teams, Meet, WebEx, Slack, etc.) for the "Supported Apps" section
- [ ] Illustration or diagram of the on-device architecture (optional, for the technical section)
- [ ] Snapdragon / Qualcomm partnership badge (if applicable and approved)

Screenshots can be generated from the running app on a Snapdragon device or from the design prototypes at `design/v2-win-app/project/DeepfakeGuard.html` (open in browser, no build step needed).
