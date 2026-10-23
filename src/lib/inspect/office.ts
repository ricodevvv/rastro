import { strFromU8, unzipSync } from "fflate";
import { findFindings } from "./findings";
import type { Field, Group, Report } from "./types";
import { xmlFields } from "./xml";

const AUTHOR_FILES = /^(word\/(document|comments|footnotes|endnotes|header\d*|footer\d*)\.xml|xl\/comments\d*\.xml|ppt\/commentAuthors\.xml)$/;

/**
 * Finds the people who left tracked changes or comments, which Word, Excel and PowerPoint keep
 * by name inside the document itself.
 */
function revisionAuthors(files: Record<string, Uint8Array>) {
  const names = new Set<string>();
  for (const [path, data] of Object.entries(files)) {
    if (!AUTHOR_FILES.test(path)) continue;
    const text = strFromU8(data);
    for (const match of text.matchAll(/w:author="([^"]+)"|<author>([^<]+)<\/author>|<p:cmAuthor[^>]*\sname="([^"]+)"/g)) {
      const name = (match[1] ?? match[2] ?? match[3]).trim();
      if (name) names.add(name);
    }
  }
  return [...names];
}

export const OFFICE_EXTENSIONS = /\.(docx|xlsx|pptx|docm|xlsm|pptm|odt|ods|odp)$/i;

/**
 * Reads the properties Office and LibreOffice keep inside their zip files: author, company,
 * last editor, editing time, plus anyone who left comments or tracked changes.
 */
export async function inspectOffice(file: File, base: Group): Promise<Report> {
  const files = unzipSync(new Uint8Array(await file.arrayBuffer()), {
    filter: (entry) => /^(docProps\/(core|app|custom)\.xml|meta\.xml)$/.test(entry.name) || AUTHOR_FILES.test(entry.name),
  });
  const read = (path: string) => (files[path] ? xmlFields(strFromU8(files[path])) : []);
  const document: Field[] = [...read("docProps/core.xml"), ...read("docProps/app.xml"), ...read("meta.xml")];
  const authors = revisionAuthors(files);
  if (authors.length) document.push({ key: "Revision authors", value: authors.join(", ") });

  const groups: Group[] = [base, { id: "document", fields: document }, { id: "custom", fields: read("docProps/custom.xml") }];
  return {
    kind: "office",
    groups: groups.filter((group) => group.fields.length),
    findings: findFindings(groups),
    cleanable: true,
  };
}
