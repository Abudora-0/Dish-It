"use client";

import { motion, useReducedMotion } from "motion/react";
import type { FlavorProfile } from "@/lib/types";

const AXES: { key: keyof FlavorProfile; label: string }[] = [
  { key: "sweet", label: "Sweet" },
  { key: "salty", label: "Salty" },
  { key: "sour", label: "Sour" },
  { key: "spicy", label: "Spicy" },
  { key: "umami", label: "Umami" },
  { key: "bitter", label: "Bitter" },
  { key: "fat", label: "Rich" },
];

export function FlavorRadar({
  flavor,
  size = 240,
}: {
  flavor: Partial<FlavorProfile>;
  size?: number;
}) {
  const reduce = useReducedMotion();
  const center = size / 2;
  const radius = center - 34;
  const count = AXES.length;

  const point = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (Math.min(10, Math.max(0, value)) / 10) * radius;
    return [center + Math.cos(angle) * r, center + Math.sin(angle) * r];
  };

  const polygon = AXES.map((axis, index) =>
    point(index, flavor[axis.key] ?? 0).join(","),
  ).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Flavor profile">
      {[0.25, 0.5, 0.75, 1].map((ring) => (
        <polygon
          key={ring}
          points={AXES.map((_, index) => point(index, ring * 10).join(",")).join(" ")}
          fill="none"
          stroke="hsl(var(--ink) / 0.1)"
          strokeWidth="1"
        />
      ))}
      {AXES.map((axis, index) => {
        const [x, y] = point(index, 11.6);
        const [lx, ly] = point(index, 10);
        return (
          <g key={axis.key}>
            <line
              x1={center}
              y1={center}
              x2={lx}
              y2={ly}
              stroke="hsl(var(--ink) / 0.1)"
              strokeWidth="1"
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-fg-faint text-[0.62rem] uppercase tracking-wide"
            >
              {axis.label}
            </text>
          </g>
        );
      })}
      <motion.polygon
        points={polygon}
        fill="hsl(var(--ember) / 0.22)"
        stroke="hsl(var(--ember))"
        strokeWidth="2"
        strokeLinejoin="round"
        initial={reduce ? false : { scale: 0.2, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        style={{ transformOrigin: "center" }}
      />
    </svg>
  );
}
