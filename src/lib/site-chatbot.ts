import { eventsByYear, getEventEndTimestamp } from "@/content/events";
import { partners } from "@/content/partners";
import { advisors, advisorsProfileSummary, executiveCommitteeByYear } from "@/content/team";

export const chatbotLinks = {
  membershipPage: "/membership",
  teamPage: "/team",
  eventsPage: "/events",
  partnersPage: "/partners",
  registrationForm: "https://smu.opine.asia/survey?id=88173c31-3ce0-419d-a811-72783811d5df",
  opine: "https://smu.opine.asia/",
  email: "mailto:smuai@sa.smu.edu.sg",
  linkedin: "https://linkedin.com/company/smuai",
  instagram: "https://www.instagram.com/smu.ai/",
  telegram: "https://t.me/SmuAI",
} as const;

type ChatRole = "user" | "assistant";

export type SiteChatMessage = {
  role: ChatRole;
  content: string;
};

type FlattenedEvent = {
  year: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  startAt: string;
  endAt?: string;
  lumaLink?: string;
};

const CURRENT_EXCO_YEAR = "26/27";

function flattenEvents() {
  return Object.entries(eventsByYear)
    .flatMap(([year, items]) =>
      items.map(
        (item) =>
          ({
            year,
            title: item.title,
            dateLabel: item.dateLabel,
            timeLabel: item.timeLabel,
            startAt: item.startAt,
            endAt: item.endAt,
            lumaLink: item.lumaLink,
          }) satisfies FlattenedEvent,
      ),
    )
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
}

function getUpcomingEvents(limit = 5) {
  const now = Date.now();
  const futureEvents = flattenEvents().filter((event) => getEventEndTimestamp(event) >= now);
  return futureEvents.slice(0, limit);
}

function getCurrentExcoSummary() {
  const currentExco = executiveCommitteeByYear[CURRENT_EXCO_YEAR];
  const leadership = currentExco.leadership
    .map((member) => `${member.position}: ${member.name}`)
    .join("; ");
  const departments = currentExco.departments
    .map((department) => {
      const leads = department.leads.map((member) => member.name).join(", ");
      const executives = department.executives.map((member) => member.name).join(", ");
      return `${department.name} - Leads: ${leads}; Executives: ${executives}`;
    })
    .join("\n");

  return [
    `Current executive committee year: AY${CURRENT_EXCO_YEAR} (${currentExco.excoNumber})`,
    `Leadership: ${leadership}`,
    `Departments:\n${departments}`,
    `Past executive committee years available on the site: ${Object.keys(executiveCommitteeByYear).join(", ")}`,
  ].join("\n");
}

function getAdvisorSummary() {
  return advisors
    .map(
      (advisor) =>
        `${advisor.name} - ${advisor.position}. ${advisorsProfileSummary[advisor.name] ?? ""}`.trim(),
    )
    .join("\n");
}

function getPartnerSummary() {
  return partners.map((partner) => `${partner.name} - ${partner.description}`).join("\n");
}

function getUpcomingEventsSummary() {
  const upcoming = getUpcomingEvents();

  if (upcoming.length === 0) {
    return "No upcoming events are currently listed on the site.";
  }

  return upcoming
    .map((event) => {
      const link = event.lumaLink ? ` | Register: ${event.lumaLink}` : "";
      return `- ${event.title} (${event.dateLabel}, ${event.timeLabel}, AY${event.year})${link}`;
    })
    .join("\n");
}

export function buildSiteChatContext() {
  return [
    "You are the SMUAI website assistant.",
    "Only answer using the SMUAI website context provided below.",
    "If the answer is not available in the context, say that you do not have that information on the current site.",
    "Do not invent dates, partnerships, fees, forms, or people.",
    "Keep answers concise, friendly, and useful.",
    "When relevant, point users to the most helpful page or link from the context.",
    "",
    "SMUAI summary:",
    "SMUAI is a student AI community at Singapore Management University.",
    "Mission: To cultivate and spread ideas about Artificial Intelligence, and provide students with the tools, knowledge, and opportunities to excel in AI.",
    "Vision: To be a hub of AI creativity and leadership that inspires groundbreaking ideas and empowers tomorrow's innovators by bridging passion with purpose.",
    "What SMUAI does: workshops, hackathons, networking, and research.",
    "",
    "Membership:",
    "Membership page: /membership",
    `Opine account: ${chatbotLinks.opine}`,
    `Registration form: ${chatbotLinks.registrationForm}`,
    "Membership fee: S$15 one-time lifetime membership fee via PayNow.",
    "Membership steps: create an Opine account with an SMU email, complete the membership form, pay the S$15 lifetime membership fee, then wait for the confirmation email.",
    "",
    "Team:",
    getCurrentExcoSummary(),
    "",
    "Advisors:",
    getAdvisorSummary(),
    "",
    "Upcoming events:",
    getUpcomingEventsSummary(),
    "",
    "Partners:",
    getPartnerSummary(),
    "",
    "Useful links:",
    `Team page: ${chatbotLinks.teamPage}`,
    `Events page: ${chatbotLinks.eventsPage}`,
    `Partners page: ${chatbotLinks.partnersPage}`,
    `Email: ${chatbotLinks.email}`,
    `LinkedIn: ${chatbotLinks.linkedin}`,
    `Instagram: ${chatbotLinks.instagram}`,
    `Telegram: ${chatbotLinks.telegram}`,
  ].join("\n");
}

function buildUpcomingEventsFallback() {
  const upcoming = getUpcomingEvents(4);

  if (upcoming.length === 0) {
    return `I do not see any upcoming events listed right now. You can still check ${chatbotLinks.eventsPage} for the latest updates.`;
  }

  return [
    "Here are the next events currently listed on the SMUAI site:",
    ...upcoming.map((event) => {
      const link = event.lumaLink ? ` Register: ${event.lumaLink}` : "";
      return `- ${event.title} on ${event.dateLabel} at ${event.timeLabel}.${link}`;
    }),
    `More details are on ${chatbotLinks.eventsPage}.`,
  ].join("\n");
}

export function buildFallbackChatReply(message: string) {
  const question = message.toLowerCase();

  if (
    question.includes("join") ||
    question.includes("member") ||
    question.includes("membership") ||
    question.includes("opine") ||
    question.includes("fee")
  ) {
    return [
      "You can join SMUAI as a member through the membership flow on the site.",
      `1. Create your Opine account: ${chatbotLinks.opine}`,
      `2. Open the registration form: ${chatbotLinks.registrationForm}`,
      "3. Pay the one-time S$15 lifetime membership fee via PayNow.",
      "4. Wait for the confirmation email.",
      `You can also check ${chatbotLinks.membershipPage} for the full checklist.`,
    ].join("\n");
  }

  if (
    question.includes("event") ||
    question.includes("workshop") ||
    question.includes("hackathon") ||
    question.includes("upcoming")
  ) {
    return buildUpcomingEventsFallback();
  }

  if (
    question.includes("team") ||
    question.includes("exco") ||
    question.includes("leadership") ||
    question.includes("president") ||
    question.includes("advisor")
  ) {
    const currentExco = executiveCommitteeByYear[CURRENT_EXCO_YEAR];
    return [
      `The current team shown on the site is AY${CURRENT_EXCO_YEAR} (${currentExco.excoNumber}).`,
      ...currentExco.leadership.map((member) => `- ${member.position}: ${member.name}`),
      `You can view the full team here: ${chatbotLinks.teamPage}`,
    ].join("\n");
  }

  if (
    question.includes("partner") ||
    question.includes("sponsor") ||
    question.includes("collab") ||
    question.includes("collaborat")
  ) {
    const featuredPartners = partners.slice(0, 8).map((partner) => partner.name).join(", ");
    return `SMUAI works with partners such as ${featuredPartners}, and more. You can browse them at ${chatbotLinks.partnersPage}. For collaboration outreach, contact ${chatbotLinks.email}.`;
  }

  if (
    question.includes("contact") ||
    question.includes("email") ||
    question.includes("instagram") ||
    question.includes("telegram") ||
    question.includes("linkedin")
  ) {
    return [
      "You can reach SMUAI through these channels:",
      `- Email: ${chatbotLinks.email}`,
      `- LinkedIn: ${chatbotLinks.linkedin}`,
      `- Instagram: ${chatbotLinks.instagram}`,
      `- Telegram: ${chatbotLinks.telegram}`,
    ].join("\n");
  }

  return [
    "I can help with information that is currently on the SMUAI site.",
    "Try asking about membership, upcoming events, the team, advisors, partners, or contact links.",
    `Useful pages: ${chatbotLinks.membershipPage}, ${chatbotLinks.eventsPage}, ${chatbotLinks.teamPage}, ${chatbotLinks.partnersPage}`,
  ].join("\n");
}
