import { getExecutiveCommitteeByYear } from "@/content/team.server";
import TeamView from "./team-view";

export default function TeamPage() {
  return <TeamView executiveCommitteeByYear={getExecutiveCommitteeByYear()} />;
}
