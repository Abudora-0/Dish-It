import Link from "next/link";
import { SizzleHero } from "@/components/home/sizzle-hero";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { Reveal } from "@/components/ui/reveal";
import { SizzleLink } from "@/components/ui/sizzle-button";
import { TonightPick } from "@/components/home/tonight-pick";
import { getRecipes } from "@/lib/content";
import { NAV_LINKS } from "@/components/site/nav-data";

const FEATURE_CARDS = [
  {
    href: "/recipes",
    title: "Smart recipe explorer",
    body: "Filter by cuisine, diet, time, and what is already in your pantry. The grid re-sorts as you go.",
    tone: "bg-ember/10 text-ember",
  },
  {
    href: "/recipes/weeknight-butter-chicken/cook",
    title: "Interactive cook mode",
    body: "One step at a time, full screen, with real timers that keep running while you chop.",
    tone: "bg-basil/10 text-basil",
  },
  {
    href: "/discover",
    title: "Flavor and mood wheel",
    body: "Spin the wheel or tap a craving and get a shortlist that matches how you want to eat.",
    tone: "bg-saffron/15 text-saffron",
  },
  {
    href: "/mixer",
    title: "Shake and drink mixer",
    body: "Drop parts into the glass and watch it fill. Live nutrition, a flavor radar, and a shareable link.",
    tone: "bg-blueberry/10 text-blueberry",
  },
];

export default async function HomePage() {
  const recipes = await getRecipes();
  const cuisines = new Set(recipes.map((r) => r.cuisine));
  const featured = recipes.filter((r) => r.featured).slice(0, 6);
  const grid = featured.length >= 3 ? featured : recipes.slice(0, 6);

  return (
    <>
      <SizzleHero recipeCount={recipes.length} cuisineCount={cuisines.size} />

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <TonightPick recipes={recipes} />
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
              Off the pass
            </p>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl">
              Fresh from the kitchen
            </h2>
          </div>
          <SizzleLink href="/recipes" variant="ghost" className="hidden sm:inline-flex">
            All recipes
          </SizzleLink>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((recipe, index) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              index={index}
              priority={index < 3}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
            Four ways in
          </p>
          <h2 className="mt-1 font-display text-3xl sm:text-4xl">
            The kitchen is fully wired
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {FEATURE_CARDS.map((card, index) => (
            <Reveal key={card.href} delay={index * 0.05}>
              <Link
                href={card.href}
                className="card-paper group flex h-full flex-col gap-3 p-6 transition-transform hover:-translate-y-1"
              >
                <span
                  className={`inline-flex w-fit rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wider ${card.tone}`}
                >
                  0{index + 1}
                </span>
                <h3 className="font-display text-2xl">{card.title}</h3>
                <p className="text-sm text-fg-soft">{card.body}</p>
                <span className="mt-auto pt-2 text-sm font-medium text-ember">
                  Open
                  <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                    {">"}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="card-paper flex flex-wrap items-center justify-between gap-6 p-8">
          <div>
            <h2 className="font-display text-2xl">Keep going</h2>
            <p className="mt-1 text-sm text-fg-soft">
              Every page carries the same toolkit. Jump to any part of the
              kitchen.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="chip hover:border-ember hover:text-ember"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
