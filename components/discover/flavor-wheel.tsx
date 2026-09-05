"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { Mood } from "@/lib/types";

export type WheelMood = { key: Mood; label: string; color: string };

export type FlavorWheelHandle = {
  spin: () => void;
  pointAt: (key: Mood) => void;
};

const SPICE_BURST = Array.from({ length: 16 }).map((_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const spread = 58 + ((i * 41) % 60);
  return {
    x: Math.round(Math.cos(angle) * spread),
    y: Math.round(Math.sin(angle) * spread),
    delay: (i % 6) * 0.02,
  };
});

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
const easeSpin = (t: number) => 1 - Math.pow(1 - t, 4);

export const FlavorWheel = forwardRef<
  FlavorWheelHandle,
  {
    moods: WheelMood[];
    activeKey: Mood;
    onLand: (key: Mood) => void;
    reduce: boolean;
  }
>(function FlavorWheel({ moods, activeKey, onLand, reduce }, ref) {
  const segment = 360 / moods.length;

  const [rotation, setRotation] = useState(0);
  const [tickKey, setTickKey] = useState(0);
  const [burstKey, setBurstKey] = useState(0);

  const rot = useRef(0);
  const frame = useRef<number | null>(null);
  const lastTick = useRef(0);
  const drag = useRef<{ startX: number; startRot: number } | null>(null);

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    [],
  );

  const apply = useCallback(
    (value: number) => {
      rot.current = value;
      setRotation(value);
      const tick = Math.floor(Math.abs(value) / segment);
      if (tick !== lastTick.current) {
        lastTick.current = tick;
        setTickKey((k) => k + 1);
      }
    },
    [segment],
  );

  const animateTo = useCallback(
    (target: number, duration: number, ease: (t: number) => number) => {
      if (frame.current) cancelAnimationFrame(frame.current);
      if (reduce) {
        apply(target);
        setBurstKey((b) => b + 1);
        return;
      }
      const start = rot.current;
      const delta = target - start;
      const startTime = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        apply(start + delta * ease(t));
        if (t < 1) {
          frame.current = requestAnimationFrame(step);
        } else {
          frame.current = null;
          setBurstKey((b) => b + 1);
        }
      };
      frame.current = requestAnimationFrame(step);
    },
    [apply, reduce],
  );

  const goTo = useCallback(
    (key: Mood, extraTurns: number) => {
      const index = moods.findIndex((m) => m.key === key);
      const currentMod = ((rot.current % 360) + 360) % 360;
      // Land with the chosen wedge centered under the pointer.
      const targetMod =
        ((-(index * segment + segment / 2) % 360) + 360) % 360;
      const stepBack = ((currentMod - targetMod) % 360 + 360) % 360;
      const target = rot.current - stepBack - 360 * extraTurns;
      onLand(key);
      animateTo(
        target,
        extraTurns > 0 ? 2400 : 520,
        extraTurns > 0 ? easeSpin : easeOutQuint,
      );
    },
    [moods, segment, onLand, animateTo],
  );

  useImperativeHandle(
    ref,
    () => ({
      spin: () => {
        const index = Math.floor(Math.random() * moods.length);
        goTo(moods[index].key, 3 + Math.floor(Math.random() * 3));
      },
      pointAt: (key: Mood) => goTo(key, 0),
    }),
    [moods, goTo],
  );

  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (reduce) return;
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = null;
    }
    drag.current = { startX: event.clientX, startRot: rot.current };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.startX;
    apply(drag.current.startRot + dx * 0.7);
  };

  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    const normalized = ((-rot.current % 360) + 360) % 360;
    const nearest =
      ((Math.round((normalized - segment / 2) / segment) % moods.length) +
        moods.length) %
      moods.length;
    goTo(moods[nearest].key, 0);
  };

  return (
    <div className="relative mx-auto aspect-square w-[300px] sm:w-[360px] lg:w-[380px]">
      <span
        key={`tick-${tickKey}`}
        aria-hidden
        className="pointer-pip absolute -top-1 left-1/2 z-10 h-0 w-0 border-x-8 border-t-[14px] border-x-transparent border-t-ember"
      />

      {burstKey > 0 && !reduce && (
        <span
          key={`burst-${burstKey}`}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 block h-0 w-0"
        >
          {SPICE_BURST.map((p, i) => (
            <span
              key={i}
              className="spice-fleck absolute block h-1.5 w-1.5 rounded-full bg-ember"
              style={
                {
                  "--bx": `${p.x}px`,
                  "--by": `${p.y}px`,
                  animationDelay: `${p.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </span>
      )}

      <svg
        viewBox="0 0 200 200"
        className="h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
        style={{ transform: `rotate(${rotation}deg)`, willChange: "transform" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {moods.map((m, index) => {
          const start = (index * segment - 90) * (Math.PI / 180);
          const end = ((index + 1) * segment - 90) * (Math.PI / 180);
          const x1 = 100 + 96 * Math.cos(start);
          const y1 = 100 + 96 * Math.sin(start);
          const x2 = 100 + 96 * Math.cos(end);
          const y2 = 100 + 96 * Math.sin(end);
          const midDeg = index * segment + segment / 2;
          const mid = (midDeg - 90) * (Math.PI / 180);
          const tx = 100 + 62 * Math.cos(mid);
          const ty = 100 + 62 * Math.sin(mid);
          const upsideDown = midDeg > 90 && midDeg < 270;
          return (
            <g key={m.key}>
              <path
                d={`M100 100 L${x1} ${y1} A96 96 0 0 1 ${x2} ${y2} Z`}
                fill={m.color}
                opacity={m.key === activeKey ? 0.95 : 0.42}
                stroke="var(--bg)"
                strokeWidth="1.5"
              />
              <text
                x={tx}
                y={ty}
                fill="hsl(var(--accent-contrast))"
                fontSize="7.5"
                fontWeight={m.key === activeKey ? 700 : 500}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${midDeg + (upsideDown ? 180 : 0)} ${tx} ${ty})`}
              >
                {m.label}
              </text>
            </g>
          );
        })}
        <circle cx="100" cy="100" r="24" fill="var(--bg)" />
        <circle
          cx="100"
          cy="100"
          r="24"
          fill="none"
          stroke="hsl(var(--ink)/0.2)"
        />
      </svg>

      <style jsx>{`
        .pointer-pip {
          transform: translateX(-50%);
        }
        @media (prefers-reduced-motion: no-preference) {
          .pointer-pip {
            animation: pip-tick 0.2s ease-out;
          }
          .spice-fleck {
            animation: fleck-fly 0.7s ease-out forwards;
          }
        }
        @keyframes pip-tick {
          0%,
          100% {
            transform: translateX(-50%) scale(1);
          }
          45% {
            transform: translateX(-50%) scale(1.4);
          }
        }
        @keyframes fleck-fly {
          from {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          to {
            transform: translate(
                calc(-50% + var(--bx)),
                calc(-50% + var(--by))
              )
              scale(0.35);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
});
