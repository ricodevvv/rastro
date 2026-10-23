import { findFindings } from "./findings";
import { formatValue, parseIso6709 } from "./format";
import type { Field, Group, GroupId, Report } from "./types";

type Track = Record<string, unknown> & { "@type": string; extra?: Record<string, unknown> };

const TRACK_GROUPS: Record<string, GroupId> = { General: "general", Video: "video", Audio: "audio", Image: "image" };

let factory: Promise<{ analyzeData: (size: number, read: (size: number, offset: number) => Promise<Uint8Array>) => Promise<unknown> }> | undefined;

function mediaInfo() {
  const url = "/vendor/mediainfo.js";
  factory ??= import(/* webpackIgnore: true */ url).then(({ default: create }) =>
    create({ format: "object", full: true, coverData: false, locateFile: () => "/vendor/MediaInfoModule.wasm" }),
  );
  return factory;
}

function trackFields(track: Track): Field[] {
  const fields: Field[] = [];
  for (const [key, value] of Object.entries({ ...track, ...(track.extra ?? {}) })) {
    if (key.startsWith("@") || key === "extra") continue;
    const text = formatValue(value);
    if (text) fields.push({ key, value: text });
  }
  return fields;
}

/**
 * Reads audio and video files with MediaInfo, which knows every container and tag format worth
 * knowing. Only the parts it asks for are read, so big videos are fine.
 */
export async function inspectMedia(file: File, base: Group): Promise<Report> {
  const info = await mediaInfo();
  const result = (await info.analyzeData(file.size, async (size, offset) => new Uint8Array(await file.slice(offset, offset + size).arrayBuffer()))) as {
    media?: { track: Track[] };
  };
  const groups: Group[] = [base];
  for (const track of result.media?.track ?? []) {
    const id = TRACK_GROUPS[track["@type"]] ?? "other";
    const fields = trackFields(track);
    const existing = groups.find((group) => group.id === id);
    if (existing) existing.fields.push(...fields);
    else if (fields.length) groups.push({ id, fields });
  }

  let gps: Report["gps"];
  for (const group of groups) {
    for (const field of group.fields) {
      if (/location|xyz|iso6709/i.test(field.key)) gps ??= parseIso6709(field.value);
    }
  }
  return {
    kind: "media",
    groups,
    findings: findFindings(groups, { encodedlibrary: "software", format: null }),
    gps,
    cleanable: false,
  };
}
