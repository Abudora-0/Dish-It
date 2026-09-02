"use client";

import { useCallback } from "react";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import type { IngredientLine } from "@/lib/types";

export type ShoppingItem = {
  id: string;
  label: string;
  from: string;
  checked: boolean;
};

function lineToLabel(line: IngredientLine): string {
  return [line.quantity ?? "", line.unit ?? "", line.item]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function useShoppingList() {
  const { value, setValue, ready } = useLocalStorage<ShoppingItem[]>(
    "dishit-shopping",
    [],
  );

  const addRecipe = useCallback(
    (recipeTitle: string, lines: IngredientLine[]) => {
      setValue((prev) => {
        const existing = new Set(prev.map((i) => i.label.toLowerCase()));
        const next = lines
          .map((line) => lineToLabel(line))
          .filter((label) => label && !existing.has(label.toLowerCase()))
          .map((label) => ({
            id: `${recipeTitle}-${label}-${Math.random().toString(36).slice(2, 7)}`,
            label,
            from: recipeTitle,
            checked: false,
          }));
        return [...prev, ...next];
      });
    },
    [setValue],
  );

  const toggle = useCallback(
    (id: string) => {
      setValue((prev) =>
        prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
      );
    },
    [setValue],
  );

  const remove = useCallback(
    (id: string) => setValue((prev) => prev.filter((i) => i.id !== id)),
    [setValue],
  );

  const clearChecked = useCallback(
    () => setValue((prev) => prev.filter((i) => !i.checked)),
    [setValue],
  );

  const clearAll = useCallback(() => setValue([]), [setValue]);

  return { items: value, addRecipe, toggle, remove, clearChecked, clearAll, ready };
}
