"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import CommandPalette from "./CommandPalette";
import ComputexBanner, { useEventBanner, BANNER_HEIGHT } from "./ComputexBanner";
import { trackCTA, trackNav, trackOutbound } from "@/lib/analytics";

type NavChild = {
  /** Stable id for resolving the translated label/description at render time. */
  key: string;
  href: string;
  external?: boolean;
  /** English fallback label — visible text resolves via t(`items.${id}.children.${key}.label`). */
  label: string;
  description?: string;
  icon?: React.ReactNode;
};

type NavItem = {
  /** Stable id — drives dropdown branching and translation lookup. */
  id: string;
  /** English fallback label — visible text resolves via t(`items.${id}.label`). */
  label: string;
  href: string;
  hasDropdown?: boolean;
  children?: NavChild[];
};

// Shared icon components for nav dropdown
const navIcons = {
  vision: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  audio: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/></svg>,
  shield: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  idCard: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8" cy="11" r="2.5"/><path d="M14 10h4"/><path d="M14 14h4"/></svg>,
  doc: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>,
  agent: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 20h10"/><path d="M12 16v4"/></svg>,
  video: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  book: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  halo: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>,
};

// label/description are English fallbacks; visible text resolves via t() at
// render time keyed by the stable `id`/`key` (translation lives in the
// `landing.nav` namespace — never mutate these strings with t() at module scope).
const navItems: NavItem[] = [
  {
    id: "product",
    label: "Product",
    href: "/products",
    hasDropdown: true,
    children: [
      {
        key: "halo",
        label: "Halo · New",
        href: "/halo",
        description: "On-device deepfake detection for live calls — with Qualcomm",
        icon: navIcons.halo,
      },
      {
        key: "aiDetection",
        label: "AI Detection",
        href: "/products/ai-detection",
        description: "Deepfake and synthetic media detection",
        icon: navIcons.vision,
      },
      {
        key: "audio",
        label: "Audio",
        href: "/products/audio-detection",
        description: "Voice cloning and synthetic audio detection",
        icon: navIcons.audio,
      },
      {
        key: "documentation",
        label: "Documentation",
        href: "https://docu.scam.ai",
        external: true,
        description: "API guides and integration examples",
        icon: navIcons.book,
      },
    ]
  },
  { id: "pricing", label: "Pricing", href: "/pricing" },
  {
    id: "solutions",
    label: "Solutions",
    href: "/solutions",
    hasDropdown: true,
    children: [
      {
        key: "fintech",
        label: "Fintech & Banking",
        href: "/solutions/fintech",
        description: "KYC deepfake protection and identity fraud prevention",
        icon: navIcons.shield,
      },
      {
        key: "kyc",
        label: "KYC Verification",
        href: "/solutions/kyc",
        description: "Stop deepfake fraud in onboarding flows",
        icon: navIcons.idCard,
      },
      {
        key: "callCenters",
        label: "Call Centers",
        href: "/solutions/call-centers",
        description: "Voice clone detection and vishing prevention",
        icon: navIcons.audio,
      },
      {
        key: "media",
        label: "Media & Publishing",
        href: "/solutions/media",
        description: "AI-generated content detection for newsrooms",
        icon: navIcons.doc,
      },
      {
        key: "dating",
        label: "Dating Apps",
        href: "/solutions/dating",
        description: "Fake profile and voice catfishing prevention",
        icon: navIcons.vision,
      },
      {
        key: "insurance",
        label: "Insurance",
        href: "/solutions/insurance",
        description: "AI claims fraud and synthetic evidence detection",
        icon: navIcons.shield,
      },
      {
        key: "hr",
        label: "HR & Hiring",
        href: "/solutions/hr",
        description: "Remote interview deepfake and voice fraud detection",
        icon: navIcons.agent,
      },
      {
        key: "government",
        label: "Government",
        href: "/solutions/government",
        description: "Synthetic media detection for public sector",
        icon: navIcons.doc,
      },
    ],
  },
  { id: "learn", label: "Learn", href: "/learn" },
  {
    id: "company",
    label: "Company",
    // Direct to /about — /company is just a redirect shim (kept for old links);
    // pointing nav there cost a 307→308 double hop on every click.
    href: "/about",
    hasDropdown: true,
    children: [
      {
        key: "about",
        label: "About Us",
        href: "/about",
        description: "Learn about our mission and team"
      },
      {
        key: "research",
        label: "Research",
        href: "/research",
        description: "Publications, benchmarks, and technical deep-dives"
      },
      {
        key: "newsletter",
        label: "Newsletter",
        href: "/newsletter",
        description: "Weekly insights on deepfake technology and AI security"
      },
      {
        key: "security",
        label: "Security & Compliance",
        href: "https://reality-inc.trust.site/",
        external: true,
        description: "Security certifications, compliance standards, and data protection policies"
      },
    ]
  },
];

// All 11 locales (matches src/i18n/config), labelled in their own language.
const languages = [
  { code: "en", name: "English" },
  { code: "zh-CN", name: "简体中文" },
  { code: "zh-TW", name: "繁體中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "ar", name: "العربية" },
];

export default function NewNav() {
  const t = useTranslations("landing.nav");
  // Resolve visible nav text from the stable id/key (set on the module-level
  // arrays). t() isn't available at module scope, so we resolve at render time.
  const itemLabel = (item: NavItem) => t(`items.${item.id}.label`);
  const childLabel = (parentId: string, child: NavChild) =>
    t(`items.${parentId}.children.${child.key}.label`);
  const childDescription = (parentId: string, child: NavChild) =>
    t(`items.${parentId}.children.${child.key}.description`);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  // Single state for desktop dropdowns — guarantees mutual exclusion.
  const [activeDropdown, setActiveDropdown] = useState<"products" | "solutions" | "company" | null>(null);
  const productsOpen = activeDropdown === "products";
  const solutionsOpen = activeDropdown === "solutions";
  const companyOpen = activeDropdown === "company";
  const setProductsOpen = (v: boolean) => setActiveDropdown(v ? "products" : null);
  const setSolutionsOpen = (v: boolean) => setActiveDropdown(v ? "solutions" : null);
  const setCompanyOpen = (v: boolean) => setActiveDropdown(v ? "company" : null);
  // Mobile accordion — separate state, desktop handler can't interfere.
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Move focus into the mobile menu when it opens, and back to the hamburger
  // when it closes — so keyboard users aren't stranded.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open) {
      const firstLink = mobileMenuRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      firstLink?.focus();
    } else if (wasOpen.current) {
      // Only steal focus back on an actual open→close transition, not on mount.
      hamburgerRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  // When the viewport grows to desktop, force the mobile menu closed.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setOpen(false);
        setMobileProductsOpen(false);
        setMobileSolutionsOpen(false);
        setMobileCompanyOpen(false);
      }
    };
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isLandingPage = pathname === "/" || pathname === "";
  const { visible: bannerVisible, dismiss: dismissBanner } = useEventBanner();
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const solutionsDropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownPanelRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (langDropdownRef.current && !langDropdownRef.current.contains(target)) {
        setLangOpen(false);
      }
      // Close the active dropdown if the click is outside both its trigger button and the panel.
      const triggerRefs = [productsDropdownRef, solutionsDropdownRef, companyDropdownRef];
      const insideAnyTrigger = triggerRefs.some((r) => r.current?.contains(target));
      const insidePanel = dropdownPanelRef.current?.contains(target);
      if (!insideAnyTrigger && !insidePanel) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
  };

  const showBanner = isLandingPage && bannerVisible;
  const announcementHeight = showBanner ? BANNER_HEIGHT : 0;

  return (
    <>
      {/* Computex 2026 event banner — replaces the "$2.6M / Berkeley SkyDeck"
          strip for the event window (Jun 2–5). To revert after the event,
          restore the strip below and drop ComputexBanner:
          <div className="fixed top-0 left-0 right-0 w-full bg-[#0021f3] py-2 text-center z-50" style={{ height: '36px' }}>
            <p className="text-xs sm:text-sm text-white leading-tight">
              Scam.ai raised $2.6M and joined Berkeley SkyDeck
            </p>
          </div> */}
      {showBanner && <ComputexBanner onDismiss={dismissBanner} />}
      <div className="fixed left-0 right-0 z-40" style={{ top: `${announcementHeight}px` }}>
      <header className={`transition-[background-color,backdrop-filter,box-shadow] duration-300 ${open ? 'bg-[#0b0b0b]' : scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <a href="#main-content" className="skip-link">{t("skipToContent")}</a>
        <nav className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" className={`flex shrink-0 items-center ${open ? 'invisible' : ''}`}>
          <img
            src="/scamai-logo.svg"
            alt={t("logoAlt")}
            className="h-8 w-auto"
          />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => {
            if (item.children) {
              const isProduct = item.id === "product";
              const isSolutions = item.id === "solutions";
              const isCompany = item.id === "company";
              const isOpen = isProduct ? productsOpen : isSolutions ? solutionsOpen : (isCompany ? companyOpen : false);
              const setIsOpen = isProduct ? setProductsOpen : isSolutions ? setSolutionsOpen : (isCompany ? setCompanyOpen : () => {});
              const dropdownRef = isProduct ? productsDropdownRef : isSolutions ? solutionsDropdownRef : (isCompany ? companyDropdownRef : null);

              return (
                <div key={item.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-controls="nav-dropdown-panel"
                    className="flex items-center gap-1 text-sm font-medium text-white transition-colors duration-150 hover:text-white/80"
                  >
                    {itemLabel(item)}
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
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
                    </svg>
                  </button>
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1 text-sm font-medium text-white transition hover:text-white/80"
              >
                {itemLabel(item)}
                {item.hasDropdown && (
                  <svg
                    className="h-4 w-4"
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
                  </svg>
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex w-[160px] xl:w-[210px] items-center gap-2 rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-gray-500 transition-colors duration-150 hover:bg-white/[0.08] hover:border-white/20 hover:text-gray-300 cursor-text"
            aria-label={t("search")}
          >
            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="flex-1 text-left">{t("searchPlaceholder")}</span>
            <kbd className="hidden lg:inline-flex items-center rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-600 font-medium">
              ⌘K
            </kbd>
          </button>
          {/* Language switcher */}
          <div className="relative shrink-0" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              aria-expanded={langOpen}
              aria-haspopup="true"
              aria-label={t("language")}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 whitespace-nowrap"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.5-2.5 3.5-6 3.5-9S14.5 5.5 12 3m0 18c-2.5-2.5-3.5-6-3.5-9S9.5 5.5 12 3M3.5 9h17M3.5 15h17" /></svg>
              <span>{currentLanguage.name}</span>
              <svg className={`h-3.5 w-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {langOpen && (
              <div role="menu" className="absolute right-0 top-full z-50 mt-2 max-h-[70vh] w-44 overflow-auto rounded-xl border border-white/10 bg-[#0b0b0b] py-1 shadow-2xl">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    role="menuitem"
                    onClick={() => switchLocale(lang.code)}
                    aria-current={lang.code === locale ? "true" : undefined}
                    className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-white/10 ${lang.code === locale ? "font-semibold text-white" : "text-white/70"}`}
                  >
                    <span>{lang.name}</span>
                    {lang.code === locale && (
                      <svg className="h-4 w-4 text-[#245FFF]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" /></svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <a
            href="https://app.scam.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/80 bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 whitespace-nowrap shrink-0"
            onClick={() => trackCTA("log_in", "nav")}
          >
            {t("logIn")}
          </a>
          <a
            href="https://cal.com/scamai/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 whitespace-nowrap shrink-0"
            onClick={() => trackCTA("book_demo", "nav")}
          >
            {t("bookDemo")}
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-11 w-11 items-center justify-center text-white"
            aria-label={t("search")}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            ref={hamburgerRef}
            className="flex h-11 w-11 items-center justify-center text-white"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-haspopup="true"
          >
            {open ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>

    <div
      ref={dropdownPanelRef}
      id="nav-dropdown-panel"
      className={`fixed left-0 right-0 w-full bg-black/95 backdrop-blur-xl z-30 hidden lg:block transition-[opacity,transform] duration-200 ${
        activeDropdown
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-1 pointer-events-none'
      }`}
      style={{ top: `${announcementHeight + 48}px` }}
    >
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Products Grid */}
        {productsOpen && (
          <div className="flex gap-6">
            {/* Talk with Team Card */}
            <div className="flex-shrink-0" style={{ width: '220px' }}>
              <a
                href="https://cal.com/scamai/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full p-6 rounded-lg bg-white/5 hover:bg-white/8 transition-[background-color] duration-150"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2">
                      {t("talkWithTeam.title")}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1 group-hover:gap-2 transition-[gap]">
                    {t("talkWithTeam.scheduleCall")}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            </div>

            {/* Products List */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {navItems.find(item => item.id === "product")?.children?.map((child) => {
                const content = (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      {child.icon && (
                        <span className="text-[#245FFF] flex-shrink-0">{child.icon}</span>
                      )}
                      <h3 className="text-sm font-medium text-white">
                        {childLabel("product", child)}
                      </h3>
                    </div>
                    {child.description && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 pl-6">
                        {childDescription("product", child)}
                      </p>
                    )}
                  </>
                );
                return child.external || child.href.includes('#') ? (
                  <a
                    key={child.key}
                    href={child.href}
                    {...(child.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group block p-4 rounded-lg hover:bg-white/5 transition-colors duration-150"
                    onClick={() => setProductsOpen(false)}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    key={child.key}
                    href={child.href}
                    className="group block p-4 rounded-lg hover:bg-white/5 transition-colors duration-150"
                    onClick={() => setProductsOpen(false)}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Solutions Grid */}
        {solutionsOpen && (
          <div className="flex gap-6">
            {/* All Industries Card */}
            <div className="flex-shrink-0" style={{ width: '220px' }}>
              <Link
                href="/solutions"
                className="group block h-full p-6 rounded-lg bg-white/5 hover:bg-white/8 transition-[background-color] duration-150"
                onClick={() => setSolutionsOpen(false)}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2">
                      {t("allIndustries.title")}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1 group-hover:gap-2 transition-[gap]">
                    {t("allIndustries.viewAll")}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>

            {/* Solutions List */}
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3">
              {navItems.find(item => item.id === "solutions")?.children?.map((child) => (
                <Link
                  key={child.key}
                  href={child.href}
                  className="group block p-4 rounded-lg hover:bg-white/5 transition-colors duration-150"
                  onClick={() => setSolutionsOpen(false)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {child.icon && (
                      <span className="text-[#245FFF] flex-shrink-0">{child.icon}</span>
                    )}
                    <h3 className="text-sm font-medium text-white">
                      {childLabel("solutions", child)}
                    </h3>
                  </div>
                  {child.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 pl-6">
                      {childDescription("solutions", child)}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Company Grid */}
        {companyOpen && (
          <div className="flex gap-4">
            {/* Company List */}
            <div className="flex-1">
              {navItems.find(item => item.id === "company")?.children?.map((child) => (
                child.external ? (
                  <a
                    key={child.key}
                    href={child.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-5 rounded-lg hover:bg-white/5 transition-colors duration-150"
                    onClick={() => setCompanyOpen(false)}
                  >
                    <div className="mb-3">
                      <h3 className="text-sm font-medium text-white mb-1">
                        {childLabel("company", child)}
                      </h3>
                    </div>
                    {child.description && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {childDescription("company", child)}
                      </p>
                    )}
                  </a>
                ) : (
                  <Link
                    key={child.key}
                    href={child.href}
                    className="group block p-5 rounded-lg hover:bg-white/5 transition-colors duration-150"
                    onClick={() => setCompanyOpen(false)}
                  >
                    <div className="mb-3">
                      <h3 className="text-sm font-medium text-white mb-1">
                        {childLabel("company", child)}
                      </h3>
                    </div>
                    {child.description && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {childDescription("company", child)}
                      </p>
                    )}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>

    {/* Mobile Full-Screen Menu — rendered at root to avoid backdrop-filter containment on iOS */}
    <div
      ref={mobileMenuRef}
      id="mobile-menu"
      inert={!open}
      aria-hidden={!open}
      className={`fixed left-0 right-0 bottom-0 z-[60] bg-[#0b0b0b] transition-transform duration-300 ease-in-out lg:hidden ${
        open ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      }`}
      style={{ top: `${announcementHeight}px` }}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <Link href="/" onClick={() => setOpen(false)}>
            <img
              src="/scamai-logo.svg"
              alt={t("logoAlt")}
              className="h-8 w-auto"
            />
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              setMobileProductsOpen(false);
              setMobileSolutionsOpen(false);
              setMobileCompanyOpen(false);
            }}
            className="flex h-11 w-11 items-center justify-center text-white"
            aria-label={t("closeMenu")}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items — min-h-0 overrides flex min-height:auto so overflow scrolling works */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              if (item.children) {
                const isProduct = item.id === "product";
                const isSolutions = item.id === "solutions";
                const isCompany = item.id === "company";
                const isOpen = isProduct ? mobileProductsOpen : isSolutions ? mobileSolutionsOpen : (isCompany ? mobileCompanyOpen : false);
                const setIsOpen = isProduct ? setMobileProductsOpen : isSolutions ? setMobileSolutionsOpen : (isCompany ? setMobileCompanyOpen : () => {});

                const panelId = `mobile-accordion-${item.id}`;
                return (
                  <div key={item.href}>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      aria-controls={panelId}
                      className="w-full flex items-center justify-between py-4 text-lg font-medium text-white border-b border-gray-700"
                    >
                      {itemLabel(item)}
                      <svg
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
                      </svg>
                    </button>
                    {isOpen && (
                      <div id={panelId} className="py-3 pl-2 space-y-3">
                        {isProduct && (
                          <a
                            href="https://cal.com/scamai/15min"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-lg bg-white/5"
                            onClick={() => {
                              setOpen(false);
                              setIsOpen(false);
                            }}
                          >
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-white mb-0.5">
                                {t("talkWithTeam.title")}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {t("talkWithTeam.scheduleCallMobile")}
                              </p>
                            </div>
                          </a>
                        )}

                        {isSolutions && (
                          <Link
                            href="/solutions"
                            className="flex items-center gap-3 p-4 rounded-lg bg-white/5"
                            onClick={() => {
                              setOpen(false);
                              setIsOpen(false);
                            }}
                          >
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-white mb-0.5">
                                {t("allIndustries.title")}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {t("allIndustries.viewAllMobile")}
                              </p>
                            </div>
                          </Link>
                        )}

                        {item.children.map((child) => {
                          const mobileContent = (
                            <div className="flex items-start gap-3">
                              {child.icon && (
                                <span className="text-[#245FFF] mt-0.5 flex-shrink-0">{child.icon}</span>
                              )}
                              <div>
                                <h3 className="text-sm font-medium text-white mb-1">
                                  {childLabel(item.id, child)}
                                </h3>
                                {child.description && (
                                  <p className="text-xs text-gray-500 leading-relaxed">
                                    {childDescription(item.id, child)}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                          return child.external || child.href.includes('#') ? (
                            <a
                              key={child.key}
                              href={child.href}
                              {...(child.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                              className="block p-4 rounded-lg hover:bg-white/5"
                              onClick={() => {
                                setOpen(false);
                                setIsOpen(false);
                              }}
                            >
                              {mobileContent}
                            </a>
                          ) : (
                            <Link
                              key={child.key}
                              href={child.href}
                              className="block p-4 rounded-lg hover:bg-white/5"
                              onClick={() => {
                                setOpen(false);
                                setIsOpen(false);
                              }}
                            >
                              {mobileContent}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-4 text-lg font-medium text-white border-b border-gray-700"
                  onClick={() => setOpen(false)}
                >
                  {itemLabel(item)}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-700 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-col gap-3">
            {/* Language switcher (mobile) */}
            <div>
              <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wider text-gray-500">{t("language")}</p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => { switchLocale(lang.code); setOpen(false); }}
                    aria-current={lang.code === locale ? "true" : undefined}
                    className={`rounded-full border px-3 py-2 text-sm transition ${lang.code === locale ? "border-[#245FFF] bg-[#245FFF]/10 font-semibold text-white" : "border-gray-700 text-white/70 hover:bg-gray-800"}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <a
              href="https://app.scam.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-6 py-3 text-center text-sm font-semibold text-white bg-transparent border border-gray-600 rounded-full hover:bg-gray-800 transition"
              onClick={() => { trackCTA("log_in", "nav_mobile"); setOpen(false); }}
            >
              {t("logIn")}
            </a>
            <a
              href="https://cal.com/scamai/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-6 py-3 text-center text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-100 transition"
              onClick={() => { trackCTA("book_demo", "nav_mobile"); setOpen(false); }}
            >
              {t("bookDemo")}
            </a>
          </div>
        </div>
      </div>
    </div>

    <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
