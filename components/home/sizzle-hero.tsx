"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { AnimatedLogo } from "@/components/brand/animated-logo";
import { SizzleLink } from "@/components/ui/sizzle-button";
import { CountUp } from "@/components/ui/odometer";
import {
  BasilIcon,
  BayLeafIcon,
  ChiliIcon,
  CinnamonIcon,
  CitrusIcon,
  CloveIcon,
  CoffeeBeanIcon,
  GarlicIcon,
  LimeIcon,
  MintIcon,
  PeppercornIcon,
  RollingPinIcon,
  SaltIcon,
  StarAniseIcon,
  WhiskIcon,
} from "@/components/home/ingredient-icons";

// A curated scatter across the whole hero rather than a tidy edge stack.
// left / top in %, size in tailwind units.
const FLOATERS = [
  { Icon: ChiliIcon, left: 6, top: 9, size: "h-6 w-6" },
  { Icon: MintIcon, left: 21, top: 5, size: "h-5 w-5" },
  { Icon: PeppercornIcon, left: 47, top: 3, size: "h-4 w-4" },
  { Icon: StarAniseIcon, left: 73, top: 6, size: "h-6 w-6" },
  { Icon: LimeIcon, left: 92, top: 13, size: "h-5 w-5" },
  { Icon: GarlicIcon, left: 3, top: 27, size: "h-7 w-7" },
  { Icon: WhiskIcon, left: 89, top: 31, size: "h-6 w-6" },
  { Icon: BasilIcon, left: 11, top: 47, size: "h-5 w-5" },
  { Icon: CinnamonIcon, left: 91, top: 51, size: "h-6 w-6" },
  { Icon: CloveIcon, left: 5, top: 65, size: "h-6 w-6" },
  { Icon: RollingPinIcon, left: 85, top: 69, size: "h-7 w-7" },
  { Icon: CitrusIcon, left: 28, top: 81, size: "h-5 w-5" },
  { Icon: CoffeeBeanIcon, left: 54, top: 87, size: "h-5 w-5" },
  { Icon: SaltIcon, left: 15, top: 90, size: "h-6 w-6" },
  { Icon: BayLeafIcon, left: 71, top: 89, size: "h-5 w-5" },
  { Icon: ChiliIcon, left: 95, top: 79, size: "h-4 w-4" },
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
        FLOATERS.map(({ Icon, left, top, size }, index) => (
          <motion.span
            key={index}
            aria-hidden
            className="pointer-events-none absolute hidden text-fg-faint/60 md:block"
            style={{ left: `${left}%`, top: `${top}%` }}
            animate={{ y: [0, -12, 0], rotate: [0, 5, -4, 0] }}
            transition={{
              duration: 6 + (index % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: (index % 6) * 0.5,
            }}
          >
            <Icon className={size} />
          </motion.span>
        ))}

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
