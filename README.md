# SMUAI Website Handover Guide

This README is for future ExCo members who need to update the SMUAI website quickly without digging through the whole codebase.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Recommended Check Before Push / Deploy

```bash
npm run build
```

This catches both compile issues and most content/data mistakes.

## Main Files To Know

Content:

- Home content: `src/content/home.ts`
- Events data: `src/content/events.ts`
- Team / ExCo / advisors data: `src/content/team.ts`
- Partners data: `src/content/partners.ts`

Pages:

- Home page: `src/app/page.tsx`
- Events page: `src/app/events/page.tsx`
- Team page: `src/app/team/page.tsx`
- Partners page: `src/app/partners/page.tsx`

Reusable UI:

- Navbar: `src/components/navbar.tsx`
- Footer: `src/components/footer.tsx`
- Home hero: `src/components/home/hero-section.tsx`
- Home mission/vision: `src/components/home/mission-vision-section.tsx`
- Home testimonials: `src/components/home/testimonials-section.tsx`
- Orbiting partners circles: `src/components/ui/orbiting-circles.tsx`

App shell:

- Layout / header spacing: `src/app/layout.tsx`
- Global styles: `src/app/globals.css`

## Home Page

Main home page sections:

- Hero logo + intro copy
- Gallery strip
- Mission and Vision
- Testimonials

Latest home intro copy is in:

- `src/components/home/hero-section.tsx`

Current positioning line:

> SMUAI is a student-led AI community where students learn, build, and connect through innovation and industry.

If you want to update the rotating gallery, edit:

- `src/content/home.ts`

Use:

- `heroGalleryImages`
- `testimonials`

## Membership Registration Link

The membership registration CTA is used in:

- `src/components/navbar.tsx`
- `src/components/footer.tsx`

Current button copy:

- navbar: `Join SMUAI`
- footer: `Join as a Member`

Both currently point to the external registration survey link.

If the registration link changes, update:

- desktop navbar button
- mobile navbar menu button
- footer CTA button

## Events

Edit:

- `src/content/events.ts`

Current academic year groups in the file:

- `26/27`
- `25/26`

Each event uses:

- `title`
- `dateLabel`
- `timeLabel`
- `startAt`
- `endAt`
- `poster`
- `lumaLink`

Important behavior on the Events page:

- events are auto-sorted by `startAt` with latest first
- signup buttons disable automatically after the event `endAt`
- clicking an event opens a viewport-centered modal

ISO SG-time example:

```ts
startAt: "2026-06-25T18:00:00+08:00",
endAt: "2026-06-25T21:00:00+08:00",
```

### Event Poster Uploads

Upload posters into:

- `public/events/26-27/`
- `public/events/25-26/`

Use filename format:

- `YYYY-MM-DD-short-slug.jpg`

Example:

- `2026-06-25-openclaw-singapore-agentic-night.jpg`

Then reference it like:

```ts
poster: "/events/26-27/2026-06-25-openclaw-singapore-agentic-night.jpg"
```

Square posters work well on mobile.

## Team / ExCo / Advisors

Edit:

- `src/content/team.ts`

The Team page reads all its content from that file.

Structure:

- `executiveCommitteeByYear["26/27"]`
- `executiveCommitteeByYear["25/26"]`
- `executiveCommitteeByYear["24/25"]`
- `executiveCommitteeByYear["22/23"]`
- `executiveCommitteeByYear["20/21"]`
- `executiveCommitteeByYear["19/20"]`

Each year contains:

- `excoNumber`
- `leadership` for the leadership team
- `departments`

Each person can have:

- `name`
- `position`
- `photo`
- `linkedin`

Advisors are also maintained in the same file:

- `advisors`
- `advisorsIntro`
- `advisorsProfileSummary`

### Team Image Uploads

Advisor images:

- `public/team/advisors/`

ExCo images:

- `public/team/exco/26-27/`
- `public/team/exco/25-26/`
- `public/team/exco/24-25/`
- `public/team/exco/22-23/`
- `public/team/exco/20-21/`
- `public/team/exco/19-20/`

Use lowercase filenames with hyphens.

The current Team page supports:

- leadership cards rendered first
- one or multiple leads
- multiple executives
- mobile-friendly stacked cards
- optional LinkedIn icons on member cards
- fallback placeholder photos when `photo` is missing

Current Team page behavior:

- the year dropdown resets to the latest ExCo on refresh because it is local page state only
- advisors use a centered 2-card layout
- advisor cards and team cards show LinkedIn buttons when `linkedin` is present

## Partners

Edit:

- `src/content/partners.ts`

Each partner currently uses:

- `name`
- `website`
- `linkedin`
- `description`
- `logo`

Partners page behavior:

- mobile view uses a compact 3-column logo grid
- desktop view uses orbiting logo rings
- clicking a logo opens a viewport-centered modal
- all orbit rings pause when hovering any logo
- inner ring currently prioritizes `AI Singapore`, `Singapore Youth AI`, and `OpenClawSG`
- partner modal now uses LinkedIn only, not website buttons

Partner logo images live in:

- `public/partners/`

If a new logo file is added but does not appear:

- make sure it is referenced in `src/content/partners.ts`
- make sure the filename exactly matches the file in `public/partners/`

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

## Mobile / Responsive Notes

The site has already been adjusted for mobile in these areas:

- Home hero spacing
- Events cards and modal
- Team stacked card layout
- Partners mobile logo grid and modal
- Testimonial manual controls
- Footer social/contact layout

If you make major layout changes, re-check mobile view on:

- Home
- Team
- Events
- Partners

## Deployment

For Vercel:

1. Push your latest code.
2. Add `GEMINI_API_KEY` in Project Settings if Smart Draft should use Gemini.
3. Deploy.

For the current project, no other secret is required.

## Quick Update Checklist

1. Update upcoming or completed events in `src/content/events.ts`.
2. Upload matching event posters into the correct `public/events/<ay>/` folder.
3. Update ExCo names / roles / photos in `src/content/team.ts`.
4. Update partner entries and logos in `src/content/partners.ts`.
5. Check the `Join SMUAI` link in `src/components/navbar.tsx`.
6. Run `npm run build` before pushing.
