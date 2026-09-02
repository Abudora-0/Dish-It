import { cn } from "@/lib/utils";
import type { Difficulty, DishType } from "@/lib/types";

const dishTone: Record<DishType, string> = {
  food: "text-ember border-ember/30 bg-ember/10",
  dessert: "text-plum border-plum/30 bg-plum/10",
  shake: "text-saffron border-saffron/40 bg-saffron/10",
  drink: "text-blueberry border-blueberry/30 bg-blueberry/10",
  sauce: "text-ember-deep border-ember-deep/30 bg-ember-deep/10",
};

export function DishBadge({ type }: { type: DishType }) {
  return (
    <span
      className={cn(
        "chip border font-medium capitalize",
        dishTone[type] ?? dishTone.food,
      )}
    >
      {type}
    </span>
  );
}

const dots: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };

export function DifficultyMeter({ level }: { level: Difficulty }) {
  return (
    <span className="inline-flex items-center gap-1" title={`${level} difficulty`}>
      <span className="font-mono text-[0.7rem] uppercase tracking-wider text-fg-faint">
        {level}
      </span>
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              n <= dots[level] ? "bg-ember" : "bg-fg/20",
            )}
          />
        ))}
      </span>
    </span>
  );
}

export function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("chip", className)}>{children}</span>;
}
