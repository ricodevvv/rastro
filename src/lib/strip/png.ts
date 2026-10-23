const KEEP = new Set(["tRNS", "gAMA", "cHRM", "sRGB", "iCCP", "sBIT", "pHYs", "bKGD", "acTL", "fcTL", "fdAT", "cICP", "mDCv", "cLLI", "hIST", "sPLT"]);

/**
 * Removes text chunks, EXIF and timestamps from a PNG. Image data, transparency, color
 * information and animation frames stay as they were.
 */
export function stripPng(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const parts: Uint8Array[] = [bytes.subarray(0, 8)];
  let offset = 8;
  while (offset < bytes.length) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
    const end = offset + 12 + length;
    const critical = type[0] === type[0].toUpperCase();
    if (critical || KEEP.has(type)) parts.push(bytes.subarray(offset, end));
    offset = end;
    if (type === "IEND") break;
  }
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let at = 0;
  for (const part of parts) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}
