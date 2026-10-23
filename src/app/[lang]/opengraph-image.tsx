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
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, background: "#f2f2f7", color: "#000", textAlign: "center", padding: 80 }}>
        <div style={{ display: "flex", width: 120, height: 120, borderRadius: 27, background: "linear-gradient(180deg, #5ac8fa, #007aff)", alignItems: "center", justifyContent: "center" }}>
          <svg width="72" height="72" viewBox="0 0 32 32" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 9V7a2 2 0 0 1 2-2h2M23 5h2a2 2 0 0 1 2 2v2M27 23v2a2 2 0 0 1-2 2h-2M9 27H7a2 2 0 0 1-2-2v-2" />
            <circle cx="15" cy="15" r="5" />
            <path d="m19 19 4 4" />
          </svg>
        </div>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#007aff" }}>Rastro</div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1.05, maxWidth: 1000 }}>{t.hero.title}</div>
        <div style={{ display: "flex", fontSize: 28, color: "rgba(60,60,67,0.6)" }}>metadata.ricodevvv.com</div>
      </div>
    ),
    size,
  );
}
