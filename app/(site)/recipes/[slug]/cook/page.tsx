import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CookMode } from "@/components/cook/cook-mode";
import { getRecipe, getRecipes } from "@/lib/content";

export async function generateStaticParams() {
  const recipes = await getRecipes();
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  return {
    title: recipe ? `Cook ${recipe.title}` : "Cook mode",
    robots: { index: false },
  };
}

export default async function CookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);
  if (!recipe) notFound();
  return <CookMode recipe={recipe} />;
}
