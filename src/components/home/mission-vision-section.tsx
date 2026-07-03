import { Eye, Target } from "lucide-react";

const pillars = [
  {
    title: "Mission",
    description:
      "To cultivate and spread ideas about Artificial Intelligence, and provide students with the tools, knowledge, and opportunities to excel in AI.",
    icon: Target,
  },
  {
    title: "Vision",
    description:
      "To be a hub of AI creativity and leadership that inspires groundbreaking ideas and empowers tomorrow's innovators by bridging passion with purpose.",
    icon: Eye,
  },
] as const;

export default function MissionVisionSection() {
  return (
    <section className="bg-brand-cloud px-5 py-14 text-brand-deep-blue lg:px-8 lg:py-20">
      <div className="relative mx-auto w-full max-w-[1320px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Purpose</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Mission And Vision</h2>
          <p className="mt-4 text-base leading-relaxed text-brand-slate sm:mt-5 sm:text-lg">
            SMUAI exists to grow a thoughtful, capable, and action-oriented AI community at SMU.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 items-stretch gap-4 sm:mt-14 sm:gap-8 lg:grid-cols-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article
                key={pillar.title}
                className="group relative overflow-hidden rounded-[1.5rem] border border-brand-soft/80 bg-white p-4 shadow-[0_30px_60px_-42px_rgba(27,43,84,0.32)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_64px_-38px_rgba(27,43,84,0.38)] sm:rounded-[2rem] sm:p-9"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-brand-deep-blue" />
                <div className="inline-flex items-center gap-3 text-brand-deep-blue sm:gap-4">
                  <div className="rounded-2xl border border-brand-soft bg-brand-cloud p-2.5 shadow-[0_18px_28px_-24px_rgba(27,43,84,0.22)] transition duration-300 group-hover:border-brand-deep-blue/20 group-hover:bg-white sm:p-3">
                    <Icon size={20} className="sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-[1.35rem] font-black tracking-tight text-brand-deep-blue sm:text-3xl">
                    {pillar.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-brand-slate sm:mt-6 sm:text-lg">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
