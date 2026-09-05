"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const SUGGESTIONS = [
  "chicken",
  "eggs",
  "spinach",
  "chickpeas",
  "banana",
  "tomato",
  "garlic",
  "lentils",
  "lime",
];

/*
  Pantry ingredient collector. Type an item and press enter, or tap a common
  suggestion. Results in the explorer sort by how much of each recipe you can
  already make.
*/
export function PantryMatch({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = (item: string) => {
    const clean = item.trim().toLowerCase();
    if (clean && !value.includes(clean)) onChange([...value, clean]);
    setDraft("");
  };

  return (
    <div className="rounded-2xl border border-fg/15 bg-bg-raised p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-ember">
          In my pantry
        </span>
        <AnimatePresence>
          {value.map((item) => (
            <motion.button
              key={item}
              type="button"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onChange(value.filter((v) => v !== item))}
              className="chip border-ember/40 bg-ember/10 text-ember"
            >
              {item}
              <span aria-hidden className="ml-1 text-[0.8em]">
                x
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add(draft);
            }
            if (event.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          placeholder={value.length ? "add another" : "add an ingredient"}
          className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-fg-faint"
          aria-label="Add pantry ingredient"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {SUGGESTIONS.filter((s) => !value.includes(s)).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => add(s)}
            className="rounded-full px-2 py-0.5 text-xs text-fg-faint transition-colors hover:bg-fg/5 hover:text-fg-soft"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
