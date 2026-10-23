import { decodePDFRawStream, EncryptedPDFError, PDFDict, PDFDocument, PDFHexString, PDFName, PDFRawStream, PDFString } from "pdf-lib";
import { findFindings } from "./findings";
import { formatDate } from "./format";
import type { Field, Group, Report } from "./types";
import { xmlFields } from "./xml";

function pdfDate(text: string) {
  const match = /^D:(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?/.exec(text);
  if (!match) return text;
  const [, y, mo = "01", d = "01", h = "00", mi = "00", s = "00"] = match;
  return `${formatDate(new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s)))}${text.slice(match[0].length)}`;
}

export async function loadPdf(bytes: Uint8Array) {
  try {
    return await PDFDocument.load(bytes, { updateMetadata: false });
  } catch (error) {
    if (error instanceof EncryptedPDFError || /encrypt/i.test(String(error))) throw new Error("encrypted");
    throw error;
  }
}

export function infoDict(doc: PDFDocument) {
  const ref = doc.context.trailerInfo.Info;
  return ref ? doc.context.lookupMaybe(ref, PDFDict) : undefined;
}

/**
 * Reads a PDF's document info (author, title, dates, the app that made it) and its XMP packet.
 */
export async function inspectPdf(file: File, base: Group): Promise<Report> {
  const doc = await loadPdf(new Uint8Array(await file.arrayBuffer()));
  const document: Field[] = [];
  for (const [key, value] of infoDict(doc)?.entries() ?? []) {
    if (!(value instanceof PDFString || value instanceof PDFHexString)) continue;
    const text = value.decodeText().replace(/\u0000/g, "").trim();
    if (text) document.push({ key: key.decodeText(), value: /Date$/.test(key.decodeText()) ? pdfDate(text) : text });
  }
  document.push({ key: "Pages", value: String(doc.getPageCount()) });

  const metadata = doc.catalog.lookup(PDFName.of("Metadata"));
  const xmp = metadata instanceof PDFRawStream ? xmlFields(new TextDecoder().decode(decodePDFRawStream(metadata).decode())) : [];

  const groups: Group[] = [base, { id: "document", fields: document }, { id: "xmp", fields: xmp }];
  return {
    kind: "pdf",
    groups: groups.filter((group) => group.fields.length),
    findings: findFindings(groups, { creator: "software", pages: null }),
    cleanable: true,
  };
}
