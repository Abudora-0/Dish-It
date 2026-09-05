"use client";

import { useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { SizzleButton } from "@/components/ui/sizzle-button";
import {
  FlavorWheel,
  type FlavorWheelHandle,
} from "@/components/discover/flavor-wheel";
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
  const wheelRef = useRef<FlavorWheelHandle>(null);

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
        <FlavorWheel
          ref={wheelRef}
          moods={MOODS}
          activeKey={mood}
          onLand={setMood}
          reduce={!!reduce}
        />

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
                onClick={() => wheelRef.current?.pointAt(m.key)}
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
            <SizzleButton size="sm" onClick={() => wheelRef.current?.spin()}>
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
