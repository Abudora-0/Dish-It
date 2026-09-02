"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Technique } from "@/lib/types";

export function TechniqueHint({ technique }: { technique: Technique }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="chip border-ember/30 text-ember hover:bg-ember/10"
        aria-expanded={open}
      >
        <span aria-hidden>?</span> {technique.name}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="card-paper absolute bottom-full left-0 z-30 mb-2 w-64 p-3 text-left text-xs leading-relaxed text-fg-soft"
          >
            <span className="mb-1 block font-mono text-[0.65rem] uppercase tracking-wider text-ember">
              {technique.name}
            </span>
            {technique.summary}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
