"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ChopCheckbox } from "@/components/ui/chop-checkbox";
import { SizzleButton } from "@/components/ui/sizzle-button";
import { useShoppingList } from "@/lib/hooks/use-shopping-list";

export function ShoppingListView() {
  const { items, toggle, remove, clearChecked, clearAll, ready } =
    useShoppingList();

  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    items.forEach((item) => {
      if (!map.has(item.from)) map.set(item.from, []);
      map.get(item.from)!.push(item);
    });
    return Array.from(map.entries());
  }, [items]);

  const checkedCount = items.filter((i) => i.checked).length;

  if (!ready) return <p className="text-sm text-fg-faint">Loading list...</p>;

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-fg/20 p-12 text-center">
        <p className="font-display text-2xl">Nothing on the list</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-fg-soft">
          Open any recipe and use add to shopping list. Items land here grouped
          by recipe.
        </p>
        <Link
          href="/recipes"
          className="mt-5 inline-flex rounded-full bg-ember px-5 py-2.5 text-sm font-medium text-[hsl(var(--accent-contrast))]"
        >
          Browse recipes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-soft">
          <span className="font-mono text-fg">
            {items.length - checkedCount}
          </span>{" "}
          left, {checkedCount} in the cart
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="rounded-full border border-fg/20 px-3 py-1.5 text-sm text-fg-soft hover:border-ember hover:text-ember"
          >
            Print
          </button>
          {checkedCount > 0 && (
            <SizzleButton size="sm" variant="ghost" onClick={clearChecked}>
              Clear checked
            </SizzleButton>
          )}
          <SizzleButton size="sm" variant="ghost" onClick={clearAll}>
            Empty list
          </SizzleButton>
        </div>
      </div>

      <div className="space-y-6">
        {grouped.map(([from, group]) => (
          <div key={from} className="card-paper p-4">
            <p className="mb-2 font-mono text-xs uppercase tracking-wider text-ember">
              {from}
            </p>
            <ul>
              <AnimatePresence initial={false}>
                {group.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between gap-2"
                  >
                    <ChopCheckbox
                      checked={item.checked}
                      onChange={() => toggle(item.id)}
                      label={item.label}
                    />
                    <button
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.label}`}
                      className="no-print px-2 text-fg-faint hover:text-fg"
                    >
                      x
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
