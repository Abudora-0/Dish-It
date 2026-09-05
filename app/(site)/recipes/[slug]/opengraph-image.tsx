import { ImageResponse } from "next/og";
import { getRecipe } from "@/lib/content";
import { formatTotalTime } from "@/lib/utils";

export const alt = "Dish It recipe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  const title = recipe?.title ?? "Dish It";
  const meta = recipe
    ? `${recipe.cuisine} - ${formatTotalTime(
        recipe.prepMinutes,
        recipe.cookMinutes,
      )} - ${recipe.difficulty}`
    : "An animated recipe kitchen";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #1c140e 0%, #3a2113 100%)",
          color: "#f6ecd9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div style={{ display: "flex", width: 9, height: 9, borderRadius: 9, background: "#e8724c" }} />
            <div style={{ display: "flex", width: 56, height: 28, borderRadius: "30px 30px 0 0", background: "#f6ecd9" }} />
            <div style={{ display: "flex", width: 64, height: 8, borderRadius: 4, background: "#f6ecd9" }} />
          </div>
          <div style={{ fontSize: 26, letterSpacing: 8, opacity: 0.7, paddingBottom: 4 }}>
            DISH IT
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 40, color: "#f2a83c" }}>{meta}</div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
            {title}
          </div>
        </div>
        <div style={{ fontSize: 26, opacity: 0.65 }}>
          Explore by flavor and mood at dish-it
        </div>
      </div>
    ),
    size,
  );
}
