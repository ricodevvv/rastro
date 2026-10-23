import type { Field } from "./types";

function keyFor(element: Element): string {
  if (element.getAttribute("name")) return element.getAttribute("name")!;
  let current: Element | null = element;
  while (current && (current.prefix === "rdf" || current.prefix === "vt")) current = current.parentElement;
  return current?.tagName ?? element.tagName;
}

/**
 * Collects every leaf element and attribute of an XML document as fields. Handles XMP lists
 * (rdf:li), which take the name of the property they belong to, and Office custom properties,
 * which keep their name in an attribute.
 */
export function xmlFields(text: string): Field[] {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (doc.getElementsByTagName("parsererror").length) return [];
  const fields: Field[] = [];
  const add = (key: string, value: string | null | undefined) => {
    const clean = value?.replace(/\s+/g, " ").trim();
    if (!clean) return;
    const existing = fields.find((field) => field.key === key);
    if (existing && !existing.value.split(", ").includes(clean)) existing.value += `, ${clean}`;
    else if (!existing) fields.push({ key, value: clean });
  };
  for (const element of Array.from(doc.getElementsByTagName("*"))) {
    for (const attribute of Array.from(element.attributes)) {
      if (attribute.name.startsWith("xmlns") || attribute.prefix === "rdf" || attribute.name === "name" || attribute.name === "fmtid" || attribute.name === "pid") continue;
      if (element === doc.documentElement) continue;
      add(attribute.name, attribute.value);
    }
    if (!element.children.length && element !== doc.documentElement) add(keyFor(element), element.textContent);
  }
  return fields;
}
