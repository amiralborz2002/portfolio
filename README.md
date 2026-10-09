# Amir Alborz — Portfolio

Personal portfolio of Amir Hossein Talebi Alborz, Product Designer and Information Architect.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and Framer Motion.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build (every route is prerendered)
npm start       # serve the production build
npm run lint
```

## Project structure

```
app/                  Routes: / · /work · /work/[slug] · /lab · /about · /contact
  layout.tsx          Shell: fonts, header, footer, MotionProvider
  globals.css         Design tokens (@theme) and shared utilities
components/
  layout/             Header, mobile menu, footer, case-study layout
  sections/           Page sections, grouped by page (about/, contact/, lab/, work/)
  motion/             LazyMotion providers (see "Animations")
  ui/                 Button, BentoCard
lib/
  data.ts             Case studies for /work/[slug]
  use-reduced-motion.ts
public/images/        Portrait and testimonial photos
```

## Editing content

- **Case studies:** `lib/data.ts`. Each entry becomes a prerendered `/work/[slug]` page.
- **Archive list:** `archiveData` in `components/sections/work/ArchiveList.tsx`.
- **Lab experiments:** `components/sections/lab/data.ts`. Put media in `public/` and reference it with `media`.
- **Experience timeline:** `EXPERIENCES` in `components/sections/ExperienceJourney.tsx`.
- **Testimonials:** the `TESTIMONIALS` arrays in `components/sections/Testimonials.tsx` (home) and
  `components/sections/about/AboutTestimonials.tsx` (about). Photos go in `public/images/testimonials/`.
- **Contact details:** the email and phone appear in `components/layout/Footer.tsx`,
  `components/sections/contact/ContactHero.tsx` and `components/sections/FinalCTA.tsx`.

## Conventions

### Animations

Components render `m.*` from `framer-motion`, never `motion.*`. The root layout wraps the app in
`MotionProvider` (`LazyMotion` with `domAnimation`), so pages only ship the animation features
they use. A component that needs drag or `layoutId` wraps itself in `<MaxFeatures>`.

Use `useReducedMotion` from `@/lib/use-reduced-motion`, not the Framer Motion hook: Framer's
version causes hydration errors for visitors with reduced motion turned on.

Above-the-fold entrance animations use the CSS `animate-rise` utility in `globals.css` (set
`--rise-delay` in `style`), so they start on first paint rather than after hydration and don't
delay Largest Contentful Paint.

### Colours and accessibility

`zinc-500` and `text-subtle` are redefined in `globals.css` to meet WCAG AA contrast (4.5:1) on
the dark backgrounds. Don't use `zinc-600` or darker for text.

### Images

Use `next/image` with explicit `width`/`height` or `fill` plus `sizes`. Give the page's
Largest Contentful Paint image `loading="eager"` and `fetchPriority="high"`.

## Security

`next.config.ts` sends a Content-Security-Policy and other security headers on every route. The
policy only allows same-origin resources, so adding an external script, font, image or embed
means adding its origin to the matching directive there.
