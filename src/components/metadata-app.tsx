"use client";

import { zipSync } from "fflate";
import { FileSearchIcon, LockIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cleanName, download, ReportView, type Entry } from "@/components/report-view";
import { inspect } from "@/lib/inspect";
import { strip } from "@/lib/strip";
import Link from "next/link";
import { useDictionary, useLocale } from "@/lib/use-dictionary";

let counter = 0;

export function MetadataApp() {
  const t = useDictionary();
  const locale = useLocale();
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
      <div
        data-dragging={dragging}
        className="flex flex-col items-center gap-4 rounded-2xl bg-cell px-6 py-12 text-center transition-all duration-300 data-[dragging=true]:scale-[1.01] data-[dragging=true]:bg-blue-tint data-[dragging=true]:ring-2 data-[dragging=true]:ring-blue"
      >
        <span className="grid size-14 place-items-center rounded-full bg-blue-tint text-blue">
          <FileSearchIcon className="size-7" />
        </span>
        <div>
          <p className="text-[20px] font-semibold tracking-[-0.02em]">{t.drop.title}</p>
          <p className="mt-1 text-[15px] text-secondary">{t.drop.formats}</p>
        </div>
        <button type="button" onClick={() => input.current?.click()} className="spring h-11 rounded-full bg-blue px-6 text-[17px] font-medium text-white hover:opacity-90">
          {t.drop.choose}
        </button>
        <p className="flex items-center gap-1.5 text-[13px] text-secondary">
          <LockIcon className="size-3.5" />
          {t.drop.local}
        </p>
      </div>
      <p className="mt-2 text-center text-[12px] text-secondary">
        <Link href={`/${locale}/terms`} className="hover:underline">
          {t.drop.legal}
        </Link>
      </p>

      {entries.length > 1 && (
        <div className="appear mt-4 flex flex-wrap items-center justify-center gap-3">
          {cleanable > 1 && (
            <button type="button" onClick={cleanAll} className="spring h-9 rounded-full bg-blue-tint px-4 text-[15px] font-medium text-blue">
              {t.report.downloadAll}
            </button>
          )}
          <button type="button" onClick={() => setEntries([])} className="spring h-9 rounded-full px-3 text-[15px] text-blue hover:bg-fill">
            {t.report.clear}
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-6">
        {entries.map((entry) => (
          <ReportView key={entry.id} entry={entry} onClean={() => clean(entry)} onRemove={() => setEntries((current) => current.filter((item) => item.id !== entry.id))} />
        ))}
      </div>
    </div>
  );
}
