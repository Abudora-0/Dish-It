"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { DishBadge, DifficultyMeter } from "@/components/ui/badge";
import { SaveButton } from "@/components/recipe/save-button";
import { formatMinutes, totalTime } from "@/lib/utils";
import type { Recipe } from "@/lib/types";

export function RecipeCard({
  recipe,
  index = 0,
  priority,
}: {
  recipe: Recipe;
  index?: number;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.3) }}
      className="group card-paper relative flex flex-col overflow-hidden"
    >
      <Link href={`/recipes/${recipe.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.04]">
          <RecipeImage
            src={recipe.heroImage}
            alt={recipe.heroAlt}
            slug={recipe.slug}
            dishType={recipe.dishType}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          />
        </div>
        <div className="absolute left-3 top-3">
          <DishBadge type={recipe.dishType} />
        </div>
      </Link>

      <div className="absolute right-3 top-3 z-10">
        <SaveButton slug={recipe.slug} compact />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-xs text-fg-faint">
          <span className="font-mono uppercase tracking-wider">
            {recipe.cuisine}
          </span>
          <span aria-hidden>/</span>
          <span>{formatMinutes(totalTime(recipe.prepMinutes, recipe.cookMinutes))}</span>
        </div>
        <h3 className="font-display text-xl leading-tight">
          <Link
            href={`/recipes/${recipe.slug}`}
            className="underline-sizzle"
          >
            {recipe.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-fg-soft">{recipe.intro}</p>
        <div className="mt-auto flex items-center justify-between pt-1">
          <DifficultyMeter level={recipe.difficulty} />
          <span className="font-mono text-xs text-fg-faint">
            {recipe.nutrition.calories} kcal
          </span>
        </div>
      </div>
    </motion.article>
  );
}
