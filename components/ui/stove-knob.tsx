"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

/*
  Theme toggle shaped like a stove dial. Rotates from cool to hot as it turns
  the interface dark.
*/
export function StoveKnob({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const reduce = useReducedMotion();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light kitchen" : "Switch to dark kitchen"}
      aria-pressed={isDark}
      className={cn(
        "group relative grid h-10 w-10 place-items-center rounded-full border border-fg/20 bg-bg-raised transition-colors hover:border-ember",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background: isDark
            ? "conic-gradient(from 180deg, hsl(var(--ember)/0.35), transparent 60%)"
            : "conic-gradient(from 0deg, hsl(var(--saffron)/0.35), transparent 55%)",
        }}
      />
      <motion.span
        aria-hidden
        className="relative block h-6 w-6 rounded-full border border-fg/30 bg-bg"
        animate={{ rotate: isDark ? 135 : -45 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 18 }}
      >
        <span className="absolute left-1/2 top-1 h-2 w-[2px] -translate-x-1/2 rounded bg-ember" />
      </motion.span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
