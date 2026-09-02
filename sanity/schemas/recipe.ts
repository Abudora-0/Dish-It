import { defineField, defineType } from "sanity";

const dishTypes = ["food", "shake", "drink", "dessert", "sauce"];
const difficulties = ["easy", "medium", "hard"];
const moods = [
  "cozy",
  "fiery",
  "fresh",
  "indulgent",
  "quick",
  "post-gym",
  "celebration",
  "comfort",
];

export const recipe = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  groups: [
    { name: "main", title: "Overview", default: true },
    { name: "build", title: "Ingredients and steps" },
    { name: "meta", title: "Flavor and nutrition" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "main",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "main",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dishType",
      type: "string",
      group: "main",
      options: { list: dishTypes, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "cuisine", type: "string", group: "main" }),
    defineField({ name: "category", type: "string", group: "main" }),
    defineField({
      name: "heroImage",
      type: "image",
      group: "main",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "intro",
      type: "text",
      rows: 3,
      group: "main",
    }),
    defineField({
      name: "dietTags",
      type: "array",
      of: [{ type: "string" }],
      group: "main",
      options: { layout: "tags" },
    }),
    defineField({
      name: "moodTags",
      type: "array",
      of: [{ type: "string" }],
      group: "main",
      options: { list: moods, layout: "tags" },
    }),
    defineField({
      name: "difficulty",
      type: "string",
      group: "main",
      options: { list: difficulties, layout: "radio" },
    }),
    defineField({ name: "prepMinutes", type: "number", group: "main" }),
    defineField({ name: "cookMinutes", type: "number", group: "main" }),
    defineField({
      name: "servings",
      type: "number",
      group: "main",
      initialValue: 2,
    }),
    defineField({
      name: "ingredients",
      type: "array",
      of: [{ type: "ingredientLine" }],
      group: "build",
    }),
    defineField({
      name: "steps",
      type: "array",
      of: [{ type: "step" }],
      group: "build",
    }),
    defineField({
      name: "equipment",
      type: "array",
      of: [{ type: "string" }],
      group: "build",
      options: { layout: "tags" },
    }),
    defineField({
      name: "tips",
      type: "array",
      of: [{ type: "text", rows: 2 }],
      group: "build",
    }),
    defineField({ name: "nutrition", type: "nutrition", group: "meta" }),
    defineField({ name: "flavor", type: "flavorProfile", group: "meta" }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      group: "meta",
    }),
    defineField({ name: "featured", type: "boolean", group: "meta" }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "dishType", media: "heroImage" },
  },
});
