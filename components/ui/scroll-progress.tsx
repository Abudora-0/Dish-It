"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

/*
  A sauce drip that tracks reading position down the left edge of the viewport.
*/
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const dripTop = useTransform(smooth, [0, 1], ["0%", "99%"]);

  return (
    <div
      aria-hidden
      className="no-print pointer-events-none fixed left-0 top-0 z-50 hidden h-full w-1 sm:block"
    >
      <motion.div
        className="h-full w-full origin-top rounded-full"
        style={{
          scaleY: smooth,
          background:
            "linear-gradient(hsl(var(--saffron)), hsl(var(--ember)), hsl(var(--ember-deep)))",
        }}
      />
      <motion.div
        className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-ember-deep shadow-[0_0_12px_hsl(var(--ember)/0.8)]"
        style={{ top: dripTop }}
      />
    </div>
  );
}
