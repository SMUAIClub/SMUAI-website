// Shared event types/helpers (safe to import from client components).
// The event data itself lives in /content/events/*.json and is edited via the
// Keystatic admin at /keystatic — see src/content/events.server.ts.

export type EventItem = {
  title: string;
  dateLabel: string;
  timeLabel: string;
  startAt: string;
  endAt?: string;
  poster?: string;
  lumaLink?: string;
};

export type EventsByYear = Record<string, EventItem[]>;

export const SINGAPORE_OFFSET = "+08:00";

function getFallbackEndAt(startAt: string) {
  const [datePart] = startAt.split("T");
  return `${datePart}T23:59:59${SINGAPORE_OFFSET}`;
}

export function normalizeEvent(event: EventItem): EventItem {
  return {
    ...event,
    endAt: event.endAt ?? getFallbackEndAt(event.startAt),
  };
}

export function getEventEndTimestamp(event: Pick<EventItem, "startAt" | "endAt">) {
  return new Date(event.endAt ?? getFallbackEndAt(event.startAt)).getTime();
}
