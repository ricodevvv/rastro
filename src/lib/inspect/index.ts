import { formatBytes, formatDate } from "./format";
import { inspectImage } from "./image";
import { inspectMedia } from "./media";
import { inspectOffice, OFFICE_EXTENSIONS } from "./office";
import { inspectPdf } from "./pdf";
import type { Group, Report } from "./types";

function fileGroup(file: File): Group {
  return {
    id: "file",
    fields: [
      { key: "name", value: file.name },
      { key: "type", value: file.type || file.name.split(".").pop()?.toUpperCase() || "?" },
      { key: "size", value: formatBytes(file.size) },
      { key: "modified", value: formatDate(new Date(file.lastModified)) },
    ],
  };
}

/**
 * Picks the right reader for a file and returns everything it found, plus what that means for
 * the person sharing it.
 */
export async function inspect(file: File): Promise<Report> {
  const base = fileGroup(file);
  const name = file.name.toLowerCase();
  try {
    if (file.type === "application/pdf" || name.endsWith(".pdf")) return await inspectPdf(file, base);
    if (OFFICE_EXTENSIONS.test(name)) return await inspectOffice(file, base);
    if (file.type.startsWith("image/") || /\.(heic|heif|tiff?|avif|dng|cr2|nef|arw)$/.test(name)) return await inspectImage(file, base);
    return await inspectMedia(file, base);
  } catch (error) {
    return { kind: "other", groups: [base], findings: [], cleanable: false, error: (error as Error).message === "encrypted" ? "encrypted" : "error" };
  }
}

export type { Report } from "./types";
