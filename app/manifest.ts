import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dish It",
    short_name: "Dish It",
    description:
      "An animated recipe kitchen for food, shakes, and drinks. Explore by flavor and mood.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6efe2",
    theme_color: "#e8724c",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/icon", sizes: "192x192", type: "image/png" },
      { src: "/icon", sizes: "512x512", type: "image/png" },
    ],
  };
}
