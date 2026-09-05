import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedLogo } from "@/components/brand/animated-logo";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Dish It exists and how it is built. A small hand made kitchen on the internet.",
};

const STACK = [
  ["Next.js App Router", "Server components, static generation, and the metadata API."],
  ["Sanity", "Structured content with an embedded studio. The site also ships with seed data."],
  ["motion", "Every transition, the lifting cloche logo, and the glass fill."],
  ["Tailwind CSS v4", "A token driven theme with full light and dark support."],
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <AnimatedLogo markClassName="h-12 w-12" />
      </div>
      <h1 className="font-display text-4xl sm:text-5xl">
        A kitchen built by hand
      </h1>
      <p className="mt-4 text-lg text-fg-soft">
        Most recipe sites feel the same. Dish It is a small counter argument.
        Every control was made to match the food: the scrollbar drips like sauce,
        the counters roll like an old till, the theme switch is a stove dial, and
        the logo lifts a serving cloche on a loop.
      </p>
      <p className="mt-4 text-fg-soft">
        Live at{" "}
        <a
          href="https://dish-itt.vercel.app"
          className="text-ember underline-sizzle"
        >
          dish-itt.vercel.app
        </a>
        .
      </p>

      <Reveal className="mt-10">
        <h2 className="font-display text-2xl">What is inside</h2>
        <ul className="mt-4 space-y-3 text-fg-soft">
          <li>
            A <Link href="/recipes" className="text-ember underline-sizzle">recipe explorer</Link>{" "}
            that filters by pantry contents and reorders by how much you can make.
          </li>
          <li>
            A full screen <Link href="/recipes/weeknight-butter-chicken/cook" className="text-ember underline-sizzle">cook mode</Link>{" "}
            with stacking timers and a screen that stays awake.
          </li>
          <li>
            A <Link href="/discover" className="text-ember underline-sizzle">flavor wheel</Link>{" "}
            for choosing by mood and a{" "}
            <Link href="/mixer" className="text-ember underline-sizzle">drink mixer</Link>{" "}
            with a glass that fills as you build.
          </li>
          <li>
            A cookbook, a shopping list, and a{" "}
            <Link href="/planner" className="text-ember underline-sizzle">weekly planner</Link>, all stored on your device.
          </li>
          <li>
            Over a hundred recipes across{" "}
            <Link href="/cuisines" className="text-ember underline-sizzle">two dozen cuisines</Link>,
            a starter set written by hand plus a batch from the TheMealDB
            community collection.
          </li>
        </ul>
      </Reveal>

      <Reveal className="mt-10">
        <h2 className="font-display text-2xl">The stack</h2>
        <dl className="mt-4 space-y-3">
          {STACK.map(([name, detail]) => (
            <div key={name} className="card-paper p-4">
              <dt className="font-medium text-fg">{name}</dt>
              <dd className="mt-1 text-sm text-fg-soft">{detail}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal className="mt-10">
        <div className="rounded-2xl border border-fg/10 bg-bg-raised p-6 text-sm text-fg-soft">
          <p>
            Dish It is open source under the MIT license. Recipe data and
            imagery for the imported dishes come from{" "}
            <a href="https://www.themealdb.com/" className="text-ember">
              TheMealDB
            </a>
            . Connect a Sanity project to manage recipes from a dashboard, or
            keep editing the seed files directly.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
