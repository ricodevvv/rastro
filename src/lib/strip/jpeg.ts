const SOS = 0xda;
const KEEP_APP: Record<number, string> = { 0xe0: "JFIF", 0xe2: "ICC_PROFILE", 0xee: "Adobe" };

function startsWith(bytes: Uint8Array, offset: number, text: string) {
  for (let i = 0; i < text.length; i++) if (bytes[offset + i] !== text.charCodeAt(i)) return false;
  return true;
}

/** A tiny EXIF block holding only the orientation, so a cleaned photo still shows upright. */
function orientationSegment(orientation: number) {
  const payload = [0x45, 0x78, 0x69, 0x66, 0, 0, 0x4d, 0x4d, 0, 0x2a, 0, 0, 0, 8, 0, 1, 0x01, 0x12, 0, 3, 0, 0, 0, 1, 0, orientation, 0, 0, 0, 0, 0, 0];
  const length = payload.length + 2;
  return Uint8Array.from([0xff, 0xe1, length >> 8, length & 0xff, ...payload]);
}

/**
 * Removes EXIF, XMP, IPTC, comments and thumbnails from a JPEG without touching the image data.
 * The JFIF header, the color profile and the Adobe marker stay, since they affect how it looks.
 */
export function stripJpeg(bytes: Uint8Array, orientation?: number) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error("Not a JPEG");
  const parts: Uint8Array[] = [bytes.subarray(0, 2)];
  let offset = 2;
  let inserted = false;
  const insertOrientation = () => {
    if (!inserted && orientation && orientation !== 1) parts.push(orientationSegment(orientation));
    inserted = true;
  };
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) throw new Error("Broken JPEG");
    const marker = bytes[offset + 1];
    if (marker === 0xff) {
      offset++;
      continue;
    }
    if (marker === SOS) {
      insertOrientation();
      parts.push(bytes.subarray(offset));
      break;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      parts.push(bytes.subarray(offset, offset + 2));
      offset += 2;
      continue;
    }
    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    const end = offset + 2 + length;
    const isApp = marker >= 0xe0 && marker <= 0xef;
    const keep = isApp ? KEEP_APP[marker] !== undefined && startsWith(bytes, offset + 4, KEEP_APP[marker]) : marker !== 0xfe;
    if (keep) parts.push(bytes.subarray(offset, end));
    if (marker === 0xe0 && keep) insertOrientation();
    offset = end;
  }
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let at = 0;
  for (const part of parts) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}
