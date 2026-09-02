import type { MetadataRoute } from "next";
import { getRecipes } from "@/lib/content";
import { siteUrl } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await getRecipes();
  const staticRoutes = [
    "",
    "/recipes",
    "/discover",
    "/mixer",
    "/planner",
    "/techniques",
    "/cookbooks",
    "/shopping-list",
    "/about",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const recipeRoutes = recipes.map((recipe) => ({
    url: `${siteUrl}/recipes/${recipe.slug}`,
    lastModified: new Date(recipe.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...recipeRoutes];
}
