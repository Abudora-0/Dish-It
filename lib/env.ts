/*
  Central place to read Sanity configuration. Everything is optional so the
  project builds and deploys with zero configuration using bundled seed data.
*/
export const sanityProjectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "").trim();
export const sanityDataset =
  (process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production").trim() || "production";
export const sanityApiVersion =
  (process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01").trim() ||
  "2024-10-01";

// Sanity project ids are lowercase alphanumeric with dashes. Guarding the
// format means a stray placeholder value never reaches the client factory.
export const isSanityConfigured = /^[a-z0-9-]+$/.test(sanityProjectId);

const DEFAULT_SITE_URL = "https://dish-it.vercel.app";

/*
  Resolve the public site URL from the environment, tolerating a missing value,
  a bare host with no scheme, stray whitespace, or an unusable placeholder that
  a hosting platform may inject for a sensitive variable. Falls back to the
  Vercel deployment URL, then to a stable default, so `new URL()` never throws
  during the build.
*/
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value || value.startsWith("[")) continue;
    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withScheme).origin;
    } catch {
      // try the next candidate
    }
  }
  return DEFAULT_SITE_URL;
}

export const siteUrl = resolveSiteUrl();
