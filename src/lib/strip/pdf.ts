import { PDFDict, PDFName, PDFRef } from "pdf-lib";
import { loadPdf } from "../inspect/pdf";

const KEYS = [PDFName.of("Metadata"), PDFName.of("PieceInfo")];

/**
 * Drops a PDF's document info and XMP metadata, at the document and page level. The objects
 * themselves are deleted too, since pdf-lib would otherwise keep writing them out unreferenced.
 */
export async function stripPdf(bytes: Uint8Array) {
  const doc = await loadPdf(bytes);
  const remove = (owner: PDFDict) => {
    for (const key of KEYS) {
      const value = owner.get(key);
      if (value instanceof PDFRef) doc.context.delete(value);
      owner.delete(key);
    }
  };
  const info = doc.context.trailerInfo.Info;
  if (info instanceof PDFRef) doc.context.delete(info);
  doc.context.trailerInfo.Info = undefined;
  remove(doc.catalog);
  doc.getPages().forEach((page) => remove(page.node));
  return doc.save({ updateFieldAppearances: false });
}
