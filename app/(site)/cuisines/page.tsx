import type { Metadata } from "next";
import Link from "next/link";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { Reveal } from "@/components/ui/reveal";
import { getRecipes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cuisines",
  description:
    "Browse every recipe by country and cuisine. Pick a kitchen and the explorer opens filtered to it.",
};

export default async function CuisinesPage() {
  const recipes = await getRecipes();

  const byCuisine = new Map<string, typeof recipes>();
  for (const recipe of recipes) {
    if (!byCuisine.has(recipe.cuisine)) byCuisine.set(recipe.cuisine, []);
    byCuisine.get(recipe.cuisine)!.push(recipe);
  }

  const cuisines = Array.from(byCuisine.entries())
    .map(([name, list]) => ({
      name,
      count: list.length,
      hero: list.find((r) => r.heroImage) ?? list[0],
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
          Around the world
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">
          Browse by cuisine
        </h1>
        <p className="mt-3 text-fg-soft">
          {cuisines.length} kitchens, {recipes.length} recipes. Pick a country
          and the explorer opens filtered to it.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cuisines.map((cuisine, index) => (
          <Reveal key={cuisine.name} delay={Math.min(index * 0.03, 0.3)}>
            <Link
              href={`/recipes?cuisine=${encodeURIComponent(cuisine.name)}`}
              className="card-paper group block overflow-hidden"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                  <RecipeImage
                    src={cuisine.hero.heroImage}
                    alt={cuisine.hero.heroAlt}
                    slug={cuisine.hero.slug}
                    dishType={cuisine.hero.dishType}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <p className="font-display text-2xl text-white">
                    {cuisine.name}
                  </p>
                  <p className="font-mono text-xs text-white/80">
                    {cuisine.count} {cuisine.count === 1 ? "recipe" : "recipes"}
                  </p>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
