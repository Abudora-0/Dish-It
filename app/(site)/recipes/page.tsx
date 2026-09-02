import type { Metadata } from "next";
import { Suspense } from "react";
import { RecipeExplorer } from "@/components/recipe/recipe-explorer";
import { getRecipes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Filter the whole kitchen by cuisine, diet, time, mood, and what is already in your pantry.",
};

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
          The explorer
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">
          Every dish, one filter away
        </h1>
        <p className="mt-3 text-fg-soft">
          The grid re-sorts as you change filters. Add what you already have and
          the list reorders by how much of each recipe you can make right now.
        </p>
      </header>

      <div className="mt-10">
        <Suspense fallback={<p className="text-sm text-fg-faint">Loading the pass...</p>}>
          <RecipeExplorer recipes={recipes} />
        </Suspense>
      </div>
    </div>
  );
}
