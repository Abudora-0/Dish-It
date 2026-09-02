import type { Metadata } from "next";
import { ShoppingListView } from "@/components/shopping/shopping-list-view";

export const metadata: Metadata = {
  title: "Shopping list",
  description: "Every ingredient from the recipes you added, in one checklist.",
};

export default function ShoppingListPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-fg-faint">
          Your kitchen
        </p>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl">Shopping list</h1>
        <p className="mt-3 text-fg-soft">
          Pulled from every recipe you sent here. Check items off with a chop.
        </p>
      </header>
      <div className="mt-10">
        <ShoppingListView />
      </div>
    </div>
  );
}
