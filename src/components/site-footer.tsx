import { AUTHOR_URL, getDictionary, GITHUB_URL, type Locale } from "@/lib/i18n";
import { Wordmark } from "@/components/wordmark";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <footer className="mx-auto mt-24 flex w-full max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 border-t px-5 py-8 text-sm text-muted-foreground">
      <Wordmark className="text-foreground" />
      <span>
        {t.footer.made}{" "}
        <a href={AUTHOR_URL} target="_blank" rel="noreferrer" className="text-foreground underline-offset-4 hover:underline">
          ricodevvv
        </a>
      </span>
      <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-foreground hover:underline sm:ml-auto">
        {t.footer.source}
      </a>
    </footer>
  );
}
