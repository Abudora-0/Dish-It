import type { Metadata } from "next";
import { CookbookShelf } from "@/components/cookbook/cookbook-shelf";
import { getRecipes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Your cookbook",
  description: "The recipes you saved, kept on this device.",
};

export default async function CookbooksPage() {
  const recipes = await getRecipes();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
          Your kitchen
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">Your cookbook</h1>
        <p className="mt-3 text-fg-soft">
          Everything you saved, on a shelf. Stored locally, so it is yours alone.
        </p>
      </header>
      <div className="mt-10">
        <CookbookShelf recipes={recipes} />
      </div>
    </div>
  );
}
