"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type KitchenTimer = {
  id: string;
  label: string;
  total: number;
  remaining: number;
  running: boolean;
  done: boolean;
};

function beep() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    osc.start();
    osc.stop(ctx.currentTime + 0.9);
  } catch {
    // audio not available
  }
}

export function useTimers() {
  const [timers, setTimers] = useState<KitchenTimer[]>([]);
  const frame = useRef<number | null>(null);
  const last = useRef<number>(0);

  useEffect(() => {
    function tick(now: number) {
      if (!last.current) last.current = now;
      const delta = (now - last.current) / 1000;
      last.current = now;
      setTimers((prev) =>
        prev.map((timer) => {
          if (!timer.running || timer.done) return timer;
          const remaining = Math.max(0, timer.remaining - delta);
          if (remaining === 0) {
            beep();
            return { ...timer, remaining: 0, running: false, done: true };
          }
          return { ...timer, remaining };
        }),
      );
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      last.current = 0;
    };
  }, []);

  const add = useCallback((label: string, minutes: number) => {
    const seconds = Math.round(minutes * 60);
    setTimers((prev) => [
      ...prev,
      {
        id: `${label}-${Date.now()}`,
        label,
        total: seconds,
        remaining: seconds,
        running: true,
        done: false,
      },
    ]);
  }, []);

  const toggle = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id && !t.done ? { ...t, running: !t.running } : t,
      ),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { timers, add, toggle, remove };
}
