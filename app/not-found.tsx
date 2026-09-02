import Link from "next/link";
import { AnimatedLogo } from "@/components/brand/animated-logo";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <AnimatedLogo withWordmark={false} markClassName="h-14 w-14" />
      <p className="mt-6 font-mono text-xs uppercase tracking-widest text-ember">
        86 that
      </p>
      <h1 className="mt-2 font-display text-4xl">This dish is off the menu</h1>
      <p className="mt-3 text-fg-soft">
        The page you asked for is not in the kitchen. Head back to the pass and
        pick something else.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-[hsl(var(--accent-contrast))]"
      >
        Back to Dish It
      </Link>
    </div>
  );
}
