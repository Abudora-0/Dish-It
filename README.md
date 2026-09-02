<div align="center">

<img src=".github/assets/logo.svg" alt="Dish It" width="420" />

### Cook the thing you are actually craving

An animated recipe kitchen for food, shakes, and drinks. Explore by flavor and
mood, follow a full screen cook mode with real timers, and build your own drinks
in the mixer. Every control was made to match the food.

[![License: MIT](https://img.shields.io/badge/License-MIT-e8724c.svg?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Sanity](https://img.shields.io/badge/Sanity-CMS-f03e2f?style=flat-square&logo=sanity)](https://www.sanity.io)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-ready-000000?style=flat-square&logo=vercel)](https://vercel.com)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-3f7d3f?style=flat-square)](CONTRIBUTING.md)

[Live demo](https://dish-it.vercel.app) &nbsp;&middot;&nbsp; [Report a bug](https://github.com/Abudora-0/Dish-It/issues) &nbsp;&middot;&nbsp; [Request a feature](https://github.com/Abudora-0/Dish-It/issues)

`recipes` &nbsp; `nextjs` &nbsp; `react` &nbsp; `typescript` &nbsp; `tailwindcss` &nbsp; `framer-motion` &nbsp; `sanity` &nbsp; `pwa` &nbsp; `ui-ux`

</div>

---

## Why this exists

Most recipe sites feel the same. Dish It is a small counter argument. The
scrollbar drips like sauce, the number counters roll like an old till, the theme
switch is a stove dial, the dropdowns open like a lifting pot lid, and the logo
tosses a pan on a loop. It is a portfolio piece that takes the interface as
seriously as the content.

## Highlights

| | Feature | What it does |
|---|---|---|
| 01 | **Smart recipe explorer** | Filter by cuisine, diet, mood, time, and what is already in your pantry. The grid re-sorts live and the results reorder by how much of each recipe you can make right now. URL synced so any view is shareable. |
| 02 | **Interactive cook mode** | Full screen, one step at a time, with stacking countdown timers that keep running while you chop, a screen wake lock, servings scaling, and a herb confetti finish. |
| 03 | **Flavor and mood wheel** | Drag the wheel or tap a craving. It resolves to a shortlist that matches how you want to eat, blending mood tags with each recipe's flavor vector. |
| 04 | **Shake and drink mixer** | Drop parts into the glass and watch it fill and layer. Live nutrition, a flavor radar, layered or blended views, and a URL encoded share link that rebuilds the exact drink. |
| + | **Your kitchen** | A saved cookbook, a categorized shopping list with a chop to check animation, and a drag and drop weekly meal planner that turns the week into one shopping list. All on device, no account. |
| + | **Extras** | Command palette search (Ctrl or Cmd + K), animated macro donuts and flavor radars, per recipe Open Graph images, Recipe JSON-LD, a print optimized recipe card, PWA manifest, full keyboard support, reduced motion variants, and a Konami code easter egg. |

## Design system: "Mise en Place"

- Token driven light and dark themes with a no flash inline script
- Display type in Fraunces, body in Inter, numerals in Space Mono
- Generative SVG dish art so no recipe is ever missing a hero image
- Subtle film grain, steam loops, and a spring based motion language
- Every custom control lives in [`components/ui`](components/ui) and is keyboard accessible

## Tech stack

- **Next.js 16** App Router, React 19, Server Components, static generation, Metadata API
- **Tailwind CSS v4** with a CSS first token theme
- **motion** (Framer Motion) for the logo, transitions, the wheel, and the glass
- **Sanity** headless CMS with an embedded Studio at `/studio`
- Content adapter pattern: reads Sanity when configured, bundled seed data otherwise
- No database and no required environment variables to deploy

## Quick start

```bash
git clone https://github.com/Abudora-0/Dish-It.git
cd Dish-It
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site runs on bundled
seed recipes with zero configuration.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint with ESLint |
| `npm run typecheck` | Type check with `tsc` |

## Connect the CMS (optional)

The content layer works without Sanity. To manage recipes from a dashboard:

1. Run `npx sanity@latest init` in the project folder and sign in. It creates a
   project and prints a project id.
2. Copy `.env.example` to `.env.local` and fill in the values.
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```
3. Seed your dataset with the starter content:
   ```bash
   npx sanity dataset import content/seed/dishit-seed.ndjson production
   ```
4. Restart the dev server and open `/studio`.

Once `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, every page reads from Sanity
automatically. Nothing else changes.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Abudora-0/Dish-It)

The project needs no environment variables to deploy. Add the Sanity keys later
in the Vercel dashboard to switch the content source.

## Project structure

```
app/
  (site)/            Public pages: home, recipes, discover, mixer, planner, ...
  studio/            Embedded Sanity Studio
  icon.tsx           Generated favicon
  sitemap.ts         Dynamic sitemap and robots
components/
  brand/             The animated logo
  ui/                Themed controls: scrollbar, odometer, stove knob, ...
  recipe/  cook/  mixer/  discover/  planner/  viz/
content/seed/        Bundled recipes, techniques, drink parts, plus NDJSON export
lib/
  content/           The Sanity or seed data adapter
  hooks/             Local storage state: cookbook, shopping list, planner, timers
  types.ts           One shared content shape
sanity/schemas/      CMS document and object schemas
```

## Accessibility

- Skip link, semantic landmarks, and visible focus rings
- Full keyboard support for the palette, dropdowns, wheel, and cook mode
- `prefers-reduced-motion` disables loops and swaps in static states
- Contrast checked palette in both themes

## Roadmap

- [ ] Optional Sanity backed reviews and ratings
- [ ] Shared cookbooks via a short link
- [ ] Unit test coverage for the content adapter and scaling helpers
- [ ] More seed recipes and a sauces section
- [ ] Voice guided cook mode

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the setup
and the ground rules, and please keep the no em dash house style.

## License

[MIT](LICENSE) &copy; 2026 Dish It
