import type { Metadata } from "next";
import { MealPlanner } from "@/components/planner/meal-planner";
import { getRecipes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Meal planner",
  description:
    "Drag recipes onto a seven day board and generate one shopping list for the whole week.",
};

export default async function PlannerPage() {
  const recipes = await getRecipes();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
          Your kitchen
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">Plan the week</h1>
        <p className="mt-3 text-fg-soft">
          Drag a card between days, or use quick add. When the week looks right,
          turn it into a single shopping list.
        </p>
      </header>
      <div className="mt-10">
        <MealPlanner recipes={recipes} />
      </div>
    </div>
  );
}
