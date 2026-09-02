"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

/*
  Custom listbox that opens like a lifting pot lid. Full keyboard support with
  proper aria roles so it behaves for screen readers too.
*/
export function FlavorSelect({
  options,
  value,
  onChange,
  label,
  placeholder = "Choose",
  className,
}: {
  options: SelectOption[];
  value: string | null;
  onChange: (next: string | null) => void;
  label: string;
  placeholder?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value) ?? null;

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (open) {
      const index = options.findIndex((o) => o.value === value);
      setActive(index < 0 ? 0 : index);
    }
  }, [open, options, value]);

  function handleKey(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) return setOpen(true);
      setActive((a) => Math.min(options.length - 1, a + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) setOpen(true);
      else {
        onChange(options[active]?.value ?? null);
        setOpen(false);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onKeyDown={handleKey}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-full border px-4 py-2.5 text-left text-sm transition-colors",
          open ? "border-ember" : "border-fg/20 hover:border-fg/40",
          selected ? "text-fg" : "text-fg-faint",
        )}
      >
        <span className="truncate">
          <span className="mr-2 font-mono text-[0.7rem] uppercase tracking-wider text-fg-faint">
            {label}
          </span>
          {selected?.label ?? placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          className="text-ember"
          aria-hidden
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 5l4 4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -8, rotateX: reduce ? 0 : -35 }}
            animate={{ opacity: 1, y: 6, rotateX: 0 }}
            exit={{ opacity: 0, y: -8, rotateX: reduce ? 0 : -25 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top center", transformPerspective: 600 }}
            className="card-paper absolute z-40 mt-1 max-h-64 w-full overflow-auto p-1.5"
          >
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-fg-faint hover:bg-fg/5"
              >
                Any {label.toLowerCase()}
              </button>
            </li>
            {options.map((option, index) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    index === active ? "bg-ember/12 text-fg" : "text-fg-soft",
                  )}
                >
                  {option.label}
                  {option.value === value && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="text-ember"
                      aria-hidden
                    >
                      <path
                        d="M2 7.5l3.2 3.2L12 3.5"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
