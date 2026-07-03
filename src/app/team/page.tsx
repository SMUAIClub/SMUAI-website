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
  const leadershipGridClass =
    executiveCommittee.leadership.length >= 4
      ? "grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4"
      : executiveCommittee.leadership.length === 3
        ? "mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3"
        : "mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:gap-5";
  const departmentGridClass =
    executiveCommittee.departments.length >= 4
      ? "grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      : "grid gap-5 md:grid-cols-2 xl:grid-cols-3";
  const hasAnyExecutives = executiveCommittee.departments.some(
    (department) => department.executives.length > 0,
  );
  const useCompactSingleLeadCards = ["22/23", "19/20"].includes(year);

  const renderFeaturedCard = (
    member: TeamMember,
    key: string,
    compact = false,
    tone: "default" | "primary" | "secondary" = "default",
  ) => (
    <article
      key={key}
      className={
        tone === "primary"
          ? "min-w-0 overflow-hidden rounded-3xl border border-brand-pale-gold/95 bg-white shadow-[0_28px_55px_-38px_rgba(27,43,84,0.52),0_0_0_1px_rgba(255,204,0,0.22)] ring-[1.5px] ring-brand-pale-gold/90"
          : tone === "secondary"
            ? "min-w-0 overflow-hidden rounded-3xl border border-brand-soft/70 bg-brand-cloud/55 shadow-[0_18px_36px_-34px_rgba(27,43,84,0.35)]"
            : "min-w-0 overflow-hidden rounded-3xl border border-brand-soft/70 bg-white shadow-[0_24px_45px_-38px_rgba(27,43,84,0.45)]"
      }
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
        <div className={compact ? "space-y-2" : "flex items-start justify-between gap-3"}>
          <div className="min-w-0 flex-1 text-[15px] font-semibold leading-snug text-balance sm:text-base">
            {member.name}
          </div>
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`${member.name} LinkedIn`}
              className="inline-flex shrink-0 self-start rounded-xl border border-brand-soft p-1.5 text-brand-deep-blue transition hover:bg-brand-pale-gold"
            >
              <Linkedin size={16} />
            </a>
          )}
        </div>
        <div className="text-sm text-brand-slate">{member.position}</div>
        {tone !== "default" && (
          <div className="pt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-slate">
            {tone === "primary" ? "Core Leadership" : "Honorary Secretary"}
          </div>
        )}
      </div>
    </article>
  );

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <section className="bg-white px-5 py-6 text-brand-deep-blue lg:px-8 lg:py-8">
        <div className="mx-auto w-full max-w-[1320px] space-y-8">
          <div className="space-y-4">
            <div className="w-full max-w-3xl">
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
            <h2 className="text-lg font-semibold">Leadership Team</h2>
            <div className={leadershipGridClass}>
              {executiveCommittee.leadership.map((member, index) =>
                renderFeaturedCard(
                  member,
                  `leadership-${member.position}-${index}`,
                  false,
                  /president/i.test(member.position) ? "primary" : "secondary",
                ),
              )}
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-lg font-semibold">
              {hasAnyExecutives ? "Department Leads & Executives" : "Department Leads"}
            </h2>
            <div className={departmentGridClass}>
              {executiveCommittee.departments.map((department) => (
                <div key={department.name} className="rounded-3xl bg-brand-cloud p-5">
                  <div className="mb-3 text-base font-semibold">{department.name}</div>
                  <div className="text-xs uppercase tracking-wide text-brand-slate">Lead</div>
                  <div
                    className="mt-2 grid grid-cols-2 gap-3"
                  >
                    {department.leads.map((lead, index) => (
                      <div
                        key={`${department.name}-lead-wrap-${index}`}
                        className={
                          department.leads.length === 1
                            ? "col-span-2 flex justify-center sm:block"
                            : ""
                        }
                      >
                        <div
                          className={
                            department.leads.length === 1
                              ? useCompactSingleLeadCards
                                ? "w-[calc(50%-0.375rem)] sm:w-full sm:max-w-[calc(50%-0.375rem)]"
                                : "w-[calc(50%-0.375rem)] sm:w-full"
                              : "w-full"
                          }
                        >
                          {renderFeaturedCard(
                            lead,
                            `${department.name}-lead-${index}`,
                            false,
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {department.executives.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-xs uppercase tracking-wide text-brand-slate">
                        Executives ({department.executives.length})
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {department.executives.map((member, index) =>
                          renderFeaturedCard(member, `${department.name}-exec-${index}`, true),
                        )}
                      </div>
                    </div>
                  )}
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

          <div className="mx-auto mt-8 grid max-w-5xl gap-6 sm:grid-cols-2">
            {advisors.map((advisor) => (
              <article
                key={advisor.name}
                className="rounded-3xl border border-brand-soft bg-white p-5 shadow-[0_25px_50px_-40px_rgba(27,43,84,0.55)] sm:p-6"
              >
                <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-brand-soft">
                  {advisor.photo ? (
                    <Image
                      src={advisor.photo}
                      alt={advisor.name}
                      className="h-full w-full object-cover object-top"
                      width={640}
                      height={640}
                      sizes="(min-width: 640px) 40vw, 100vw"
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
                        className="rounded-xl border border-brand-soft p-1.5 text-brand-deep-blue transition hover:bg-brand-pale-gold"
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
