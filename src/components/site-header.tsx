import Link from "next/link";
import { LocaleSwitch, ThemeToggle } from "@/components/header-controls";
import { Wordmark } from "@/components/wordmark";
import type { Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="material-bar sticky top-0 z-40 border-b-[0.5px]">
      <div className="mx-auto flex h-12 max-w-3xl items-center px-4">
        <Link href={`/${locale}`} aria-label="Rastro">
          <Wordmark />
        </Link>
        <nav className="ml-auto flex items-center">
          <LocaleSwitch />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
