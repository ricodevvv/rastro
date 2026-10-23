import { strFromU8, strToU8, unzipSync, zipSync, type Zippable } from "fflate";

const CORE = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></cp:coreProperties>`;
const APP = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"></Properties>`;
const META = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" office:version="1.3"><office:meta/></office:document-meta>`;

const AUTHORED = /^(word\/[^/]+\.xml|xl\/comments\d*\.xml|ppt\/commentAuthors\.xml)$/;

function anonymize(xml: string) {
  return xml
    .replace(/w:author="[^"]*"/g, 'w:author="Author"')
    .replace(/w:initials="[^"]*"/g, 'w:initials="A"')
    .replace(/<author>[^<]*<\/author>/g, "<author>Author</author>")
    .replace(/(<p:cmAuthor[^>]*\s)name="[^"]*"/g, '$1name="Author"')
    .replace(/(<p:cmAuthor[^>]*\s)initials="[^"]*"/g, '$1initials="A"');
}

/**
 * Empties the document properties of an Office or OpenDocument file, drops custom properties,
 * and replaces the names on comments and tracked changes with "Author". Content isn't touched.
 */
export function stripOffice(bytes: Uint8Array) {
  const files = unzipSync(bytes);
  const out: Zippable = {};
  if (files.mimetype) out.mimetype = [files.mimetype, { level: 0 }];
  for (const [path, data] of Object.entries(files)) {
    if (path === "mimetype" || path === "docProps/custom.xml") continue;
    if (path === "docProps/core.xml") out[path] = strToU8(CORE);
    else if (path === "docProps/app.xml") out[path] = strToU8(APP);
    else if (path === "meta.xml") out[path] = strToU8(META);
    else if (path === "_rels/.rels") out[path] = strToU8(strFromU8(data).replace(/<Relationship[^>]*Target="\/?docProps\/custom\.xml"[^>]*\/>/g, ""));
    else if (path === "[Content_Types].xml") out[path] = strToU8(strFromU8(data).replace(/<Override[^>]*PartName="\/docProps\/custom\.xml"[^>]*\/>/g, ""));
    else if (AUTHORED.test(path)) out[path] = strToU8(anonymize(strFromU8(data)));
    else out[path] = data;
  }
  return zipSync(out, { level: 6 });
}
