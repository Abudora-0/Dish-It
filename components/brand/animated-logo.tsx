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
  Dish It mark: a skillet that tosses a morsel in an arc while steam curls off
  the pan. The wordmark sits beside it with a bouncing drop for the dot on the i.
  Everything freezes into a clean static state under reduced motion.
*/
export function AnimatedLogo({
  className,
  markClassName,
  withWordmark = true,
  interactive = true,
}: Props) {
  const reduce = useReducedMotion();

  const toss = reduce
    ? {}
    : {
        rotate: [-18, -18, 14, -18],
        transition: {
          duration: 2.6,
          times: [0, 0.25, 0.55, 1],
          repeat: Infinity,
          repeatDelay: 1.4,
          ease: "easeInOut" as const,
        },
      };

  const morsel = reduce
    ? {}
    : {
        y: [0, -34, -34, 0],
        x: [0, 10, 22, 30],
        rotate: [0, 180, 320, 420],
        transition: {
          duration: 2.6,
          times: [0.2, 0.4, 0.55, 0.75],
          repeat: Infinity,
          repeatDelay: 1.4,
          ease: "easeOut" as const,
        },
      };

  return (
    <span
      className={cn("inline-flex items-center gap-2.5 select-none", className)}
    >
      <motion.svg
        viewBox="0 0 64 64"
        className={cn("h-9 w-9 shrink-0 overflow-visible", markClassName)}
        initial={false}
        whileHover={interactive && !reduce ? { scale: 1.06 } : undefined}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="dishit-pan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="hsl(var(--ink))" />
            <stop offset="1" stopColor="hsl(var(--ink-soft))" />
          </linearGradient>
        </defs>

        {!reduce &&
          [0, 1, 2].map((i) => (
            <motion.path
              key={i}
              d={`M${24 + i * 7} 24 q ${i % 2 ? 6 : -6} -7 0 -14 q ${
                i % 2 ? -6 : 6
              } -7 0 -14`}
              fill="none"
              stroke="hsl(var(--saffron))"
              strokeWidth="2.4"
              strokeLinecap="round"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: [0, 0.8, 0], y: [6, -10, -20] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            />
          ))}

        <motion.circle
          cx="20"
          cy="30"
          r="5.4"
          fill="hsl(var(--ember))"
          animate={morsel}
          style={{ originX: "20px", originY: "30px" }}
        />

        <motion.g animate={toss} style={{ originX: "26px", originY: "40px" }}>
          <ellipse
            cx="26"
            cy="40"
            rx="17"
            ry="7.5"
            fill="url(#dishit-pan)"
          />
          <ellipse
            cx="26"
            cy="38.5"
            rx="17"
            ry="7.5"
            fill="var(--bg-raised)"
          />
          <ellipse
            cx="26"
            cy="38.5"
            rx="17"
            ry="7.5"
            fill="none"
            stroke="hsl(var(--ink))"
            strokeWidth="2.4"
          />
          <rect
            x="41"
            y="36"
            width="20"
            height="5"
            rx="2.5"
            fill="hsl(var(--ink))"
          />
        </motion.g>
      </motion.svg>

      {withWordmark && (
        <span className="font-display text-[1.35rem] font-semibold leading-none tracking-tight">
          Dish
          <span className="relative mx-[0.12em] inline-block">
            It
            <motion.span
              className="absolute left-[0.62em] top-[-0.16em] block h-[0.16em] w-[0.16em] rounded-full bg-ember"
              animate={
                reduce
                  ? {}
                  : {
                      y: [0, -3, 0],
                      scaleX: [1, 1.4, 1],
                    }
              }
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </span>
        </span>
      )}
    </span>
  );
}
