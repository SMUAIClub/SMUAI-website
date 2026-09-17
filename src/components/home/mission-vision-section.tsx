import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Eye, Target } from "lucide-react";

const startingPoints = [
  {
    title: "Just curious?",
    description: "Explore AI at a beginner-friendly workshop.",
    href: "/events",
    action: "Events",
  },
  {
    title: "Ready to build?",
    description: "Find teammates and try a hackathon.",
    href: "/events",
    action: "Events",
  },
  {
    title: "Looking beyond class?",
    description: "Connect with students and people working in AI.",
    href: "/team",
    action: "Team",
  },
] as const;

export default function MissionVisionSection() {
  return (
    <section aria-labelledby="find-your-place-heading" className="bg-brand-cloud px-5 py-8 text-brand-deep-blue sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] sm:text-sm text-brand-slate">Your starting point</p>
          <h2 id="find-your-place-heading" className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Find your place in AI.</h2>
          <p className="mt-3 text-base leading-relaxed text-brand-slate sm:text-lg">
            A student-led community to learn, build, and explore AI together.
          </p>
        </div>

        <div className="mt-6 grid items-stretch gap-6 sm:mt-8 sm:gap-8 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-14">
          <figure className="grid w-full grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] items-center gap-5 justify-self-start sm:block sm:max-w-[360px]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] border border-brand-soft bg-white sm:rounded-[2rem]">
              <Image
                src="/team/exco/26-27/group-portrait.jpg"
                alt="The SMUAI 2026–27 executive committee together on campus"
                fill
                sizes="(min-width: 1024px) 360px, (min-width: 768px) 35vw, (min-width: 640px) 360px, 42vw"
                className="object-cover"
              />
            </div>
            <figcaption className="flex flex-col items-start gap-2 text-xs text-brand-slate sm:mt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <span className="text-base font-bold leading-snug text-brand-deep-blue sm:text-xs sm:font-semibold sm:text-brand-slate">The people behind SMUAI</span>
              <span>EXCO 2026–27</span>
            </figcaption>
          </figure>

          <div className="flex min-w-0 flex-col">
            <div className="divide-y divide-brand-deep-blue/15">
              {startingPoints.map((point, index) => (
                <Link
                  key={point.title}
                  href={point.href}
                  className="group grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[2rem_minmax(0,1fr)] rounded-lg py-4 first:pt-1 transition-colors hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-deep-blue sm:gap-x-4"
                >
                  <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8 bg-brand-gold text-xs font-bold">0{index + 1}</span>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-black leading-tight tracking-tight sm:text-xl lg:text-2xl">{point.title}</h3>
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs sm:gap-2 font-semibold sm:text-sm">
                        <span className="underline decoration-brand-deep-blue/30 underline-offset-4 group-hover:decoration-brand-deep-blue">{point.action}</span>
                        <ArrowUpRight aria-hidden="true" size={16} className="transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
                      </span>
                    </div>
                    <p className="mt-1.5 max-w-md text-sm sm:mt-2 leading-relaxed text-brand-slate">{point.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="pt-5">
              <div className="grid gap-5 rounded-[1.5rem] border border-brand-deep-blue/10 bg-white p-5 sm:grid-cols-2 sm:gap-6 lg:p-6">
                <article>
                  <div className="flex items-center gap-3">
                    <Target size={24} className="shrink-0" aria-hidden="true" />
                    <h3 className="text-lg font-black tracking-tight sm:text-xl">Our mission</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed sm:mt-3 sm:text-[15px] text-brand-slate lg:text-base">
                    To cultivate and spread ideas about Artificial Intelligence, and provide students with the tools, knowledge, and opportunities to excel in AI.
                  </p>
                </article>
                <article className="border-t border-brand-soft pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                  <div className="flex items-center gap-3">
                    <Eye size={24} className="shrink-0" aria-hidden="true" />
                    <h3 className="text-lg font-black tracking-tight sm:text-xl">Our vision</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed sm:mt-3 sm:text-[15px] text-brand-slate lg:text-base">
                    To be a hub of AI creativity and leadership that inspires groundbreaking ideas and empowers tomorrow&apos;s innovators by bridging passion with purpose.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
