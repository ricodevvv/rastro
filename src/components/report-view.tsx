"use client";

import {
  AppWindowIcon,
  BarcodeIcon,
  Building2Icon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  DownloadIcon,
  FileIcon,
  HistoryIcon,
  MapPinIcon,
  MessageSquareTextIcon,
  SearchIcon,
  SmartphoneIcon,
  UserIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { fieldCount, type Finding, type FindingCode, type Group, type Report } from "@/lib/inspect/types";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/use-dictionary";

export interface Entry {
  id: string;
  file: File;
  report?: Report;
  cleaned?: { file: File; report: Report };
  cleaning?: boolean;
}

const FINDING_ICONS: Record<FindingCode, { Icon: LucideIcon; color: string }> = {
  location: { Icon: MapPinIcon, color: "bg-red" },
  author: { Icon: UserIcon, color: "bg-orange" },
  serial: { Icon: BarcodeIcon, color: "bg-purple" },
  device: { Icon: SmartphoneIcon, color: "bg-blue" },
  company: { Icon: Building2Icon, color: "bg-indigo" },
  history: { Icon: HistoryIcon, color: "bg-yellow" },
  software: { Icon: AppWindowIcon, color: "bg-teal" },
  date: { Icon: CalendarIcon, color: "bg-green" },
  comments: { Icon: MessageSquareTextIcon, color: "bg-gray" },
};

const LEVEL_TEXT = { high: "text-red", medium: "text-orange", low: "text-secondary" };

export function download(file: Blob, name: string) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function cleanName(name: string) {
  return name.replace(/(\.[^.]+)?$/, "-clean$1");
}

function Section({ title, footer, children }: { title?: React.ReactNode; footer?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      {title && <h3 className="mb-1.5 px-4 text-[13px] text-secondary">{title}</h3>}
      <div className="inset-list overflow-hidden rounded-xl bg-cell">{children}</div>
      {footer && <p className="mt-1.5 px-4 text-[13px] leading-snug text-secondary">{footer}</p>}
    </section>
  );
}

function Findings({ findings }: { findings: Finding[] }) {
  const t = useDictionary();
  if (!findings.length) {
    return (
      <Section>
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="grid size-[30px] place-items-center rounded-[7px] bg-green text-white">
            <CheckIcon className="size-[18px]" />
          </span>
          <span className="text-[17px]">{t.report.noFindings}</span>
        </div>
      </Section>
    );
  }
  return (
    <Section title={t.report.findingsTitle}>
      {findings.map((finding, index) => {
        const { Icon, color } = FINDING_ICONS[finding.code];
        return (
          <div key={finding.code} className="appear flex items-center gap-3 py-2.5 pr-4 pl-4 [--inset:58px]" style={{ "--delay": `${index * 50}ms` } as React.CSSProperties}>
            <span className={cn("grid size-[30px] shrink-0 place-items-center rounded-[7px] text-white", color)}>
              <Icon className="size-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[17px] leading-tight">{t.findings[finding.code]}</p>
              <p className="mt-0.5 truncate text-[13px] text-secondary">{finding.evidence.join(" · ")}</p>
            </div>
            <span className={cn("shrink-0 text-[15px]", LEVEL_TEXT[finding.level])}>{t.levels[finding.level]}</span>
          </div>
        );
      })}
    </Section>
  );
}

function MapBlock({ latitude, longitude }: { latitude: number; longitude: number }) {
  const t = useDictionary();
  const [open, setOpen] = useState(false);
  const bbox = [longitude - 0.008, latitude - 0.005, longitude + 0.008, latitude + 0.005].join(",");
  return (
    <Section title={t.groups.location} footer={open ? undefined : t.report.mapNote}>
      {open && (
        <iframe
          title="map"
          className="appear aspect-[16/9] w-full border-0"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`}
        />
      )}
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="grid size-[30px] shrink-0 place-items-center rounded-[7px] bg-red text-white">
          <MapPinIcon className="size-[18px]" />
        </span>
        <span className="min-w-0 flex-1 font-mono text-[15px]">
          {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </span>
        {!open && (
          <button type="button" onClick={() => setOpen(true)} className="spring text-[17px] text-blue">
            {t.report.map}
          </button>
        )}
      </div>
      <a
        href={`https://maps.apple.com/?ll=${latitude},${longitude}&q=${latitude},${longitude}`}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between px-4 py-3 text-[17px] text-blue [--inset:16px] hover:bg-fill"
      >
        {t.report.openMap}
        <ChevronRightIcon className="size-4 text-tertiary" />
      </a>
    </Section>
  );
}

function Groups({ groups }: { groups: Group[] }) {
  const t = useDictionary();
  const [query, setQuery] = useState("");
  const [closed, setClosed] = useState<Record<string, boolean>>({ icc: true, other: true });
  const wanted = query.trim().toLowerCase();
  const labels = t.file as Record<string, string>;
  return (
    <div className="flex flex-col gap-6">
      <label className="flex h-9 items-center gap-2 rounded-[10px] bg-fill px-2.5">
        <SearchIcon className="size-4 text-secondary" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.report.filter}
          aria-label={t.report.filter}
          className="h-full flex-1 bg-transparent text-[17px] outline-none placeholder:text-secondary"
        />
      </label>
      {groups.map((group) => {
        const fields = group.fields.filter((field) => !wanted || `${field.key} ${field.value}`.toLowerCase().includes(wanted));
        if (!fields.length) return null;
        const isClosed = closed[group.id] && !wanted;
        return (
          <section key={group.id}>
            <button
              type="button"
              onClick={() => setClosed({ ...closed, [group.id]: !isClosed })}
              aria-expanded={!isClosed}
              className="mb-1.5 flex w-full items-center gap-1 px-4 text-left text-[13px] text-secondary"
            >
              {t.groups[group.id]}
              <span className="text-tertiary">· {fields.length}</span>
              <ChevronRightIcon className={cn("ml-auto size-3.5 text-blue transition-transform duration-300", !isClosed && "rotate-90")} />
            </button>
            {!isClosed && (
              <dl className="inset-list overflow-hidden rounded-xl bg-cell">
                {fields.map((field, index) => (
                  <div key={`${field.key}-${index}`} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5 px-4 py-[11px]">
                    <dt className="shrink-0 text-[15px]">{group.id === "file" ? labels[field.key] : field.key}</dt>
                    <dd className="min-w-0 text-right text-[15px] break-words text-secondary sm:max-w-[60%]">{field.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        );
      })}
    </div>
  );
}

function toJson(report: Report) {
  return JSON.stringify(
    {
      findings: report.findings.map((finding) => ({ type: finding.code, level: finding.level, evidence: finding.evidence })),
      gps: report.gps,
      metadata: Object.fromEntries(report.groups.map((group) => [group.id, Object.fromEntries(group.fields.map((field) => [field.key, field.value]))])),
    },
    null,
    2,
  );
}

/**
 * Everything found in one file: what it gives away, where it was taken, every field, and the
 * button to clean it.
 */
export function ReportView({ entry, onClean, onRemove }: { entry: Entry; onClean: () => void; onRemove: () => void }) {
  const t = useDictionary();
  const { file, report, cleaned } = entry;
  const before = report ? fieldCount(report) : 0;
  const after = cleaned ? fieldCount(cleaned.report) : 0;
  const leftover = cleaned?.report.findings.filter((finding) => finding.level !== "low") ?? [];

  return (
    <article className="appear flex flex-col gap-6 pt-4">
      <header className="flex items-center gap-3 rounded-2xl bg-cell px-4 py-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-fill text-secondary">
          <FileIcon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[17px] font-semibold">{file.name}</h2>
          <p className="text-[13px] text-secondary">
            {report && !report.error ? `${before} ${t.report.fields}` : `${t.report.reading}…`}
          </p>
        </div>
        <button type="button" onClick={onRemove} aria-label={t.report.remove} className="spring grid size-8 place-items-center rounded-full bg-fill text-secondary">
          <XIcon className="size-4" />
        </button>
      </header>

      {!report ? (
        <div className="relative h-20 overflow-hidden rounded-xl bg-cell">
          <div className="sweep absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-blue-tint to-transparent" />
        </div>
      ) : report.error ? (
        <Section>
          <p className="px-4 py-3 text-[15px] text-red">{report.error === "encrypted" ? t.report.encrypted : t.report.error}</p>
        </Section>
      ) : (
        <>
          {report.gps && <MapBlock {...report.gps} />}
          <Findings findings={report.findings} />

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            {cleaned ? (
              <button
                type="button"
                onClick={() => download(cleaned.file, cleanName(file.name))}
                className="spring inline-flex h-12 items-center justify-center gap-2 rounded-full bg-blue px-6 text-[17px] font-medium text-white hover:opacity-90"
              >
                <DownloadIcon className="size-[18px]" />
                {t.report.download}
              </button>
            ) : report.cleanable ? (
              <button
                type="button"
                onClick={onClean}
                disabled={entry.cleaning}
                className="spring inline-flex h-12 items-center justify-center rounded-full bg-blue px-6 text-[17px] font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {entry.cleaning ? `${t.report.cleaning}…` : t.report.clean}
              </button>
            ) : (
              <p className="px-4 text-[13px] text-secondary">{t.report.noClean}</p>
            )}
            <button
              type="button"
              onClick={() => download(new Blob([toJson(report)], { type: "application/json" }), `${file.name}.metadata.json`)}
              className="spring inline-flex h-12 items-center justify-center rounded-full bg-blue-tint px-5 text-[17px] font-medium text-blue"
            >
              {t.report.json}
            </button>
          </div>

          {cleaned && (
            <Section>
              <div className="appear flex items-center gap-3 px-4 py-3">
                <span className="grid size-[30px] shrink-0 place-items-center rounded-[7px] bg-green text-white">
                  <CheckIcon className="size-[18px]" />
                </span>
                <p className="text-[15px]">
                  <span className="font-semibold">
                    {Math.max(0, before - after)} {t.report.removed}.
                  </span>{" "}
                  <span className="text-secondary">
                    {leftover.length ? `${t.report.leftover}: ${leftover.map((finding) => t.findings[finding.code]).join(", ")}.` : t.report.nothingLeft}
                  </span>
                </p>
              </div>
            </Section>
          )}

          <Groups groups={report.groups} />
        </>
      )}
    </article>
  );
}
