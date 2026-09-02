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
          alignItems: "center",
          justifyContent: "center",
          background: "#1c140e",
        }}
      >
        <div
          style={{
            width: 42,
            height: 18,
            borderRadius: 999,
            background: "#e8724c",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
