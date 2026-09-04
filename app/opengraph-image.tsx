import { ImageResponse } from "next/og";

export const alt = "Dish It - an animated recipe kitchen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #1c140e 0%, #3a2113 100%)",
          color: "#f6ecd9",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", width: 12, height: 12, borderRadius: 12, background: "#e8724c" }} />
            <div style={{ display: "flex", width: 76, height: 38, borderRadius: "40px 40px 0 0", background: "#f6ecd9" }} />
            <div style={{ display: "flex", width: 88, height: 11, borderRadius: 6, background: "#f6ecd9" }} />
          </div>
          <div style={{ fontSize: 30, letterSpacing: 10, opacity: 0.65, paddingBottom: 6 }}>
            DISH IT
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 38, color: "#f2a83c" }}>
            Food, shakes, and drinks
          </div>
          <div style={{ fontSize: 82, fontWeight: 600, lineHeight: 1.05, maxWidth: 900 }}>
            Cook the thing you are actually craving
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, opacity: 0.6 }}>
          Explore by flavor and mood at dish-it
        </div>
      </div>
    ),
    size,
  );
}
