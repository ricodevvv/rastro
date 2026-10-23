import { notFound } from "next/navigation";
import { MetadataApp } from "@/components/metadata-app";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <>
      <section className="pt-16 pb-12 sm:pt-24">
        <p className="enter font-mono text-xs tracking-wider text-accent uppercase">{t.hero.eyebrow}</p>
        <h1 className="enter mt-4 max-w-2xl text-4xl leading-[1.08] font-semibold tracking-[-0.035em] text-balance sm:text-6xl" style={{ "--delay": "80ms" } as React.CSSProperties}>
          {t.hero.title}
        </h1>
        <p className="enter mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground" style={{ "--delay": "160ms" } as React.CSSProperties}>
          {t.hero.subtitle}
        </p>
      </section>

      <section className="enter" style={{ "--delay": "240ms" } as React.CSSProperties}>
        <MetadataApp />
      </section>

      <section className="mt-24 border-t pt-12">
        <h2 className="text-2xl font-semibold tracking-tight">{t.learn.title}</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{t.learn.text}</p>
        <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-3">
          {t.learn.items.map((item) => (
            <div key={item.title}>
              <dt className="font-mono text-xs tracking-wider text-accent uppercase">{item.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</dd>
            </div>
          ))}
        </dl>
        <h2 className="mt-14 text-2xl font-semibold tracking-tight">{t.learn.cleanTitle}</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{t.learn.cleanText}</p>
      </section>
    </>
  );
}
