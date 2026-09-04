import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          background: "#14100d",
        }}
      >
        <div style={{ display: "flex", width: 7, height: 7, borderRadius: 7, background: "#e0552e", marginBottom: 1 }} />
        <div
          style={{
            display: "flex",
            width: 40,
            height: 21,
            borderRadius: "21px 21px 0 0",
            background: "#f6efe2",
          }}
        />
        <div style={{ display: "flex", width: 48, height: 6, borderRadius: 3, background: "#f6efe2" }} />
      </div>
    ),
    size,
  );
}
