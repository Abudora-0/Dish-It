"use client";

import { motion, useReducedMotion } from "motion/react";
import { useCookbook } from "@/lib/hooks/use-cookbook";
import { cn } from "@/lib/utils";

export function SaveButton({
  slug,
  compact = false,
}: {
  slug: string;
  compact?: boolean;
}) {
  const { has, toggle, ready } = useCookbook();
  const reduce = useReducedMotion();
  const saved = ready && has(slug);

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => toggle(slug)}
        aria-pressed={saved}
        aria-label={saved ? "Remove from cookbook" : "Save to cookbook"}
        className="grid h-9 w-9 place-items-center rounded-full border border-fg/15 bg-bg/80 backdrop-blur transition-colors hover:border-ember"
      >
        <BowlMark filled={saved} reduce={!!reduce} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        saved
          ? "border-ember bg-ember/10 text-ember"
          : "border-fg/20 text-fg-soft hover:border-fg/40 hover:text-fg",
      )}
    >
      <BowlMark filled={saved} reduce={!!reduce} />
      {saved ? "In your cookbook" : "Save to cookbook"}
    </button>
  );
}

function BowlMark({ filled, reduce }: { filled: boolean; reduce: boolean }) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      animate={reduce ? undefined : { scale: filled ? [1, 1.3, 1] : 1 }}
      transition={{ duration: 0.3 }}
      aria-hidden
    >
      <path
        d="M2 6.5h12c0 3.6-2.7 6.5-6 6.5S2 10.1 2 6.5Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M6 3.5c0-1 .8-1.5 .8-1.5M9 4c0-1.4 1-2 1-2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}
