export type DishType = "food" | "shake" | "drink" | "dessert" | "sauce";

export type Difficulty = "easy" | "medium" | "hard";

export type FlavorProfile = {
  sweet: number;
  salty: number;
  sour: number;
  bitter: number;
  umami: number;
  fat: number;
  spicy: number;
};

export type Mood =
  | "cozy"
  | "fiery"
  | "fresh"
  | "indulgent"
  | "quick"
  | "post-gym"
  | "celebration"
  | "comfort";

export type IngredientLine = {
  quantity: number | null;
  unit: string | null;
  item: string;
  note?: string;
  group?: string;
  pantry?: boolean;
};

export type Step = {
  instruction: string;
  durationMinutes?: number;
  technique?: string;
};

export type Nutrition = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar?: number;
  fiber?: number;
};

export type Recipe = {
  _id: string;
  slug: string;
  title: string;
  dishType: DishType;
  cuisine: string;
  category: string;
  dietTags: string[];
  moodTags: Mood[];
  difficulty: Difficulty;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
  heroImage: string;
  heroAlt: string;
  intro: string;
  ingredients: IngredientLine[];
  steps: Step[];
  equipment: string[];
  tips: string[];
  nutrition: Nutrition;
  flavor: FlavorProfile;
  author: string;
  featured: boolean;
  publishedAt: string;
};

export type Technique = {
  slug: string;
  name: string;
  summary: string;
  detail: string;
};

export type DrinkComponentKind =
  | "base"
  | "fruit"
  | "green"
  | "booster"
  | "sweetener"
  | "spice"
  | "ice";

export type DrinkComponent = {
  id: string;
  name: string;
  kind: DrinkComponentKind;
  color: string;
  flavor: Partial<FlavorProfile>;
  perServing: Nutrition;
  note: string;
};
