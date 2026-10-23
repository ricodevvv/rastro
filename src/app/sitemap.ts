import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL ?? "http://localhost:3000";
  return LOCALES.flatMap((locale) => ["", "/privacy", "/terms"].map((path) => ({ url: `${base}/${locale}${path}` })));
}
