import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "radial-gradient(900px 380px at 70% 18%, rgba(167,139,250,.30) 0%, transparent 60%), radial-gradient(700px 320px at 25% 75%, rgba(108,207,255,.30) 0%, transparent 60%), #06080F",
          color: "#F0F0F3",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, color: "#6CCFFF", textTransform: "uppercase" }}>
          AI / ML Engineer · Mindcres
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.92 }}>
          <div style={{ fontSize: 140, fontWeight: 800, textTransform: "uppercase", letterSpacing: -1 }}>
            UDAY KIRAN
          </div>
          <div
            style={{
              fontSize: 140,
              fontStyle: "italic",
              color: "#F5E0AA",
              letterSpacing: -2,
            }}
          >
            Battula.
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#CFD2DC", opacity: 0.85 }}>
          uday-kiran-battula.vercel.app
        </div>
      </div>
    ),
    size
  );
}
