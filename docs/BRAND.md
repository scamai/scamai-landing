# Brand Naming Standard

One spelling, locked. Do not mix variants in the same surface — that reads as the least
professional option. When in doubt, use the **Prose** form.

| Context | Use | Never |
| --- | --- | --- |
| Legal entity | **Reality Inc.** | Reality, Reality Incorporated |
| Product name in copy / prose / headings / meta titles | **Scam AI** (with a space) | ScamAI, Scam.ai, Scam.AI, scamai |
| Logo / wordmark (the visual mark only) | **scam.ai** (lowercase) | SCAM.AI, ScamAI |
| Primary domain | **scam.ai** | — |
| Subdomains | app.scam.ai, docu.scam.ai, api.scam.ai | — |
| Email | security@scam.ai, etc. | — |
| Social handle | **@scamai** (handles are lowercase by platform convention) | @ScamAI |

## Rationale
- **Scam AI** (two words) is more legible than the run-together `ScamAI` and looks less
  like a scrappy startup than the domain-styled `Scam.ai`.
- `Scam.AI` (mixed domain + capitalized suffix) is the least professional — never use it.
- The product is one offering of **Reality Inc.**; the trust center lives at
  `reality-inc.trust.site`.

## Notes for implementation
- Inside translated UI strings, keep **Scam AI** untranslated (it is a brand name).
- Do **not** rewrite the domain `scam.ai` or any URL/email to `Scam AI` — those stay literal.
- The homepage (`src/components/new-site/*`, `src/components/seo/StructuredData.tsx`,
  `src/app/[locale]/layout.tsx`, `src/app/layout.tsx`) was standardized to **Scam AI** on
  2026-06-12. Other surfaces still contain legacy `ScamAI` and should be migrated:
  `src/lib/solutions/industries.ts`, `src/lib/compare/competitors.ts`, and the non-`landing`
  namespaces in `src/messages/*.json` (e.g. `industries`, `HomePage`, `seoMeta`).
