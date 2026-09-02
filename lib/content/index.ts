import "server-only";
import { isSanityConfigured } from "@/lib/env";
import { sanityClient } from "@/lib/sanity/client";
import {
  allRecipesQuery,
  recipeBySlugQuery,
  allTechniquesQuery,
  drinkComponentsQuery,
} from "@/lib/sanity/queries";
import {
  seedRecipes,
  seedRecipeBySlug,
  seedTechniques,
  seedDrinkComponents,
} from "@/lib/content/seed";
import type { Recipe, Technique, DrinkComponent } from "@/lib/types";

const revalidate = 300;

/*
  One content API for the whole app. When a Sanity project is connected the
  data comes from the CMS, otherwise it falls back to bundled seed data. Pages
  never need to know which source answered.
*/

export async function getRecipes(): Promise<Recipe[]> {
  if (isSanityConfigured && sanityClient) {
    try {
      const data = await sanityClient.fetch<Recipe[]>(
        allRecipesQuery,
        {},
        { next: { revalidate, tags: ["recipe"] } },
      );
      if (data?.length) return data;
    } catch {
      // fall through to seed data
    }
  }
  return seedRecipes();
}

export async function getRecipe(slug: string): Promise<Recipe | undefined> {
  if (isSanityConfigured && sanityClient) {
    try {
      const data = await sanityClient.fetch<Recipe | null>(
        recipeBySlugQuery,
        { slug },
        { next: { revalidate, tags: ["recipe", `recipe:${slug}`] } },
      );
      if (data) return data;
    } catch {
      // fall through to seed data
    }
  }
  return seedRecipeBySlug(slug);
}

export async function getTechniques(): Promise<Technique[]> {
  if (isSanityConfigured && sanityClient) {
    try {
      const data = await sanityClient.fetch<Technique[]>(
        allTechniquesQuery,
        {},
        { next: { revalidate, tags: ["technique"] } },
      );
      if (data?.length) return data;
    } catch {
      // fall through to seed data
    }
  }
  return seedTechniques();
}

export async function getDrinkComponents(): Promise<DrinkComponent[]> {
  if (isSanityConfigured && sanityClient) {
    try {
      const data = await sanityClient.fetch<DrinkComponent[]>(
        drinkComponentsQuery,
        {},
        { next: { revalidate, tags: ["drinkComponent"] } },
      );
      if (data?.length) return data;
    } catch {
      // fall through to seed data
    }
  }
  return seedDrinkComponents();
}
