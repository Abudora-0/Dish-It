import { recipes } from "@/content/seed/recipes";
import { importedRecipes } from "@/content/seed/imported-recipes";
import { techniques } from "@/content/seed/techniques";
import { drinkComponents } from "@/content/seed/drink-components";
import type { Recipe, Technique, DrinkComponent } from "@/lib/types";

// Hand written recipes first, then the imported batch. Slugs from the importer
// are already de-duplicated against each other; a clash with a hand written
// slug keeps the hand written one.
const allRecipes: Recipe[] = [
  ...recipes,
  ...importedRecipes.filter(
    (imported) => !recipes.some((r) => r.slug === imported.slug),
  ),
];

export function seedRecipes(): Recipe[] {
  return [...allRecipes].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export function seedRecipeBySlug(slug: string): Recipe | undefined {
  return allRecipes.find((r) => r.slug === slug);
}

export function seedTechniques(): Technique[] {
  return [...techniques].sort((a, b) => a.name.localeCompare(b.name));
}

export function seedTechniqueBySlug(slug: string): Technique | undefined {
  return techniques.find((t) => t.slug === slug);
}

export function seedDrinkComponents(): DrinkComponent[] {
  return drinkComponents;
}
