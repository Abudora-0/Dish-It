"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { SizzleButton } from "@/components/ui/sizzle-button";
import { DifficultyMeter, DishBadge } from "@/components/ui/badge";
import { formatMinutes, slugHash, totalTime } from "@/lib/utils";
import type { Recipe } from "@/lib/types";

/*
  A spin the wheel style pick. Rotates a plate and lands on a new recipe.
*/
export function TonightPick({ recipes }: { recipes: Recipe[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(() =>
    recipes.length ? slugHash("tonight") % recipes.length : 0,
  );
  const [spin, setSpin] = useState(0);
  const recipe = recipes[index];

  if (!recipe) return null;

  const shuffle = () => {
    let next = index;
    while (next === index && recipes.length > 1) {
      next = Math.floor(Math.random() * recipes.length);
    }
    setIndex(next);
    setSpin((s) => s + 360 + Math.round(Math.random() * 360));
  };

  return (
    <div className="card-paper grid gap-6 overflow-hidden p-5 sm:p-6 md:grid-cols-[220px_1fr] md:items-center">
      <motion.div
        className="relative mx-auto aspect-square w-40 overflow-hidden rounded-full border-4 border-bg shadow-inner sm:w-52"
        animate={{ rotate: reduce ? 0 : spin }}
        transition={{ type: "spring", stiffness: 40, damping: 12 }}
      >
        <RecipeImage
          src={recipe.heroImage}
          alt={recipe.heroAlt}
          slug={recipe.slug}
          dishType={recipe.dishType}
          sizes="220px"
        />
      </motion.div>

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
          Tonight, maybe
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={recipe._id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="mt-1 font-display text-2xl sm:text-3xl">
              {recipe.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-fg-soft">
              <DishBadge type={recipe.dishType} />
              <span>{formatMinutes(totalTime(recipe.prepMinutes, recipe.cookMinutes))}</span>
              <DifficultyMeter level={recipe.difficulty} />
            </div>
            <p className="mt-3 max-w-lg text-sm text-fg-soft">{recipe.intro}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-5 flex flex-wrap gap-3">
          <SizzleButton onClick={shuffle} variant="outline" size="sm">
            Spin again
          </SizzleButton>
          <Link
            href={`/recipes/${recipe.slug}`}
            className="inline-flex items-center rounded-full bg-fg px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Open recipe
          </Link>
        </div>
      </div>
    </div>
  );
}
