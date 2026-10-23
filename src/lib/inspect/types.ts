import type { Dictionary } from "../i18n";

export type GroupId = keyof Dictionary["groups"];
export type FindingCode = keyof Dictionary["findings"];
export type Level = "high" | "medium" | "low";
export type Kind = "image" | "pdf" | "office" | "media" | "other";

export interface Field {
  key: string;
  value: string;
}

export interface Group {
  id: GroupId;
  fields: Field[];
}

export interface Finding {
  code: FindingCode;
  level: Level;
  evidence: string[];
}

export interface Report {
  kind: Kind;
  groups: Group[];
  findings: Finding[];
  gps?: { latitude: number; longitude: number };
  cleanable: boolean;
  error?: "error" | "encrypted";
}

export function fieldCount(report: Report) {
  return report.groups.filter((group) => group.id !== "file").reduce((sum, group) => sum + group.fields.length, 0);
}
