"use client";

import { forwardRef, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Ripple = { id: number; x: number; y: number };

type BaseProps = {
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-[0.95rem]",
  lg: "px-7 py-3.5 text-base",
};

const variants = {
  solid:
    "bg-ember text-[hsl(var(--accent-contrast))] hover:bg-ember-deep shadow-[0_10px_30px_-12px_hsl(var(--ember)/0.7)]",
  outline: "border border-fg/25 text-fg hover:border-ember hover:text-ember",
  ghost: "text-fg-soft hover:text-fg hover:bg-fg/5",
};

function useRipples() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const add = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((prev) => [
      ...prev,
      { id, x: event.clientX - rect.left, y: event.clientY - rect.top },
    ]);
    window.setTimeout(
      () => setRipples((prev) => prev.filter((r) => r.id !== id)),
      600,
    );
  };
  return { ripples, add };
}

function Sizzle({ ripples }: { ripples: Ripple[] }) {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="sizzle-ring absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron/60"
          style={{ left: r.x, top: r.y }}
        />
      ))}
    </span>
  );
}

const baseClass =
  "relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 will-change-transform focus-visible:outline-2";

type ButtonNativeProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
>;

export const SizzleButton = forwardRef<
  HTMLButtonElement,
  BaseProps & ButtonNativeProps
>(function SizzleButton(
  { children, variant = "solid", size = "md", className, onClick, ...rest },
  ref,
) {
  const reduce = useReducedMotion();
  const { ripples, add } = useRipples();
  const localRef = useRef<HTMLButtonElement>(null);

  const handleMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (reduce) return;
    const el = localRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const my = (event.clientY - rect.top - rect.height / 2) / rect.height;
    el.style.transform = `translate(${mx * 6}px, ${my * 6}px)`;
  };

  const reset = () => {
    if (localRef.current) localRef.current.style.transform = "";
  };

  return (
    <motion.button
      ref={(node) => {
        localRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={(event) => {
        add(event);
        onClick?.(event);
      }}
      className={cn(baseClass, sizes[size], variants[variant], className)}
      {...rest}
    >
      {children}
      <Sizzle ripples={ripples} />
    </motion.button>
  );
});

export function SizzleLink({
  children,
  href,
  variant = "solid",
  size = "md",
  className,
}: BaseProps & { href: string }) {
  const { ripples, add } = useRipples();
  return (
    <Link
      href={href}
      onClick={add}
      className={cn(baseClass, sizes[size], variants[variant], className)}
    >
      {children}
      <Sizzle ripples={ripples} />
    </Link>
  );
}
