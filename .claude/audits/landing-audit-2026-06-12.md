# Landing Page 完整审计 — 2026-06-12

范围：首页 `/[locale]/(site)` + 站点公共框架（NewNav / NewFooter / StickyCtaBar 等）+ 公开 API 面 + 线上 https://www.scam.ai。
方法：6 个并行专项 agent（代码质量 / 安全 / 技术 SEO / 性能 / 可访问性 WCAG 2.1 AA / 文案与转化 CRO）。

---

## P0 — 立即修复

### 1. SEO 主机错位：所有 SEO 信号指向 non-www，全部吃 307 重定向（SEO agent，CRO 交叉确认）
- `src/app/layout.tsx:45` — `metadataBase: new URL("https://scam.ai")` → canonical、hreflang、og:url 全部输出 non-www
- `src/app/sitemap.ts:9` — `baseUrl = 'https://scam.ai'`；抽查的所有 sitemap URL 均 307 → www
- `public/robots.txt:45` — `Sitemap: https://scam.ai/sitemap.xml` 同样指错
- `https://scam.ai → www` 是 **307（临时）** 而非 301/308 → 链接权重不传递
- canonical 在 `/en` 页上是 `https://scam.ai`（无 locale 路径），hreflang `en` 同样指向裸域根
- 修复：metadataBase 改 www；sitemap baseUrl 改 www；robots.txt 改 www；Vercel 域名重定向改永久；默认 locale canonical 用 `/en`；`alternates.languages` 加 `x-default: /en`（`src/app/[locale]/layout.tsx:51-56`）

### 2. i18n 是空壳 + middleware 读错 header（代码 agent C1，CRO agent #1 交叉确认）
- `middleware.ts:48` 读 `x-locale`，但 next-intl v4 实际设置 `X-NEXT-INTL-LOCALE` → cookie 永远写 `en`，**所有 locale 的 `<html lang>` 都是 "en"、dir 都是 "ltr"**（阿拉伯语布局直接坏）
- `src/app/layout.tsx:122-129` 从 cookie 而非 URL 派生 lang
- 11 个 locale 全部输出同一份硬编码英文（~240+ 硬编码字符串：NewNav ~45、Pricing ~40、NewLanding ~35…）；`src/messages/*.json` 994 条翻译对应的是旧版首页，已成孤儿
- 净效果：10 个重复内容英文页通过 hreflang 广播给 Google
- 修复（二选一）：把 next-intl 接进 new-site 组件；或砍掉未翻译 locale 的生成与 hreflang。lang 必须从 route param 派生

### 3. 安全：未认证花钱端点 + HTML 注入 + 限流可绕过（安全 agent）
- **C-01 HIGH** HTML 注入进内部通知邮件：`src/app/api/waitlist/route.ts:99-102`、`newsletter-subscribe/route.ts:114-115` — utm_*/referrer/source 未做 HTML 实体转义直接插模板。修复：htmlEscape 所有插值
- **C-02 HIGH** 无限流的花钱端点：`/api/waitlist`（每次触发 2 封 Resend）、`/api/faceswap-token`、`/api/turn-credentials`、`/api/playground/collect`（无 size cap、session_id 未消毒直接进 blob 路径）
- **C-03 HIGH** 所有限流读 `x-forwarded-for` **第一项**（攻击者可控）：`newsletter-subscribe:28`、`demo:36`、`dataset-access:139`、`faceswap-token:68`。修复：用 `x-real-ip` 或 XFF 最后一项 / `@vercel/functions` 的 `ipAddress()`
- **C-04 MED** 内存 Map 限流在 serverless 冷启动归零 → 换 Upstash/KV 或 Vercel WAF
- **C-05 MED** `/api/share/[session_id]` 无认证给任意 session_id 预签名私有 blob（人脸生物数据）；session_id 是 `Math.random()`（FaceswapPlayground.tsx:137）。修复：crypto.randomUUID + share token 或会话校验
- **C-06 MED** CSP `unsafe-inline`+`unsafe-eval` → XSS 防护近乎为零（next.config.ts:41）；img-src 放行全部 https:
- **C-07 MED** HSTS 缺 `includeSubDomains; preload`
- C-08 LOW dataset-access token 也是内存 Map（跨实例 GET 会 403）+ GDrive 直链不过期；C-09 LOW email 地址正则放行 `<>` 后未转义进邮件

### 4. 性能：LCP 被水合卡死 + 342KB 首载 JS（性能 agent）
- **hero `<h1>` SSR 输出 `opacity:0`**（NewLanding.tsx:98-104 AnimatedSection），要等 342KB gz JS 水合后才可见 → LCP 主要杀手。修复：CSS keyframes 或 `initial={false}`
- posthog-js **61KB gz 同意前静态打包**（`src/lib/analytics.ts:15`）→ 改 `await import()`，零 UX 代价
- 全量 i18n catalog（含首页根本不用的 namespace）嵌进每页 flight payload，**~90KB / 占 HTML 的 45%**（`[locale]/layout.tsx:90-106`）→ next-intl v4 `pick()` 按需
- 整个首页一棵 "use client" 树（NewLanding.tsx:1）；TrustedBy 的 "use client" 可直接删
- Sentry tracing build 在 shared chunk（~20-30KB 可省，`__SENTRY_TRACING__: false`）
- bento barrel import 拉进全部 ~60 个 bento 的 CSS（156KB raw）；`<Suspense>` 包静态 import 无效 → 直接 import 或 next/dynamic
- session1.svg 392K（内嵌位图+27 个 gaussian blur）做 CSS 背景 → 转 WebP
- GTM 未过同意门且 afterInteractive；soc2-badge.png 84K 渲染 128px 不走 next/image
- 实测：TTFB 0.234s（服务端没问题，问题全在 payload）；预计四项结构修复可砍 ~40% 首载 JS、~45% HTML

### 5. 转化：三个互相竞争的主 CTA + 零客户证言 + 合规文案自相矛盾（CRO agent）
- Hero 主按钮 "Visit Halo"→/halo（副产品），nav "Book a demo"→cal.com，正文/定价 "Start detecting"→app.scam.ai，StickyCtaBar 又是 Halo — 最高注意力位卖的不是转化路径
- **数据保留声明矛盾**：NewLanding.tsx:610 "No customer data retained… deleted immediately" vs FAQSection.tsx:72 "We only retain data as necessary…" — 对 KYC 买家是最危险的文案 bug
- 零客户证言/案例/署名指标；TrustedBy 把客户/投资人/加速器/Product Hunt 混在一行
- FAQ 3 处链接指错：`scam.ai/platform` 被标成 "contact sales"/"docs"（FAQSection.tsx:56,60,68），实际 307 到 /en/products
- nav 没有免费层钩子（"200 free images/mo" 藏在 5 屏之下）

---

## P1 — 高优先级

| # | 发现 | 位置 | 来源 |
|---|------|------|------|
| 1 | Pricing addon 开关双触发，点击立即回弹 | PricingSection.tsx:196-204（外层 div onClick + 内层 ToggleSwitch onChange 各 fire 一次） | 代码 |
| 2 | NewLanding ~200-270 行死代码：上传/水印/分享子系统从未接进 JSX，含 Math.random 假检测结果 + watermarkjs 留在 bundle | NewLanding.tsx:110-330 | 代码+性能+CRO 三方确认 |
| 3 | 语言切换器：state 机器存在但从未渲染；languages 数组只列 7/11 locale | NewNav.tsx:160-168 | 代码+CRO |
| 4 | CommandPalette 不是 dialog：无 role/aria-modal/focus trap/焦点归还，箭头选中对 AT 不可见 | CommandPalette.tsx:166-176 | a11y |
| 5 | Pricing switch 无 accessible name、volume slider 无 label | PricingSection.tsx:34-52, 125-151 | a11y |
| 6 | nav dropdown 无 aria-expanded/controls；关闭的移动菜单仍可 Tab 进入（无 visibility/inert） | NewNav.tsx:309-327, 622-627 | a11y |
| 7 | logo marquee 显式无视 reduced-motion 且无暂停控制（WCAG 2.2.2 Level A） | globals.css:363-379, TrustedBy.tsx:56 | a11y |
| 8 | 大面积 sub-AA 对比度：text-gray-600（2.8:1）、white/30-45 小字、gray-500（4.35:1）批量使用 | PricingSection/NewFooter/HaloSpotlight/CommandPalette 多处 | a11y |
| 9 | StructuredData SearchAction 指向不存在的 /search 路由 | StructuredData.tsx:62-68 | 代码+SEO |
| 10 | og:locale 输出裸 "en"（OG 规范要求 en_US）；页级/布局级/Twitter 三处 title 不一致 | [locale]/layout.tsx:59-61, (site)/page.tsx:6 | SEO |
| 11 | locale 组之外存在孤儿 /company /contact 页（无 canonical、绕过 middleware、可被索引） | src/app/company, src/app/contact | SEO |
| 12 | 品牌命名混乱：ScamAI 128× / scam.ai 106× / Scam.ai 5×；法律实体 Reality Inc + trust site 域名不一致 | 全站 | CRO |
| 13 | 无 skip link；CommandPalette input outline-none 无替代焦点样式；`.landing-section * {border-color:#000}` 杀掉所有边框 | layout / globals.css:385-387 | a11y |
| 14 | middleware 每请求写 Set-Cookie（即使值没变）破坏 CDN 缓存 | middleware.ts:48 | 代码 |

## P2 — 中低优先级（摘选）

- VideoObject 缺 duration、uploadDate 是占位日期；Dataset license 指向内容页而非许可证；ImageObject width/height 应为整数（StructuredData.tsx）
- og image URL hardcode `/en/opengraph-image` 与默认 locale canonical `/` 不一致（[locale]/layout.tsx:52）
- ComputexBanner `Date.now()` 在 EVENT_END 临界点可能 hydration mismatch（低概率）
- GDPR/SOC2 badge `<img>` 无 width/height → CLS（NewLanding.tsx:592-601）
- AnimatedSection sessionStorage 二次渲染闪烁 → useState 懒初始化（NewLanding.tsx:86-108）
- DeveloperSection "Try it" 按钮无任何行为（DeveloperSection.tsx:222）
- "SOC 2 Type II certified" → 应为 attested/audited；"industry-leading accuracy" 无数据支撑（正文是 95.3%）
- hero CTA 文案不通 "See how easy deepfake is"；摄像头授权页无隐私说明一行字
- nav dropdown 子链接不在 SSR HTML 中 → 首页给 solutions/products 子页零可爬内部链接
- 法律页 ×11 locale 全进 sitemap（薄重复内容）；llms.txt 在 robots 注释中提及但文件不存在；IndexNow 未接
- FAQ accordion 缺 aria-controls；dropdown 内用 h3 破坏标题层级；scroll-behavior:smooth 未包 reduced-motion
- 三个 100K favicon.ico；dashboard.mp4 2.3MB（非默认 tab，加 preload="metadata"）

## 做得好的（各 agent 一致确认）

- 链接完整性：17 个内部链接全部直接 200，无死链
- robots.txt 正确屏蔽 admin/api；管理后台未从公开页泄露；无 NEXT_PUBLIC_ 秘密泄露；.env 未入库
- X-Frame-Options / X-Content-Type-Options / Referrer-Policy / Permissions-Policy 齐全
- 单一 h1、标题层级无跳级、38 张图全有 alt、landmark 结构完整
- IntersectionObserver 清理全部正确；next/font + display:swap；playground 的 error boundary + dynamic import 质量高
- TTFB 0.234s；8 块 JSON-LD 全部可解析；dataset-access 的一次性 token 用了 crypto.randomBytes（强）
- ComputexBanner 正确自动过期；StickyCtaBar 可访问性做得好（useReducedMotion、role=region、自动避让）

## Agent 会话 ID（可 SendMessage 追问）

- 代码质量: a7b64cf2bcc8a140e
- 安全: abf88082d56812efe
- SEO: ae3c7cff9b956f49e
- 性能: a4b4c66b1fb20bbc1
- 可访问性: a73379e6e3165da13
- CRO/文案: acaf9c2673b6cfa36
