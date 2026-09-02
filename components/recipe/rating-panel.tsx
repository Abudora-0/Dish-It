"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { SizzleButton } from "@/components/ui/sizzle-button";

type Review = { rating: number; note: string; at: string };
type Store = Record<string, Review>;

/*
  Local rating and note per recipe. Stored on the device. When a Sanity project
  is connected this is a good place to also POST to a review dataset.
*/
export function RatingPanel({ slug }: { slug: string }) {
  const { value, setValue } = useLocalStorage<Store>("dishit-reviews", {});
  const existing = value[slug];
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [note, setNote] = useState(existing?.note ?? "");
  const [saved, setSaved] = useState(false);

  const average = useMemo(() => {
    const list = Object.values(value);
    if (!list.length) return null;
    return list.reduce((sum, r) => sum + r.rating, 0) / list.length;
  }, [value]);

  const save = () => {
    setValue((prev) => ({
      ...prev,
      [slug]: { rating, note, at: new Date().toISOString() },
    }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="card-paper p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl">Your take</h2>
        {average !== null && (
          <p className="font-mono text-xs text-fg-faint">
            you rate {average.toFixed(1)} on average across{" "}
            {Object.keys(value).length} cooks
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-1.5" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} out of 5`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
          >
            <motion.svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              whileTap={{ scale: 0.8 }}
              className={
                n <= (hover || rating) ? "text-ember" : "text-fg/20"
              }
            >
              <path
                d="M12 3l2.5 5.2 5.7.8-4.1 4 1 5.6L12 21l-5.1 2.7 1-5.6-4.1-4 5.7-.8z"
                fill="currentColor"
              />
            </motion.svg>
          </button>
        ))}
      </div>

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        rows={3}
        placeholder="What did you change, what worked, what to try next time"
        className="mt-4 w-full resize-none rounded-xl border border-fg/15 bg-bg p-3 text-sm outline-none focus:border-ember"
      />
      <div className="mt-3">
        <SizzleButton size="sm" onClick={save} disabled={rating === 0}>
          {saved ? "Saved to this device" : "Save my notes"}
        </SizzleButton>
      </div>
    </div>
  );
}
