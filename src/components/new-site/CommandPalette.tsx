"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { trackSearch } from "@/lib/analytics";

// Stable item identity is the `key` (used for t() lookups, dedupe, and analytics
// via the resolved label). Visible label/description/category are resolved at
// render through t(); href/external/behaviour stay here untouched.
type SearchItem = {
  key: string;
  categoryKey: string;
  href: string;
  external?: boolean;
  hasDescription?: boolean;
};

const searchItems: SearchItem[] = [
  // Products
  { key: "halo", categoryKey: "products", href: "/halo", hasDescription: true },
  { key: "aiDetection", categoryKey: "products", href: "/products/ai-detection", hasDescription: true },
  { key: "audioDetection", categoryKey: "products", href: "/products/audio-detection", hasDescription: true },

  // Pages
  { key: "home", categoryKey: "pages", href: "/" },
  { key: "pricing", categoryKey: "pages", href: "/pricing", hasDescription: true },
  { key: "about", categoryKey: "pages", href: "/about", hasDescription: true },
  { key: "research", categoryKey: "pages", href: "/research", hasDescription: true },
  { key: "newsletter", categoryKey: "pages", href: "/newsletter", hasDescription: true },
  { key: "contact", categoryKey: "pages", href: "/contact", hasDescription: true },

  // Resources
  { key: "documentation", categoryKey: "resources", href: "https://docu.scam.ai", external: true, hasDescription: true },
  { key: "securityCompliance", categoryKey: "resources", href: "https://reality-inc.trust.site/", external: true, hasDescription: true },

  // Quick actions
  { key: "logIn", categoryKey: "actions", href: "https://app.scam.ai", external: true, hasDescription: true },
  { key: "bookDemo", categoryKey: "actions", href: "https://cal.com/scamai/15min", external: true, hasDescription: true },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const t = useTranslations("landing.search");
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Element that had focus before the dialog opened, restored on close.
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const listboxId = "command-palette-listbox";
  const optionId = (i: number) => `command-palette-option-${i}`;
  const router = useRouter();

  // Resolve the visible label/description/category for an item from the active
  // locale. Behaviour (href/external) lives on the item; only display text is t().
  const itemLabel = (item: SearchItem) => t(`items.${item.key}.label`);
  const itemDescription = (item: SearchItem) =>
    item.hasDescription ? t(`items.${item.key}.description`) : undefined;
  const categoryLabel = (categoryKey: string) => t(`categories.${categoryKey}`);

  const filtered = query.length === 0
    ? searchItems
    : searchItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          itemLabel(item).toLowerCase().includes(q) ||
          itemDescription(item)?.toLowerCase().includes(q) ||
          categoryLabel(item.categoryKey).toLowerCase().includes(q)
        );
      });

  const close = useCallback(() => {
    onClose();
    setQuery("");
    setSelectedIndex(0);
  }, [onClose]);

  const navigate = useCallback(
    (item: SearchItem) => {
      // Track the stable key (locale-independent) so search_select analytics
      // stay consistent across locales rather than recording translated labels.
      trackSearch(query, item.key);
      close();
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else if (item.href.includes("#")) {
        // Hash links need native navigation to trigger scroll-to-anchor
        const [path, hash] = item.href.split("#");
        const currentPath = window.location.pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "");
        if (!path || path === "/" || currentPath === path) {
          // Same page — just scroll to the element
          const el = document.getElementById(hash);
          el?.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push(path);
          setTimeout(() => {
            const el = document.getElementById(hash);
            el?.scrollIntoView({ behavior: "smooth" });
          }, 500);
        }
      } else {
        router.push(item.href);
      }
    },
    [close, router, query]
  );

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Focus input when opened; restore focus to the trigger on close.
  useEffect(() => {
    if (isOpen) {
      // Remember what had focus so we can return to it when the dialog closes.
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      // Use requestAnimationFrame for more reliable focus timing across browsers
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } else if (previouslyFocused.current) {
      previouslyFocused.current.focus?.();
      previouslyFocused.current = null;
    }
  }, [isOpen]);

  // Trap focus inside the dialog while open — keep Tab/Shift+Tab within it.
  useEffect(() => {
    if (!isOpen) return;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey) {
        if (active === first || !dialog.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !dialog.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Track what people search for (debounced, once per settled query) — distinct
  // from search_select which fires on navigate(). This is the only signal for
  // zero-result / abandoned searches: what users hunt for but don't find/click.
  useEffect(() => {
    if (!isOpen) return;
    const q = query.trim();
    if (q.length < 2) return;
    const t = setTimeout(() => trackSearch(q), 700);
    return () => clearTimeout(t);
  }, [query, isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.querySelector('[data-selected="true"]');
      selected?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      navigate(filtered[selectedIndex]);
    }
  };

  // Group items by category, tagging each with its flat index upfront so
  // render never mutates a variable (which breaks in React StrictMode).
  const grouped = filtered.reduce<Record<string, (SearchItem & { flatIdx: number })[]>>(
    (acc, item, i) => {
      if (!acc[item.categoryKey]) acc[item.categoryKey] = [];
      acc[item.categoryKey].push({ ...item, flatIdx: i });
      return acc;
    },
    {}
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
      />

      {/* Dialog */}
      <div className="relative z-10 mx-auto mt-[min(12vh,120px)] sm:mt-[min(20vh,120px)] w-full max-w-xl px-3 sm:px-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("dialogLabel")}
          className="overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              autoFocus
              role="combobox"
              aria-expanded="true"
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-activedescendant={filtered[selectedIndex] ? optionId(selectedIndex) : undefined}
              aria-label={t("inputAriaLabel")}
              placeholder={t("placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#245FFF]"
            />
            <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[11px] text-gray-500 sm:inline-block">
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={t("resultsAriaLabel")}
            className="max-h-[60vh] overflow-y-auto overscroll-contain p-2"
          >
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                {t("noResults", { query })}
              </div>
            ) : (
              Object.entries(grouped).map(([categoryKey, items]) => (
                <div key={categoryKey} role="group" aria-label={categoryLabel(categoryKey)} className="mb-1">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500" aria-hidden="true">
                    {categoryLabel(categoryKey)}
                  </div>
                  {items.map((item) => {
                    const isSelected = item.flatIdx === selectedIndex;
                    const label = itemLabel(item);
                    const description = itemDescription(item);
                    return (
                      <button
                        key={item.key + item.href}
                        id={optionId(item.flatIdx)}
                        role="option"
                        aria-selected={isSelected}
                        data-selected={isSelected}
                        onClick={() => navigate(item)}
                        onMouseEnter={() => setSelectedIndex(item.flatIdx)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                          isSelected ? "bg-white/10" : "hover:bg-white/5"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white truncate">
                              {label}
                            </span>
                            {item.external && (
                              <svg className="h-3 w-3 flex-shrink-0 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            )}
                          </div>
                          {description && (
                            <p className="text-xs text-gray-500 truncate">
                              {description}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <svg className="h-4 w-4 flex-shrink-0 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer — hidden on mobile where keyboard shortcuts don't apply */}
          <div className="hidden sm:flex items-center gap-4 border-t border-white/10 px-4 py-2.5 text-[11px] text-gray-600">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5">↑</kbd>
              <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5">↓</kbd>
              {t("hintNavigate")}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5">↵</kbd>
              {t("hintSelect")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
