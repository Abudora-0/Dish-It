/*
  Generates content/seed/dishit-seed.ndjson from the bundled seed data so a
  fresh Sanity dataset can be populated with:
    npx sanity dataset import content/seed/dishit-seed.ndjson production

  Run with: node scripts/build-seed-ndjson.mjs
  Requires Node 22.6+ for native TypeScript import support.
*/
import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const load = (rel) => import(pathToFileURL(resolve(root, rel)).href);

const { recipes } = await load("content/seed/recipes.ts");
const { techniques } = await load("content/seed/techniques.ts");
const { drinkComponents } = await load("content/seed/drink-components.ts");

const slug = (current) => ({ _type: "slug", current });
const docs = [];

docs.push({
  _id: "author-dish-it-kitchen",
  _type: "author",
  name: "The Dish It Kitchen",
  bio: "Recipes tested on weeknights in a normal kitchen.",
});

for (const technique of techniques) {
  docs.push({
    _id: `technique-${technique.slug}`,
    _type: "technique",
    name: technique.name,
    slug: slug(technique.slug),
    summary: technique.summary,
    detail: technique.detail,
  });
}

for (const component of drinkComponents) {
  docs.push({
    _id: `drink-${component.id}`,
    _type: "drinkComponent",
    name: component.name,
    slug: slug(component.id),
    kind: component.kind,
    color: component.color,
    flavor: { _type: "flavorProfile", ...component.flavor },
    perServing: { _type: "nutrition", ...component.perServing },
    note: component.note,
  });
}

for (const recipe of recipes) {
  docs.push({
    _id: recipe._id,
    _type: "recipe",
    title: recipe.title,
    slug: slug(recipe.slug),
    dishType: recipe.dishType,
    cuisine: recipe.cuisine,
    category: recipe.category,
    intro: recipe.intro,
    dietTags: recipe.dietTags,
    moodTags: recipe.moodTags,
    difficulty: recipe.difficulty,
    prepMinutes: recipe.prepMinutes,
    cookMinutes: recipe.cookMinutes,
    servings: recipe.servings,
    equipment: recipe.equipment,
    tips: recipe.tips,
    featured: recipe.featured,
    publishedAt: new Date(recipe.publishedAt).toISOString(),
    author: { _type: "reference", _ref: "author-dish-it-kitchen" },
    nutrition: { _type: "nutrition", ...recipe.nutrition },
    flavor: { _type: "flavorProfile", ...recipe.flavor },
    ingredients: recipe.ingredients.map((line, index) => ({
      _key: `ing-${index}`,
      _type: "ingredientLine",
      quantity: line.quantity ?? undefined,
      unit: line.unit ?? undefined,
      item: line.item,
      note: line.note,
      group: line.group,
      pantry: line.pantry ?? false,
    })),
    steps: recipe.steps.map((step, index) => ({
      _key: `step-${index}`,
      _type: "step",
      instruction: step.instruction,
      durationMinutes: step.durationMinutes,
      technique: step.technique
        ? { _type: "reference", _ref: `technique-${step.technique}` }
        : undefined,
    })),
  });
}

const ndjson = docs.map((doc) => JSON.stringify(doc)).join("\n") + "\n";
writeFileSync(resolve(root, "content/seed/dishit-seed.ndjson"), ndjson);
console.log(`Wrote ${docs.length} documents to content/seed/dishit-seed.ndjson`);
