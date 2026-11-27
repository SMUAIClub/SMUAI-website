// Shared team types + advisors (safe to import from client components).
// Data lives in /content and is edited via the Keystatic admin at /keystatic:
// - ExCo years: content/exco/<yy-yy>.json (loaded by src/content/team.server.ts)
// - Advisors:   content/advisors.json
import advisorsData from "../../content/advisors.json";

export type TeamMember = {
  name: string;
  position: string;
  photo?: string;
  linkedin?: string;
};

export type DepartmentGroup = {
  name: string;
  leads: TeamMember[];
  executives: TeamMember[];
};

export type ExecutiveCommitteeByYear = {
  excoNumber: string;
  leadership: TeamMember[];
  departments: DepartmentGroup[];
};

export const EXCO_PLACEHOLDER_PHOTO = "/team/exco/placeholder_profile.webp";

/** Sort "26/27"-style year keys, newest first. */
export function sortYearsDesc(years: string[]) {
  return [...years].sort((a, b) => Number(b.split("/")[0]) - Number(a.split("/")[0]));
}

type AdvisorEntry = TeamMember & { summary?: string };

const advisorEntries = advisorsData.advisors as AdvisorEntry[];

export const advisors: TeamMember[] = advisorEntries.map(({ name, position, photo, linkedin }) => ({ name, position, photo, linkedin }));

export const advisorsIntro: string = advisorsData.intro;

export const advisorsProfileSummary: Record<string, string> = Object.fromEntries(
  advisorEntries.filter((advisor) => advisor.summary).map((advisor) => [advisor.name, advisor.summary as string]),
);
