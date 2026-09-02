import { groq } from "next-sanity";

const recipeProjection = groq`{
  "_id": _id,
  "slug": slug.current,
  title,
  dishType,
  cuisine,
  category,
  "dietTags": coalesce(dietTags, []),
  "moodTags": coalesce(moodTags, []),
  difficulty,
  "prepMinutes": coalesce(prepMinutes, 0),
  "cookMinutes": coalesce(cookMinutes, 0),
  "servings": coalesce(servings, 1),
  "heroImage": heroImage.asset->url,
  "heroAlt": coalesce(heroImage.alt, title),
  intro,
  "ingredients": coalesce(ingredients, []),
  "steps": coalesce(steps, []),
  "equipment": coalesce(equipment, []),
  "tips": coalesce(tips, []),
  nutrition,
  flavor,
  "author": coalesce(author->name, "The Dish It Kitchen"),
  "featured": coalesce(featured, false),
  "publishedAt": coalesce(publishedAt, _createdAt)
}`;

export const allRecipesQuery = groq`*[_type == "recipe"] | order(publishedAt desc) ${recipeProjection}`;

export const recipeBySlugQuery = groq`*[_type == "recipe" && slug.current == $slug][0] ${recipeProjection}`;

export const allTechniquesQuery = groq`*[_type == "technique"] | order(name asc) {
  "slug": slug.current,
  name,
  summary,
  detail
}`;

export const drinkComponentsQuery = groq`*[_type == "drinkComponent"] | order(kind asc) {
  "id": slug.current,
  name,
  kind,
  color,
  flavor,
  perServing,
  note
}`;
