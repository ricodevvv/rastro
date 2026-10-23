import Link from "next/link";
import { AUTHOR_URL, getDictionary, GITHUB_URL, type Locale } from "@/lib/i18n";
import { LEGAL } from "@/lib/legal";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <footer className="mx-auto mt-20 w-full max-w-3xl px-4 pb-10">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t-[0.5px] pt-5 text-xs text-secondary">
        <span>
          {t.footer.made}{" "}
          <a href={AUTHOR_URL} target="_blank" rel="noreferrer" className="text-blue hover:underline">
            ricodevvv
          </a>
        </span>
        <Link href={`/${locale}/privacy`} className="text-blue hover:underline sm:ml-auto">
          {LEGAL.privacy[locale].title}
        </Link>
        <Link href={`/${locale}/terms`} className="text-blue hover:underline">
          {LEGAL.terms[locale].title}
        </Link>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-blue hover:underline">
          {t.footer.source}
        </a>
      </div>
    </footer>
  );
}
