import Link from "next/link";
import { LocaleSwitch, ThemeToggle } from "@/components/header-controls";
import { Wordmark } from "@/components/wordmark";
import { GITHUB_URL, type Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="mx-auto flex h-16 w-full max-w-3xl items-center px-5">
      <Link href={`/${locale}`} className="text-lg">
        <Wordmark />
      </Link>
      <nav className="ml-auto flex items-center gap-1 text-sm">
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          GitHub
        </a>
        <LocaleSwitch />
        <ThemeToggle />
      </nav>
    </header>
  );
}
