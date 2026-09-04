"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  markClassName?: string;
  withWordmark?: boolean;
  interactive?: boolean;
};

/*
  Dish It mark: a domed serving cloche that lifts to release steam, then settles.
  The wordmark carries a sizzle underline that draws itself and a bouncing sauce
  drop for the tittle on the i. Everything freezes to a clean static state under
  reduced motion.
*/
export function AnimatedLogo({
  className,
  markClassName,
  withWordmark = true,
  interactive = true,
}: Props) {
  const reduce = useReducedMotion();

  const loop = { duration: 3.8, repeat: Infinity, repeatDelay: 1.1 };
  const times = [0, 0.18, 0.36, 0.62, 0.8, 1];

  const domeMotion = reduce
    ? {}
    : {
        y: [0, 0, -7, -7, 0, 0],
        transition: { ...loop, times, ease: "easeInOut" as const },
      };

  const steamMotion = reduce
    ? { opacity: 0 }
    : {
        opacity: [0, 0, 0.85, 0.5, 0, 0],
        y: [4, 4, -3, -11, -15, -15],
        transition: { ...loop, times, ease: "easeOut" as const },
      };

  return (
    <span
      className={cn("inline-flex items-center gap-2.5 select-none", className)}
    >
      <motion.svg
        viewBox="0 0 64 64"
        className={cn("h-9 w-9 shrink-0 overflow-visible", markClassName)}
        initial={false}
        whileHover={interactive && !reduce ? { scale: 1.07 } : undefined}
        aria-hidden="true"
      >
        <g strokeLinecap="round" fill="none" strokeWidth="2.6">
          <motion.path
            d="M26 42 q 5 -8 0 -15 q -4 -6 0 -12"
            stroke="hsl(var(--saffron))"
            animate={steamMotion}
          />
          <motion.path
            d="M38 42 q -5 -8 0 -15 q 4 -6 0 -12"
            stroke="hsl(var(--saffron))"
            animate={
              reduce
                ? { opacity: 0 }
                : {
                    ...steamMotion,
                    transition: {
                      ...loop,
                      times,
                      ease: "easeOut" as const,
                      delay: 0.25,
                    },
                  }
            }
          />
        </g>

        <ellipse cx="32" cy="52" rx="22" ry="5" fill="hsl(var(--ink))" />
        <rect
          x="11"
          y="45"
          width="42"
          height="5"
          rx="2.5"
          fill="hsl(var(--ink))"
        />

        <motion.g
          animate={domeMotion}
          style={{ originX: "32px", originY: "46px" }}
        >
          <path d="M14 46 A18 20 0 0 1 50 46 Z" fill="hsl(var(--ink))" />
          <circle cx="32" cy="25" r="3" fill="hsl(var(--ember))" />
        </motion.g>
      </motion.svg>

      {withWordmark && (
        <span className="relative font-display text-[1.35rem] font-semibold leading-none tracking-tight">
          {!reduce && (
            <motion.svg
              width="10"
              height="14"
              viewBox="0 0 10 14"
              className="absolute -left-0.5 -top-2"
              aria-hidden="true"
            >
              <motion.path
                d="M5 13 q 3.5 -5 0 -8 q -2.5 -4 0 -5"
                fill="none"
                stroke="hsl(var(--saffron))"
                strokeWidth="1.6"
                strokeLinecap="round"
                animate={{ opacity: [0, 0.5, 0], y: [2, -6, -10] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut" }}
              />
            </motion.svg>
          )}

          <span>D</span>
          <span className="relative">
            {"ı"}
            <motion.span
              className="absolute left-[48%] top-[0.26em] block h-[0.17em] w-[0.17em] -translate-x-1/2 rounded-full bg-ember"
              animate={
                reduce ? {} : { y: [0, -2.5, 0], scaleX: [1, 1.4, 1] }
              }
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
          <span>sh&nbsp;It</span>

          <motion.span
            aria-hidden
            className="absolute -bottom-[0.16em] left-0 block h-[0.09em] w-full origin-left rounded-full"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--saffron)), hsl(var(--ember)))",
            }}
            initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          />
        </span>
      )}
    </span>
  );
}
