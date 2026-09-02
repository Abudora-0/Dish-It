"use client";

import { motion } from "motion/react";
import { Odometer } from "@/components/ui/odometer";
import { cn } from "@/lib/utils";

/*
  A themed number stepper with rolling digits. The minus and plus keys read as
  stove dials.
*/
export function Stepper({
  value,
  min = 1,
  max = 99,
  step = 1,
  onChange,
  label,
  suffix,
  className,
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (next: number) => void;
  label?: string;
  suffix?: string;
  className?: string;
}) {
  const set = (next: number) =>
    onChange(Math.min(max, Math.max(min, Math.round(next * 100) / 100)));

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <DialButton
        ariaLabel={`Decrease ${label ?? "value"}`}
        disabled={value <= min}
        onClick={() => set(value - step)}
        symbol="minus"
      />
      <span className="min-w-[3ch] text-center text-2xl font-semibold text-fg">
        <Odometer value={value} />
        {suffix ? (
          <span className="ml-1 text-sm font-normal text-fg-faint">
            {suffix}
          </span>
        ) : null}
      </span>
      <DialButton
        ariaLabel={`Increase ${label ?? "value"}`}
        disabled={value >= max}
        onClick={() => set(value + step)}
        symbol="plus"
      />
    </div>
  );
}

function DialButton({
  onClick,
  disabled,
  ariaLabel,
  symbol,
}: {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  symbol: "plus" | "minus";
}) {
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      whileTap={{ rotate: symbol === "plus" ? 32 : -32 }}
      className="grid h-10 w-10 place-items-center rounded-full border border-fg/20 bg-bg-raised text-fg transition-colors hover:border-ember hover:text-ember disabled:opacity-35"
    >
      <span className="pointer-events-none relative block h-4 w-4">
        <span className="absolute left-1/2 top-1/2 h-[2px] w-3 -translate-x-1/2 -translate-y-1/2 rounded bg-current" />
        {symbol === "plus" && (
          <span className="absolute left-1/2 top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded bg-current" />
        )}
        <span className="absolute -right-1 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-ember" />
      </span>
    </motion.button>
  );
}
