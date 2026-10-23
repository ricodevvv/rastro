import type { Field } from "./types";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * Turns whatever a parser returned into a short, readable string, or undefined when there's
 * nothing worth showing.
 */
export function formatValue(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : formatDate(value);
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") {
    const text = value.replace(/\u0000/g, "").trim();
    return text || undefined;
  }
  if (value instanceof Uint8Array || value instanceof ArrayBuffer) return `(${value.byteLength} bytes)`;
  if (Array.isArray(value)) {
    const parts = value.map(formatValue).filter(Boolean);
    if (!parts.length) return undefined;
    return parts.length > 24 ? `${parts.slice(0, 24).join(", ")}, …` : parts.join(", ");
  }
  if (typeof value === "object") {
    const parts = Object.entries(value as Record<string, unknown>)
      .map(([key, inner]) => {
        const text = formatValue(inner);
        return text ? `${key}: ${text}` : undefined;
      })
      .filter(Boolean);
    return parts.length ? parts.join("; ") : undefined;
  }
  return String(value);
}

export function toFields(source: Record<string, unknown> | undefined, skip: string[] = []): Field[] {
  if (!source) return [];
  return Object.entries(source)
    .filter(([key]) => !skip.includes(key))
    .map(([key, value]) => ({ key, value: formatValue(value) }))
    .filter((field): field is Field => field.value !== undefined);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Parses ISO 6709 coordinates like "+19.4326-099.1332+2240.000/", as phones store them in videos. */
export function parseIso6709(text: string) {
  const match = /([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)/.exec(text);
  if (!match) return undefined;
  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return undefined;
  return { latitude, longitude };
}
