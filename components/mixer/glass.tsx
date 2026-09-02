"use client";

import { AnimatePresence, motion } from "motion/react";

export type Band = { id: string; color: string; portion: number; label: string };

/*
  The glass. Bands stack from the bottom and animate their height. In blended
  mode they collapse into one averaged color with a slow swirl.
*/
export function Glass({
  bands,
  blended,
  fillRatio,
}: {
  bands: Band[];
  blended: boolean;
  fillRatio: number;
}) {
  const blendedColor = mixColors(bands);
  const clip = "url(#glass-clip)";

  return (
    <svg viewBox="0 0 200 280" className="h-full w-full" role="img" aria-label="Your drink">
      <defs>
        <clipPath id="glass-clip">
          <path d="M52 24 L148 24 L134 250 Q100 268 66 250 Z" />
        </clipPath>
        <linearGradient id="glass-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="0.2" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g clipPath={clip}>
        <rect x="0" y="0" width="200" height="280" fill="var(--bg-raised)" />
        <AnimatePresence>
          {blended ? (
            <motion.g key="blended">
              <motion.rect
                x="0"
                width="200"
                fill={blendedColor}
                initial={{ y: 280, height: 0 }}
                animate={{ y: 280 - fillRatio * 226, height: fillRatio * 226 }}
                transition={{ type: "spring", stiffness: 60, damping: 14 }}
              />
              <motion.ellipse
                cx="100"
                rx="60"
                ry="10"
                fill="#ffffff"
                opacity="0.12"
                animate={{
                  cy: 280 - fillRatio * 226,
                  rx: [60, 66, 60],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.g>
          ) : (
            (() => {
              let acc = 0;
              return bands.map((band) => {
                const h = band.portion * fillRatio * 226;
                const y = 280 - acc - h;
                acc += h;
                return (
                  <motion.rect
                    key={band.id}
                    x="0"
                    width="200"
                    fill={band.color}
                    initial={{ height: 0, y: 280 }}
                    animate={{ height: h, y }}
                    exit={{ height: 0, y: 280, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 80, damping: 16 }}
                  />
                );
              });
            })()
          )}
        </AnimatePresence>
        <rect x="0" y="0" width="60" height="280" fill="url(#glass-shine)" />
      </g>

      <path
        d="M52 24 L148 24 L134 250 Q100 268 66 250 Z"
        fill="none"
        stroke="hsl(var(--ink)/0.35)"
        strokeWidth="3"
      />
      <ellipse cx="100" cy="24" rx="48" ry="7" fill="none" stroke="hsl(var(--ink)/0.35)" strokeWidth="3" />
    </svg>
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const int = parseInt(full || "888888", 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

export function mixColors(bands: Band[]): string {
  if (!bands.length) return "var(--bg-raised)";
  let r = 0;
  let g = 0;
  let b = 0;
  let weight = 0;
  bands.forEach((band) => {
    const [br, bg, bb] = hexToRgb(band.color);
    r += br * band.portion;
    g += bg * band.portion;
    b += bb * band.portion;
    weight += band.portion;
  });
  if (!weight) return "var(--bg-raised)";
  return `rgb(${Math.round(r / weight)}, ${Math.round(g / weight)}, ${Math.round(
    b / weight,
  )})`;
}
