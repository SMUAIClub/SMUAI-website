"use client";

import Image from "next/image";
import { ChevronDown, Linkedin } from "lucide-react";
import { useMemo, useState } from "react";
import {
  type TeamMember,
  advisors,
  advisorsIntro,
  advisorsProfileSummary,
  executiveCommitteeByYear,
} from "@/content/team";

export default function TeamPage() {
  const years = useMemo(
    () =>
      Object.keys(executiveCommitteeByYear).sort((a, b) => {
        const startA = Number(a.split("/")[0]);
        const startB = Number(b.split("/")[0]);
        return startB - startA;
      }),
    [],
  );
  const [year, setYear] = useState(years[0]);

  const executiveCommittee = executiveCommitteeByYear[year];
  const executiveLabel = `AY${year} • ${executiveCommittee.excoNumber}`;
  const departmentGridClass =
    executiveCommittee.departments.length >= 4
      ? "grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      : "grid gap-5 md:grid-cols-2 xl:grid-cols-3";

  const renderFeaturedCard = (member: TeamMember, key: string) => (
    <article
      key={key}
      className="overflow-hidden rounded-3xl border border-brand-soft/70 bg-white shadow-[0_24px_45px_-38px_rgba(27,43,84,0.45)]"
    >
      <div className="aspect-square w-full overflow-hidden bg-brand-soft">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            width={640}
            height={640}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-brand-slate">
            Photo placeholder
          </div>
        )}
      </div>
      <div className="space-y-1 px-4 py-3">
        <div className="font-semibold">{member.name}</div>
        <div className="text-sm text-brand-slate">{member.position}</div>
      </div>
    </article>
  );

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <section className="bg-white px-5 py-12 text-brand-deep-blue lg:px-8">
        <div className="mx-auto w-full max-w-[1320px] space-y-8">
          <div className="space-y-4">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Team</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-brand-deep-blue sm:text-4xl">
                Executive Committee
              </h1>
              <p className="mt-3 text-sm text-brand-slate">{executiveLabel}</p>
            </div>

            <div className="w-full max-w-xs md:ml-auto">
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full appearance-none rounded-xl border bg-white px-3 py-2 pr-11 text-sm"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      AY{y} • {executiveCommitteeByYear[y].excoNumber}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-slate"
                />
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Big 4</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {executiveCommittee.leadership.map((member, index) =>
                renderFeaturedCard(member, `leadership-${member.position}-${index}`),
              )}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-lg font-semibold">Department Leads & Executives</h2>
            <div className={departmentGridClass}>
              {executiveCommittee.departments.map((department) => (
                <div key={department.name} className="rounded-3xl bg-brand-cloud p-5">
                  <div className="mb-3 text-base font-semibold">{department.name}</div>
                  <div className="text-xs uppercase tracking-wide text-brand-slate">Lead</div>
                  <div
                    className={
                      department.leads.length === 1
                        ? "mt-2"
                        : "mt-2 grid gap-3 sm:grid-cols-2"
                    }
                  >
                    {department.leads.map((lead, index) =>
                      renderFeaturedCard(lead, `${department.name}-lead-${index}`),
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="text-xs uppercase tracking-wide text-brand-slate">
                      Executives ({department.executives.length})
                    </div>
                    {department.executives.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {department.executives.map((member, index) =>
                          renderFeaturedCard(member, `${department.name}-exec-${index}`),
                        )}
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-white/75 p-3 text-sm text-brand-slate ring-1 ring-brand-soft/70">
                        No executives for this ExCo year.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="bg-brand-cloud px-5 py-12 text-brand-deep-blue lg:px-8">
        <div className="mx-auto w-full max-w-[1320px]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Advisors</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-brand-deep-blue sm:text-4xl">
              Guided By IIE Leadership
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-slate sm:text-base">
              {advisorsIntro}
            </p>
            <a
              href="https://iie.smu.edu.sg/"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full border border-brand-soft bg-white px-5 py-2 text-sm font-semibold text-brand-deep-blue transition hover:bg-brand-pale-gold"
            >
              Learn More About IIE
            </a>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {advisors.map((advisor) => (
              <article
                key={advisor.name}
                className="rounded-3xl border border-brand-soft bg-white p-5 shadow-[0_25px_50px_-40px_rgba(27,43,84,0.55)]"
              >
                <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-brand-soft">
                  {advisor.photo ? (
                    <Image
                      src={advisor.photo}
                      alt={advisor.name}
                      className="h-full w-full object-cover"
                      width={640}
                      height={640}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-brand-slate">
                      Photo placeholder
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-medium">{advisor.name}</div>
                    {advisor.linkedin && (
                      <a
                        href={advisor.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${advisor.name} LinkedIn`}
                        className="rounded-full border border-brand-soft p-1.5 text-brand-deep-blue transition hover:bg-brand-pale-gold"
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                  </div>
                  <div className="text-sm text-brand-slate">{advisor.position}</div>
                  <p className="mt-3 text-sm text-brand-slate">
                    {advisorsProfileSummary[advisor.name]}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
