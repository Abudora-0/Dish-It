import type { Metadata } from "next";
import { Discovery } from "@/components/discover/discovery";
import { getRecipes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Discover by mood",
  description:
    "Spin the flavor wheel or pick a craving and get a shortlist of dishes, shakes, and drinks that match.",
};

export default async function DiscoverPage() {
  const recipes = await getRecipes();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
          Flavor and mood
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">
          Start with how you want to eat
        </h1>
        <p className="mt-3 text-fg-soft">
          Drag the wheel, tap a craving, or spin it and let the kitchen decide.
        </p>
      </header>
      <div className="mt-10">
        <Discovery recipes={recipes} />
      </div>
    </div>
  );
}
