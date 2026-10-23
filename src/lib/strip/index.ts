import { OFFICE_EXTENSIONS } from "../inspect/office";
import { stripJpeg } from "./jpeg";
import { stripOffice } from "./office";
import { stripPdf } from "./pdf";
import { stripPng } from "./png";
import { stripWebp } from "./webp";

async function orientationOf(file: File) {
  const { default: exifr } = await import("exifr");
  return (await exifr.orientation(file).catch(() => undefined)) ?? undefined;
}

/**
 * Returns a copy of the file without its metadata, in the same format and with the same name.
 */
export async function strip(file: File): Promise<File> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const name = file.name.toLowerCase();
  let data: Uint8Array;
  if (file.type === "image/jpeg") data = stripJpeg(bytes, await orientationOf(file));
  else if (file.type === "image/png") data = stripPng(bytes);
  else if (file.type === "image/webp") data = stripWebp(bytes);
  else if (file.type === "application/pdf" || name.endsWith(".pdf")) data = await stripPdf(bytes);
  else if (OFFICE_EXTENSIONS.test(name)) data = stripOffice(bytes);
  else throw new Error("unsupported");
  return new File([data as BlobPart], file.name, { type: file.type, lastModified: Date.now() });
}
