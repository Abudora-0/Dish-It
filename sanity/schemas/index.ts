import { recipe } from "@/sanity/schemas/recipe";
import { technique } from "@/sanity/schemas/technique";
import { drinkComponent } from "@/sanity/schemas/drink-component";
import { author } from "@/sanity/schemas/author";
import { ingredientLine } from "@/sanity/schemas/objects";
import { step } from "@/sanity/schemas/objects";
import { nutrition } from "@/sanity/schemas/objects";
import { flavorProfile } from "@/sanity/schemas/objects";

export const schemaTypes = [
  recipe,
  technique,
  drinkComponent,
  author,
  ingredientLine,
  step,
  nutrition,
  flavorProfile,
];
