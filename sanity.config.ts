"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@/sanity/schemas";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "@/lib/env";

export default defineConfig({
  name: "dish-it",
  title: "Dish It Studio",
  basePath: "/studio",
  projectId: sanityProjectId || "placeholder",
  dataset: sanityDataset,
  plugins: [structureTool(), visionTool({ defaultApiVersion: sanityApiVersion })],
  schema: { types: schemaTypes },
});
