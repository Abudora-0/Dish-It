"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Glass, type Band } from "@/components/mixer/glass";
import { FlavorRadar } from "@/components/viz/flavor-radar";
import { SizzleButton } from "@/components/ui/sizzle-button";
import { Segmented } from "@/components/ui/segmented";
import type {
  DrinkComponent,
  DrinkComponentKind,
  FlavorProfile,
  Nutrition,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const KIND_ORDER: DrinkComponentKind[] = [
  "base",
  "fruit",
  "green",
  "booster",
  "sweetener",
  "spice",
  "ice",
];

const KIND_LABEL: Record<DrinkComponentKind, string> = {
  base: "Base",
  fruit: "Fruit",
  green: "Greens",
  booster: "Boosters",
  sweetener: "Sweeteners",
  spice: "Spice",
  ice: "Ice",
};

const MAX_MEASURES = 9;
const emptyNutrition: Nutrition = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  sugar: 0,
  fiber: 0,
};

type Pick = { id: string; count: number };

function encode(picks: Pick[], name: string): string {
  return btoa(
    JSON.stringify({ p: picks.map((x) => [x.id, x.count]), n: name }),
  );
}

function decode(value: string): { picks: Pick[]; name: string } {
  try {
    const parsed = JSON.parse(atob(value)) as {
      p: [string, number][];
      n?: string;
    };
    return {
      picks: parsed.p.map(([id, count]) => ({ id, count })),
      name: parsed.n ?? "",
    };
  } catch {
    return { picks: [], name: "" };
  }
}

export function Mixer({ components }: { components: DrinkComponent[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const byId = useMemo(
    () => new Map(components.map((c) => [c.id, c])),
    [components],
  );

  const [picks, setPicks] = useState<Pick[]>([]);
  const [name, setName] = useState("");
  const [view, setView] = useState<"layered" | "blended">("layered");
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const mix = params.get("mix");
    if (mix) {
      const { picks: p, name: n } = decode(mix);
      setPicks(p.filter((x) => byId.has(x.id)));
      setName(n);
    }
    setHydrated(true);
  }, [params, byId]);

  useEffect(() => {
    if (!hydrated) return;
    const qs = picks.length ? `?mix=${encode(picks, name)}` : "";
    router.replace(`/mixer${qs}`, { scroll: false });
  }, [picks, name, hydrated, router]);

  const totalMeasures = picks.reduce((sum, p) => sum + p.count, 0);

  const change = useCallback(
    (id: string, delta: number) => {
      setPicks((prev) => {
        const current = prev.find((p) => p.id === id);
        const nextCount = (current?.count ?? 0) + delta;
        if (nextCount <= 0) return prev.filter((p) => p.id !== id);
        if (
          delta > 0 &&
          prev.reduce((s, p) => s + p.count, 0) >= MAX_MEASURES
        )
          return prev;
        if (current) {
          return prev.map((p) =>
            p.id === id ? { ...p, count: nextCount } : p,
          );
        }
        return [...prev, { id, count: 1 }];
      });
    },
    [],
  );

  const bands: Band[] = picks
    .map((pick) => {
      const component = byId.get(pick.id);
      if (!component) return null;
      return {
        id: pick.id,
        color: component.color,
        label: component.name,
        portion: pick.count / Math.max(1, totalMeasures),
      };
    })
    .filter(Boolean) as Band[];

  const nutrition = picks.reduce<Nutrition>((acc, pick) => {
    const component = byId.get(pick.id);
    if (!component) return acc;
    const n = component.perServing;
    return {
      calories: acc.calories + n.calories * pick.count,
      protein: acc.protein + n.protein * pick.count,
      carbs: acc.carbs + n.carbs * pick.count,
      fat: acc.fat + n.fat * pick.count,
      sugar: (acc.sugar ?? 0) + (n.sugar ?? 0) * pick.count,
      fiber: (acc.fiber ?? 0) + (n.fiber ?? 0) * pick.count,
    };
  }, { ...emptyNutrition });

  const flavor = useMemo<Partial<FlavorProfile>>(() => {
    const totals: Record<string, number> = {};
    let weight = 0;
    picks.forEach((pick) => {
      const component = byId.get(pick.id);
      if (!component) return;
      weight += pick.count;
      Object.entries(component.flavor).forEach(([key, val]) => {
        totals[key] = (totals[key] ?? 0) + (val ?? 0) * pick.count;
      });
    });
    if (!weight) return {};
    return Object.fromEntries(
      Object.entries(totals).map(([key, val]) => [key, val / weight]),
    );
  }, [picks, byId]);

  const share = async () => {
    const url = `${window.location.origin}/mixer?mix=${encode(picks, name)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked
    }
  };

  const grouped = KIND_ORDER.map((kind) => ({
    kind,
    items: components.filter((c) => c.kind === kind),
  })).filter((group) => group.items.length);

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
      <div className="lg:sticky lg:top-24">
        <div className="card-paper p-5">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name your drink"
            className="w-full bg-transparent font-display text-xl outline-none placeholder:text-fg-faint"
            aria-label="Drink name"
          />
          <div className="mx-auto mt-3 aspect-[3/4] w-52">
            <Glass
              bands={bands}
              blended={view === "blended"}
              fillRatio={Math.min(1, totalMeasures / MAX_MEASURES)}
            />
          </div>

          <div className="mt-3 flex justify-center">
            <Segmented
              label="View"
              value={view}
              onChange={setView}
              options={[
                { value: "layered", label: "Layered" },
                { value: "blended", label: "Blended" },
              ]}
            />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-2 text-center min-[420px]:grid-cols-4">
            <Metric label="kcal" value={Math.round(nutrition.calories)} />
            <Metric label="protein" value={Math.round(nutrition.protein)} />
            <Metric label="carbs" value={Math.round(nutrition.carbs)} />
            <Metric label="fat" value={Math.round(nutrition.fat)} />
          </dl>

          <div className="mt-4 flex justify-center">
            <FlavorRadar flavor={flavor} size={190} />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <SizzleButton
              size="sm"
              onClick={share}
              disabled={!picks.length}
            >
              {copied ? "Link copied" : "Share this mix"}
            </SizzleButton>
            <button
              onClick={() => window.print()}
              className="rounded-full border border-fg/20 px-3 py-1.5 text-sm text-fg-soft hover:border-ember hover:text-ember"
            >
              Print card
            </button>
            {picks.length > 0 && (
              <button
                onClick={() => {
                  setPicks([]);
                  setName("");
                }}
                className="rounded-full px-3 py-1.5 text-sm text-fg-faint hover:text-fg"
              >
                Empty glass
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {grouped.map((group) => (
          <section key={group.kind}>
            <h2 className="font-mono text-xs uppercase tracking-widest text-fg-faint">
              {KIND_LABEL[group.kind]}
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {group.items.map((component) => {
                const pick = picks.find((p) => p.id === component.id);
                return (
                  <motion.div
                    key={component.id}
                    layout
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors",
                      pick ? "border-ember/50 bg-ember/[0.06]" : "border-fg/12",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="h-6 w-6 shrink-0 rounded-full border border-black/10"
                        style={{ background: component.color }}
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-fg">
                          {component.name}
                        </p>
                        <p className="truncate text-xs text-fg-faint">
                          {component.note}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {pick && (
                        <>
                          <button
                            onClick={() => change(component.id, -1)}
                            aria-label={`Less ${component.name}`}
                            className="grid h-7 w-7 place-items-center rounded-full border border-fg/20 text-fg-soft hover:border-ember"
                          >
                            -
                          </button>
                          <span className="w-4 text-center font-mono text-sm">
                            {pick.count}
                          </span>
                        </>
                      )}
                      <button
                        onClick={() => change(component.id, 1)}
                        aria-label={`More ${component.name}`}
                        className="grid h-7 w-7 place-items-center rounded-full border border-fg/20 text-fg-soft hover:border-ember"
                      >
                        +
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-fg/10 bg-bg py-2">
      <dd className="font-mono text-sm font-semibold text-fg tabular-nums">
        {value}
      </dd>
      <dt className="font-mono text-[0.58rem] uppercase tracking-wider text-fg-faint">
        {label}
      </dt>
    </div>
  );
}
