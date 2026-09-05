/*
  Pulls a batch of recipes from TheMealDB into the seed format used by the
  hand written recipes. Run with:

    node scripts/import-themealdb.mjs

  The shared development key "1" caps list style endpoints and is not meant for
  a public site. Set THEMEALDB_KEY to a supporter key (a small one time PayPal
  payment on themealdb.com) before running the real import:

    THEMEALDB_KEY=your_key node scripts/import-themealdb.mjs

  Output: content/seed/imported-recipes.ts (git tracked, regenerate anytime).
  Attribution: recipe data and imagery are from TheMealDB, credited in the UI.
*/
import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const { parseMeasure } = await import(
  pathToFileURL(resolve(root, "lib/import/parse-measure.ts")).href
);

const KEY = process.env.THEMEALDB_KEY?.trim() || "1";
const BASE = `https://www.themealdb.com/api/json/v1/${KEY}`;
const MEALS_PER_AREA = KEY === "1" ? 6 : 14;

if (KEY === "1") {
  console.warn(
    "! Using the shared test key '1'. It is capped and not for production.\n" +
      "  Set THEMEALDB_KEY to a supporter key for the full import.\n",
  );
}

// A spread of well populated cuisines so the browse by country page has range.
const AREAS = [
  "American",
  "British",
  "Canadian",
  "Chinese",
  "Croatian",
  "Dutch",
  "Egyptian",
  "French",
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Jamaican",
  "Japanese",
  "Malaysian",
  "Mexican",
  "Moroccan",
  "Polish",
  "Portuguese",
  "Spanish",
  "Thai",
  "Tunisian",
  "Turkish",
  "Vietnamese",
];

const MOOD_BY_CATEGORY = {
  Dessert: ["indulgent"],
  Breakfast: ["quick", "cozy"],
  Side: ["quick"],
  Starter: ["quick"],
  Seafood: ["fresh"],
  Vegan: ["fresh"],
  Vegetarian: ["fresh"],
  Beef: ["comfort", "indulgent"],
  Lamb: ["comfort", "indulgent"],
  Pork: ["comfort"],
  Chicken: ["comfort"],
  Pasta: ["comfort"],
  Goat: ["comfort"],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// The project bans em and en dashes and prefers straight quotes. Source text
// from an external database has plenty of both.
function clean(value) {
  return (value ?? "")
    .replace(/\u2014/g, " - ")
    .replace(/\u2013/g, "-")
    .replace(/[\u2018\u2019\u201A\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u2033]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/ {2,}/g, " ");
}

async function getJson(url) {
  const res = await fetch(url, { headers: { "user-agent": "dish-it-import" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function toSteps(instructions) {
  const raw = (instructions ?? "").replace(/\r/g, "").trim();
  if (!raw) return [];
  let parts = raw
    .split(/\n{1,}/)
    .map((line) =>
      line
        .trim()
        .replace(/^step\s*\d+[.:)]?\s*/i, "")
        .replace(/^\d+[.):]\s*/, "")
        .trim(),
    )
    .filter(Boolean);

  // One long paragraph: fall back to sentence grouping.
  if (parts.length <= 1 && raw.length > 320) {
    const sentences = raw.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean);
    parts = [];
    for (let i = 0; i < sentences.length; i += 2) {
      parts.push(sentences.slice(i, i + 2).join(" ").trim());
    }
  }
  return parts.slice(0, 12).map((instruction) => ({
    instruction: clean(instruction),
  }));
}

function toIngredients(meal) {
  const lines = [];
  for (let i = 1; i <= 20; i += 1) {
    const item = clean((meal[`strIngredient${i}`] ?? "").trim()).trim();
    if (!item) continue;
    const { quantity, unit } = parseMeasure(meal[`strMeasure${i}`] ?? "");
    lines.push({ quantity, unit, item, pantry: false });
  }
  return lines;
}

function difficultyFor(ingredients, steps) {
  if (ingredients.length <= 6 && steps.length <= 4) return "easy";
  if (ingredients.length >= 12 || steps.length >= 9) return "hard";
  return "medium";
}

function article(word) {
  return /^[aeiou]/i.test(word) ? "An" : "A";
}

function introFor(meal) {
  const firstLine = (meal.strInstructions ?? "")
    .replace(/\r/g, "")
    .split("\n")
    .map((s) => s.trim())
    .find((s) => s.length > 40);
  const lead = firstLine ? firstLine.replace(/\s+/g, " ") : "";
  const trimmed =
    lead.length > 180 ? `${lead.slice(0, 177).trimEnd()}...` : lead;
  const area = meal.strArea ?? "global";
  const context = `${article(area)} ${area} ${(
    meal.strCategory ?? "recipe"
  ).toLowerCase()} dish.`;
  return clean(trimmed ? `${context} ${trimmed}` : context).trim();
}

function mapMeal(meal) {
  const ingredients = toIngredients(meal);
  const steps = toSteps(meal.strInstructions);
  const category = meal.strCategory ?? "Misc";
  const title = clean((meal.strMeal ?? "").trim()).trim();
  const dietTags = [];
  if (category === "Vegan") dietTags.push("vegan");
  if (category === "Vegetarian") dietTags.push("vegetarian");

  return {
    _id: `themealdb-${meal.idMeal}`,
    slug: slugify(title),
    title,
    dishType: category === "Dessert" ? "dessert" : "food",
    cuisine: meal.strArea || meal.strCountry || "Global",
    category,
    dietTags,
    moodTags: MOOD_BY_CATEGORY[category] ?? [],
    difficulty: difficultyFor(ingredients, steps),
    servings: 4,
    heroImage: meal.strMealThumb || "",
    heroAlt: `${title}, a ${meal.strArea ?? "global"} dish`,
    intro: introFor(meal),
    ingredients,
    steps,
    equipment: [],
    tips: [],
    author: "TheMealDB community",
    featured: false,
    publishedAt: "2025-01-01",
    source: {
      name: "TheMealDB",
      url: `https://www.themealdb.com/meal/${meal.idMeal}`,
    },
  };
}

async function run() {
  const collected = [];
  const seenSlug = new Map();

  for (const area of AREAS) {
    let summary;
    try {
      summary = await getJson(`${BASE}/filter.php?a=${encodeURIComponent(area)}`);
    } catch (err) {
      console.warn(`  skip ${area}: ${err.message}`);
      continue;
    }
    const ids = (summary.meals ?? []).slice(0, MEALS_PER_AREA).map((m) => m.idMeal);
    for (const id of ids) {
      await sleep(150);
      try {
        const detail = await getJson(`${BASE}/lookup.php?i=${id}`);
        const meal = detail.meals?.[0];
        if (!meal) continue;
        const recipe = mapMeal(meal);
        if (!recipe.ingredients.length || !recipe.steps.length) continue;
        const count = seenSlug.get(recipe.slug) ?? 0;
        seenSlug.set(recipe.slug, count + 1);
        if (count > 0) recipe.slug = `${recipe.slug}-${meal.idMeal}`;
        collected.push(recipe);
      } catch (err) {
        console.warn(`  skip meal ${id}: ${err.message}`);
      }
    }
    console.log(`  ${area}: ${ids.length}`);
  }

  collected.sort((a, b) => a.cuisine.localeCompare(b.cuisine) || a.title.localeCompare(b.title));

  const file =
    `import type { Recipe } from "@/lib/types";\n\n` +
    `/*\n` +
    `  Generated by scripts/import-themealdb.mjs. Do not edit by hand.\n` +
    `  Recipe data and imagery: TheMealDB (https://www.themealdb.com/).\n` +
    `*/\n` +
    `export const importedRecipes: Recipe[] = ${JSON.stringify(collected, null, 2)};\n`;

  writeFileSync(resolve(root, "content/seed/imported-recipes.ts"), file);
  console.log(
    `\nWrote ${collected.length} recipes across ${new Set(collected.map((r) => r.cuisine)).size} cuisines to content/seed/imported-recipes.ts`,
  );
}

run();
