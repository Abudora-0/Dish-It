"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/*
  Range input themed as a heat meter. The track fills with a spice gradient and
  the thumb is a chili. Built on a native input so keyboard and touch just work.
*/
export function SpiceSlider({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  label,
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  className?: string;
}) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <label htmlFor={id} className="font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">
          {label}
        </label>
        <span className="font-mono text-fg-soft">{value}</span>
      </div>
      <div className="relative h-6">
        <div
          aria-hidden
          className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--basil)/0.4), hsl(var(--saffron)), hsl(var(--ember)), hsl(var(--ember-deep)))",
          }}
        />
        <div
          aria-hidden
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-fg/10"
          style={{ left: `calc(${pct}% + 2px)`, right: 0 }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={label}
          className="spice-range absolute inset-0 h-6 w-full cursor-pointer appearance-none bg-transparent"
          style={{ ["--pct" as string]: `${pct}%` }}
        />
      </div>
      <style jsx>{`
        .spice-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 22px;
          width: 22px;
          border-radius: 60% 60% 65% 65% / 70% 70% 60% 60%;
          background: hsl(var(--ember-deep));
          border: 2px solid hsl(var(--accent-contrast));
          box-shadow: 0 2px 8px -2px hsl(var(--ember) / 0.8);
          cursor: grab;
        }
        .spice-range::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 60% 60% 65% 65% / 70% 70% 60% 60%;
          background: hsl(var(--ember-deep));
          border: 2px solid hsl(var(--accent-contrast));
          cursor: grab;
        }
        .spice-range:focus-visible::-webkit-slider-thumb {
          outline: 2px solid hsl(var(--ember));
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
