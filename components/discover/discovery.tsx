"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";
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

export function Discovery({ recipes }: { recipes: Recipe[] }) {
  const reduce = useReducedMotion();
  const [mood, setMood] = useState<Mood>("cozy");
  const rotation = useMotionValue(0);
  const wheelRef = useRef<SVGSVGElement>(null);
  const segment = 360 / MOODS.length;

  const pick = (next: Mood) => {
    const targetIndex = MOODS.findIndex((m) => m.key === next);
    setMood(next);
    if (!reduce) rotation.set(-targetIndex * segment);
  };

  const spin = () => {
    const nextIndex = Math.floor(Math.random() * MOODS.length);
    pick(MOODS[nextIndex].key);
    if (!reduce) {
      rotation.set(rotation.get() - 360 * 2 - nextIndex * segment);
    }
  };

  const results = useMemo(() => {
    return recipes
      .map((recipe) => {
        let score = recipe.moodTags.includes(mood) ? 3 : 0;
        if (mood === "fiery") score += (recipe.flavor.spicy ?? 0) / 4;
        if (mood === "fresh") score += (recipe.flavor.sour ?? 0) / 5;
        if (mood === "indulgent") score += (recipe.flavor.fat ?? 0) / 4;
        if (mood === "post-gym") score += recipe.nutrition.protein / 12;
        if (mood === "quick")
          score += Math.max(0, 3 - (recipe.prepMinutes + recipe.cookMinutes) / 20);
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
      <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:items-center">
        <div className="relative mx-auto aspect-square w-[300px] sm:w-[340px]">
          <div
            aria-hidden
            className="absolute -top-1 left-1/2 z-10 h-0 w-0 -translate-x-1/2 border-x-8 border-t-[14px] border-x-transparent border-t-ember"
          />
          <motion.svg
            ref={wheelRef}
            viewBox="0 0 200 200"
            className="h-full w-full cursor-grab active:cursor-grabbing"
            style={{ rotate: rotation }}
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDrag={(_, info) => rotation.set(rotation.get() + info.delta.x)}
            onDragEnd={() => {
              const normalized =
                ((-rotation.get() % 360) + 360) % 360;
              const nearest = Math.round(normalized / segment) % MOODS.length;
              pick(MOODS[nearest].key);
            }}
            transition={{ type: "spring", stiffness: 60, damping: 14 }}
          >
            {MOODS.map((m, index) => {
              const start = (index * segment - 90) * (Math.PI / 180);
              const end = ((index + 1) * segment - 90) * (Math.PI / 180);
              const x1 = 100 + 96 * Math.cos(start);
              const y1 = 100 + 96 * Math.sin(start);
              const x2 = 100 + 96 * Math.cos(end);
              const y2 = 100 + 96 * Math.sin(end);
              const mid = (index * segment + segment / 2 - 90) * (Math.PI / 180);
              const tx = 100 + 62 * Math.cos(mid);
              const ty = 100 + 62 * Math.sin(mid);
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
                    fontSize="7"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${index * segment + segment / 2} ${tx} ${ty})`}
                  >
                    {m.label}
                  </text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="22" fill="var(--bg)" />
            <circle cx="100" cy="100" r="22" fill="none" stroke="hsl(var(--ink)/0.2)" />
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
