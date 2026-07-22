# SMUAI Website Handover Guide

This repo powers the SMUAI public site. Most updates are content and layout tweaks, so this guide is meant to help future ExCo members find the right file quickly.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS v4
- Framer Motion for some animated sections

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Recommended Checks

```bash
npm run build
```

Use `npm run build` before pushing. It is currently the most reliable project health check.

`npm run lint` should stay useful as a secondary check, but `npm run build` is still the better final verification for this repo because it catches both typing and App Router build issues.

## Main Files

Content:

- `src/content/home.ts`
- `src/content/events.ts`
- `src/content/team.ts`
- `src/content/partners.ts`

Top-level pages:

- `src/app/page.tsx`
- `src/app/events/page.tsx`
- `src/app/team/page.tsx`
- `src/app/partners/page.tsx`
- `src/app/membership/page.tsx`

Shared layout:

- `src/app/layout.tsx`
- `src/components/navbar.tsx`
- `src/components/footer.tsx`
- `src/components/site-chatbot.tsx`
- `src/app/globals.css`

Home sections:

- `src/components/home/hero-section.tsx`
- `src/components/home/mission-vision-section.tsx`
- `src/components/home/what-smuai-does-section.tsx`
- `src/components/home/testimonials-section.tsx`

## Home Page

Home page sections are currently:

- hero logo and intro
- mobile swipe gallery / desktop rotating gallery
- mission and vision
- what SMUAI does
- testimonials marquee

Hero images and testimonials come from `src/content/home.ts`.

Key fields:

- `heroGalleryImages`
- `testimonials`

## SMUAI Bot

The site includes a floating chatbot in the bottom-right corner.

Files:

- `src/components/site-chatbot.tsx`
- `src/app/api/chat/route.ts`
- `src/lib/site-chatbot.ts`

Current behavior:

- the bot appears site-wide through `src/app/layout.tsx`
- it answers from curated SMUAI site content
- it uses Gemini when `GEMINI_API_KEY` is available
- if Gemini fails or is unavailable, it falls back to local replies for membership, events, team, partners, and contact info
- event answers use the same event data as the Events page

Branding:

- chatbot launcher icon: `public/brand/smuai-assistant.png`
- if you replace the assistant icon, keep the same filename unless you also update `src/components/site-chatbot.tsx`

## Membership CTA

The membership CTA is used in:

- `src/components/navbar.tsx`
- `src/components/footer.tsx`
- `src/app/membership/page.tsx`

Current labels vary slightly by placement:

- navbar desktop: `Join SMUAI`
- navbar mobile menu: `Join as a Member`
- footer CTA: `Join SMUAI as a Member`

If the registration flow changes, update those buttons together.

## Events

Events are maintained in `src/content/events.ts`.

Each event uses:

- `title`
- `dateLabel`
- `timeLabel`
- `startAt`
- `endAt`
- `poster`
- `lumaLink`

Important behavior:

- events are sorted from their date data
- the nearest future event becomes the featured event
- ended events still keep their `lumaLink` so visitors can open the event page
- clicking a card opens the preview modal
- `src/content/events.ts` is the single source of truth for all event entries
- update event dates manually in `src/content/events.ts`; the site no longer auto-syncs from Luma

Time values should use ISO timestamps with `+08:00`, for example:

```ts
startAt: "2026-07-03T18:30:00+08:00",
endAt: "2026-07-03T21:00:00+08:00",
```

Poster folders:

- `public/events/26-27/`
- `public/events/25-26/`

Suggested poster filename format:

- `YYYY-MM-DD-short-slug.jpg`

## Team

Team and advisors are maintained in `src/content/team.ts`.

Each ExCo year contains:

- `excoNumber`
- `leadership`
- `departments`

Each person supports:

- `name`
- `position`
- `photo`
- `linkedin`

Advisors are also stored there:

- `advisors`
- `advisorsIntro`
- `advisorsProfileSummary`

Team image folders:

- `public/team/advisors/`
- `public/team/exco/26-27/`
- `public/team/exco/25-26/`
- `public/team/exco/24-25/`
- `public/team/exco/22-23/`
- `public/team/exco/20-21/`
- `public/team/exco/19-20/`

Notes:

- the Team page defaults to the latest ExCo year on refresh
- leadership renders before departments
- mobile view currently uses 2-up card layouts for most people grids
- LinkedIn buttons only show when a `linkedin` URL exists

## Partners

Partners are maintained in `src/content/partners.ts`.

Each partner currently uses:

- `name`
- `website`
- `linkedin`
- `description`
- `logo`

Partners page behavior:

- mobile uses a logo grid
- desktop uses orbiting rings
- clicking a logo opens a modal
- orbit animations pause on hover and while a partner modal is open
- the modal currently shows LinkedIn only

Partner logos live in:

- `public/partners/`

## Responsive Notes

The pages use a mix of normal contained layouts and full-bleed sections.

If something looks clipped:

- check `src/app/layout.tsx` first
- then check whether the page uses `left-1/2 w-screen -translate-x-1/2`

Recent pages that have custom mobile handling:

- home hero
- events featured section
- team card grids
- partners mobile logo grid
- footer shortcuts and social/contact layout

## Maintenance Tips

- Prefer editing content files before touching page logic.
- When updating photos, keep filenames stable if possible and use version query strings only when cache busting is needed.
- If a UI change affects both mobile and desktop, test both explicitly because several sections now have different layouts per breakpoint.
- The navbar, footer, and chatbot all contain club-facing links, so if a public link changes, update those together.

## Gemini Features

Two site features currently use Gemini server-side:

- Partners `Smart Draft`
- SMUAI Bot

Keep the API key server-side only.

## Partners Contact Form / Smart Draft

The Partners page includes a contact form with a `Smart Draft` button.

Files:

- page UI: `src/app/partners/page.tsx`
- API route: `src/app/api/contact-draft/route.ts`

Current behavior:

- if the user already typed a draft, Smart Draft improves it instead of overwriting it
- the route tries Gemini first
- if Gemini fails, it falls back to a local draft template

### Environment Variable

Set this locally and on Vercel:

```env
GEMINI_API_KEY=your_key_here
```

Important:

- keep the API key server-side only
- do not expose it with `NEXT_PUBLIC_`

## Deployment

For Vercel:

1. Push your latest code.
2. Add `GEMINI_API_KEY` in Project Settings if Smart Draft or the SMUAI Bot should use Gemini.
3. Deploy.

For the current project, no other secret is required.

## Quick Update Checklist

1. Run `npm run sync:events` if the current AY event list should match the public Luma page.
2. Update upcoming or completed events in `src/content/events.ts` if historical or manual entries need changes.
3. Upload matching event posters into the correct `public/events/<ay>/` folder.
4. Update ExCo names / roles / photos in `src/content/team.ts`.
5. Update partner entries and logos in `src/content/partners.ts`.
6. Check membership links and labels in `src/components/navbar.tsx`, `src/components/footer.tsx`, and `src/lib/site-chatbot.ts` if the sign-up flow changes.
7. Run `npm run build` before pushing.
