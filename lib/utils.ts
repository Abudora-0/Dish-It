export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// Undefined means the source recipe never stated a time, not zero.
export function totalTime(prep?: number, cook?: number): number | undefined {
  if (prep == null && cook == null) return undefined;
  return Math.max(0, Math.round((prep ?? 0) + (cook ?? 0)));
}

export function formatMinutes(mins: number): string {
  if (mins <= 0) return "no cook";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

export function formatTotalTime(prep?: number, cook?: number): string {
  const total = totalTime(prep, cook);
  return total === undefined ? "time varies" : formatMinutes(total);
}

export function slugHash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function scaleQuantity(
  quantity: number | null,
  from: number,
  to: number,
): number | null {
  if (quantity === null || from <= 0) return quantity;
  const scaled = (quantity * to) / from;
  return Math.round(scaled * 100) / 100;
}

export function titleCase(value: string): string {
  return value.replace(/(^|\s|-)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
}

const gramsPerUnit: Record<string, number> = {
  cup: 240,
  tbsp: 15,
  tsp: 5,
  oz: 28,
  lb: 454,
};

export function toMetric(quantity: number | null, unit: string | null) {
  if (quantity === null || !unit) return { quantity, unit };
  const key = unit.toLowerCase();
  if (key === "lb") return { quantity: Math.round(quantity * 454), unit: "g" };
  if (key === "oz") return { quantity: Math.round(quantity * 28), unit: "g" };
  if (gramsPerUnit[key]) {
    return { quantity: Math.round(quantity * gramsPerUnit[key]), unit: "ml" };
  }
  return { quantity, unit };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
