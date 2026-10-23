import { findFindings } from "./findings";
import { toFields } from "./format";
import type { Group, Report } from "./types";

const CAMERA = ["Make", "Model", "LensMake", "LensModel", "BodySerialNumber", "LensSerialNumber", "CameraOwnerName", "Software", "HostComputer", "Artist", "Copyright"];
const DATES = ["DateTimeOriginal", "CreateDate", "ModifyDate", "DateTime", "OffsetTime", "OffsetTimeOriginal", "OffsetTimeDigitized", "SubSecTimeOriginal"];

type Segments = Record<string, Record<string, unknown> | undefined>;

function pick(source: Record<string, unknown>, keys: string[]) {
  return Object.fromEntries(keys.filter((key) => key in source).map((key) => [key, source[key]]));
}

export const CLEANABLE_IMAGES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Reads EXIF, GPS, XMP, IPTC and ICC data from photos with exifr.
 */
export async function inspectImage(file: File, base: Group): Promise<Report> {
  const { default: exifr } = await import("exifr");
  const segments = ((await exifr.parse(file, {
    tiff: true,
    exif: true,
    gps: true,
    xmp: true,
    iptc: true,
    icc: true,
    jfif: true,
    ihdr: true,
    interop: false,
    ifd1: false,
    makerNote: false,
    userComment: true,
    mergeOutput: false,
    multiSegment: true,
    translateKeys: true,
    translateValues: true,
    reviveValues: true,
    sanitize: true,
  }).catch(() => undefined)) ?? {}) as Segments;

  const tiff = { ...(segments.ifd0 ?? {}), ...(segments.exif ?? {}) };
  const gps = segments.gps ?? {};
  const groups: Group[] = [
    base,
    { id: "location", fields: toFields(gps) },
    { id: "camera", fields: toFields(pick(tiff, CAMERA)) },
    { id: "dates", fields: toFields(pick(tiff, DATES)) },
    { id: "exif", fields: toFields(tiff, [...CAMERA, ...DATES]) },
    { id: "xmp", fields: toFields(segments.xmp) },
    { id: "iptc", fields: toFields(segments.iptc) },
    { id: "icc", fields: toFields(segments.icc) },
    { id: "image", fields: [...toFields(segments.jfif), ...toFields(segments.ihdr)] },
  ];

  const latitude = gps.latitude as number | undefined;
  const longitude = gps.longitude as number | undefined;
  return {
    kind: "image",
    groups: groups.filter((group) => group.fields.length),
    findings: findFindings(groups, { latitude: "location", longitude: "location" }),
    gps: typeof latitude === "number" && typeof longitude === "number" ? { latitude, longitude } : undefined,
    cleanable: CLEANABLE_IMAGES.includes(file.type),
  };
}
