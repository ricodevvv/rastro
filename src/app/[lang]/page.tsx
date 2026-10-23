import { CameraIcon, FileTextIcon, VideoIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { MetadataApp } from "@/components/metadata-app";
import { AppIcon } from "@/components/wordmark";
import { getDictionary, isLocale } from "@/lib/i18n";

const LEARN_ICONS = [
  { Icon: CameraIcon, color: "bg-orange" },
  { Icon: FileTextIcon, color: "bg-blue" },
  { Icon: VideoIcon, color: "bg-purple" },
];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <>
      <section className="flex flex-col items-center pt-14 pb-10 text-center sm:pt-20">
        <AppIcon className="appear size-20 shadow-[0_12px_32px_-10px_rgb(0_122_255/45%)]" glyph="size-10" />
        <p className="appear mt-6 text-[17px] font-semibold text-blue" style={{ "--delay": "60ms" } as React.CSSProperties}>
          {t.hero.eyebrow}
        </p>
        <h1
          className="appear mt-2 max-w-2xl text-[40px] leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-[56px]"
          style={{ "--delay": "120ms" } as React.CSSProperties}
        >
          {t.hero.title}
        </h1>
        <p className="appear mt-4 max-w-xl text-[19px] leading-[1.45] text-pretty text-secondary sm:text-[21px]" style={{ "--delay": "180ms" } as React.CSSProperties}>
          {t.hero.subtitle}
        </p>
      </section>

      <section className="appear" style={{ "--delay": "240ms" } as React.CSSProperties}>
        <MetadataApp />
      </section>

      <section className="mt-20">
        <h2 className="text-center text-[28px] font-semibold tracking-[-0.02em]">{t.learn.title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[17px] leading-relaxed text-secondary">{t.learn.text}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {t.learn.items.map((item, index) => {
            const { Icon, color } = LEARN_ICONS[index];
            return (
              <div key={item.title} className="rounded-2xl bg-cell p-5">
                <span className={`grid size-8 place-items-center rounded-[8px] text-white ${color}`}>
                  <Icon className="size-[18px]" />
                </span>
                <h3 className="mt-3 text-[17px] font-semibold">{item.title}</h3>
                <p className="mt-1 text-[15px] leading-snug text-secondary">{item.text}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-3 rounded-2xl bg-cell p-5">
          <h3 className="text-[17px] font-semibold">{t.learn.cleanTitle}</h3>
          <p className="mt-1 text-[15px] leading-snug text-secondary">{t.learn.cleanText}</p>
        </div>
      </section>
    </>
  );
}
