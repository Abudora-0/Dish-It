"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { SizzleButton } from "@/components/ui/sizzle-button";
import { cn } from "@/lib/utils";
import type { Mood, Recipe } from "@/lib/types";

const MOODS: { key: Mood; label: string; hint: string; color: string }[] = [
  { key: "cozy", label: "Cozy", hint: "warm, soft, low effort", color: "hsl(var(--ember))" },
  { key: "fiery", label: "Fiery", hint: "bring the heat", color: "hsl(var(--ember-deep))" },
  { key: "fresh", label: "Fresh", hint: "bright and clean", color: "hsl(var(--basil))" },
  { key: "indulgent", label: "Indulgent", hint: "rich, no apologies", color: "hsl(var(--plum))" },
  { key: "quick", label: "In a rush", hint: "on the table fast", color: "hsl(var(--saffron))" },
  { key: "post-gym", label: "Post gym", hint: "protein forward", color: "hsl(var(--blueberry))" },
  { key: "celebration", label: "A moment", hint: "worth the effort", color: "hsl(var(--plum))" },
  { key: "comfort", label: "Comfort", hint: "the familiar hug", color: "hsl(var(--ember))" },
];

// Deterministic burst so the render stays pure - no Math.random() in JSX.
const SPICE_BURST = Array.from({ length: 14 }).map((_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  const spread = 60 + ((i * 37) % 50);
  return {
    x: Math.cos(angle) * spread,
    y: Math.sin(angle) * spread,
    delay: (i % 5) * 0.02,
    color: MOODS[i % MOODS.length].color,
  };
});

// A quick, gentle ease for a tap-to-select snap.
function easeOutQuint(t: number) {
  return 1 - Math.pow(1 - t, 5);
}
// A punchier deceleration for the multi-turn "Spin the wheel" throw.
function easeSpin(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

export function Discovery({ recipes }: { recipes: Recipe[] }) {
  const reduce = useReducedMotion();
  const [mood, setMood] = useState<Mood>("cozy");
  const [burst, setBurst] = useState(0);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [pointerPulse, setPointerPulse] = useState(false);
  const rotationRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const pulseTimeout = useRef<number | null>(null);
  const lastTick = useRef(0);
  const segment = 360 / MOODS.length;

  useEffect(
    () => () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (pulseTimeout.current) window.clearTimeout(pulseTimeout.current);
    },
    [],
  );

  // Hand rolled so the wheel's motion is not at the mercy of a third party
  // imperative animation call fighting with this component's re-renders.
  const applyRotation = useCallback(
    (value: number) => {
      rotationRef.current = value;
      setRotationDeg(value);
      const tick = Math.floor(Math.abs(value) / segment);
      if (tick !== lastTick.current) {
        lastTick.current = tick;
        setPointerPulse(true);
        if (pulseTimeout.current) window.clearTimeout(pulseTimeout.current);
        pulseTimeout.current = window.setTimeout(() => setPointerPulse(false), 150);
      }
    },
    [segment],
  );

  const spinTo = useCallback(
    (target: number, duration: number, ease: (t: number) => number, onDone?: () => void) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      const start = rotationRef.current;
      const delta = target - start;
      const startTime = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        applyRotation(start + delta * ease(t));
        if (t < 1) {
          frameRef.current = requestAnimationFrame(step);
        } else {
          frameRef.current = null;
          onDone?.();
        }
      };
      frameRef.current = requestAnimationFrame(step);
    },
    [applyRotation],
  );

  const settle = () => setBurst((b) => b + 1);

  // Rotation only ever decreases (a consistent spin direction). Each call
  // walks back to the nearest angle that puts `next` at the pointer, plus
  // `extraTurns` full rotations for a dramatic multi-turn spin.
  const pick = (next: Mood, extraTurns = 0) => {
    const targetIndex = MOODS.findIndex((m) => m.key === next);
    setMood(next);
    const current = rotationRef.current;
    const currentMod = ((current % 360) + 360) % 360;
    const targetMod = (((-targetIndex * segment) % 360) + 360) % 360;
    const stepBack = ((currentMod - targetMod) % 360 + 360) % 360;
    const target = current - stepBack - 360 * extraTurns;

    if (reduce) {
      applyRotation(target);
      settle();
      return;
    }
    spinTo(
      target,
      extraTurns > 0 ? 2200 : 600,
      extraTurns > 0 ? easeSpin : easeOutQuint,
      settle,
    );
  };

  const spin = () => {
    const nextIndex = Math.floor(Math.random() * MOODS.length);
    pick(MOODS[nextIndex].key, 3 + Math.floor(Math.random() * 2));
  };

  const results = useMemo(() => {
    return recipes
      .map((recipe) => {
        let score = recipe.moodTags.includes(mood) ? 3 : 0;
        if (mood === "fiery") score += (recipe.flavor?.spicy ?? 0) / 4;
        if (mood === "fresh") score += (recipe.flavor?.sour ?? 0) / 5;
        if (mood === "indulgent") score += (recipe.flavor?.fat ?? 0) / 4;
        if (mood === "post-gym") score += (recipe.nutrition?.protein ?? 0) / 12;
        if (mood === "quick") {
          const total = (recipe.prepMinutes ?? 0) + (recipe.cookMinutes ?? 0);
          if (total > 0) score += Math.max(0, 3 - total / 20);
        }
        return { recipe, score };
      })
      .filter((x) => x.score > 0.4)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.recipe);
  }, [recipes, mood]);

  const active = MOODS.find((m) => m.key === mood)!;

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:items-center">
        <div className="relative mx-auto aspect-square w-[300px] sm:w-[360px] lg:w-[380px]">
          <motion.div
            aria-hidden
            className="absolute -top-1 left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-8 border-t-[14px] border-x-transparent border-t-ember"
            animate={{ scale: pointerPulse ? 1.35 : 1 }}
            transition={{ duration: 0.15 }}
          />

          <AnimatePresence>
            {burst > 0 && !reduce && (
              <motion.div
                key={burst}
                className="pointer-events-none absolute left-1/2 top-1/2 z-20"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              >
                {SPICE_BURST.map((p, i) => (
                  <motion.span
                    key={i}
                    className="absolute h-1.5 w-1.5 rounded-full"
                    style={{ background: p.color }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4 }}
                    transition={{ duration: 0.65, delay: p.delay, ease: "easeOut" }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.svg
            viewBox="0 0 200 200"
            className="h-full w-full cursor-grab active:cursor-grabbing"
            style={{ transform: `rotate(${rotationDeg}deg)` }}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => {
              if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
              }
            }}
            onDrag={(_, info) => applyRotation(rotationRef.current + info.delta.x)}
            onDragEnd={() => {
              const normalized = ((-rotationRef.current % 360) + 360) % 360;
              const nearest = Math.round(normalized / segment) % MOODS.length;
              pick(MOODS[nearest].key);
            }}
          >
            {MOODS.map((m, index) => {
              const start = (index * segment - 90) * (Math.PI / 180);
              const end = ((index + 1) * segment - 90) * (Math.PI / 180);
              const x1 = 100 + 96 * Math.cos(start);
              const y1 = 100 + 96 * Math.sin(start);
              const x2 = 100 + 96 * Math.cos(end);
              const y2 = 100 + 96 * Math.sin(end);
              const midDeg = index * segment + segment / 2;
              const mid = (midDeg - 90) * (Math.PI / 180);
              const tx = 100 + 62 * Math.cos(mid);
              const ty = 100 + 62 * Math.sin(mid);
              // Keep labels upright: flip 180 on the lower half of the wheel.
              const upsideDown = midDeg > 90 && midDeg < 270;
              return (
                <g key={m.key}>
                  <path
                    d={`M100 100 L${x1} ${y1} A96 96 0 0 1 ${x2} ${y2} Z`}
                    fill={m.color}
                    opacity={m.key === mood ? 0.95 : 0.45}
                    stroke="var(--bg)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={tx}
                    y={ty}
                    fill="hsl(var(--accent-contrast))"
                    fontSize="7.5"
                    fontWeight={m.key === mood ? 700 : 500}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midDeg + (upsideDown ? 180 : 0)} ${tx} ${ty})`}
                  >
                    {m.label}
                  </text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="24" fill="var(--bg)" />
            <circle cx="100" cy="100" r="24" fill="none" stroke="hsl(var(--ink)/0.2)" />
          </motion.svg>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
            Right now I want something
          </p>
          <h2 className="mt-1 font-display text-4xl">{active.label}</h2>
          <p className="mt-2 text-fg-soft">{active.hint}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.key}
                onClick={() => pick(m.key)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  m.key === mood
                    ? "border-ember bg-ember/12 text-ember"
                    : "border-fg/20 text-fg-soft hover:border-fg/40",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <SizzleButton size="sm" onClick={spin}>
              Spin the wheel
            </SizzleButton>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
          {results.length} matches for {active.label.toLowerCase()}
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((recipe, index) => (
            <RecipeCard key={recipe._id} recipe={recipe} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
