/*
  Central place to read Sanity configuration. Everything is optional so the
  project builds and deploys with zero configuration using bundled seed data.
*/
export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const sanityApiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

export const isSanityConfigured = sanityProjectId.trim().length > 0;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dish-it.vercel.app";
