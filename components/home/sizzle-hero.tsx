"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { AnimatedLogo } from "@/components/brand/animated-logo";
import { SizzleLink } from "@/components/ui/sizzle-button";
import { CountUp } from "@/components/ui/odometer";
import { slugHash } from "@/lib/utils";
import {
  BasilIcon,
  ChiliIcon,
  CitrusIcon,
  CloveIcon,
  LimeIcon,
  MintIcon,
  PeppercornIcon,
  StarAniseIcon,
} from "@/components/home/ingredient-icons";

const FLOATERS = [
  { key: "chili", Icon: ChiliIcon },
  { key: "lime", Icon: LimeIcon },
  { key: "mint", Icon: MintIcon },
  { key: "star anise", Icon: StarAniseIcon },
  { key: "peppercorn", Icon: PeppercornIcon },
  { key: "basil", Icon: BasilIcon },
  { key: "citrus", Icon: CitrusIcon },
  { key: "clove", Icon: CloveIcon },
];

export function SizzleHero({
  recipeCount,
  cuisineCount,
}: {
  recipeCount: number;
  cuisineCount: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pt-20"
    >
      <motion.div
        aria-hidden
        style={{ y: y1 }}
        className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full blur-3xl"
      >
        <div className="h-full w-full rounded-full bg-ember/20" />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ y: y2 }}
        className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-basil/20 blur-3xl"
      />

      {!reduce &&
        FLOATERS.map(({ key, Icon }, index) => {
          const seed = slugHash(key);
          // Keep floaters pinned to the left and right gutters, clear of the copy.
          const onLeft = index % 2 === 0;
          const edge = 2 + ((seed >> 2) % 7);
          const left = onLeft ? edge : 100 - edge;
          const top = 10 + ((seed >> 3) % 78);
          return (
            <motion.span
              key={key}
              aria-hidden
              className="pointer-events-none absolute hidden text-fg-faint/70 xl:block"
              style={{ left: `${left}%`, top: `${top}%` }}
              animate={{ y: [0, -14, 0], rotate: [0, 6, -4, 0] }}
              transition={{
                duration: 6 + (seed % 5),
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.4,
              }}
            >
              <Icon className="h-6 w-6" />
            </motion.span>
          );
        })}

      <motion.div
        style={{ opacity: fade }}
        className="relative mx-auto max-w-4xl text-center"
      >
        <div className="mb-6 flex justify-center">
          <AnimatedLogo withWordmark={false} markClassName="h-16 w-16" />
        </div>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-ember">
          Food / Shakes / Drinks
        </p>
        <h1 className="display-fluid text-balance font-display">
          Cook the thing you are
          <span className="relative mx-2 inline-block">
            <span className="relative z-10">actually</span>
            <motion.span
              aria-hidden
              className="absolute -bottom-1 left-0 -z-0 h-3 w-full rounded bg-saffron/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
            />
          </span>
          craving
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-fg-soft">
          Dish It is a small hand built kitchen. Explore recipes by flavor and
          mood, follow a full screen cook mode with real timers, and blend your
          own shakes in the mixer.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <SizzleLink href="/recipes" size="lg">
            Browse recipes
          </SizzleLink>
          <SizzleLink href="/discover" size="lg" variant="outline">
            Find by mood
          </SizzleLink>
        </div>
        <dl className="mx-auto mt-12 grid max-w-xs grid-cols-3 gap-3 text-center sm:max-w-md sm:gap-4">
          <Stat label="recipes" value={recipeCount} />
          <Stat label="cuisines" value={cuisineCount} />
          <Stat label="mixer parts" value={21} />
        </dl>
      </motion.div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dd className="font-display text-2xl text-fg sm:text-3xl">
        <CountUp to={value} />
      </dd>
      <dt className="font-mono text-[0.58rem] uppercase tracking-wide text-fg-faint sm:text-[0.7rem] sm:tracking-widest">
        {label}
      </dt>
    </div>
  );
}
