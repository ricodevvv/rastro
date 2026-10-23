"use client";

import { ChevronRightIcon, DownloadIcon, MapPinIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { fieldCount, type Finding, type Group, type Report } from "@/lib/inspect/types";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/lib/use-dictionary";

export interface Entry {
  id: string;
  file: File;
  report?: Report;
  cleaned?: { file: File; report: Report };
  cleaning?: boolean;
}

const LEVEL_STYLES = {
  high: "bg-danger-soft text-danger",
  medium: "bg-warn-soft text-warn",
  low: "bg-muted text-muted-foreground",
};

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

function Findings({ findings }: { findings: Finding[] }) {
  const t = useDictionary();
  if (!findings.length) return <p className="text-sm text-muted-foreground">{t.report.noFindings}</p>;
  return (
    <ul className="flex flex-col gap-2">
      {findings.map((finding, index) => (
        <li key={finding.code} className="enter" style={{ "--delay": `${index * 60}ms` } as React.CSSProperties}>
          <div className="flex items-start gap-3">
            <span className={cn("mt-0.5 shrink-0 rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide uppercase", LEVEL_STYLES[finding.level])}>{t.levels[finding.level]}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium">{t.findings[finding.code]}</p>
              <p className="truncate font-mono text-xs text-muted-foreground">{finding.evidence.join(" · ")}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function MapBlock({ latitude, longitude }: { latitude: number; longitude: number }) {
  const t = useDictionary();
  const [open, setOpen] = useState(false);
  const bbox = [longitude - 0.008, latitude - 0.005, longitude + 0.008, latitude + 0.005].join(",");
  return (
    <div className="rounded-md border border-danger/30 bg-danger-soft/50 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <MapPinIcon className="size-4 text-danger" />
        <span className="font-mono text-sm">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </span>
        <div className="ml-auto flex gap-3 text-sm">
          {!open && (
            <button type="button" onClick={() => setOpen(true)} className="font-medium text-danger underline-offset-4 hover:underline">
              {t.report.map}
            </button>
          )}
          <a
            href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {t.report.openMap}
          </a>
        </div>
      </div>
      {open ? (
        <iframe
          title="map"
          className="enter mt-3 aspect-[16/9] w-full rounded-sm border"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`}
        />
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">{t.report.mapNote}</p>
      )}
    </div>
  );
}

function Groups({ groups }: { groups: Group[] }) {
  const t = useDictionary();
  const [query, setQuery] = useState("");
  const wanted = query.trim().toLowerCase();
  const labels = t.file as Record<string, string>;
  return (
    <div className="flex flex-col gap-3">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t.report.filter}
        aria-label={t.report.filter}
        className="h-9 w-full rounded-md border bg-surface px-3 text-sm outline-none focus-visible:border-accent"
      />
      {groups.map((group) => {
        const fields = group.fields.filter((field) => !wanted || `${field.key} ${field.value}`.toLowerCase().includes(wanted));
        if (!fields.length) return null;
        return (
          <details key={group.id} open={group.id !== "icc" && group.id !== "other"} className="group/details border-t pt-3">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground uppercase select-none">
              <ChevronRightIcon className="size-3.5 transition-transform group-open/details:rotate-90" />
              {t.groups[group.id]}
              <span className="font-mono font-normal normal-case">{fields.length}</span>
            </summary>
            <dl className="mt-2">
              {fields.map((field, index) => (
                <div key={`${field.key}-${index}`} className="grid grid-cols-[minmax(0,12rem)_1fr] gap-4 py-1.5 text-sm max-sm:grid-cols-1 max-sm:gap-0.5">
                  <dt className="truncate text-muted-foreground" title={field.key}>
                    {group.id === "file" ? labels[field.key] : field.key}
                  </dt>
                  <dd className="min-w-0 font-mono text-[13px] break-words">{field.value}</dd>
                </div>
              ))}
            </dl>
          </details>
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
    <article className="enter border-t pt-8">
      <header className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-mono text-base font-medium">{file.name}</h2>
          {report && !report.error && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {before} {t.report.fields}
            </p>
          )}
        </div>
        <button type="button" onClick={onRemove} aria-label={t.report.remove} className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
          <XIcon className="size-4" />
        </button>
      </header>

      {!report ? (
        <div className="relative mt-5 h-24 overflow-hidden rounded-md border bg-surface">
          <div className="scanline absolute inset-x-0 h-6 bg-gradient-to-b from-transparent via-accent-soft to-transparent" />
          <p className="absolute inset-0 grid place-items-center font-mono text-sm text-muted-foreground">{t.report.reading}…</p>
        </div>
      ) : report.error ? (
        <p className="mt-4 text-sm text-danger">{report.error === "encrypted" ? t.report.encrypted : t.report.error}</p>
      ) : (
        <div className="mt-5 flex flex-col gap-6">
          {report.gps && <MapBlock {...report.gps} />}
          <Findings findings={report.findings} />

          <div className="flex flex-wrap items-center gap-3">
            {cleaned ? (
              <button
                type="button"
                onClick={() => download(cleaned.file, cleanName(file.name))}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:text-background"
              >
                <DownloadIcon className="size-4" />
                {t.report.download}
              </button>
            ) : report.cleanable ? (
              <button
                type="button"
                onClick={onClean}
                disabled={entry.cleaning}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {entry.cleaning ? `${t.report.cleaning}…` : t.report.clean}
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">{t.report.noClean}</p>
            )}
            <button
              type="button"
              onClick={() => download(new Blob([toJson(report)], { type: "application/json" }), `${file.name}.metadata.json`)}
              className="inline-flex h-10 items-center rounded-md border px-3 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t.report.json}
            </button>
          </div>

          {cleaned && (
            <div className="enter rounded-md border border-accent/30 bg-accent-soft p-4 text-sm">
              <p>
                <span className="font-mono font-medium text-accent">−{Math.max(0, before - after)}</span> {t.report.removed}.{" "}
                {leftover.length ? `${t.report.leftover}: ${leftover.map((finding) => t.findings[finding.code]).join(", ")}.` : t.report.nothingLeft}
              </p>
            </div>
          )}

          <Groups groups={report.groups} />
        </div>
      )}
    </article>
  );
}
