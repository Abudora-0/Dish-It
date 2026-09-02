import { defineField, defineType } from "sanity";

export const ingredientLine = defineType({
  name: "ingredientLine",
  title: "Ingredient",
  type: "object",
  fields: [
    defineField({ name: "quantity", type: "number", title: "Quantity" }),
    defineField({ name: "unit", type: "string", title: "Unit" }),
    defineField({
      name: "item",
      type: "string",
      title: "Item",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "note", type: "string", title: "Note" }),
    defineField({ name: "group", type: "string", title: "Group heading" }),
    defineField({ name: "pantry", type: "boolean", title: "Pantry staple" }),
  ],
  preview: {
    select: { quantity: "quantity", unit: "unit", item: "item" },
    prepare: ({ quantity, unit, item }) => ({
      title: [quantity, unit, item].filter(Boolean).join(" "),
    }),
  },
});

export const step = defineType({
  name: "step",
  title: "Step",
  type: "object",
  fields: [
    defineField({
      name: "instruction",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "durationMinutes",
      type: "number",
      title: "Timer minutes",
    }),
    defineField({
      name: "technique",
      type: "reference",
      to: [{ type: "technique" }],
    }),
  ],
  preview: {
    select: { instruction: "instruction" },
    prepare: ({ instruction }) => ({ title: instruction }),
  },
});

export const nutrition = defineType({
  name: "nutrition",
  title: "Nutrition per serving",
  type: "object",
  options: { columns: 3 },
  fields: [
    defineField({ name: "calories", type: "number" }),
    defineField({ name: "protein", type: "number" }),
    defineField({ name: "carbs", type: "number" }),
    defineField({ name: "fat", type: "number" }),
    defineField({ name: "sugar", type: "number" }),
    defineField({ name: "fiber", type: "number" }),
  ],
});

export const flavorProfile = defineType({
  name: "flavorProfile",
  title: "Flavor profile",
  type: "object",
  options: { columns: 4 },
  description: "Rate each axis from 0 to 10",
  fields: [
    defineField({ name: "sweet", type: "number", initialValue: 0 }),
    defineField({ name: "salty", type: "number", initialValue: 0 }),
    defineField({ name: "sour", type: "number", initialValue: 0 }),
    defineField({ name: "bitter", type: "number", initialValue: 0 }),
    defineField({ name: "umami", type: "number", initialValue: 0 }),
    defineField({ name: "fat", type: "number", initialValue: 0 }),
    defineField({ name: "spicy", type: "number", initialValue: 0 }),
  ],
});
