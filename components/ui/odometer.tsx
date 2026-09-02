"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/*
  Rolling digit counter. Each digit column slides to its target value like a
  mechanical odometer. Used for servings, times, and headline stats.
*/
export function Odometer({
  value,
  className,
  digitClassName,
}: {
  value: number;
  className?: string;
  digitClassName?: string;
}) {
  const reduce = useReducedMotion();
  const chars = Math.round(value).toString().split("");

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono tabular-nums",
        className,
      )}
      aria-label={String(value)}
      role="text"
    >
      {chars.map((char, index) => (
        <DigitColumn
          key={`${index}-${chars.length}`}
          digit={Number(char)}
          reduce={!!reduce}
          className={digitClassName}
        />
      ))}
    </span>
  );
}

function DigitColumn({
  digit,
  reduce,
  className,
}: {
  digit: number;
  reduce: boolean;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => setMounted(true), []);

  return (
    <span
      ref={ref}
      className={cn("relative block h-[1em] w-[0.62em] overflow-hidden", className)}
    >
      <motion.span
        className="absolute left-0 top-0 flex flex-col"
        animate={{ y: `-${digit}em` }}
        initial={{ y: reduce || !mounted ? `-${digit}em` : "0em" }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 220, damping: 26 }
        }
      >
        {Array.from({ length: 10 }).map((_, n) => (
          <span key={n} className="flex h-[1em] items-center justify-center">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function CountUp({
  to,
  suffix = "",
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) {
      setDisplay(to);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const duration = 1100;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * to));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [to, reduce]);

  return (
    <span ref={ref} className={cn("font-mono tabular-nums", className)}>
      {display}
      {suffix}
    </span>
  );
}
