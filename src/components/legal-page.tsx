import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { LEGAL } from "@/lib/legal";

/**
 * Renders the privacy notice or the terms as a readable article, with a link to the other one.
 */
export function LegalPage({ kind, locale }: { kind: "privacy" | "terms"; locale: Locale }) {
  const doc = LEGAL[kind][locale];
  const other = LEGAL[kind === "privacy" ? "terms" : "privacy"][locale];
  return (
    <article className="appear pt-12 pb-4">
      <h1 className="text-[34px] leading-tight font-bold tracking-[-0.025em]">{doc.title}</h1>
      <p className="mt-1 text-[15px] text-secondary">{doc.updated}</p>
      <div className="mt-6 rounded-2xl bg-cell p-5 sm:p-7">
        <p className="text-[17px] leading-relaxed">{doc.intro}</p>
        <div className="mt-8 flex flex-col gap-7">
          {doc.sections.map((section, index) => (
            <section key={section.heading}>
              <h2 className="text-[20px] font-semibold tracking-[-0.015em]">
                <span className="mr-2 text-tertiary tabular-nums">{index + 1}.</span>
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-2 text-[16px] leading-relaxed text-label/80">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
      <Link
        href={`/${locale}/${kind === "privacy" ? "terms" : "privacy"}`}
        className="mt-4 flex items-center justify-between rounded-xl bg-cell px-4 py-3 text-[17px] text-blue hover:bg-fill"
      >
        {other.title}
        <span className="text-tertiary">›</span>
      </Link>
    </article>
  );
}
