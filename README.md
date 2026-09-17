# SMUAI Website Handover Guide

This repo powers the SMUAI public site. Most updates are content and layout tweaks, so this guide is meant to help future ExCo members find the right file quickly.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS v4
- Framer Motion for some animated sections

## Local Setup

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Recommended Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Run these before pushing, then check the affected pages at phone and desktop widths. There is currently no automated UI test suite.

If the default Turbopack build stalls locally, use `npm run build -- --webpack` to check the production build with Webpack.

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
- `src/components/home/hero-gallery.tsx`
- `src/components/home/mission-vision-section.tsx`
- `src/components/home/what-smuai-does-section.tsx`
- `src/components/home/testimonials-section.tsx`

## Home Page

The homepage has four sections:

1. **Hero:** logo, introduction, draggable photo strip, and linked SMU IIE acknowledgement. The gold particles respond to the pointer and clicks on desktop.
2. **Find your place in AI:** current ExCo group photo, links for students getting started, and the official mission and vision.
3. **What SMUAI Does:** four selectable categories with an animated photo stack and a featured event for each.
4. **Testimonials:** a sliding marquee with dragging and a “Pause to read” control.

### Editing content

- Hero photos: `heroGalleryImages` in `src/content/home.ts`.
- Hero introduction and SMU IIE link: `src/components/home/hero-section.tsx`.
- Starting-point links, mission, vision, and ExCo photo: `src/components/home/mission-vision-section.tsx`.
- Activity descriptions and featured highlights: the `activities` array in `src/components/home/what-smuai-does-section.tsx`. These highlights are curated separately from the Events page.
- Testimonial names, roles, and quotes: `testimonials` in `src/content/home.ts`.

### Homepage images

Replace these files to update the current photos. Paths used in components omit the `public` prefix.

| Placement | File | Display crop |
| --- | --- | --- |
| ExCo group photo | `public/team/exco/26-27/group-portrait.jpg` | 3:4 portrait |
| Workshops — Claude101 Workshop | `public/activities/workshops.jpg` | 4:3 landscape |
| Hackathons — Tencent Cloud “AI CAN DO IT” Hackathon | `public/activities/hackathon.jpg` | 4:3 landscape |
| Networking — OpenClaw Agentic Night | `public/activities/networking.jpg` | 4:3 landscape |
| Research — Early Research Opportunity Program (EROP) | `public/activities/research.jpg` | 4:3, slightly above centre |

The hackathon filename is singular. Images use `object-cover`, so the source can have a different ratio but edges may be cropped. Research uses `object-position: center 40%`; adjust that class if a replacement needs a different focal point. Update alt text and the ExCo year caption when replacing photos.

### Gallery and activity interactions

`hero-gallery.tsx` handles the photo strip sizing, automatic movement, drag speed, and centring after release. Left/right arrow keys move the gallery when focused. Automatic movement pauses during dragging and keyboard focus; reduced-motion preferences disable automatic movement.

Activity tabs support arrow keys, Home, and End. All four tabs stay in one row on phones, with the image stack below the text. Desktop also has previous/next controls. Stack transitions respect reduced-motion preferences.

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
- `src/content/events.ts` is the source of truth for the Events page and chatbot event answers
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
- mobile view uses two-column advisor cards as well as most people grids
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

- Shared header height is set by `--site-header-height` in `src/app/layout.tsx`; the main content offset and mobile menu use the same value.
- Keep `overflow-x-clip` on the homepage and shared layout wrappers. Replacing it with `overflow-x-hidden` can create a nested scroll container and make the first scroll gesture appear stuck.
- The hero strip uses different card widths and staggering on phones and desktops. Its layout is owned by `hero-gallery.tsx`.

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

1. Update upcoming or completed events manually in `src/content/events.ts`.
2. Upload matching posters into `public/events/<ay>/`.
3. Update homepage featured highlights and photos separately when needed.
4. Update ExCo names, roles, and individual photos in `src/content/team.ts`; update the homepage group photo and caption for a new committee.
5. Update partner entries and logos in `src/content/partners.ts`.
6. Check membership links in the navbar, footer, membership page, and chatbot if the sign-up flow changes.
7. Run lint, TypeScript, and a production build. Check mobile and desktop layouts, navigation, gallery dragging, activity tabs, and testimonial pause controls.
8. Review `git diff --check` and `git status --short`. Include new image assets and components, and keep environment files and generated build output out of the commit.
