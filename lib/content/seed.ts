import { recipes } from "@/content/seed/recipes";
import { techniques } from "@/content/seed/techniques";
import { drinkComponents } from "@/content/seed/drink-components";
import type { Recipe, Technique, DrinkComponent } from "@/lib/types";

export function seedRecipes(): Recipe[] {
  return [...recipes].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function seedRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
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
