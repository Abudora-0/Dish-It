"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type BurnerTab = { value: string; label: string; count?: number };

/*
  Tab set styled as stove burners. The active burner glows and a shared layout
  ring slides between them.
*/
export function BurnerTabs({
  tabs,
  value,
  onChange,
  className,
  idBase = "burner",
}: {
  tabs: BurnerTab[];
  value: string;
  onChange: (next: string) => void;
  className?: string;
  idBase?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter"
      className={cn(
        "inline-flex flex-wrap gap-1 rounded-full border border-fg/15 bg-bg-raised p-1",
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            id={`${idBase}-${tab.value}`}
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              active ? "text-[hsl(var(--accent-contrast))]" : "text-fg-soft hover:text-fg",
            )}
          >
            {active && (
              <motion.span
                layoutId={`${idBase}-glow`}
                className="absolute inset-0 rounded-full bg-ember"
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              />
            )}
            <span className="relative z-10">
              {tab.label}
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "ml-1.5 font-mono text-xs",
                    active ? "opacity-80" : "text-fg-faint",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
