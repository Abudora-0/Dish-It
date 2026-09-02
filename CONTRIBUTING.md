# Contributing to Dish It

Thanks for taking the time. This is a small project and easy to run.

## Setup

```bash
npm install
npm run dev
```

No environment variables are required. The site uses bundled seed data in
[`content/seed`](content/seed).

## Before you open a pull request

- `npm run lint` passes
- `npm run typecheck` passes
- `npm run build` succeeds
- New UI keeps keyboard support and a reduced motion path
- No em dashes anywhere in code, comments, content, or docs. Use a hyphen, a
  comma, or reword.

## Adding a recipe

Edit [`content/seed/recipes.ts`](content/seed/recipes.ts) and follow the shape in
[`lib/types.ts`](lib/types.ts). If you connect a Sanity project, add it through
`/studio` instead and it will show up automatically.

## Commit style

Short, present tense summaries. Group related changes. Keep formatting only
commits separate from behavior changes.

## Reporting bugs

Open an issue with steps to reproduce, what you expected, and what happened.
Screenshots help for anything visual.
