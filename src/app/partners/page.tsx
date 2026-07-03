"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { CalendarDays, Handshake, Linkedin, Sparkles, Trophy, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { partners } from "@/content/partners";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import type { Partner } from "@/content/partners";

const contactTopics = [
  "Partnership",
  "Workshop",
  "Sponsorship",
  "Campus Event",
  "General",
];

const collaborationHighlights = [
  {
    icon: Handshake,
    title: "Workshops & Build Sessions",
    description:
      "Hands-on sessions that help students move from curiosity to building.",
  },
  {
    icon: CalendarDays,
    title: "Hackathons & Community Events",
    description:
      "Events and challenges that bring students, builders, and industry together.",
  },
  {
    icon: Trophy,
    title: "Sponsorship & Ecosystem Support",
    description:
      "Support through prizes, credits, speakers, and programming that expands access.",
  },
] satisfies Array<{ icon: LucideIcon; title: string; description: string }>;

function PartnerNode({
  partner,
  onOpen,
  onHoverChange,
  compact = false,
}: {
  partner: Partner;
  onOpen: (partner: Partner) => void;
  onHoverChange?: (hovered: boolean) => void;
  compact?: boolean;
}) {
  const { name, logo } = partner;
  return (
    <button
      type="button"
      onClick={() => onOpen(partner)}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
      aria-label={name}
      className="flex h-full w-full items-center justify-center rounded-full p-2 text-center shadow-[0_18px_30px_-24px_rgba(27,43,84,0.6)] transition hover:scale-105"
    >
      {logo ? (
        <div className="relative h-full w-full overflow-hidden rounded-full">
          <Image src={logo} alt={name} fill className="object-cover" sizes={compact ? "24vw" : "112px"} />
        </div>
      ) : (
        <span className="px-1 text-xs font-semibold leading-tight text-brand-deep-blue">{name}</span>
      )}
    </button>
  );
}

type OrbitRingConfig = {
  partners: Partner[];
  radius: number;
  iconSize: number;
  speed: number;
  reverse?: boolean;
};

function buildOrbitRings(items: Partner[]): OrbitRingConfig[] {
  const capacities = [10, 8, 5, 3];
  const iconSizes = [68, 68, 68, 68];
  const speeds = [0.42, 0.5, 0.58, 0.68];
  const radii = [300, 220, 140, 60];
  const rings: OrbitRingConfig[] = [];
  const innerRingPriority = ["AI Singapore", "Singapore Youth AI", "OpenClawSG"];
  const prioritized = innerRingPriority
    .map((name) => items.find((partner) => partner.name === name))
    .filter((partner): partner is Partner => Boolean(partner));
  const prioritizedNames = new Set(prioritized.map((partner) => partner.name));
  const outerItems = items.filter((partner) => !prioritizedNames.has(partner.name));

  let start = 0;
  capacities.slice(0, -1).forEach((capacity, index) => {
    if (start >= outerItems.length) {
      return;
    }

    const end = Math.min(start + capacity, outerItems.length);
    rings.push({
      partners: outerItems.slice(start, end),
      radius: radii[index],
      iconSize: iconSizes[index],
      speed: speeds[index],
      reverse: index % 2 === 1,
    });
    start = end;
  });

  if (prioritized.length > 0) {
    const innerIndex = capacities.length - 1;
    rings.push({
      partners: prioritized.slice(0, capacities[innerIndex]),
      radius: radii[innerIndex],
      iconSize: iconSizes[innerIndex],
      speed: speeds[innerIndex],
      reverse: innerIndex % 2 === 1,
    });
  }

  return rings;
}

export default function PartnersPage() {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [orbitsPaused, setOrbitsPaused] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    organization: "",
    subject: "",
    topic: "General",
    message: "",
  });
  const mobilePartners = useMemo(
    () => [...partners].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );
  const orbitRings = useMemo(() => buildOrbitRings(partners), []);
  const areOrbitsPaused = orbitsPaused || Boolean(selectedPartner);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPartner(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleContactSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const subject = contactForm.subject || `SMUAI Collaboration Inquiry - ${contactForm.topic}`;
    const body = [
      contactForm.message || "Hello SMUAI Team,",
    ].join("\n");

    const mailto = `mailto:smuai@sa.smu.edu.sg?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  const handleGenerateDraft = async () => {
    setIsGeneratingDraft(true);

    try {
      const response = await fetch("/api/contact-draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      if (!response.ok) {
        throw new Error("Draft generation failed");
      }

      const data = (await response.json()) as { subject?: string; message?: string };
      setContactForm((prev) => ({
        ...prev,
        subject: data.subject || prev.subject || `SMUAI ${prev.topic} Collaboration`,
        message: data.message || prev.message,
      }));
    } catch {
      const fallbackDraft = [
        contactForm.message.trim() || `Hi SMUAI Team,`,
        "",
        contactForm.message.trim()
          ? "A few helpful details we can align on:"
          : `I'm ${contactForm.name || "[Your Name]"} from ${contactForm.organization || "[Organization]"}.`,
        ...(contactForm.message.trim()
          ? []
          : [`I'm reaching out regarding ${contactForm.topic.toLowerCase()} collaboration opportunities.`]),
        "",
        "- Goals:",
        "- Proposed timeline:",
        "- Support or collaboration needed from SMUAI:",
        "",
        "Looking forward to exploring this together.",
        "",
        "Best regards,",
        contactForm.name || "[Your Name]",
      ].join("\n");

      setContactForm((prev) => ({
        ...prev,
        subject: prev.subject || `SMUAI ${prev.topic} Collaboration`,
        message: fallbackDraft,
      }));
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const hasDraftContent = Boolean(contactForm.subject.trim() || contactForm.message.trim());

  return (
    <>
      <div className="relative w-full sm:left-1/2 sm:w-screen sm:-translate-x-1/2">
        <section className="relative flex min-h-[calc(100svh-72px)] flex-col justify-start bg-brand-cloud px-5 pb-6 pt-6 lg:px-8 lg:pb-8 lg:pt-8">
          <div className="relative mx-auto w-full max-w-[1320px]">
            <div className="w-full max-w-4xl">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Partners</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-brand-deep-blue sm:text-4xl">
                Our Partner Network
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-slate">
                Organizations we have collaborated with.
              </p>
            </div>

            <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-brand-slate md:hidden">
              Arranged Alphabetically
            </p>

            <div className="mt-3 grid grid-cols-3 gap-3 md:hidden">
              {mobilePartners.map((partner) => (
                <div
                  key={`${partner.name}-mobile`}
                  className="flex aspect-square items-center justify-center rounded-2xl bg-white p-2 text-center shadow-[0_24px_36px_-30px_rgba(27,43,84,0.35)]"
                >
                  <PartnerNode partner={partner} onOpen={setSelectedPartner} compact />
                </div>
              ))}
            </div>

            <div className="relative mt-6 hidden h-[620px] w-full max-w-[1360px] overflow-visible md:block lg:h-[700px]">
              <aside className="absolute left-0 top-6 z-30 max-w-[280px] rounded-[1.5rem] border border-brand-soft/70 bg-white/85 p-4 shadow-[0_20px_36px_-30px_rgba(27,43,84,0.18)] backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-slate">Explore</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-slate">
                  Hover or tap a circle to open a quick partner profile and see who SMUAI has collaborated with.
                </p>
              </aside>
              {orbitRings.map((ring, ringIndex) => (
                <OrbitingCircles
                  key={`orbit-ring-${ringIndex}`}
                  radius={ring.radius}
                  path
                  reverse={ring.reverse}
                  iconSize={ring.iconSize}
                  speed={ring.speed}
                  paused={areOrbitsPaused}
                  className="z-20"
                >
                  {ring.partners.map((partner) => (
                    <PartnerNode
                      key={`${partner.name}-ring-${ringIndex}`}
                      partner={partner}
                      onOpen={setSelectedPartner}
                      onHoverChange={setOrbitsPaused}
                    />
                  ))}
                </OrbitingCircles>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-12 lg:px-8 lg:py-14">
          <div className="mx-auto w-full max-w-[1320px]">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Collaboration</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-deep-blue sm:text-4xl">
                How We Work With Partners
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-slate sm:text-base">
                We partner with companies and communities on practical collaborations that help students learn, build, and connect with the AI ecosystem.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {collaborationHighlights.map((item) => (
                <article
                  key={item.title}
                  className="group rounded-[1.75rem] border border-brand-soft/70 bg-brand-cloud/45 p-6 shadow-[0_22px_40px_-34px_rgba(27,43,84,0.12)] transition duration-300 hover:-translate-y-1 hover:border-brand-deep-blue/18 hover:bg-white hover:shadow-[0_30px_48px_-30px_rgba(27,43,84,0.18)] sm:min-h-[200px] sm:p-7"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-soft bg-white text-brand-deep-blue shadow-[0_14px_26px_-22px_rgba(27,43,84,0.28)] transition duration-300 group-hover:-translate-y-0.5">
                    <item.icon size={19} strokeWidth={2.1} />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-deep-blue transition-colors duration-300 group-hover:text-brand-deep-blue">
                    <span className="mt-4 block">
                    {item.title}
                    </span>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-slate sm:text-base">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-cloud px-5 py-10 lg:px-8 lg:py-12">
          <div className="mx-auto w-full max-w-[1320px]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Contact</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-deep-blue sm:text-4xl">Reach Out To Us</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-slate">
                For partnerships, events, or collaboration opportunities, contact{" "}
                <a
                  href="mailto:smuai@sa.smu.edu.sg"
                  className="font-semibold text-brand-deep-blue underline underline-offset-4"
                >
                  smuai@sa.smu.edu.sg
                </a>
                . This sends via the visitor&apos;s own email app.
              </p>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <form onSubmit={handleContactSubmit} className="rounded-2xl border border-brand-soft bg-white p-4 shadow-[0_24px_40px_-34px_rgba(27,43,84,0.35)] sm:p-5">
                <div className="mb-4 flex flex-wrap gap-2">
                  {contactTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() =>
                        setContactForm((prev) => ({
                          ...prev,
                          topic,
                          subject:
                            prev.subject && prev.subject !== `SMUAI ${prev.topic} Collaboration`
                              ? prev.subject
                              : `SMUAI ${topic} Collaboration`,
                        }))
                      }
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        contactForm.topic === topic
                          ? "bg-brand-deep-blue text-white"
                          : "bg-brand-cloud text-brand-slate hover:bg-brand-soft"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>

                <div className="grid gap-3">
                  <input
                    type="text"
                    required
                    value={contactForm.name ?? ""}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-brand-soft bg-white px-3 py-2 text-sm text-brand-deep-blue outline-none transition focus:border-brand-deep-blue"
                  />
                  <input
                    type="email"
                    required
                    value={contactForm.email ?? ""}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Your email"
                    className="w-full rounded-xl border border-brand-soft bg-white px-3 py-2 text-sm text-brand-deep-blue outline-none transition focus:border-brand-deep-blue"
                  />
                  <input
                    type="text"
                    value={contactForm.organization ?? ""}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, organization: e.target.value }))}
                    placeholder="Organization (optional)"
                    className="w-full rounded-xl border border-brand-soft bg-white px-3 py-2 text-sm text-brand-deep-blue outline-none transition focus:border-brand-deep-blue"
                  />
                  <input
                    type="text"
                    value={contactForm.subject ?? ""}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
                    placeholder="Subject"
                    className="w-full rounded-xl border border-brand-soft bg-white px-3 py-2 text-sm text-brand-deep-blue outline-none transition focus:border-brand-deep-blue"
                  />
                  <textarea
                    required
                    value={contactForm.message ?? ""}
                    onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="How would you like to collaborate?"
                    rows={6}
                    className="w-full resize-y rounded-xl border border-brand-soft bg-white px-3 py-2 text-sm text-brand-deep-blue outline-none transition focus:border-brand-deep-blue"
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleGenerateDraft}
                      disabled={isGeneratingDraft}
                      className="inline-flex items-center gap-2 rounded-full border border-brand-soft bg-brand-cloud px-4 py-2 text-sm font-semibold text-brand-deep-blue transition hover:bg-brand-soft"
                    >
                      <Sparkles size={15} />
                      {isGeneratingDraft ? "Generating..." : "Smart Draft"}
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-full bg-brand-deep-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-deep-blue/90"
                    >
                      Open In Email App
                    </button>
                  </div>
                </div>
              </form>

              <aside className="rounded-2xl border border-brand-soft bg-white p-4 text-brand-deep-blue shadow-[0_24px_40px_-34px_rgba(27,43,84,0.35)] sm:p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-brand-slate">How This Works</p>
                <h3 className="mt-3 text-lg font-semibold text-brand-deep-blue">Draft with AI, then send in your own mailbox</h3>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-brand-slate">
                  <p>
                    Start by typing rough notes, goals, or bullet points in the message box. The more context you give,
                    the better the AI draft will be.
                  </p>
                  <p>
                    Click <span className="font-semibold text-brand-deep-blue">Smart Draft</span> to polish or expand
                    what you wrote. If the message box is empty, it will generate a starter draft for you.
                  </p>
                  <p>
                    When you are happy with the result, click{" "}
                    <span className="font-semibold text-brand-deep-blue">Open In Email App</span>. This opens your own
                    mail client with the subject and message prefilled, so you can review and send it yourself.
                  </p>
                </div>

                <div className="mt-5 rounded-2xl bg-brand-cloud p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-slate">Current Draft Status</p>
                  <p className="mt-3 text-sm text-brand-slate">
                    To: <span className="font-semibold text-brand-deep-blue">smuai@sa.smu.edu.sg</span>
                  </p>
                  <p className="mt-1 text-sm text-brand-slate">
                    Topic: <span className="font-semibold text-brand-deep-blue">{contactForm.topic}</span>
                  </p>
                  <p className="mt-1 text-sm text-brand-slate">
                    Subject:{" "}
                    <span className="font-semibold text-brand-deep-blue">
                      {contactForm.subject || `SMUAI ${contactForm.topic} Collaboration`}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-brand-slate">
                    Draft:{" "}
                    <span className="font-semibold text-brand-deep-blue">
                      {hasDraftContent ? "Ready to review" : "Waiting for your notes"}
                    </span>
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>

      {selectedPartner && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4"
          onClick={() => setSelectedPartner(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-brand-deep-blue">{selectedPartner.name}</h2>
              <button
                type="button"
                aria-label="Close partner details"
                onClick={() => setSelectedPartner(null)}
                className="rounded-full border border-brand-soft p-1.5 text-brand-slate transition hover:bg-brand-cloud"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-brand-slate">{selectedPartner.description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {selectedPartner.linkedin ? (
                <a
                  href={selectedPartner.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-soft px-4 py-2 text-sm font-semibold text-brand-deep-blue transition hover:bg-brand-pale-gold"
                >
                  <Linkedin size={16} />
                  LinkedIn
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand-slate"
                >
                  <Linkedin size={16} />
                  LinkedIn Soon
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
