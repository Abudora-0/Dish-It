"use client";

import { useCallback } from "react";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

export const PLANNER_DAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

export type PlannerDay = (typeof PLANNER_DAYS)[number];

export type Plan = Record<PlannerDay, string[]>;

const emptyPlan: Plan = {
  Mon: [],
  Tue: [],
  Wed: [],
  Thu: [],
  Fri: [],
  Sat: [],
  Sun: [],
};

export function usePlanner() {
  const { value, setValue, ready } = useLocalStorage<Plan>(
    "dishit-planner",
    emptyPlan,
  );

  const assign = useCallback(
    (day: PlannerDay, slug: string) => {
      setValue((prev) => {
        if (prev[day]?.includes(slug)) return prev;
        return { ...prev, [day]: [...(prev[day] ?? []), slug] };
      });
    },
    [setValue],
  );

  const move = useCallback(
    (from: PlannerDay, to: PlannerDay, slug: string) => {
      setValue((prev) => ({
        ...prev,
        [from]: (prev[from] ?? []).filter((s) => s !== slug),
        [to]: (prev[to] ?? []).includes(slug)
          ? prev[to]
          : [...(prev[to] ?? []), slug],
      }));
    },
    [setValue],
  );

  const removeItem = useCallback(
    (day: PlannerDay, slug: string) => {
      setValue((prev) => ({
        ...prev,
        [day]: (prev[day] ?? []).filter((s) => s !== slug),
      }));
    },
    [setValue],
  );

  const clear = useCallback(() => setValue(emptyPlan), [setValue]);

  return { plan: value, assign, move, removeItem, clear, ready };
}
