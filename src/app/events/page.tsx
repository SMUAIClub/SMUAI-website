"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, ChevronDown, Clock3, X } from "lucide-react";
import { eventsByYear, type EventItem } from "@/content/events";

type EventStatus = "upcoming" | "live" | "ended";

function getEventEndTime(event: EventItem) {
  return new Date(event.endAt ?? event.startAt).getTime();
}

function getEventStartTime(event: EventItem) {
  return new Date(event.startAt).getTime();
}

function getEventStatus(event: EventItem, nowTs: number): EventStatus {
  const start = getEventStartTime(event);
  const end = getEventEndTime(event);

  if (nowTs < start) {
    return "upcoming";
  }

  if (nowTs <= end) {
    return "live";
  }

  return "ended";
}

function formatCountdown(targetTs: number, nowTs: number) {
  const diff = Math.max(0, targetTs - nowTs);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function getCountdownParts(targetTs: number, nowTs: number) {
  const diff = Math.max(0, targetTs - nowTs);
  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function getUrgencyLabel(event: EventItem, nowTs: number) {
  const status = getEventStatus(event, nowTs);
  const start = getEventStartTime(event);
  const msUntilStart = start - nowTs;

  if (status === "live") {
    return "Happening now";
  }

  if (status === "ended") {
    return "Past event";
  }

  if (msUntilStart <= 24 * 60 * 60 * 1000) {
    return "Tomorrow";
  }

  if (msUntilStart <= 3 * 24 * 60 * 60 * 1000) {
    return "This week";
  }

  return "Coming up";
}

function EventPill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "accent" | "muted" }) {
  const className =
    tone === "accent"
      ? "inline-flex items-center rounded-full bg-brand-gold px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-deep-blue"
      : tone === "muted"
        ? "inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/78"
        : "inline-flex items-center rounded-full border border-brand-soft bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-slate";

  return <span className={className}>{children}</span>;
}

function CountdownTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-brand-soft/80 bg-white px-2 py-3 text-center shadow-[0_20px_40px_-34px_rgba(27,43,84,0.28)]">
      <div
        key={`${label}-${value}`}
        className="countdown-ticker text-2xl font-black tabular-nums text-brand-deep-blue sm:text-3xl"
      >
        {String(value).padStart(2, "0")}
      </div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-slate">
        {label}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const years = useMemo(
    () =>
      Object.keys(eventsByYear).sort((a, b) => {
        const startA = Number(a.split("/")[0]);
        const startB = Number(b.split("/")[0]);
        return startB - startA;
      }),
    [],
  );
  const [year, setYear] = useState(years[0]);
  const [nowTs, setNowTs] = useState(() => Date.now());
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const events = useMemo(
    () => [...(eventsByYear[year] ?? [])].sort((a, b) => getEventStartTime(a) - getEventStartTime(b)),
    [year],
  );

  const upcomingEvents = useMemo(
    () => events.filter((event) => getEventEndTime(event) >= nowTs),
    [events, nowTs],
  );

  const pastEvents = useMemo(
    () =>
      events
        .filter((event) => getEventEndTime(event) < nowTs)
        .sort((a, b) => getEventStartTime(b) - getEventStartTime(a)),
    [events, nowTs],
  );

  const featuredEvent = upcomingEvents[0] ?? null;
  const remainingUpcomingEvents = featuredEvent ? upcomingEvents.slice(1) : [];
  const hasUpcomingEvents = upcomingEvents.length > 0;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTs(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedEvent(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const renderSignupButton = (event: EventItem, inverse = false) => {
    const status = getEventStatus(event, nowTs);
    const isLumaEnabled = Boolean(event.lumaLink) && status !== "ended";

    if (isLumaEnabled) {
      return (
        <a
          href={event.lumaLink}
          target="_blank"
          rel="noreferrer"
          className={
            inverse
              ? "inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-deep-blue transition hover:bg-brand-pale-gold"
              : "inline-flex items-center gap-2 rounded-full bg-brand-deep-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-deep-blue/90"
          }
        >
          {status === "live" ? "Join via Luma" : "Open Luma Registration"}
          <ArrowRight size={15} />
        </a>
      );
    }

    return (
      <button
        type="button"
        disabled
        className={
          inverse
            ? "inline-flex cursor-not-allowed rounded-full bg-white/14 px-5 py-2.5 text-sm font-semibold text-white/78"
            : "inline-flex cursor-not-allowed rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand-slate"
        }
      >
        {status === "ended" ? "Event Ended" : "Luma Link Soon"}
      </button>
    );
  };

  return (
    <>
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <section className="bg-white px-5 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1320px] space-y-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Events</p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-brand-deep-blue sm:text-4xl">
                  Build Nights, Workshops, Hackathons
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-slate">
                  Catch what&apos;s happening next, register before spots fill.
                </p>
              </div>

              <div className="w-full max-w-xs">
                <div className="relative">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-brand-soft bg-white px-3 py-2 pr-11 text-sm text-brand-deep-blue outline-none"
                  >
                    {years.map((y) => (
                      <option key={y} value={y} className="text-brand-deep-blue">
                        AY{y}
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

            {featuredEvent && (
              <section
                role="button"
                tabIndex={0}
                onClick={() => setSelectedEvent(featuredEvent)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedEvent(featuredEvent);
                  }
                }}
                className="grid gap-4 rounded-[2rem] border border-brand-soft/70 bg-[linear-gradient(135deg,#fff9ef_0%,#ffffff_52%,#f7f9ff_100%)] p-4 shadow-[0_30px_60px_-42px_rgba(27,43,84,0.28)] sm:gap-5 sm:p-5 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-stretch lg:p-6"
              >
                <div className="group relative aspect-[4/3] min-h-[220px] overflow-hidden rounded-[1.75rem] border border-brand-soft/70 bg-brand-cloud shadow-[0_30px_60px_-42px_rgba(27,43,84,0.25)] sm:min-h-[280px] lg:min-h-full lg:aspect-auto">
                  {featuredEvent.poster ? (
                    <Image
                      src={featuredEvent.poster}
                      alt={featuredEvent.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 320px, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-brand-slate">
                      Poster coming soon
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#162856]/82 via-[#162856]/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <div className="rounded-2xl border border-white/20 bg-white/12 p-3 backdrop-blur-sm sm:p-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/70">
                        Click for details
                      </div>
                      <div className="mt-2 line-clamp-2 text-base font-semibold text-white">
                        {featuredEvent.title}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex min-w-0 flex-col justify-between gap-4 sm:gap-5">
                  <div className="flex flex-wrap gap-2">
                    <EventPill tone="accent">Next Event</EventPill>
                    <EventPill>{getUrgencyLabel(featuredEvent, nowTs)}</EventPill>
                  </div>

                  <div>
                    <h2 className="max-w-3xl text-[1.9rem] font-black leading-[1.05] text-brand-deep-blue sm:text-3xl">
                      {featuredEvent.title}
                    </h2>
                    <div className="mt-3 flex flex-col gap-2 text-sm text-brand-slate sm:mt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={16} />
                        {featuredEvent.dateLabel}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock3 size={16} />
                        {featuredEvent.timeLabel}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)]">
                    {getEventStatus(featuredEvent, nowTs) === "upcoming" ? (
                      <div className="rounded-[1.5rem] border border-brand-soft/70 bg-brand-cloud/75 p-4">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand-slate">
                              Countdown
                            </div>
                            <div className="mt-1 text-sm font-semibold text-brand-deep-blue">
                              Time left before kickoff
                            </div>
                          </div>
                          <div className="text-xs text-brand-slate">live timer</div>
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-2">
                          {(() => {
                            const parts = getCountdownParts(getEventStartTime(featuredEvent), nowTs);

                            return (
                              <>
                                <CountdownTile label="Days" value={parts.days} />
                                <CountdownTile label="Hours" value={parts.hours} />
                                <CountdownTile label="Minutes" value={parts.minutes} />
                                <CountdownTile label="Seconds" value={parts.seconds} />
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-[1.5rem] border border-brand-soft/70 bg-brand-cloud/75 px-4 py-4">
                        <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand-slate">
                          Countdown
                        </div>
                        <div className="mt-2 text-2xl font-black text-brand-deep-blue">Live now</div>
                        <div className="mt-1 text-sm text-brand-slate">
                          Registration may still be open on Luma.
                        </div>
                      </div>
                    )}

                    <div className="rounded-[1.5rem] border border-brand-soft/70 bg-white p-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand-slate">
                        Registration
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-brand-slate">
                        Attendance is subject to approval, and SMUAI members are prioritized if slots are limited.
                      </p>
                      <div className="mt-4">{renderSignupButton(featuredEvent)}</div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {remainingUpcomingEvents.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">
                      Coming Soon
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-brand-deep-blue">More Upcoming Events</h2>
                  </div>
                  <p className="hidden text-sm text-brand-slate md:block">
                    {remainingUpcomingEvents.length} more event{remainingUpcomingEvents.length === 1 ? "" : "s"} on the calendar
                  </p>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {remainingUpcomingEvents.map((event) => (
                    <article
                      key={`${event.title}-${event.startAt}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedEvent(event)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedEvent(event);
                        }
                      }}
                      className="group overflow-hidden rounded-[1.75rem] border border-brand-soft/70 bg-white shadow-[0_26px_50px_-40px_rgba(15,23,42,0.4)] transition hover:-translate-y-1 hover:shadow-[0_32px_65px_-38px_rgba(15,23,42,0.48)]"
                    >
                      <div className="grid gap-4 p-4 sm:grid-cols-[140px_1fr]">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-soft">
                          {event.poster ? (
                            <Image
                              src={event.poster}
                              alt={event.title}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-[1.03]"
                              sizes="140px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-brand-slate">
                              Poster
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <EventPill>{getUrgencyLabel(event, nowTs)}</EventPill>
                          <h3 className="text-lg font-bold leading-tight text-brand-deep-blue">
                            {event.title}
                          </h3>
                          <div className="space-y-1 text-sm text-brand-slate">
                            <div>{event.dateLabel}</div>
                            <div>{event.timeLabel}</div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            <div className="text-sm font-semibold text-brand-deep-blue">
                              Starts in {formatCountdown(getEventStartTime(event), nowTs)}
                            </div>
                            {renderSignupButton(event)}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">
                    {hasUpcomingEvents ? "Archive" : "Events Archive"}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-brand-deep-blue">
                    {hasUpcomingEvents ? "Past Events" : "All Events"}
                  </h2>
                </div>
                <p className="hidden text-sm text-brand-slate md:block">
                  AY{year} archive
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {pastEvents.map((event) => (
                  <article
                    key={`${event.title}-${event.startAt}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedEvent(event)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedEvent(event);
                      }
                    }}
                    className="group overflow-hidden rounded-[1.75rem] border border-brand-soft/80 bg-white shadow-[0_24px_45px_-38px_rgba(27,43,84,0.45)] transition hover:-translate-y-1 hover:shadow-[0_30px_58px_-36px_rgba(27,43,84,0.48)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-brand-soft">
                      {event.poster ? (
                        <Image
                          src={event.poster}
                          alt={event.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 42vw, 100vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-brand-slate">
                          Poster
                        </div>
                      )}
                      <div className="absolute inset-x-0 top-0 flex justify-between p-4">
                        <EventPill>Archive</EventPill>
                      </div>
                    </div>

                    <div className="space-y-3 p-5">
                      <h3 className="text-lg font-bold leading-tight text-brand-deep-blue">
                        {event.title}
                      </h3>
                      <div className="space-y-1 text-sm text-brand-slate">
                        <div>{event.dateLabel}</div>
                        <div>{event.timeLabel}</div>
                      </div>
                      <div className="pt-1">
                        {renderSignupButton(event)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>

      {selectedEvent && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="max-h-[90svh] w-full max-w-3xl overflow-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-brand-soft px-5 py-4">
              <h2 className="pr-4 text-lg font-semibold text-brand-deep-blue">Event Details</h2>
              <button
                type="button"
                aria-label="Close event details"
                onClick={() => setSelectedEvent(null)}
                className="rounded-full border border-brand-soft p-1.5 text-brand-slate transition hover:bg-brand-cloud"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-[240px_1fr]">
              <div className="relative mx-auto aspect-[3/4] w-full max-w-[240px] overflow-hidden rounded-2xl bg-brand-soft md:mx-0">
                {selectedEvent.poster ? (
                  <Image
                    src={selectedEvent.poster}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                    sizes="240px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-brand-slate">
                    No poster
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <EventPill>{getUrgencyLabel(selectedEvent, nowTs)}</EventPill>
                </div>
                <h3 className="text-xl font-semibold leading-tight text-brand-deep-blue">
                  {selectedEvent.title}
                </h3>
                <p className="text-sm text-brand-slate">{selectedEvent.dateLabel}</p>
                <p className="text-sm font-medium text-brand-deep-blue">{selectedEvent.timeLabel}</p>

                {getEventStatus(selectedEvent, nowTs) === "upcoming" && (
                  <div className="rounded-2xl bg-brand-cloud px-4 py-3 text-sm text-brand-slate">
                    Starts in{" "}
                    <span className="font-semibold text-brand-deep-blue">
                      {formatCountdown(getEventStartTime(selectedEvent), nowTs)}
                    </span>
                  </div>
                )}

                <div className="pt-2">{renderSignupButton(selectedEvent)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
