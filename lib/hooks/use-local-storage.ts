"use client";

import { useCallback, useEffect, useState } from "react";

/*
  Typed localStorage hook that survives private mode, cross tab writes, and
  server rendering. Reads happen after mount so markup stays stable.
*/
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      // ignore
    }
    setReady(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
          window.dispatchEvent(
            new StorageEvent("storage", { key, newValue: JSON.stringify(resolved) }),
          );
        } catch {
          // ignore
        }
        return resolved;
      });
    },
    [key],
  );

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== key || event.newValue == null) return;
      try {
        setValue(JSON.parse(event.newValue) as T);
      } catch {
        // ignore
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return { value, setValue: update, ready };
}
