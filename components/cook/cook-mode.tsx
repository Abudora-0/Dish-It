"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Stepper } from "@/components/ui/stepper";
import { SizzleButton } from "@/components/ui/sizzle-button";
import { useTimers } from "@/lib/hooks/use-timers";
import { scaleQuantity } from "@/lib/utils";
import type { Recipe } from "@/lib/types";

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const HERB_COLORS = [
  "hsl(var(--ember))",
  "hsl(var(--basil))",
  "hsl(var(--saffron))",
];

/* Deterministic confetti so the render stays pure. */
const CONFETTI = Array.from({ length: 24 }).map((_, i) => {
  const angle = (i / 24) * Math.PI * 2;
  const spread = 180 + ((i * 53) % 200);
  return {
    x: Math.cos(angle) * spread,
    y: Math.sin(angle) * spread,
    rotate: (i * 47) % 360,
    color: HERB_COLORS[i % 3],
    delay: i * 0.02,
  };
});

export function CookMode({ recipe }: { recipe: Recipe }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [servings, setServings] = useState(recipe.servings);
  const { timers, add, toggle, remove } = useTimers();
  const step = recipe.steps[index];
  const finished = index >= recipe.steps.length;

  useEffect(() => {
    type Sentinel = { release: () => Promise<void> };
    const nav = navigator as unknown as {
      wakeLock?: { request: (type: "screen") => Promise<Sentinel> };
    };
    let lock: Sentinel | null = null;
    const request = async () => {
      try {
        lock = (await nav.wakeLock?.request("screen")) ?? null;
      } catch {
        // not supported or denied
      }
    };
    request();
    const onVisible = () => {
      if (document.visibilityState === "visible") request();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      lock?.release().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight")
        setIndex((i) => Math.min(recipe.steps.length, i + 1));
      if (event.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [recipe.steps.length]);

  const progress = Math.min(1, index / recipe.steps.length);

  return (
    <div className="fixed inset-0 z-[75] flex flex-col bg-bg">
      <header className="flex items-center justify-between gap-4 border-b border-fg/10 px-4 py-3 sm:px-6">
        <Link
          href={`/recipes/${recipe.slug}`}
          className="text-sm text-fg-faint hover:text-ember"
        >
          Leave cook mode
        </Link>
        <p className="truncate font-display text-lg">{recipe.title}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="hidden font-mono text-xs text-fg-faint sm:block">
            serves
          </span>
          <Stepper value={servings} min={1} max={24} onChange={setServings} />
        </div>
      </header>

      <div className="h-1.5 w-full bg-fg/10">
        <motion.div
          className="h-full bg-ember"
          animate={{ width: `${(finished ? 1 : progress) * 100}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-10 text-center">
        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div
              key="done"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              {!reduce &&
                CONFETTI.map((piece, i) => (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/2 h-2 w-3 rounded-sm"
                    style={{ background: piece.color }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: piece.x,
                      y: piece.y,
                      rotate: piece.rotate,
                      opacity: 0,
                    }}
                    transition={{ duration: 1.4, delay: piece.delay }}
                  />
                ))}
              <p className="font-mono text-xs uppercase tracking-widest text-ember">
                Plated
              </p>
              <h2 className="mt-2 font-display text-4xl">That is dinner</h2>
              <p className="mx-auto mt-3 max-w-sm text-fg-soft">
                Rest anything that needs resting, then serve for {servings}.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <SizzleButton size="sm" onClick={() => setIndex(0)}>
                  Run it again
                </SizzleButton>
                <Link
                  href={`/recipes/${recipe.slug}`}
                  className="rounded-full border border-fg/20 px-4 py-2 text-sm hover:border-ember hover:text-ember"
                >
                  Back to recipe
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={index}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -24 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl"
            >
              <p className="font-mono text-sm text-fg-faint">
                Step {index + 1} of {recipe.steps.length}
              </p>
              <p className="mt-4 font-display text-3xl leading-snug sm:text-4xl">
                {step.instruction}
              </p>

              {index === 0 && (
                <div className="mx-auto mt-6 max-w-md rounded-2xl border border-fg/10 bg-bg-raised p-4 text-left text-sm">
                  <p className="font-mono text-[0.7rem] uppercase tracking-wider text-fg-faint">
                    You will need
                  </p>
                  <ul className="mt-2 space-y-1 text-fg-soft">
                    {recipe.ingredients.slice(0, 8).map((line, i) => {
                      const q = scaleQuantity(
                        line.quantity,
                        recipe.servings,
                        servings,
                      );
                      return (
                        <li key={i}>
                          {[q ?? "", line.unit ?? "", line.item]
                            .filter(Boolean)
                            .join(" ")}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {step.durationMinutes ? (
                <button
                  type="button"
                  onClick={() =>
                    add(
                      `Step ${index + 1}`,
                      step.durationMinutes as number,
                    )
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-ember/12 px-4 py-2 text-sm font-medium text-ember"
                >
                  Start {step.durationMinutes} min timer
                </button>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-fg/10 px-4 py-4 sm:px-6">
        {timers.length > 0 && (
          <div className="mx-auto mb-3 flex max-w-3xl flex-wrap gap-2">
            {timers.map((timer) => (
              <div
                key={timer.id}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                  timer.done
                    ? "border-ember bg-ember/15 text-ember"
                    : "border-fg/15"
                }`}
              >
                <span className="font-mono">{fmt(timer.remaining)}</span>
                <span className="text-xs text-fg-faint">{timer.label}</span>
                {!timer.done && (
                  <button
                    onClick={() => toggle(timer.id)}
                    className="text-xs text-fg-soft hover:text-ember"
                  >
                    {timer.running ? "hold" : "go"}
                  </button>
                )}
                <button
                  onClick={() => remove(timer.id)}
                  aria-label="Dismiss timer"
                  className="text-fg-faint hover:text-fg"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <SizzleButton
            variant="outline"
            size="sm"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
          >
            Back
          </SizzleButton>
          <div className="flex gap-1.5">
            {recipe.steps.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to step ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? "bg-ember" : i < index ? "bg-ember/40" : "bg-fg/20"
                }`}
              />
            ))}
          </div>
          <SizzleButton
            size="sm"
            onClick={() => setIndex((i) => Math.min(recipe.steps.length, i + 1))}
          >
            {index === recipe.steps.length - 1 ? "Finish" : "Next"}
          </SizzleButton>
        </div>
      </div>
    </div>
  );
}
