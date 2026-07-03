import { Eye, Target } from "lucide-react";

export default function MissionVisionSection() {
  return (
    <section className="bg-brand-cloud px-5 py-16 text-brand-deep-blue lg:px-8 lg:py-20">
      <div className="relative mx-auto w-full max-w-[1320px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Purpose</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Mission And Vision</h2>
          <p className="mt-5 text-lg leading-relaxed text-brand-slate">
            SMUAI exists to grow a thoughtful, capable, and action-oriented AI community at SMU.
          </p>
        </div>

        <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-2">
          <article className="group relative overflow-hidden rounded-[2rem] border border-brand-soft/80 bg-white p-8 shadow-[0_30px_60px_-42px_rgba(27,43,84,0.32)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_64px_-38px_rgba(27,43,84,0.38)] sm:p-9">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-brand-deep-blue" />
            <div className="inline-flex items-center gap-4 text-brand-deep-blue">
              <div className="rounded-2xl border border-brand-soft bg-brand-cloud p-3 shadow-[0_18px_28px_-24px_rgba(27,43,84,0.22)] transition duration-300 group-hover:border-brand-deep-blue/20 group-hover:bg-white">
                <Target size={24} />
              </div>
              <h3 className="text-3xl font-black tracking-tight text-brand-deep-blue">Mission</h3>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-brand-slate">
              To cultivate and spread ideas about Artificial Intelligence, and provide students with the tools, knowledge, and
              opportunities to excel in AI.
            </p>
          </article>

          <article className="group relative overflow-hidden rounded-[2rem] border border-brand-soft/80 bg-white p-8 shadow-[0_30px_60px_-42px_rgba(27,43,84,0.32)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_64px_-38px_rgba(27,43,84,0.38)] sm:p-9">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-brand-deep-blue" />
            <div className="inline-flex items-center gap-4 text-brand-deep-blue">
              <div className="rounded-2xl border border-brand-soft bg-brand-cloud p-3 shadow-[0_18px_28px_-24px_rgba(27,43,84,0.22)] transition duration-300 group-hover:border-brand-deep-blue/20 group-hover:bg-white">
                <Eye size={24} />
              </div>
              <h3 className="text-3xl font-black tracking-tight text-brand-deep-blue">Vision</h3>
            </div>
            <p className="mt-6 text-lg leading-relaxed text-brand-slate">
              To be a hub of AI creativity and leadership that inspires groundbreaking ideas and empowers tomorrow&apos;s innovators
              by bridging passion with purpose.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
