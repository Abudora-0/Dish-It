import { slugHash } from "@/lib/utils";
import type { DishType } from "@/lib/types";

type Palette = { bg: [string, string]; plate: string; blobs: string[] };

const palettes: Record<DishType, Palette> = {
  food: {
    bg: ["#f6e7cf", "#e7c9a0"],
    plate: "#fbf3e6",
    blobs: ["#c6512c", "#e0932f", "#6f8f4e", "#8a3b2f", "#de7b3a"],
  },
  dessert: {
    bg: ["#f7dde6", "#e7b7cf"],
    plate: "#fdf4ef",
    blobs: ["#b5477e", "#e58ab0", "#7b4a2e", "#f0c56a", "#d94f5c"],
  },
  shake: {
    bg: ["#f0e6d2", "#d8c39c"],
    plate: "#fffaf0",
    blobs: ["#caa15a", "#e2c17a", "#7d4a2c", "#5f8f5a", "#e8965a"],
  },
  drink: {
    bg: ["#dcebe6", "#a7cfd8"],
    plate: "#f2fbf8",
    blobs: ["#2f8f8a", "#5bb0a6", "#c0577a", "#e0a13a", "#4d7fb0"],
  },
  sauce: {
    bg: ["#f3dcc4", "#e0a878"],
    plate: "#fbefe0",
    blobs: ["#a8402a", "#d47a2c", "#6d8a45", "#8a2f28", "#e0a24a"],
  },
};

function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function DishArt({
  slug,
  dishType,
  className,
  rounded = true,
}: {
  slug: string;
  dishType: DishType;
  className?: string;
  rounded?: boolean;
}) {
  const palette = palettes[dishType] ?? palettes.food;
  const next = rng(slugHash(slug) + 7);
  const uid = slugHash(slug).toString(36);
  const isGlass = dishType === "shake" || dishType === "drink";

  const blobs = Array.from({ length: 7 }).map((_, i) => {
    const angle = next() * Math.PI * 2;
    const radius = 40 + next() * 150;
    return {
      cx: 400 + Math.cos(angle) * radius,
      cy: 300 + Math.sin(angle) * radius * 0.7,
      r: 26 + next() * 60,
      fill: palette.blobs[i % palette.blobs.length],
      o: 0.55 + next() * 0.4,
    };
  });

  return (
    <svg
      viewBox="0 0 800 600"
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={palette.bg[0]} />
          <stop offset="1" stopColor={palette.bg[1]} />
        </linearGradient>
        <clipPath id={`plate-${uid}`}>
          {isGlass ? (
            <path d="M300 120 L500 120 L470 500 Q400 540 330 500 Z" />
          ) : (
            <circle cx="400" cy="300" r="210" />
          )}
        </clipPath>
        <filter id={`soft-${uid}`}>
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      <rect width="800" height="600" fill={`url(#bg-${uid})`} rx={rounded ? 0 : 0} />

      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${360 + i * 30} 150 q ${18 - i * 12} -40 ${-6} -80 q -18 -30 6 -64`}
          stroke={palette.plate}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      ))}

      {isGlass ? (
        <path
          d="M300 120 L500 120 L470 500 Q400 540 330 500 Z"
          fill={palette.plate}
          stroke="#00000018"
          strokeWidth="3"
        />
      ) : (
        <>
          <circle cx="400" cy="300" r="210" fill={palette.plate} />
          <circle
            cx="400"
            cy="300"
            r="168"
            fill="none"
            stroke="#00000012"
            strokeWidth="3"
          />
        </>
      )}

      <g clipPath={`url(#plate-${uid})`}>
        <g filter={`url(#soft-${uid})`} opacity="0.9">
          {blobs.map((b, i) => (
            <circle
              key={i}
              cx={b.cx}
              cy={b.cy}
              r={b.r}
              fill={b.fill}
              opacity={b.o}
            />
          ))}
        </g>
        {blobs.slice(0, 4).map((b, i) => (
          <circle
            key={`d-${i}`}
            cx={b.cx + 12}
            cy={b.cy - 10}
            r={Math.max(4, b.r * 0.18)}
            fill="#ffffff"
            opacity="0.35"
          />
        ))}
      </g>

      <circle cx="400" cy="300" r={isGlass ? 0 : 210} fill="none" />
    </svg>
  );
}
