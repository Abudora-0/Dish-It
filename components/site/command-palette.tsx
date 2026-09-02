"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { NAV_LINKS, UTILITY_LINKS } from "@/components/site/nav-data";
import type { Recipe, Technique } from "@/lib/types";

type Item = {
  id: string;
  label: string;
  hint: string;
  href: string;
  group: string;
};

const PaletteContext = createContext<{ open: () => void } | null>(null);

export function useCommandPalette() {
  return useContext(PaletteContext) ?? { open: () => undefined };
}

export function CommandPalette({
  recipes,
  techniques,
  children,
}: {
  recipes: Recipe[];
  techniques: Technique[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const items = useMemo<Item[]>(() => {
    const pages: Item[] = [...NAV_LINKS, ...UTILITY_LINKS].map((link) => ({
      id: `page-${link.href}`,
      label: link.label,
      hint: "Page",
      href: link.href,
      group: "Pages",
    }));
    const recipeItems: Item[] = recipes.map((recipe) => ({
      id: recipe._id,
      label: recipe.title,
      hint: `${recipe.dishType} - ${recipe.cuisine}`,
      href: `/recipes/${recipe.slug}`,
      group: "Recipes",
    }));
    const techniqueItems: Item[] = techniques.map((technique) => ({
      id: `tech-${technique.slug}`,
      label: technique.name,
      hint: "Technique",
      href: `/techniques#${technique.slug}`,
      group: "Techniques",
    }));
    return [...pages, ...recipeItems, ...techniqueItems];
  }, [recipes, techniques]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 8);
    return items
      .filter((item) =>
        `${item.label} ${item.hint} ${item.group}`.toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [items, query]);

  const openPalette = useCallback(() => setOpen(true), []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((o) => !o);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <PaletteContext.Provider value={{ open: openPalette }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[85] flex items-start justify-center px-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="Close search"
              className="absolute inset-0 bg-[rgba(8,6,4,0.55)] backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-label="Kitchen search"
              className="card-paper relative w-full max-w-xl overflow-hidden"
              initial={{ y: -16, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -16, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <div className="flex items-center gap-3 border-b border-fg/10 px-4 py-3">
                <span className="text-ember" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="2" />
                    <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setActive((a) => Math.min(filtered.length - 1, a + 1));
                    } else if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setActive((a) => Math.max(0, a - 1));
                    } else if (event.key === "Enter" && filtered[active]) {
                      go(filtered[active].href);
                    }
                  }}
                  placeholder="Search recipes, techniques, pages"
                  className="w-full bg-transparent text-fg outline-none placeholder:text-fg-faint"
                />
                <kbd className="hidden rounded border border-fg/20 px-1.5 py-0.5 font-mono text-[0.65rem] text-fg-faint sm:block">
                  esc
                </kbd>
              </div>
              <ul className="max-h-[52vh] overflow-auto p-2">
                {filtered.length === 0 && (
                  <li className="px-3 py-6 text-center text-sm text-fg-faint">
                    Nothing on the menu for that
                  </li>
                )}
                {filtered.map((item, index) => (
                  <li key={item.id}>
                    <button
                      onMouseEnter={() => setActive(index)}
                      onClick={() => go(item.href)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        index === active ? "bg-ember/12" : ""
                      }`}
                    >
                      <span className="text-fg">{item.label}</span>
                      <span className="font-mono text-xs text-fg-faint">
                        {item.hint}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PaletteContext.Provider>
  );
}
