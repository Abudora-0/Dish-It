"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { BurnerTabs } from "@/components/ui/burner-tabs";
import { FlavorSelect } from "@/components/ui/flavor-select";
import { PantryMatch } from "@/components/recipe/pantry-match";
import { SizzleButton } from "@/components/ui/sizzle-button";
import { totalTime } from "@/lib/utils";
import type { DishType, Recipe } from "@/lib/types";

const DISH_TABS = [
  { value: "all", label: "Everything" },
  { value: "food", label: "Food" },
  { value: "shake", label: "Shakes" },
  { value: "drink", label: "Drinks" },
  { value: "dessert", label: "Dessert" },
];

const SORTS = [
  { value: "new", label: "Newest first" },
  { value: "fast", label: "Quickest first" },
  { value: "easy", label: "Easiest first" },
  { value: "light", label: "Fewest calories" },
];

const TIME_OPTIONS = [
  { value: "15", label: "Under 15 min" },
  { value: "30", label: "Under 30 min" },
  { value: "45", label: "Under 45 min" },
  { value: "60", label: "Under 1 hour" },
];

export function RecipeExplorer({ recipes }: { recipes: Recipe[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const [dish, setDish] = useState(params.get("dish") ?? "all");
  const [cuisine, setCuisine] = useState<string | null>(params.get("cuisine"));
  const [diet, setDiet] = useState<string | null>(params.get("diet"));
  const [mood, setMood] = useState<string | null>(params.get("mood"));
  const [maxTime, setMaxTime] = useState<string | null>(params.get("time"));
  const [sort, setSort] = useState(params.get("sort") ?? "new");
  const [pantry, setPantry] = useState<string[]>(
    params.get("pantry")?.split(",").filter(Boolean) ?? [],
  );

  const cuisineOptions = useMemo(
    () =>
      Array.from(new Set(recipes.map((r) => r.cuisine)))
        .sort()
        .map((c) => ({ value: c, label: c })),
    [recipes],
  );

  const dietOptions = useMemo(
    () =>
      Array.from(new Set(recipes.flatMap((r) => r.dietTags)))
        .sort()
        .map((d) => ({ value: d, label: d.replace(/-/g, " ") })),
    [recipes],
  );

  const moodOptions = useMemo(
    () =>
      Array.from(new Set(recipes.flatMap((r) => r.moodTags)))
        .sort()
        .map((m) => ({ value: m, label: m.replace(/-/g, " ") })),
    [recipes],
  );

  const firstRun = useRef(true);
  useEffect(() => {
    // State is seeded from the URL, so the first pass has nothing to write.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const next = new URLSearchParams();
    if (dish !== "all") next.set("dish", dish);
    if (cuisine) next.set("cuisine", cuisine);
    if (diet) next.set("diet", diet);
    if (mood) next.set("mood", mood);
    if (maxTime) next.set("time", maxTime);
    if (sort !== "new") next.set("sort", sort);
    if (pantry.length) next.set("pantry", pantry.join(","));
    const qs = next.toString();
    router.replace(qs ? `/recipes?${qs}` : "/recipes", { scroll: false });
  }, [dish, cuisine, diet, mood, maxTime, sort, pantry, router]);

  const matchScore = useCallback(
    (recipe: Recipe) => {
      if (!pantry.length) return 1;
      const have = pantry.map((p) => p.toLowerCase().trim());
      const hits = recipe.ingredients.filter((line) =>
        have.some((h) => line.item.toLowerCase().includes(h)),
      ).length;
      const needed = recipe.ingredients.filter((line) => !line.pantry).length || 1;
      return Math.min(1, hits / Math.min(needed, 6));
    },
    [pantry],
  );

  const results = useMemo(() => {
    let list = recipes.filter((recipe) => {
      if (dish !== "all" && recipe.dishType !== (dish as DishType)) return false;
      if (cuisine && recipe.cuisine !== cuisine) return false;
      if (diet && !recipe.dietTags.includes(diet)) return false;
      if (mood && !recipe.moodTags.includes(mood as never)) return false;
      if (maxTime) {
        const total = totalTime(recipe.prepMinutes, recipe.cookMinutes);
        // Recipes without a stated time are left out of a "max time" filter.
        if (total === undefined || total > Number(maxTime)) return false;
      }
      return true;
    });

    if (pantry.length) {
      list = list
        .map((r) => ({ r, s: matchScore(r) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.r);
    } else {
      list = [...list].sort((a, b) => {
        if (sort === "fast") {
          // Untimed recipes sort last.
          const ta = totalTime(a.prepMinutes, a.cookMinutes) ?? Infinity;
          const tb = totalTime(b.prepMinutes, b.cookMinutes) ?? Infinity;
          return ta - tb;
        }
        if (sort === "easy") {
          const rank = { easy: 0, medium: 1, hard: 2 };
          return rank[a.difficulty] - rank[b.difficulty];
        }
        if (sort === "light")
          return (a.nutrition?.calories ?? Infinity) - (b.nutrition?.calories ?? Infinity);
        return b.publishedAt.localeCompare(a.publishedAt);
      });
    }
    return list;
  }, [recipes, dish, cuisine, diet, mood, maxTime, sort, pantry, matchScore]);

  const PAGE = 24;
  const [visible, setVisible] = useState(PAGE);

  // Reset the page size whenever the result set changes, during render rather
  // than in an effect so there is no frame showing the old count.
  const filterKey = `${dish}|${cuisine}|${diet}|${mood}|${maxTime}|${sort}|${pantry.join(",")}`;
  const [prevKey, setPrevKey] = useState(filterKey);
  if (filterKey !== prevKey) {
    setPrevKey(filterKey);
    setVisible(PAGE);
  }

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible((v) => v + PAGE);
      },
      { rootMargin: "600px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, results.length]);

  const activeFilters =
    (dish !== "all" ? 1 : 0) +
    (cuisine ? 1 : 0) +
    (diet ? 1 : 0) +
    (mood ? 1 : 0) +
    (maxTime ? 1 : 0) +
    pantry.length;

  const reset = () => {
    setDish("all");
    setCuisine(null);
    setDiet(null);
    setMood(null);
    setMaxTime(null);
    setSort("new");
    setPantry([]);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <BurnerTabs
          tabs={DISH_TABS.map((tab) => ({
            ...tab,
            count:
              tab.value === "all"
                ? recipes.length
                : recipes.filter((r) => r.dishType === tab.value).length,
          }))}
          value={dish}
          onChange={setDish}
          idBase="dish"
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <FlavorSelect
          label="Cuisine"
          options={cuisineOptions}
          value={cuisine}
          onChange={setCuisine}
        />
        <FlavorSelect
          label="Diet"
          options={dietOptions}
          value={diet}
          onChange={setDiet}
        />
        <FlavorSelect
          label="Mood"
          options={moodOptions}
          value={mood}
          onChange={setMood}
        />
        <FlavorSelect
          label="Max time"
          options={TIME_OPTIONS}
          value={maxTime}
          onChange={setMaxTime}
        />
      </div>

      <div className="mt-3">
        <PantryMatch value={pantry} onChange={setPantry} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-fg/10 pt-4">
        <p className="text-sm text-fg-soft">
          <span className="font-mono text-fg">{results.length}</span> of{" "}
          {recipes.length}
          {pantry.length > 0 && " sorted by pantry match"}
        </p>
        <div className="flex items-center gap-3">
          {activeFilters > 0 && (
            <SizzleButton variant="ghost" size="sm" onClick={reset}>
              Clear {activeFilters}
            </SizzleButton>
          )}
          {pantry.length === 0 && (
            <FlavorSelect
              label="Sort"
              options={SORTS}
              value={sort}
              onChange={(v) => setSort(v ?? "new")}
              className="min-w-[190px]"
            />
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {results.slice(0, visible).map((recipe, index) => (
          <div key={recipe._id} className="relative">
            {pantry.length > 0 && (
              <span className="absolute -top-2 left-3 z-20 rounded-full bg-fg px-2 py-0.5 font-mono text-[0.65rem] text-bg">
                {Math.round(matchScore(recipe) * 100)}% match
              </span>
            )}
            <RecipeCard recipe={recipe} index={index % PAGE} />
          </div>
        ))}
      </div>

      {visible < results.length && (
        <div ref={sentinelRef} className="mt-8 flex justify-center">
          <SizzleButton
            variant="ghost"
            size="sm"
            onClick={() => setVisible((v) => v + PAGE)}
          >
            Show more ({results.length - visible} left)
          </SizzleButton>
        </div>
      )}

      {results.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-fg/20 p-10 text-center">
          <p className="font-display text-xl">Nothing matches yet</p>
          <p className="mt-1 text-sm text-fg-soft">
            Loosen a filter or clear the pantry list.
          </p>
          <SizzleButton className="mt-4" size="sm" onClick={reset}>
            Reset filters
          </SizzleButton>
        </div>
      )}
    </div>
  );
}
