import { defineField, defineType } from "sanity";

const kinds = [
  "base",
  "fruit",
  "green",
  "booster",
  "sweetener",
  "spice",
  "ice",
];

export const drinkComponent = defineType({
  name: "drinkComponent",
  title: "Drink component",
  type: "document",
  description: "Building blocks used by the Shake and Drink Mixer",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      type: "string",
      options: { list: kinds, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "color",
      type: "string",
      description: "Hex color used in the glass visualization",
    }),
    defineField({ name: "flavor", type: "flavorProfile" }),
    defineField({ name: "perServing", type: "nutrition" }),
    defineField({ name: "note", type: "text", rows: 2 }),
  ],
});
