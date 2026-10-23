import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { getDictionary, isLocale, LOCALES } from "@/lib/i18n";
import "../globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
    title: t.site.title,
    description: t.site.description,
    alternates: { languages: { en: "/en", es: "/es" } },
    openGraph: { title: t.site.title, description: t.site.description, siteName: t.site.name, locale: lang === "es" ? "es_MX" : "en_US" },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang === "es" ? "es-MX" : "en"} suppressHydrationWarning className={inter.variable}>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <SiteHeader locale={lang} />
          <main className="mx-auto w-full max-w-3xl flex-1 px-4">{children}</main>
          <SiteFooter locale={lang} />
        </ThemeProvider>
      </body>
    </html>
  );
}
