/**
 * Removes the EXIF and XMP chunks from a WebP and clears their flags in the VP8X header.
 */
export function stripWebp(bytes: Uint8Array) {
  const parts: Uint8Array[] = [];
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const type = String.fromCharCode(...bytes.subarray(offset, offset + 4));
    const size = bytes[offset + 4] | (bytes[offset + 5] << 8) | (bytes[offset + 6] << 16) | (bytes[offset + 7] << 24);
    const end = offset + 8 + size + (size % 2);
    if (type !== "EXIF" && type !== "XMP ") {
      const chunk = bytes.slice(offset, end);
      if (type === "VP8X") chunk[8] &= ~(0x08 | 0x04);
      parts.push(chunk);
    }
    offset = end;
  }
  const body = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(12 + body);
  out.set(bytes.subarray(0, 12));
  const riff = body + 4;
  out[4] = riff & 0xff;
  out[5] = (riff >> 8) & 0xff;
  out[6] = (riff >> 16) & 0xff;
  out[7] = (riff >> 24) & 0xff;
  let at = 12;
  for (const part of parts) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}
