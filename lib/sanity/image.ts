import imageUrlBuilder from "@sanity/image-url";
import { sanityDataset, sanityProjectId, isSanityConfigured } from "@/lib/env";

const builder = isSanityConfigured
  ? imageUrlBuilder({ projectId: sanityProjectId, dataset: sanityDataset })
  : null;

/*
  Accepts either a Sanity image reference object or a plain string. Returns a
  usable URL or an empty string when the source is not a CMS image.
*/
export function urlForImage(source: unknown): string {
  if (!source) return "";
  if (typeof source === "string") {
    return source.startsWith("http") ? source : "";
  }
  if (!builder) return "";
  try {
    return builder.image(source as never).width(1400).fit("crop").auto("format").url();
  } catch {
    return "";
  }
}
