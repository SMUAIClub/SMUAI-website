import { collection, config, fields } from "@keystatic/core";

/**
 * Keystatic CMS config — admin UI lives at /keystatic.
 *
 * - In `next dev`, edits are written straight to files on disk (local mode).
 *   Set NEXT_PUBLIC_KEYSTATIC_STORAGE=github to test GitHub mode locally.
 * - In production, admins sign in with GitHub and every save becomes a commit
 *   to the repo below, which triggers a normal Vercel rebuild.
 */
const githubRepo = (process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO ?? "SMUAIClub/SMUAI-website") as `${string}/${string}`;

export default config({
  storage:
    process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE !== "github"
      ? { kind: "local" }
      : { kind: "github", repo: githubRepo },
  ui: {
    brand: { name: "SMUAI Website" },
  },
  collections: {
    events: collection({
      label: "Events",
      slugField: "title",
      path: "content/events/*",
      format: { data: "json" },
      entryLayout: "form",
      columns: ["title", "academicYear", "dateLabel"],
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { isRequired: true } },
          slug: {
            label: "File name",
            description: "Used for the file and poster folder. Tip: start with the date, e.g. 2026-11-20-my-event",
          },
        }),
        academicYear: fields.text({
          label: "Academic year",
          description: "Which year tab this event appears under, e.g. 26/27",
          validation: {
            isRequired: true,
            pattern: { regex: /^\d{2}\/\d{2}$/, message: "Use the format YY/YY, e.g. 26/27" },
          },
        }),
        dateLabel: fields.text({
          label: "Date (as shown on the site)",
          description: 'e.g. "Friday, 4 Sep 2026" or "22 Jul - 5 Aug 2026"',
          validation: { isRequired: true },
        }),
        timeLabel: fields.text({
          label: "Time (as shown on the site)",
          description: 'e.g. "6:30 PM - 9:30 PM"',
          validation: { isRequired: true },
        }),
        startAt: fields.datetime({
          label: "Start (Singapore time)",
          description: "Used to sort events and decide upcoming vs past",
          validation: { isRequired: true },
        }),
        endAt: fields.datetime({
          label: "End (Singapore time)",
          description: "Optional — if empty, the event counts as ending at 23:59 on its start day",
        }),
        poster: fields.image({
          label: "Poster",
          directory: "public/events",
          publicPath: "/events/",
          validation: { isRequired: true },
        }),
        lumaLink: fields.url({
          label: "Luma sign-up link",
          description: "Optional",
        }),
      },
    }),
  },
});
