/*
  Small single-stroke line icons for the hero's drifting ingredients. Each
  uses currentColor so it inherits the caller's text color and works in both
  themes without its own palette.
*/
type IconProps = { className?: string };

const shared = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ChiliIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <path d="M8 4c1.5 1 2 2.5 1.5 4" />
      <path d="M9 5.5c3 .5 6 3.5 6.5 8 .4 3.4-1.6 6-4 6-2.8 0-4.5-2.4-4-5.5.5-3 3-6.5 1.5-8.5Z" />
    </svg>
  );
}

export function LimeIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <path d="M12 3.5c.6-.8 1.6-1 2.3-.6" />
      <circle cx="12" cy="13" r="7.5" />
      <path d="M12 6.5V19.5M6 9.5l12 7M6 16.5l12-7" opacity="0.55" />
    </svg>
  );
}

export function MintIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <path d="M12 21V9" />
      <path d="M12 9c0-4 3-6.5 6.5-6.5C18 6.5 15.5 9.5 12 9Z" />
      <path d="M12 13c0-3-2.3-5-5.5-5C7 11.5 9 13.6 12 13Z" />
    </svg>
  );
}

export function CloveIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <path d="M12 3v6" />
      <ellipse cx="12" cy="12.5" rx="3.4" ry="4.2" />
      <path d="M8.8 16.2 6.5 19M15.2 16.2 17.5 19M12 16.7V20" />
    </svg>
  );
}

export function StarAniseIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="2.2" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 8;
        const x1 = 12 + Math.cos(angle) * 3.2;
        const y1 = 12 + Math.sin(angle) * 3.2;
        const x2 = 12 + Math.cos(angle) * 9;
        const y2 = 12 + Math.sin(angle) * 9;
        return <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} />;
      })}
    </svg>
  );
}

export function CitrusIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <path d="M3 12a9 9 0 0 1 18 0Z" />
      <path d="M12 12V3.3M12 12 5.8 6.3M12 12l6.2-5.7M12 12 4.3 9.6M12 12l7.7-2.4" opacity="0.55" />
    </svg>
  );
}

export function BasilIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <path d="M12 21V7" />
      <path d="M12 8c0-3.5 2.6-6 6-6 .3 3.6-2.2 6.4-6 6Z" />
      <path d="M12 8c0-3.5-2.6-6-6-6-.3 3.6 2.2 6.4 6 6Z" />
    </svg>
  );
}

export function PeppercornIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <circle cx="8.5" cy="14" r="3" />
      <circle cx="14.5" cy="8.5" r="3" />
      <circle cx="16" cy="16" r="2.4" />
    </svg>
  );
}
