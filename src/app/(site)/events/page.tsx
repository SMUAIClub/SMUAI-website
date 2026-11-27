import { getEventsByYear } from "@/content/events.server";
import EventsView from "./events-view";

export default function EventsPage() {
  return <EventsView eventsByYear={getEventsByYear()} />;
}
