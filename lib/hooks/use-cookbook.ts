"use client";

import { useCallback } from "react";
import {
  useLocalStorage,
  useLocalStorageSelector,
  writeLocalStorage,
} from "@/lib/hooks/use-local-storage";

const KEY = "dishit-cookbook";
const EMPTY: string[] = [];

export function toggleCookbook(slug: string) {
  writeLocalStorage<string[]>(KEY, EMPTY, (prev) =>
    prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev],
  );
}

/*
  A single slug's saved state. Backed by a selector so a grid of save buttons
  only re-renders the one that changed.
*/
export function useIsInCookbook(slug: string) {
  return useLocalStorageSelector<string[], boolean>(KEY, EMPTY, (value) =>
    value.includes(slug),
  );
}

export function useCookbook() {
  const { value, ready } = useLocalStorage<string[]>(KEY, EMPTY);

  const has = useCallback((slug: string) => value.includes(slug), [value]);
  const toggle = useCallback((slug: string) => toggleCookbook(slug), []);

  return { saved: value, has, toggle, ready };
}
