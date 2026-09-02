import type { Metadata } from "next";
import { Suspense } from "react";
import { Mixer } from "@/components/mixer/mixer";
import { getDrinkComponents } from "@/lib/content";

export const metadata: Metadata = {
  title: "Shake and drink mixer",
  description:
    "Build your own shake or drink. Drop parts into the glass, watch the nutrition and flavor update live, and share the result.",
};

export default async function MixerPage() {
  const components = await getDrinkComponents();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
          The mixer
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">
          Build it in the glass
        </h1>
        <p className="mt-3 text-fg-soft">
          Add a base, stack fruit and boosters, and the glass fills as you go.
          Nutrition and the flavor radar update on every tap. Share the link and
          someone else gets the exact same drink.
        </p>
      </header>
      <div className="mt-10">
        <Suspense fallback={<p className="text-sm text-fg-faint">Rinsing the blender...</p>}>
          <Mixer components={components} />
        </Suspense>
      </div>
    </div>
  );
}
