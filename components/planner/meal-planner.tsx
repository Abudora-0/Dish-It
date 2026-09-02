"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { FlavorSelect } from "@/components/ui/flavor-select";
import { SizzleButton } from "@/components/ui/sizzle-button";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { usePlanner, PLANNER_DAYS, type PlannerDay } from "@/lib/hooks/use-planner";
import { useShoppingList } from "@/lib/hooks/use-shopping-list";
import { cn, formatMinutes, totalTime } from "@/lib/utils";
import type { Recipe } from "@/lib/types";

export function MealPlanner({ recipes }: { recipes: Recipe[] }) {
  const { plan, assign, move, removeItem, clear, ready } = usePlanner();
  const { addRecipe } = useShoppingList();
  const bySlug = useMemo(
    () => new Map(recipes.map((r) => [r.slug, r])),
    [recipes],
  );
  const [dragging, setDragging] = useState<
    { slug: string; from: PlannerDay | null } | null
  >(null);
  const [target, setTarget] = useState<PlannerDay | null>(null);
  const [addSlug, setAddSlug] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const recipeOptions = recipes.map((r) => ({ value: r.slug, label: r.title }));

  const weekRecipes = useMemo(() => {
    const slugs = new Set<string>();
    PLANNER_DAYS.forEach((day) => plan[day]?.forEach((s) => slugs.add(s)));
    return Array.from(slugs)
      .map((s) => bySlug.get(s))
      .filter(Boolean) as Recipe[];
  }, [plan, bySlug]);

  const sendWeekToList = () => {
    weekRecipes.forEach((recipe) => addRecipe(recipe.title, recipe.ingredients));
    setSent(true);
    window.setTimeout(() => setSent(false), 2200);
  };

  if (!ready) return <p className="text-sm text-fg-faint">Loading your week...</p>;

  return (
    <div>
      <div className="no-print flex flex-wrap items-end gap-3">
        <div className="min-w-[220px] flex-1">
          <FlavorSelect
            label="Quick add"
            placeholder="Pick a recipe"
            options={recipeOptions}
            value={addSlug}
            onChange={setAddSlug}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PLANNER_DAYS.map((day) => (
            <button
              key={day}
              disabled={!addSlug}
              onClick={() => addSlug && assign(day, addSlug)}
              className="rounded-full border border-fg/20 px-2.5 py-1 text-xs text-fg-soft transition-colors hover:border-ember hover:text-ember disabled:opacity-40"
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {PLANNER_DAYS.map((day) => (
          <div
            key={day}
            onDragOver={(event) => {
              event.preventDefault();
              setTarget(day);
            }}
            onDragLeave={() => setTarget((t) => (t === day ? null : t))}
            onDrop={() => {
              if (!dragging) return;
              if (dragging.from && dragging.from !== day) {
                move(dragging.from, day, dragging.slug);
              } else if (!dragging.from) {
                assign(day, dragging.slug);
              }
              setDragging(null);
              setTarget(null);
            }}
            className={cn(
              "min-h-[160px] rounded-2xl border p-3 transition-colors",
              target === day
                ? "border-ember bg-ember/[0.06]"
                : "border-fg/12 bg-bg-raised",
            )}
          >
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-fg-faint">
              {day}
            </p>
            <div className="space-y-2">
              <AnimatePresence>
                {(plan[day] ?? []).map((slug) => {
                  const recipe = bySlug.get(slug);
                  if (!recipe) return null;
                  return (
                    <motion.div
                      key={slug}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      draggable
                      onDragStart={() => setDragging({ slug, from: day })}
                      onDragEnd={() => setDragging(null)}
                      className="group flex cursor-grab items-center gap-2 rounded-xl border border-fg/10 bg-bg p-1.5 active:cursor-grabbing"
                    >
                      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                        <RecipeImage
                          src={recipe.heroImage}
                          alt={recipe.heroAlt}
                          slug={recipe.slug}
                          dishType={recipe.dishType}
                          sizes="40px"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <Link
                          href={`/recipes/${recipe.slug}`}
                          className="block truncate text-xs font-medium hover:text-ember"
                        >
                          {recipe.title}
                        </Link>
                        <span className="font-mono text-[0.62rem] text-fg-faint">
                          {formatMinutes(
                            totalTime(recipe.prepMinutes, recipe.cookMinutes),
                          )}
                        </span>
                      </span>
                      <button
                        onClick={() => removeItem(day, slug)}
                        aria-label={`Remove ${recipe.title} from ${day}`}
                        className="no-print px-1 text-fg-faint opacity-0 transition-opacity hover:text-fg group-hover:opacity-100"
                      >
                        x
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      <div className="no-print mt-6 flex flex-wrap items-center gap-3">
        <SizzleButton
          size="sm"
          onClick={sendWeekToList}
          disabled={weekRecipes.length === 0}
        >
          {sent
            ? "Sent to shopping list"
            : `Build shopping list (${weekRecipes.length})`}
        </SizzleButton>
        {weekRecipes.length > 0 && (
          <SizzleButton size="sm" variant="ghost" onClick={clear}>
            Clear the week
          </SizzleButton>
        )}
      </div>
    </div>
  );
}
