"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/*
  Checkbox with a knife stroke check. The label strikes through like an item
  crossed off a prep list.
*/
export function ChopCheckbox({
  checked,
  onChange,
  label,
  sublabel,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  sublabel?: string;
  className?: string;
}) {
  const id = useId();
  const reduce = useReducedMotion();

  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-start gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-fg/[0.03]",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-colors",
          checked
            ? "border-ember bg-ember text-[hsl(var(--accent-contrast))]"
            : "border-fg/30 group-hover:border-fg/50",
        )}
      >
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          initial={false}
          animate={checked ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
        >
          <motion.path
            d="M1.5 6.5l3 3 6-7"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: "easeOut" }}
          />
        </motion.svg>
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            "block text-[0.95rem] leading-snug transition-colors",
            checked ? "text-fg-faint line-through" : "text-fg",
          )}
        >
          {label}
        </span>
        {sublabel && (
          <span className="block text-xs text-fg-faint">{sublabel}</span>
        )}
      </span>
    </label>
  );
}
