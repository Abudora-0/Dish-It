"use client";

import { useCallback } from "react";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

export function useCookbook() {
  const { value, setValue, ready } = useLocalStorage<string[]>(
    "dishit-cookbook",
    [],
  );

  const has = useCallback((slug: string) => value.includes(slug), [value]);

  const toggle = useCallback(
    (slug: string) => {
      setValue((prev) =>
        prev.includes(slug)
          ? prev.filter((s) => s !== slug)
          : [slug, ...prev],
      );
    },
    [setValue],
  );

  return { saved: value, has, toggle, ready };
}
