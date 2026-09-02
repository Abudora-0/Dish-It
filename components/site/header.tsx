"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedLogo } from "@/components/brand/animated-logo";
import { StoveKnob } from "@/components/ui/stove-knob";
import { NAV_LINKS, UTILITY_LINKS } from "@/components/site/nav-data";
import { useCommandPalette } from "@/components/site/command-palette";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const palette = useCommandPalette();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "no-print sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-fg/10 bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Dish It home" className="shrink-0">
          <AnimatedLogo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  active ? "text-fg" : "text-fg-soft hover:text-fg",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-fg/[0.06]"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={palette.open}
            aria-label="Open kitchen search"
            className="hidden items-center gap-2 rounded-full border border-fg/15 px-3 py-1.5 text-sm text-fg-faint transition-colors hover:border-fg/30 hover:text-fg-soft sm:flex"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <circle cx="6" cy="6" r="4.2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Search
            <kbd className="font-mono text-[0.65rem]">Ctrl K</kbd>
          </button>
          <StoveKnob />
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full border border-fg/20 lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 h-0.5 w-full rounded bg-fg transition-all",
                  menuOpen ? "top-1/2 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded bg-fg transition-opacity",
                  menuOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 h-0.5 w-full rounded bg-fg transition-all",
                  menuOpen ? "top-1/2 -rotate-45" : "bottom-0",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-fg/10 bg-bg lg:hidden"
          >
            <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
              <div className="grid gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-fg hover:bg-fg/5"
                  >
                    <span className="font-medium">{link.label}</span>
                    <span className="text-xs text-fg-faint">{link.blurb}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-fg/10 pt-3">
                {UTILITY_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="chip hover:border-ember hover:text-ember"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
