import { collection, config, fields, singleton } from "@keystatic/core";

/** A person card (ExCo member or advisor). Photos are stored under `imageDir`. */
function person(imageDir: string, publicPath: string, extra: Record<string, ReturnType<typeof fields.text>> = {}) {
  return fields.object({
    name: fields.text({ label: "Name", validation: { isRequired: true } }),
    position: fields.text({ label: "Position", validation: { isRequired: true } }),
    photo: fields.image({
      label: "Photo",
      description: "Optional — a placeholder is shown if empty. Portrait crop works best.",
      directory: imageDir,
      publicPath,
    }),
    linkedin: fields.url({ label: "LinkedIn URL", description: "Optional" }),
    ...extra,
  });
}

function people(label: string, imageDir: string, publicPath: string) {
  return fields.array(person(imageDir, publicPath), {
    label,
    itemLabel: (props) => `${props.fields.name.value || "New person"} — ${props.fields.position.value}`,
  });
}

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

    exco: collection({
      label: "ExCo (by year)",
      slugField: "year",
      path: "content/exco/*",
      format: { data: "json" },
      entryLayout: "form",
      columns: ["year", "excoNumber"],
      schema: {
        year: fields.slug({
          name: {
            label: "Academic year",
            description: "e.g. 27/28. The newest year is shown first and used as the current ExCo.",
            validation: { isRequired: true },
          },
          slug: { label: "File name", description: "Use the year with a dash, e.g. 27-28" },
        }),
        excoNumber: fields.text({ label: "ExCo number", description: 'e.g. "9th ExCo"', validation: { isRequired: true } }),
        leadership: people("Leadership", "public/team/exco", "/team/exco/"),
        departments: fields.array(
          fields.object({
            name: fields.text({ label: "Department name", validation: { isRequired: true } }),
            leads: people("Leads", "public/team/exco", "/team/exco/"),
            executives: people("Executives", "public/team/exco", "/team/exco/"),
          }),
          { label: "Departments", itemLabel: (props) => props.fields.name.value || "New department" },
        ),
      },
    }),
  },

  singletons: {
    advisors: singleton({
      label: "Advisors",
      path: "content/advisors",
      format: { data: "json" },
      entryLayout: "form",
      schema: {
        intro: fields.text({ label: "Intro paragraph", multiline: true, validation: { isRequired: true } }),
        advisors: fields.array(
          person("public/team/advisors", "/team/advisors/", {
            summary: fields.text({ label: "Short profile", multiline: true }),
          }),
          { label: "Advisors", itemLabel: (props) => props.fields.name.value || "New advisor" },
        ),
      },
    }),

    partners: singleton({
      label: "Partners",
      path: "content/partners",
      format: { data: "json" },
      entryLayout: "form",
      schema: {
        partners: fields.array(
          fields.object({
            name: fields.text({ label: "Name", validation: { isRequired: true } }),
            description: fields.text({ label: "Description", multiline: true, validation: { isRequired: true } }),
            logo: fields.image({ label: "Logo", directory: "public/partners", publicPath: "/partners/" }),
            website: fields.url({ label: "Website", description: "Optional" }),
            linkedin: fields.url({ label: "LinkedIn URL", description: "Optional" }),
          }),
          {
            label: "Partners",
            description: "Drag to reorder — the order here is the order on the site.",
            itemLabel: (props) => props.fields.name.value || "New partner",
          },
        ),
      },
    }),

    home: singleton({
      label: "Homepage",
      path: "content/home",
      format: { data: "json" },
      entryLayout: "form",
      schema: {
        gallery: fields.array(
          fields.image({ label: "Photo", directory: "public/gallery", publicPath: "/gallery/", validation: { isRequired: true } }),
          { label: "Hero gallery photos", description: "Landscape photos work best." },
        ),
        testimonials: fields.array(
          fields.object({
            quote: fields.text({ label: "Quote", multiline: true, validation: { isRequired: true } }),
            name: fields.text({ label: "Name", validation: { isRequired: true } }),
            role: fields.text({ label: "Role", description: 'e.g. "ExCo | 7th President"', validation: { isRequired: true } }),
          }),
          { label: "Testimonials", itemLabel: (props) => props.fields.name.value || "New testimonial" },
        ),
      },
    }),
  },
});
