import { ImageResponse } from "next/og";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = getDictionary(isLocale(lang) ? lang : "en");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#f6f5f1", color: "#1b1b18" }}>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
          rastro<span style={{ color: "#1f6f5c" }}>.</span>
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05, maxWidth: 980 }}>{t.hero.title}</div>
        <div style={{ display: "flex", gap: 28, fontSize: 28, color: "#6b6a63" }}>
          <span style={{ color: "#b4361c" }}>GPS</span>
          <span>EXIF</span>
          <span>XMP</span>
          <span>PDF</span>
          <span>DOCX</span>
          <span>MP4</span>
          <span style={{ marginLeft: "auto" }}>metadata.ricodevvv.com</span>
        </div>
      </div>
    ),
    size,
  );
}
