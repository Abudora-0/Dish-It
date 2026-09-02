"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Stepper } from "@/components/ui/stepper";
import { Segmented } from "@/components/ui/segmented";
import { ChopCheckbox } from "@/components/ui/chop-checkbox";
import { SizzleButton } from "@/components/ui/sizzle-button";
import { TechniqueHint } from "@/components/recipe/technique-hint";
import { useShoppingList } from "@/lib/hooks/use-shopping-list";
import { scaleQuantity, toMetric } from "@/lib/utils";
import type { IngredientLine, Recipe, Technique } from "@/lib/types";

function formatQty(qty: number | null): string {
  if (qty === null) return "";
  if (Number.isInteger(qty)) return String(qty);
  const fractions: Record<number, string> = {
    0.25: "1/4",
    0.5: "1/2",
    0.75: "3/4",
    0.33: "1/3",
    0.67: "2/3",
  };
  const whole = Math.floor(qty);
  const rest = Math.round((qty - whole) * 100) / 100;
  const frac = fractions[rest];
  if (frac) return whole ? `${whole} ${frac}` : frac;
  return String(Math.round(qty * 100) / 100);
}

export function RecipeWorkspace({
  recipe,
  techniques,
}: {
  recipe: Recipe;
  techniques: Technique[];
}) {
  const [servings, setServings] = useState(recipe.servings);
  const [units, setUnits] = useState<"original" | "metric">("original");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const { addRecipe } = useShoppingList();
  const [added, setAdded] = useState(false);

  const techniqueMap = useMemo(() => {
    const map = new Map<string, Technique>();
    techniques.forEach((t) => map.set(t.slug, t));
    return map;
  }, [techniques]);

  const groups = useMemo(() => {
    const byGroup = new Map<string, IngredientLine[]>();
    recipe.ingredients.forEach((line) => {
      const key = line.group ?? "";
      if (!byGroup.has(key)) byGroup.set(key, []);
      byGroup.get(key)!.push(line);
    });
    return Array.from(byGroup.entries());
  }, [recipe.ingredients]);

  const scaledLines = useMemo(
    () =>
      recipe.ingredients.map((line) => {
        const scaled = scaleQuantity(line.quantity, recipe.servings, servings);
        const converted =
          units === "metric"
            ? toMetric(scaled, line.unit)
            : { quantity: scaled, unit: line.unit };
        return { ...line, ...converted };
      }),
    [recipe.ingredients, recipe.servings, servings, units],
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="card-paper p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-fg-faint">
                Servings
              </p>
              <Stepper
                value={servings}
                min={1}
                max={24}
                onChange={setServings}
                label="servings"
              />
            </div>
            <Segmented
              label="Units"
              value={units}
              onChange={setUnits}
              options={[
                { value: "original", label: "Original" },
                { value: "metric", label: "Metric" },
              ]}
            />
          </div>

          <div className="mt-5 space-y-4">
            {groups.map(([group, lines]) => (
              <div key={group || "main"}>
                {group && (
                  <p className="mb-1 font-mono text-[0.7rem] uppercase tracking-wider text-ember">
                    {group}
                  </p>
                )}
                <ul>
                  {lines.map((line) => {
                    const index = recipe.ingredients.indexOf(line);
                    const scaled = scaledLines[index];
                    const label = [
                      formatQty(scaled.quantity),
                      scaled.unit ?? "",
                      line.item,
                    ]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <li key={`${line.item}-${index}`}>
                        <ChopCheckbox
                          checked={!!checked[label]}
                          onChange={(next) =>
                            setChecked((prev) => ({ ...prev, [label]: next }))
                          }
                          label={label}
                          sublabel={line.note}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-fg/10 pt-4">
            <SizzleButton
              size="sm"
              onClick={() => {
                addRecipe(recipe.title, recipe.ingredients);
                setAdded(true);
                window.setTimeout(() => setAdded(false), 2200);
              }}
            >
              {added ? "Added to list" : "Add to shopping list"}
            </SizzleButton>
            <Link
              href={`/recipes/${recipe.slug}/cook`}
              className="inline-flex items-center rounded-full border border-fg/20 px-4 py-2 text-sm font-medium text-fg-soft transition-colors hover:border-ember hover:text-ember"
            >
              Start cook mode
            </Link>
          </div>

          {recipe.equipment.length > 0 && (
            <div className="mt-4">
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-fg-faint">
                Equipment
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {recipe.equipment.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      <div>
        <ol className="space-y-5">
          {recipe.steps.map((step, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className="card-paper flex gap-4 p-5"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ember/12 font-mono text-sm font-bold text-ember">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="leading-relaxed text-fg">{step.instruction}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  {step.durationMinutes ? (
                    <span className="chip">{step.durationMinutes} min</span>
                  ) : null}
                  {step.technique && techniqueMap.has(step.technique) && (
                    <TechniqueHint technique={techniqueMap.get(step.technique)!} />
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </ol>

        {recipe.tips.length > 0 && (
          <div className="mt-8 rounded-2xl border border-basil/30 bg-basil/[0.07] p-5">
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-basil">
              From the kitchen
            </p>
            <ul className="mt-2 space-y-2 text-sm text-fg-soft">
              {recipe.tips.map((tip, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-basil" aria-hidden>
                    -
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
