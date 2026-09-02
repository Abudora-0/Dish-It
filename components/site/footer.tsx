import Link from "next/link";
import { AnimatedLogo } from "@/components/brand/animated-logo";
import { NAV_LINKS, UTILITY_LINKS } from "@/components/site/nav-data";
import { CursorToggle } from "@/components/site/cursor-toggle";

export function Footer() {
  return (
    <footer className="no-print mt-24 border-t border-fg/10 bg-bg-raised">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <AnimatedLogo interactive={false} />
          <p className="mt-4 max-w-sm text-sm text-fg-soft">
            A small, hand built kitchen on the internet. Every control here was
            made to feel like the food. No stock templates, no filler.
          </p>
          <div className="mt-5">
            <CursorToggle />
          </div>
        </div>

        <nav aria-label="Explore">
          <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-fg-soft hover:text-ember">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="More">
          <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
            Your kitchen
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {UTILITY_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-fg-soft hover:text-ember">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/studio" className="text-fg-soft hover:text-ember">
                Content studio
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-fg/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-fg-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Built with Next.js, Sanity, and motion. MIT licensed.</p>
          <p>Press Ctrl K to search anywhere.</p>
        </div>
      </div>
    </footer>
  );
}
