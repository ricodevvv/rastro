"use client";

import { zipSync } from "fflate";
import { useCallback, useEffect, useRef, useState } from "react";
import { cleanName, download, ReportView, type Entry } from "@/components/report-view";
import { inspect } from "@/lib/inspect";
import { strip } from "@/lib/strip";
import { useDictionary } from "@/lib/use-dictionary";

let counter = 0;

export function MetadataApp() {
  const t = useDictionary();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const update = (id: string, change: Partial<Entry>) => setEntries((current) => current.map((entry) => (entry.id === id ? { ...entry, ...change } : entry)));

  const add = useCallback((files: File[]) => {
    const fresh = files.map((file) => ({ id: `e${counter++}`, file }));
    setEntries((current) => [...fresh, ...current]);
    for (const entry of fresh) inspect(entry.file).then((report) => update(entry.id, { report }));
  }, []);

  const clean = async (entry: Entry) => {
    update(entry.id, { cleaning: true });
    try {
      const file = await strip(entry.file);
      update(entry.id, { cleaning: false, cleaned: { file, report: await inspect(file) } });
    } catch {
      update(entry.id, { cleaning: false });
    }
  };

  const cleanAll = async () => {
    const zip: Record<string, Uint8Array> = {};
    for (const entry of entries.filter((item) => item.report?.cleanable)) {
      const file = entry.cleaned?.file ?? (await strip(entry.file));
      let name = cleanName(entry.file.name);
      for (let i = 2; zip[name]; i++) name = cleanName(entry.file.name).replace(/(\.[^.]+)?$/, `-${i}$1`);
      zip[name] = new Uint8Array(await file.arrayBuffer());
    }
    if (Object.keys(zip).length) download(new Blob([zipSync(zip, { level: 0 }) as BlobPart], { type: "application/zip" }), "rastro-clean.zip");
  };

  useEffect(() => {
    let depth = 0;
    const enter = (event: DragEvent) => {
      if (!event.dataTransfer?.types.includes("Files")) return;
      depth++;
      setDragging(true);
    };
    const leave = () => {
      depth = Math.max(0, depth - 1);
      if (!depth) setDragging(false);
    };
    const over = (event: DragEvent) => event.preventDefault();
    const drop = (event: DragEvent) => {
      event.preventDefault();
      depth = 0;
      setDragging(false);
      const files = Array.from(event.dataTransfer?.files ?? []);
      if (files.length) add(files);
    };
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragleave", leave);
    window.addEventListener("dragover", over);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("dragover", over);
      window.removeEventListener("drop", drop);
    };
  }, [add]);

  const cleanable = entries.filter((entry) => entry.report?.cleanable).length;

  return (
    <div>
      <input
        ref={input}
        type="file"
        multiple
        className="sr-only"
        onChange={(event) => {
          add(Array.from(event.target.files ?? []));
          event.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => input.current?.click()}
        data-dragging={dragging}
        className="group flex w-full flex-col items-start gap-1 rounded-md border border-dashed bg-surface px-6 py-10 text-left transition-colors hover:border-foreground/40 data-[dragging=true]:border-accent data-[dragging=true]:bg-accent-soft"
      >
        <span className="text-lg font-medium">
          {t.drop.title} <span className="text-muted-foreground">{t.drop.or}</span>{" "}
          <span className="text-accent underline decoration-accent/40 underline-offset-4 group-hover:decoration-accent">{t.drop.choose}</span>
        </span>
        <span className="text-sm text-muted-foreground">{t.drop.formats}</span>
        <span className="mt-3 font-mono text-xs text-muted-foreground">↳ {t.drop.local}</span>
      </button>

      {entries.length > 1 && (
        <div className="enter mt-6 flex flex-wrap items-center gap-3">
          {cleanable > 1 && (
            <button type="button" onClick={cleanAll} className="inline-flex h-9 items-center rounded-md bg-foreground px-3.5 text-sm font-medium text-background hover:opacity-90">
              {t.report.downloadAll}
            </button>
          )}
          <button type="button" onClick={() => setEntries([])} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            {t.report.clear}
          </button>
        </div>
      )}

      <div className="mt-10 flex flex-col gap-10">
        {entries.map((entry) => (
          <ReportView key={entry.id} entry={entry} onClean={() => clean(entry)} onRemove={() => setEntries((current) => current.filter((item) => item.id !== entry.id))} />
        ))}
      </div>
    </div>
  );
}
