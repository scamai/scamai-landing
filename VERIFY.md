# VERIFY.md — scamai-landing (Computex faceswap landing work)

Coverage matrix for the `feat/computex-faceswap-playground` branch: hero rework,
trusted-by marquee, live faceswap playground, Halo spotlight, /halo route, API
proxies, mobile responsiveness, accent consistency, copy accuracy.

**Coverage:** 22 ✅, 0 ❌, 2 ⚠, 0 ⬜ untested
**Last full pass:** 2026-06-01

## Build & Types

| ID | Checkpoint | Status | Verified | Notes |
|----|-----------|--------|----------|-------|
| B1 | `tsc --noEmit` clean | ✅ | 2026-06-01 | zero type errors |
| B2 | `next build` production build succeeds | ⚠ | 2026-06-01 | Full 12-locale build exceeds 600s local timeout (not a failure). tsc clean + dev compiles all routes; Vercel CI build is the deploy gate. |

## Routes & API

| ID | Checkpoint | Status | Verified | Notes |
|----|-----------|--------|----------|-------|
| R1 | `/` → 307 → `/en` | ✅ | 2026-06-01 | |
| R2 | `/en` → 200 | ✅ | 2026-06-01 | |
| R3 | `/en/halo` → 200 | ✅ | 2026-06-01 | |
| R4 | `POST /api/faceswap-token` → 200 + token + brand_id | ✅ | 2026-06-01 | trial token, brand_id decoded |
| R5 | `GET /api/turn-credentials` → 200 + iceServers | ✅ | 2026-06-01 | relays full Cloudflare TURN set (stun+3 turn urls) |

## Homepage Sections (desktop + mobile)

| ID | Checkpoint | Status | Verified | Notes |
|----|-----------|--------|----------|-------|
| H1 | Hero: UVP, Halo/Qualcomm eyebrow, Visit Halo + Try faceswapping CTAs | ✅ | 2026-06-01 | "Verify what's real. Protect what matters." |
| H2 | Hero secondary CTA legible over glow on mobile | ✅ | 2026-06-01 | bordered ghost pill |
| H3 | TrustedBy: all logos render white (no blobs/boxes), scrolls | ✅ | 2026-06-01 | grayscale+invert; 14 logos |
| H4 | Playground fits one screen (laptop + mobile) | ✅ | 2026-06-01 | laptop 608px≤720, mobile 669px≤844 |
| H5 | HaloSpotlight: accurate copy, scanner card, scam.ai+Qualcomm logos | ✅ | 2026-06-01 | |

## Faceswap Flow (E2E — critical long-running op)

| ID | Checkpoint | Status | Verified | Notes |
|----|-----------|--------|----------|-------|
| F1 | Pick face → consent → connect → live (swapped frames arrive) | ✅ | 2026-06-01 | fake-camera E2E, 640x360 stream |
| F2 | Live stays stable (no black-out on countdown re-render) | ✅ | 2026-06-01 | frames persist +4s |
| F3 | Switch face live without reconnect | ✅ | 2026-06-01 | stays live after face switch |
| F4 | 30s countdown → ended state → Halo CTA | ✅ | 2026-06-01 | "Meet Halo" CTA appears |

## E2E Interrupts

| ID | Checkpoint | Status | Verified | Notes |
|----|-----------|--------|----------|-------|
| I-01 | Stop button mid-swap → clean teardown | ✅ | 2026-06-01 | returns to intro |
| I-02 | Replay after stop/ended re-acquires camera | ✅ | 2026-06-01 | goes live again |
| I-03 | Navigate away during swap → no zombie WS/PC, camera released | ✅ | 2026-06-01 | no uncaught errors on nav-away teardown |
| I-04 | Queue state renders (#N, people ahead, ETA) when busy | ⚠ | 2026-06-01 | backend not at capacity in test; code path present (renders on state.phase==='queued') |

## Consistency & Copy Accuracy

| ID | Checkpoint | Status | Verified | Notes |
|----|-----------|--------|----------|-------|
| C1 | No violet #6d5dfb left in playground/halo (unified brand blue) | ✅ | 2026-06-01 | 0 occurrences |
| C2 | Halo copy accurate vs snap_dragon_packaging | ✅ | 2026-06-01 | Win desktop app, X2 NPU, faces+AI-content (no voice), no macOS, no fabricated % |
| C3 | Preset faces are PD set only (no Jobs/Diana/Hepburn) | ✅ | 2026-06-01 | Einstein/JFK/Tesla/Lincoln/Curie |
| C4 | No app-window chrome (macOS dots) in playground/halo stage | ✅ | 2026-06-01 | 0 traffic-light dots |

## Security Headers & Layout

| ID | Checkpoint | Status | Verified | Notes |
|----|-----------|--------|----------|-------|
| S1 | `Permissions-Policy: camera=(self)` present | ✅ | 2026-06-01 | |
| S2 | CSP connect-src includes api.liveface.app + wss | ✅ | 2026-06-01 | |
| S3 | No horizontal overflow on mobile (390px) | ✅ | 2026-06-01 | |
| N1 | Mobile nav menu opens; Halo in Product dropdown | ✅ | 2026-06-01 | Halo · New link present |
