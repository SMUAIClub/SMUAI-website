import "server-only";

import fs from "node:fs";
import path from "node:path";
import { EXCO_PLACEHOLDER_PHOTO, type DepartmentGroup, type ExecutiveCommitteeByYear, type TeamMember } from "./team";

const EXCO_DIR = path.join(process.cwd(), "content", "exco");

type RawMember = Partial<Record<keyof TeamMember, unknown>>;
type RawExco = {
  year?: unknown;
  excoNumber?: unknown;
  leadership?: RawMember[];
  departments?: { name?: unknown; leads?: RawMember[]; executives?: RawMember[] }[];
};

function str(value: unknown) {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function requireStr(value: unknown, field: string, file: string) {
  const result = str(value);
  if (!result) throw new Error(`content/exco/${file}: "${field}" is required`);
  return result;
}

function toMember(raw: RawMember, file: string): TeamMember {
  return {
    name: requireStr(raw.name, "name", file),
    position: requireStr(raw.position, "position", file),
    photo: str(raw.photo) ?? EXCO_PLACEHOLDER_PHOTO,
    linkedin: str(raw.linkedin),
  };
}

export function getExecutiveCommitteeByYear(): Record<string, ExecutiveCommitteeByYear> {
  const files = fs.readdirSync(EXCO_DIR).filter((file) => file.endsWith(".json")).sort();
  const byYear: Record<string, ExecutiveCommitteeByYear> = {};

  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(EXCO_DIR, file), "utf8")) as RawExco;
    const year = requireStr(raw.year, "year", file);

    byYear[year] = {
      excoNumber: requireStr(raw.excoNumber, "excoNumber", file),
      leadership: (raw.leadership ?? []).map((member) => toMember(member, file)),
      departments: (raw.departments ?? []).map(
        (department): DepartmentGroup => ({
          name: requireStr(department.name, "department name", file),
          leads: (department.leads ?? []).map((member) => toMember(member, file)),
          executives: (department.executives ?? []).map((member) => toMember(member, file)),
        }),
      ),
    };
  }

  return byYear;
}
