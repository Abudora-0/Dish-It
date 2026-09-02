"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Nutrition } from "@/lib/types";

/*
  Animated macro breakdown. Protein, carbs, and fat are shown as grams of energy
  split around a ring with the calorie count in the middle.
*/
export function MacroDonut({
  nutrition,
  size = 168,
}: {
  nutrition: Nutrition;
  size?: number;
}) {
  const reduce = useReducedMotion();
  const p = nutrition.protein * 4;
  const c = nutrition.carbs * 4;
  const f = nutrition.fat * 9;
  const total = Math.max(1, p + c + f);

  const segments = [
    { label: "Protein", value: p, grams: nutrition.protein, color: "hsl(var(--basil))" },
    { label: "Carbs", value: c, grams: nutrition.carbs, color: "hsl(var(--saffron))" },
    { label: "Fat", value: f, grams: nutrition.fat, color: "hsl(var(--ember))" },
  ];

  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--ink) / 0.08)"
          strokeWidth="14"
        />
        {segments.map((segment) => {
          const fraction = segment.value / total;
          const dash = fraction * circumference;
          const circle = (
            <motion.circle
              key={segment.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          );
          offset += dash;
          return circle;
        })}
        <text
          x="50%"
          y="47%"
          textAnchor="middle"
          className="fill-fg font-mono text-2xl font-semibold"
        >
          {nutrition.calories}
        </text>
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          className="fill-fg-faint text-[0.65rem] uppercase tracking-widest"
        >
          kcal
        </text>
      </svg>
      <ul className="space-y-1.5 text-sm">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: segment.color }}
              aria-hidden
            />
            <span className="text-fg-soft">{segment.label}</span>
            <span className="font-mono text-fg">{segment.grams} g</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
