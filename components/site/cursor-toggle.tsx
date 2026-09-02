"use client";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";

export function CursorToggle() {
  const { value, setValue, ready } = useLocalStorage("dishit-cursor", false);

  return (
    <button
      type="button"
      onClick={() => setValue(!value)}
      aria-pressed={value}
      className="inline-flex items-center gap-2 rounded-full border border-fg/20 px-3 py-1.5 text-xs text-fg-soft transition-colors hover:border-ember hover:text-ember"
    >
      <span
        className={`h-2 w-2 rounded-full ${
          ready && value ? "bg-ember" : "bg-fg/30"
        }`}
      />
      Whisk cursor {ready && value ? "on" : "off"}
    </button>
  );
}
