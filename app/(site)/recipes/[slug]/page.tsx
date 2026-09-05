import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { RecipeWorkspace } from "@/components/recipe/recipe-workspace";
import { SaveButton } from "@/components/recipe/save-button";
import { PrintButton } from "@/components/recipe/print-button";
import { RatingPanel } from "@/components/recipe/rating-panel";
import { MacroDonut } from "@/components/viz/macro-donut";
import { FlavorRadar } from "@/components/viz/flavor-radar";
import { DifficultyMeter, DishBadge } from "@/components/ui/badge";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { getRecipe, getRecipes, getTechniques } from "@/lib/content";
import { formatMinutes, totalTime } from "@/lib/utils";
import { siteUrl } from "@/lib/env";

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
  if (!recipe) return { title: "Recipe not found" };
  return {
    title: recipe.title,
    description: recipe.intro,
    openGraph: {
      title: recipe.title,
      description: recipe.intro,
      images: [`/recipes/${recipe.slug}/opengraph-image`],
    },
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [recipe, allRecipes, techniques] = await Promise.all([
    getRecipe(slug),
    getRecipes(),
    getTechniques(),
  ]);

  if (!recipe) notFound();

  const related = allRecipes
    .filter(
      (r) =>
        r.slug !== recipe.slug &&
        (r.dishType === recipe.dishType || r.cuisine === recipe.cuisine),
    )
    .slice(0, 3);

  const total = totalTime(recipe.prepMinutes, recipe.cookMinutes);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.intro,
    recipeCuisine: recipe.cuisine,
    recipeCategory: recipe.category,
    keywords: recipe.dietTags.join(", "),
    ...(total !== undefined ? { totalTime: `PT${total}M` } : {}),
    ...(recipe.prepMinutes != null ? { prepTime: `PT${recipe.prepMinutes}M` } : {}),
    ...(recipe.cookMinutes != null ? { cookTime: `PT${recipe.cookMinutes}M` } : {}),
    recipeYield: `${recipe.servings} servings`,
    author: { "@type": "Organization", name: recipe.author },
    url: `${siteUrl}/recipes/${recipe.slug}`,
    ...(recipe.nutrition
      ? {
          nutrition: {
            "@type": "NutritionInformation",
            calories: `${recipe.nutrition.calories} kcal`,
            proteinContent: `${recipe.nutrition.protein} g`,
            carbohydrateContent: `${recipe.nutrition.carbs} g`,
            fatContent: `${recipe.nutrition.fat} g`,
          },
        }
      : {}),
    recipeIngredient: recipe.ingredients.map((line) =>
      [line.quantity ?? "", line.unit ?? "", line.item].filter(Boolean).join(" "),
    ),
    recipeInstructions: recipe.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step.instruction,
    })),
  };

  return (
    <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="no-print mb-6 text-sm text-fg-faint">
        <Link href="/recipes" className="hover:text-ember">
          Recipes
        </Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{recipe.dishType}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <DishBadge type={recipe.dishType} />
            <span className="chip">{recipe.cuisine}</span>
            <DifficultyMeter level={recipe.difficulty} />
          </div>
          <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            {recipe.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-fg-soft">{recipe.intro}</p>

          {total !== undefined ? (
            <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
              <Fact
                label="Prep"
                value={recipe.prepMinutes != null ? formatMinutes(recipe.prepMinutes) : "-"}
              />
              <Fact
                label="Cook"
                value={recipe.cookMinutes != null ? formatMinutes(recipe.cookMinutes) : "-"}
              />
              <Fact label="Total" value={formatMinutes(total)} />
            </dl>
          ) : null}

          <div className="no-print mt-6 flex flex-wrap gap-3">
            <SaveButton slug={recipe.slug} />
            <PrintButton />
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-fg/10">
          <RecipeImage
            src={recipe.heroImage}
            alt={recipe.heroAlt}
            slug={recipe.slug}
            dishType={recipe.dishType}
            priority
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        </div>
      </div>

      {(recipe.nutrition || recipe.flavor) && (
        <div className="mt-10 grid gap-6 rounded-3xl border border-fg/10 bg-bg-raised p-6 sm:grid-cols-2">
          {recipe.nutrition && (
            <div>
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-fg-faint">
                Per serving
              </p>
              <div className="mt-3">
                <MacroDonut nutrition={recipe.nutrition} />
              </div>
            </div>
          )}
          {recipe.flavor && (
            <div className="flex flex-col items-center">
              <p className="self-start font-mono text-[0.7rem] uppercase tracking-wider text-fg-faint">
                Flavor profile
              </p>
              <FlavorRadar flavor={recipe.flavor} />
            </div>
          )}
        </div>
      )}

      <div className="mt-12">
        <RecipeWorkspace recipe={recipe} techniques={techniques} />
      </div>

      <div className="no-print mt-12">
        <RatingPanel slug={recipe.slug} />
      </div>

      {recipe.source && (
        <p className="mt-8 text-xs text-fg-faint">
          Recipe and photo from{" "}
          <a
            href={recipe.source.url}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-ember"
          >
            {recipe.source.name}
          </a>
          . Times and difficulty are estimated.
        </p>
      )}

      {related.length > 0 && (
        <section className="no-print mt-16">
          <h2 className="font-display text-2xl">More like this</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <RecipeCard key={item._id} recipe={item} index={index} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-fg/10 bg-bg py-3">
      <dd className="font-display text-lg text-fg">{value}</dd>
      <dt className="font-mono text-[0.62rem] uppercase tracking-widest text-fg-faint">
        {label}
      </dt>
    </div>
  );
}
