import type { Finding, FindingCode, Group, Level } from "./types";

const RULES: [FindingCode, Level, string[]][] = [
  ["location", "high", ["gpslatitude", "gpslongitude", "latitude", "longitude", "gpsposition", "recordedlocation", "xyz", "comapplequicktimelocationiso6709", "location"]],
  ["serial", "high", ["bodyserialnumber", "serialnumber", "lensserialnumber", "internalserialnumber", "cameraserialnumber", "imageuniqueid"]],
  ["author", "high", ["artist", "author", "creator", "lastmodifiedby", "ownername", "cameraownername", "copyright", "byline", "writer", "performer", "composer", "director", "initialcreator", "revisionauthors", "albumperformer"]],
  ["company", "medium", ["company", "manager", "credit", "source", "rights", "publisher"]],
  ["device", "medium", ["make", "model", "lensmake", "lensmodel", "hostcomputer", "comapplequicktimemake", "comapplequicktimemodel", "uniquecameramodel"]],
  ["history", "medium", ["revision", "totaltime", "editingcycles", "editingduration", "history", "documentid", "instanceid", "originaldocumentid", "derivedfrom", "lastprinted", "template"]],
  ["software", "low", ["software", "creatortool", "producer", "application", "appversion", "writingapplication", "encodedapplication", "writinglibrary", "generator", "comapplequicktimesoftware"]],
  ["date", "low", ["datetimeoriginal", "createdate", "modifydate", "datetime", "created", "modified", "creationdate", "moddate", "encodeddate", "taggeddate", "recordeddate", "metadatadate", "date", "creationtime", "datecreated", "comapplequicktimecreationdate"]],
  ["comments", "low", ["description", "comment", "usercomment", "imagedescription", "subject", "keywords", "headline", "caption", "captionabstract", "title", "category", "comments"]],
];

function normalize(key: string) {
  return key
    .replace(/^[a-z]+:/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Looks through every field for things that say something about a person: where, who, with
 * which device and when. `overrides` reassigns keys that mean something else for one format,
 * like a PDF's "Creator", which is the app that made it.
 */
export function findFindings(groups: Group[], overrides: Record<string, FindingCode | null> = {}): Finding[] {
  const found = new Map<FindingCode, Finding>();
  for (const group of groups) {
    if (group.id === "file") continue;
    for (const field of group.fields) {
      const key = normalize(field.key);
      const override = overrides[key];
      if (override === null) continue;
      const rule = override ? RULES.find(([code]) => code === override) : RULES.find(([, , keys]) => keys.includes(key));
      if (!rule) continue;
      const [code, level] = rule;
      const finding = found.get(code) ?? { code, level, evidence: [] };
      const line = `${field.key}: ${field.value}`;
      if (finding.evidence.length < 4 && !finding.evidence.includes(line)) finding.evidence.push(line);
      found.set(code, finding);
    }
  }
  const order: Level[] = ["high", "medium", "low"];
  return [...found.values()].sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level));
}
