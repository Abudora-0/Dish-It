"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-media-query";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/*
  Easter egg. The Konami code lights the burners for a few seconds.
*/
const FLAMES = Array.from({ length: 26 }).map((_, i) => ({
  left: (i / 26) * 100,
  rise: 320 + ((i * 71) % 200),
  duration: 1.6 + ((i * 13) % 10) / 10,
  delay: ((i * 17) % 60) / 100,
}));
export function KonamiFlambe() {
  const reduce = usePrefersReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    let progress = 0;
    function onKey(event: KeyboardEvent) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      progress = key === SEQUENCE[progress] ? progress + 1 : 0;
      if (progress === SEQUENCE.length) {
        progress = 0;
        setActive(true);
        window.setTimeout(() => setActive(false), 3200);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {(reduce ? [] : FLAMES).map((flame, i) => (
            <motion.span
              key={i}
              className="absolute bottom-0 h-24 w-24 rounded-full"
              style={{
                left: `${flame.left}%`,
                background:
                  "radial-gradient(circle at 50% 80%, hsl(var(--saffron)), hsl(var(--ember)) 45%, transparent 70%)",
              }}
              initial={{ y: 120, scale: 0.6, opacity: 0 }}
              animate={{ y: -flame.rise, scale: 1.3, opacity: [0, 1, 0] }}
              transition={{ duration: flame.duration, delay: flame.delay }}
            />
          ))}
          <motion.p
            className="absolute left-1/2 top-10 -translate-x-1/2 font-display text-2xl text-ember"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
          >
            Flambe mode
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
