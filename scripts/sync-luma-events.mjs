import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ORGANIZER_URL = process.env.LUMA_USER_URL ?? "https://luma.com/user/smuai";
const TARGET_YEAR = process.env.LUMA_TARGET_YEAR ?? "26/27";
const OUTPUT_PATH = path.join(process.cwd(), "src/content/events.luma.generated.json");
const SINGAPORE_OFFSET = "+08:00";
const DUMP_DOM_FLAGS = [
  "--headless",
  "--disable-gpu",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=6000",
  "--dump-dom",
];

const CHROME_CANDIDATES = [
  process.env.LUMA_CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/usr/bin/chromium",
].filter(Boolean);

const monthIndex = new Map([
  ["Jan", 1],
  ["Feb", 2],
  ["Mar", 3],
  ["Apr", 4],
  ["May", 5],
  ["Jun", 6],
  ["Jul", 7],
  ["Aug", 8],
  ["Sep", 9],
  ["Oct", 10],
  ["Nov", 11],
  ["Dec", 12],
]);

async function findChromePath() {
  for (const candidate of CHROME_CANDIDATES) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // keep searching
    }
  }

  throw new Error(
    "Could not find a Chrome executable. Set LUMA_CHROME_PATH to a valid Chrome or Chromium binary.",
  );
}

async function getRenderedOrganizerDom() {
  const chromePath = await findChromePath();
  const { stdout } = await execFileAsync(chromePath, [...DUMP_DOM_FLAGS, ORGANIZER_URL], {
    maxBuffer: 50 * 1024 * 1024,
  });
  return stdout;
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizePosterUrl(url) {
  const decoded = decodeHtml(url);
  return decoded.replace(
    /https:\/\/images\.lumacdn\.com\/cdn-cgi\/image\/[^/]+\/(uploads\/.+)$/i,
    "https://images.lumacdn.com/$1",
  );
}

function parseDisplayedTime(timeText) {
  const match = timeText.trim().match(
    /^(?<weekday>\w{3}), (?<month>\w{3}) (?<day>\d{1,2}), (?<time>\d{1,2}:\d{2} [AP]M)$/i,
  );

  if (!match?.groups) {
    throw new Error(`Unable to parse Luma time string: ${timeText}`);
  }

  const { month, day, time } = match.groups;
  const monthNumber = monthIndex.get(month);

  if (!monthNumber) {
    throw new Error(`Unknown month in Luma time string: ${timeText}`);
  }

  return {
    month: monthNumber,
    day: Number(day),
    time,
  };
}

function toSingaporeTimestamp(year, month, day, timeText) {
  const [, hourText, minuteText, meridiem] =
    timeText.match(/^(\d{1,2}):(\d{2}) ([AP]M)$/i) ?? [];

  if (!hourText || !minuteText || !meridiem) {
    throw new Error(`Unable to parse event time: ${timeText}`);
  }

  let hour = Number(hourText) % 12;
  if (meridiem.toUpperCase() === "PM") {
    hour += 12;
  }

  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hour).padStart(2, "0")}:${minuteText}:00${SINGAPORE_OFFSET}`;
}

function inferEventYear(now, month, day, timeText, isPastEvent) {
  const currentYear = now.getUTCFullYear();
  let timestamp = toSingaporeTimestamp(currentYear, month, day, timeText);
  const parsed = new Date(timestamp).getTime();
  const nowTs = now.getTime();
  const dayWindowMs = 36 * 60 * 60 * 1000;

  if (!isPastEvent && parsed < nowTs - dayWindowMs) {
    timestamp = toSingaporeTimestamp(currentYear + 1, month, day, timeText);
  } else if (isPastEvent && parsed > nowTs + dayWindowMs) {
    timestamp = toSingaporeTimestamp(currentYear - 1, month, day, timeText);
  }

  return timestamp;
}

function formatDateLabel(timestamp) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Singapore",
  }).format(new Date(timestamp));
}

function buildTimeLabel(timeText) {
  return timeText.trim();
}

function extractEventRows(dom) {
  const anchorNeedle = 'class="event-link content-link"';
  const pastEventsStart = dom.indexOf("Past Events");
  const rows = [];
  let searchStart = 0;

  while (true) {
    const anchorIndex = dom.indexOf(anchorNeedle, searchStart);
    if (anchorIndex === -1) {
      break;
    }

    const rowStart = dom.lastIndexOf('<div class="jsx-3537648588 event-row', anchorIndex);
    const nextAnchorIndex = dom.indexOf(anchorNeedle, anchorIndex + anchorNeedle.length);
    const rowEnd =
      nextAnchorIndex === -1
        ? dom.length
        : dom.lastIndexOf('<div class="jsx-3537648588 event-row', nextAnchorIndex);

    const rowHtml = dom.slice(rowStart, rowEnd === -1 ? dom.length : rowEnd);
    const titleMatch = rowHtml.match(/<a aria-label="([^"]+)" class="event-link content-link" href="([^"]+)"/);
    const imageMatch = rowHtml.match(/<img class="rectangle"[^>]+src="([^"]+)"/);
    const timeMatch = rowHtml.match(/<span class="jsx-3570480901">([^<]+)<\/span>/);

    if (titleMatch && imageMatch && timeMatch) {
      rows.push({
        title: decodeHtml(titleMatch[1]),
        href: titleMatch[2],
        imageUrl: normalizePosterUrl(imageMatch[1]),
        displayedTime: decodeHtml(timeMatch[1]),
        isPastEvent: pastEventsStart !== -1 && rowStart > pastEventsStart,
      });
    }

    searchStart = anchorIndex + anchorNeedle.length;
  }

  return rows;
}

function convertRowsToEvents(rows) {
  const now = new Date();

  return rows.map((row) => {
    const parsed = parseDisplayedTime(row.displayedTime);
    const startAt = inferEventYear(
      now,
      parsed.month,
      parsed.day,
      parsed.time,
      row.isPastEvent,
    );

    return {
      title: row.title,
      dateLabel: formatDateLabel(startAt),
      timeLabel: buildTimeLabel(parsed.time),
      startAt,
      poster: row.imageUrl,
      lumaLink: row.href.startsWith("http") ? row.href : `https://luma.com${row.href}`,
    };
  });
}

function sortEvents(events) {
  return [...events].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );
}

async function writeGeneratedEventsFile(events) {
  const payload = {
    [TARGET_YEAR]: sortEvents(events),
  };

  await fs.writeFile(`${OUTPUT_PATH}`, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function main() {
  const dom = await getRenderedOrganizerDom();
  const rows = extractEventRows(dom);

  if (rows.length === 0) {
    throw new Error("No Luma event rows were found on the rendered organizer page.");
  }

  const events = convertRowsToEvents(rows);
  await writeGeneratedEventsFile(events);

  process.stdout.write(
    `Synced ${events.length} Luma events into ${path.relative(process.cwd(), OUTPUT_PATH)} for AY${TARGET_YEAR}.\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
