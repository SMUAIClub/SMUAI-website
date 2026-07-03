"use client";

import NumberFlow from "@number-flow/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronDown, X } from "lucide-react";
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

function getZeroCountdownParts() {
  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
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

function CompactCountdown({ targetTs, nowTs }: { targetTs?: number | null; nowTs: number }) {
  const parts = targetTs ? getCountdownParts(targetTs, nowTs) : getZeroCountdownParts();
  const items = [
    { label: "D", value: parts.days },
    { label: "H", value: parts.hours },
    { label: "M", value: parts.minutes },
    { label: "S", value: parts.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-start gap-2 sm:gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="min-w-[68px] rounded-2xl border border-brand-soft/80 bg-[linear-gradient(180deg,#ffffff_0%,#f4f7fc_100%)] px-3 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_16px_32px_-28px_rgba(27,43,84,0.28)] sm:min-w-[78px] sm:px-4 sm:py-3"
        >
          <NumberFlow
            value={item.value}
            format={{ minimumIntegerDigits: 2 }}
            className="text-2xl font-black leading-none tracking-[-0.06em] text-brand-deep-blue sm:text-[2rem]"
          />
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-slate">
            {item.label}
          </div>
        </div>
      ))}
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
  const remainingUpcomingEvents = featuredEvent
    ? upcomingEvents.filter((event) => event !== featuredEvent)
    : [];
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
    const hasLuma = Boolean(event.lumaLink);

    if (!hasLuma) {
      return null;
    }

    return (
      <a
        href={event.lumaLink}
        target="_blank"
        rel="noreferrer"
        className={
          inverse
            ? "inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-deep-blue transition hover:bg-brand-pale-gold sm:w-auto"
            : "inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-deep-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-deep-blue/90 sm:w-auto"
        }
      >
        {status === "ended" ? "View Event" : status === "live" ? "Join" : "Register"}
        <ArrowRight size={15} />
      </a>
    );
  };

  return (
    <>
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <section className="bg-white px-5 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1320px] space-y-8">
            <div className="space-y-4">
              <div className="w-full max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">Events</p>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-brand-deep-blue max-sm:max-w-[10.5ch] max-sm:text-[2.05rem] max-sm:leading-[0.98] sm:text-4xl">
                  Build Nights, Workshops, Hackathons
                </h1>
                <p className="mt-3 text-sm text-brand-slate max-sm:max-w-[21rem]">
                  Catch what&apos;s happening next, register before spots fill.
                </p>
              </div>

              <div className="w-full max-w-xs md:ml-auto">
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
              <section className="relative overflow-hidden rounded-[2.25rem] bg-white px-5 py-6 sm:px-6 sm:py-8 lg:min-h-[calc(100svh-220px)] lg:px-8 lg:py-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(27,43,84,0.06),transparent_38%),radial-gradient(circle_at_82%_72%,rgba(81,97,133,0.08),transparent_42%)]" />
                <div className="relative flex h-full flex-col justify-center gap-6 lg:gap-8">
                  <div className="mx-auto grid w-full max-w-6xl items-center gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:gap-8">
                    <div className="text-left">
                      <div className="flex flex-wrap items-center justify-start gap-2">
                        <EventPill tone="accent">Next Event</EventPill>
                        <EventPill>{getUrgencyLabel(featuredEvent, nowTs)}</EventPill>
                      </div>
                      <h2 className="mt-4 text-[2.05rem] font-black leading-[1.04] tracking-[-0.025em] text-brand-deep-blue max-sm:text-[1.75rem] max-sm:leading-[1.02] sm:text-[2.45rem] lg:text-[2.8rem]">
                        {featuredEvent.title}
                      </h2>
                      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-brand-slate max-sm:max-w-[21rem] sm:text-base">
                        {featuredEvent.dateLabel} • {featuredEvent.timeLabel}
                      </p>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-slate max-sm:max-w-[21rem]">
                        Attendance is subject to approval, and SMUAI members are prioritized if slots are limited.
                      </p>
                      <div className="mt-5 flex flex-col items-start gap-3">
                        <div className="space-y-1 text-left">
                          <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">
                            Countdown
                          </p>
                          <p className="text-sm text-brand-slate">
                            Starts in {formatCountdown(getEventStartTime(featuredEvent), nowTs)}
                          </p>
                        </div>
                        <CompactCountdown targetTs={getEventStartTime(featuredEvent)} nowTs={nowTs} />
                      </div>
                      <div className="mt-5 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                        {renderSignupButton(featuredEvent)}
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(featuredEvent)}
                          className="inline-flex items-center justify-center rounded-full border border-brand-soft px-4 py-2 text-sm font-semibold text-brand-deep-blue transition hover:bg-brand-cloud"
                        >
                          Open preview
                        </button>
                      </div>
                    </div>

                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedEvent(featuredEvent)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedEvent(featuredEvent);
                        }
                      }}
                      className="group relative"
                    >
                      <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] bg-brand-cloud shadow-[0_30px_60px_-40px_rgba(27,43,84,0.24)]">
                        {featuredEvent.poster ? (
                          <Image
                            src={featuredEvent.poster}
                            alt={featuredEvent.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-[1.02]"
                            sizes="(min-width: 1024px) 42vw, 100vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-brand-slate">
                            Poster coming soon
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#162856]/70 via-[#162856]/10 to-transparent" />
                      </div>
                    </div>
                  </div>

                  {remainingUpcomingEvents.length > 0 && (
                    <div className="mx-auto w-full max-w-6xl space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-slate">
                          Coming Up
                        </p>
                        <p className="hidden text-sm text-brand-slate lg:block">
                          {remainingUpcomingEvents.length} more event{remainingUpcomingEvents.length === 1 ? "" : "s"} on the calendar
                        </p>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-2">
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
                            className="group overflow-hidden rounded-[1.5rem] border border-brand-soft/70 bg-white/85 shadow-[0_20px_40px_-36px_rgba(27,43,84,0.22)] transition hover:-translate-y-1 hover:shadow-[0_28px_50px_-34px_rgba(27,43,84,0.3)]"
                          >
                            <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-4 p-4 items-center sm:grid-cols-[116px_minmax(0,1fr)]">
                              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-soft">
                                {event.poster ? (
                                  <Image
                                    src={event.poster}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                                    sizes="(min-width: 640px) 116px, 92px"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-xs text-brand-slate">
                                    Poster
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <EventPill>{getUrgencyLabel(event, nowTs)}</EventPill>
                                </div>
                                <h3 className="text-base font-semibold leading-tight text-brand-deep-blue">
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
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
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

              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
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
                      <h3 className="text-lg font-semibold leading-tight text-brand-deep-blue">
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
