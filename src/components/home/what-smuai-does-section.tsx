import { FlaskConical, GraduationCap, MonitorSmartphone, UsersRound } from "lucide-react";

const pillars = [
  {
    title: "Workshops",
    description:
      "Industry talks and hands-on sessions that introduce students to AI tools, technologies, and real-world applications.",
    icon: GraduationCap,
    accent: "bg-brand-deep-blue",
    surface: "bg-white",
  },
  {
    title: "Hackathons",
    description:
      "Collaborative challenges where students prototype, experiment, and turn ideas into practical AI products.",
    icon: MonitorSmartphone,
    accent: "bg-brand-deep-blue",
    surface: "bg-white",
  },
  {
    title: "Networking",
    description:
      "Spaces for students to connect with founders, startups, operators, and professionals across the AI ecosystem.",
    icon: UsersRound,
    accent: "bg-brand-deep-blue",
    surface: "bg-white",
  },
  {
    title: "Research",
    description:
      "Student-led exploration of emerging technologies, AI research ideas, and interdisciplinary knowledge sharing.",
    icon: FlaskConical,
    accent: "bg-brand-deep-blue",
    surface: "bg-white",
  },
];

export default function WhatSmuaiDoesSection() {
  return (
    <section className="overflow-hidden bg-white px-5 py-16 text-brand-deep-blue lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-[1320px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Activities</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">What SMUAI Does</h2>
          <p className="mt-5 text-lg leading-relaxed text-brand-slate">
            SMUAI gives students multiple entry points into AI, whether they want to learn, build, connect, or explore
            deeper questions.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article
                key={pillar.title}
                className={`group relative overflow-hidden rounded-[2rem] border border-brand-soft/70 ${pillar.surface} p-6 shadow-[0_24px_48px_-36px_rgba(27,43,84,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_56px_-34px_rgba(27,43,84,0.24)] sm:p-7`}
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 ${pillar.accent}`} />

                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-soft bg-white text-brand-deep-blue shadow-[0_18px_28px_-24px_rgba(27,43,84,0.24)] transition duration-300 group-hover:border-brand-deep-blue/20">
                  <Icon size={28} strokeWidth={2.1} />
                </div>

                <div className="mt-8">
                  <h3 className="text-[1.85rem] font-black tracking-tight text-brand-deep-blue">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-brand-slate sm:text-[1.05rem]">
                    {pillar.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
