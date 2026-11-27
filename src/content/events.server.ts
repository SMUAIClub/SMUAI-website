import "server-only";

import fs from "node:fs";
import path from "node:path";
import { normalizeEvent, SINGAPORE_OFFSET, type EventItem, type EventsByYear } from "./events";

const EVENTS_DIR = path.join(process.cwd(), "content", "events");

type EventFile = {
  title?: unknown;
  academicYear?: unknown;
  dateLabel?: unknown;
  timeLabel?: unknown;
  startAt?: unknown;
  endAt?: unknown;
  poster?: unknown;
  lumaLink?: unknown;
};

/** Keystatic stores datetimes as "YYYY-MM-DDTHH:mm" with no timezone; treat them as Singapore time. */
function toSingaporeIso(value: string) {
  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(value)) return value;
  const withSeconds = /T\d{2}:\d{2}$/.test(value) ? `${value}:00` : value;
  return `${withSeconds}${SINGAPORE_OFFSET}`;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function requireString(value: unknown, field: string, file: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`content/events/${file}: "${field}" is required`);
  }
  return value;
}

function parseEventFile(file: string): { year: string; event: EventItem } {
  const raw = JSON.parse(fs.readFileSync(path.join(EVENTS_DIR, file), "utf8")) as EventFile;
  const startAt = toSingaporeIso(requireString(raw.startAt, "startAt", file));
  const endAt = optionalString(raw.endAt);

  if (Number.isNaN(new Date(startAt).getTime())) {
    throw new Error(`content/events/${file}: "startAt" is not a valid date`);
  }

  return {
    year: requireString(raw.academicYear, "academicYear", file),
    event: normalizeEvent({
      title: requireString(raw.title, "title", file),
      dateLabel: requireString(raw.dateLabel, "dateLabel", file),
      timeLabel: requireString(raw.timeLabel, "timeLabel", file),
      startAt,
      endAt: endAt ? toSingaporeIso(endAt) : undefined,
      poster: optionalString(raw.poster),
      lumaLink: optionalString(raw.lumaLink),
    }),
  };
}

export function getEventsByYear(): EventsByYear {
  const files = fs.readdirSync(EVENTS_DIR).filter((file) => file.endsWith(".json")).sort();
  const byYear: EventsByYear = {};

  for (const file of files) {
    const { year, event } = parseEventFile(file);
    (byYear[year] ??= []).push(event);
  }

  return byYear;
}
