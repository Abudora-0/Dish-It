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

export function GarlicIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <path d="M12 3c1 1.5 1 3 0 4" />
      <path d="M12 7c-4 0-6 3.5-6 8 0 3 2.6 4.5 6 4.5s6-1.5 6-4.5c0-4.5-2-8-6-8Z" />
      <path d="M9 9c-1 3-1 7 0 10M15 9c1 3 1 7 0 10" opacity="0.5" />
    </svg>
  );
}

export function WhiskIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <path d="M12 3v9" />
      <path d="M12 12c-3 0-5-2.5-5-5s2-4 5-4M12 12c3 0 5-2.5 5-5s-2-4-5-4M12 12V3" opacity="0.7" />
      <rect x="9.5" y="12" width="5" height="9" rx="2.5" />
    </svg>
  );
}

export function RollingPinIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <rect x="5" y="9" width="14" height="6" rx="3" />
      <path d="M3 12h2M19 12h2" />
    </svg>
  );
}

export function SaltIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <path d="M8 9h8l1 11H7Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      <path d="M10.5 6.5v.01M13.5 6v.01M12 5v.01" />
    </svg>
  );
}

export function BayLeafIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <path d="M5 19C5 11 10 5 19 5c0 8-5 14-14 14Z" />
      <path d="M8 16 16 8" opacity="0.5" />
    </svg>
  );
}

export function CinnamonIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <path d="M7 4c2 0 3.5 1 3.5 3v13c0 1-1.4 2-3.5 2S3.5 21 3.5 20V7C3.5 5 5 4 7 4Z" />
      <path d="M13 4c2 0 3.5 1 3.5 3v13" />
      <path d="M10.5 6.5H16" opacity="0.5" />
    </svg>
  );
}

export function CoffeeBeanIcon({ className }: IconProps) {
  return (
    <svg {...shared} className={className} aria-hidden="true">
      <ellipse cx="12" cy="12" rx="6" ry="8.5" transform="rotate(28 12 12)" />
      <path d="M9 6c2 3 2 9 4 12" />
    </svg>
  );
}
