"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useDictionary, useLocale } from "@/lib/use-dictionary";

const control = "grid h-8 min-w-8 place-items-center rounded-md px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useDictionary();
  return (
    <button type="button" aria-label={t.nav.theme} className={control} onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      <SunIcon className="hidden size-4 dark:block" />
      <MoonIcon className="size-4 dark:hidden" />
    </button>
  );
}

export function LocaleSwitch() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useDictionary();
  const other = locale === "en" ? "es" : "en";
  return (
    <Link href={pathname.replace(/^\/(en|es)/, `/${other}`)} hrefLang={other} aria-label={t.nav.language} className={`${control} font-mono text-xs uppercase`}>
      {other}
    </Link>
  );
}
