"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { SaveButton } from "@/components/recipe/save-button";
import { useCookbook } from "@/lib/hooks/use-cookbook";
import { useShoppingList } from "@/lib/hooks/use-shopping-list";
import { SizzleButton } from "@/components/ui/sizzle-button";
import { formatTotalTime } from "@/lib/utils";
import type { Recipe } from "@/lib/types";

export function CookbookShelf({ recipes }: { recipes: Recipe[] }) {
  const { saved, ready } = useCookbook();
  const { addRecipe } = useShoppingList();

  if (!ready) {
    return <p className="text-sm text-fg-faint">Opening your cookbook...</p>;
  }

  const list = saved
    .map((slug) => recipes.find((r) => r.slug === slug))
    .filter(Boolean) as Recipe[];

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-fg/20 p-12 text-center">
        <p className="font-display text-2xl">The shelf is empty</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-fg-soft">
          Tap the bowl icon on any recipe to keep it here. Your cookbook lives on
          this device, no account needed.
        </p>
        <Link
          href="/recipes"
          className="mt-5 inline-flex rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-[hsl(var(--accent-contrast))]"
        >
          Find something to save
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-soft">
          <span className="font-mono text-fg">{list.length}</span> saved
        </p>
        <SizzleButton
          size="sm"
          variant="outline"
          onClick={() =>
            list.forEach((recipe) =>
              addRecipe(recipe.title, recipe.ingredients),
            )
          }
        >
          Send all to shopping list
        </SizzleButton>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((recipe, index) => (
          <motion.div
            key={recipe._id}
            initial={{ opacity: 0, rotateY: -12 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            style={{ transformPerspective: 800 }}
            className="card-paper group overflow-hidden"
          >
            <Link
              href={`/recipes/${recipe.slug}`}
              className="relative block aspect-[3/2] overflow-hidden"
            >
              <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                <RecipeImage
                  src={recipe.heroImage}
                  alt={recipe.heroAlt}
                  slug={recipe.slug}
                  dishType={recipe.dishType}
                  sizes="360px"
                />
              </div>
            </Link>
            <div className="flex items-center justify-between gap-2 p-4">
              <div className="min-w-0">
                <h3 className="truncate font-display text-lg">{recipe.title}</h3>
                <p className="font-mono text-xs text-fg-faint">
                  {formatTotalTime(recipe.prepMinutes, recipe.cookMinutes)}
                </p>
              </div>
              <SaveButton slug={recipe.slug} compact />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
