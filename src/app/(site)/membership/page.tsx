import { redirect } from "next/navigation";

const MEMBERSHIP_FORM_URL = "https://forms.gle/7UeUbNhu4fPJqCbs9";

export default function MembershipPage() {
  redirect(MEMBERSHIP_FORM_URL);
}
