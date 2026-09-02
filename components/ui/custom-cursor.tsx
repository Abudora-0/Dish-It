"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks/use-media-query";

/*
  Optional whisk trail cursor. Off by default, only on fine pointers, and never
  when reduced motion is requested.
*/
export function CustomCursor() {
  const { value: enabled } = useLocalStorage("dishit-cursor", false);
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduce = usePrefersReducedMotion();
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 30 });
  const sy = useSpring(y, { stiffness: 400, damping: 30 });

  useEffect(() => {
    if (!enabled || !finePointer || reduce) return;
    document.documentElement.style.cursor = "none";
    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as HTMLElement;
      setHovering(!!target.closest("a, button, [role=button], input, select"));
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.style.cursor = "";
    };
  }, [enabled, finePointer, reduce, x, y]);

  if (!enabled || !finePointer || reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
        animate={{ scale: hovering ? 1.8 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </motion.div>
  );
}
