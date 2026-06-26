# Luxury Real Estate Website — Refined Build Spec (Coding Agent Brief)

<aside>
🎯

This document is a self-contained build brief for an autonomous coding agent. Treat every requirement as a contract. Where a choice is left open, pick the option marked **Default** and proceed without asking. Produce production-ready, type-safe, accessible code.

</aside>

## 1. Project Overview

Build a premium, award-quality real estate marketing website inspired by Hubtown. The experience must feel cinematic and editorial: dark luxury aesthetic, scroll-driven storytelling, fluid 60 FPS motion, and flawless responsiveness. Branding must be **original** — do not copy Hubtown's logo, copy, or proprietary assets; match the *quality bar*, not the brand.

**Definition of done:** the site builds with zero type errors, passes lint, achieves Lighthouse ≥ 95 (Performance, Accessibility, Best Practices, SEO) on the deployed Vercel preview, and renders correctly from 360px to 1920px.

## 2. Objectives & Success Criteria

- [ ]  Lighthouse ≥ 95 across all four categories (mobile + desktop)
- [ ]  All animations hold 60 FPS on a mid-tier laptop; no layout thrash
- [ ]  Fully responsive 360px → 1920px with no horizontal overflow
- [ ]  Keyboard-navigable, screen-reader friendly, WCAG 2.1 AA contrast
- [ ]  `prefers-reduced-motion` fully respected (motion disabled/limited)
- [ ]  CMS-editable content for projects, gallery, news, testimonials
- [ ]  Zero `any` types; strict TypeScript passes

## 3. Technology Stack (pinned)

| Concern | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) | RSC by default; `"use client"` only where needed |
| UI runtime | React 19 |  |
| Language | TypeScript (strict) | `strict: true`, no implicit any |
| Styling | Tailwind CSS | Design tokens via `@theme` / CSS vars |
| Scroll | Lenis | Smooth scroll, synced to ScrollTrigger |
| Animation | GSAP + ScrollTrigger | Primary timeline/scroll engine |
| Micro-interactions | Framer Motion | Component enter/exit, hovers |
| 3D / WebGL | Three.js via React Three Fiber + drei | Lazy-loaded, optional per section |
| Text effects | SplitType | Line/word/char reveals |
| Images | next/image, AVIF/WebP | Responsive sizes, blur placeholders |
| CMS | Sanity (**Default**) | Contentful acceptable alt |
| Hosting | Vercel | Edge-ready |

<aside>
⚠️

Do not mix competing scroll engines. Lenis drives the scroll; GSAP ScrollTrigger reads from it via `lenis.on('scroll', ScrollTrigger.update)`. Framer Motion is for component-local motion only.

</aside>

## 4. Information Architecture (routes)

| Route | Page | Key sections |
| --- | --- | --- |
| `/` | Landing | Hero, About, Featured Projects, Lifestyle, Stats, News teaser, CTA, Footer |
| `/projects` | Projects index | Filterable grid, masonry gallery |
| `/projects/[slug]` | Project detail | Hero, overview, amenities, construction timeline, gallery, location |
| `/communities` | Communities | Editorial grid + map |
| `/lifestyle` | Lifestyle | Storytelling, parallax imagery |
| `/innovation` | Innovation | Feature highlights, WebGL accent |
| `/news` | News/Blog | List + article `/news/[slug]` |
| `/careers` | Careers | Openings list, culture |
| `/contact` | Contact | Form, map, office info |

## 5. Design System

### Color tokens

| Token | Value | Use |
| --- | --- | --- |
| `--bg-base` | `#0B0B0B` | Page background |
| `--bg-elevated` | `#121212` | Cards, surfaces |
| `--accent-gold` | `#C8A26A` | Accents, CTAs, hairlines |
| `--text-primary` | `#F7F7F5` | Primary text |
| `--text-muted` | `rgba(247,247,245,0.64)` | Secondary text |

### Typography

- **Display/Headings:** Neue Montreal or Suisse Int'l (editorial, tight tracking). Use a self-hosted fallback if licensing unavailable; **Default** fallback: a high-quality serif/grotesk pairing via `next/font`.
- **Body/UI:** Inter.
- Fluid type scale with `clamp()`; large editorial headlines, generous line-height for body.

### Layout

- 12-column grid, max container **1600px**, generous gutters and vertical rhythm.
- Spacing scale on a 4px base; sections breathe (large vertical padding).

## 6. Section Specs (key interactions)

- **Hero:** fullscreen video/image bg, overlay gradient, masked headline reveal (SplitType + GSAP), subtle parallax on scroll, custom cursor, magnetic CTA buttons.
- **Navigation:** transparent sticky nav, shrink-on-scroll, mega menu, search affordance, language selector, animated underline. Solidifies background after hero.
- **Scroll storytelling:** every section reveals via masks/fades/slides/scale/parallax; pinned sections; one horizontal-scroll gallery; animated counters for stats; horizontal construction timeline; smooth page transitions.
- **Interactive features:** custom cursor, magnetic buttons, hover states, masonry gallery with lightbox, project cards with hover reveal, animated statistics, subtle particle/WebGL accents (must degrade gracefully).

## 7. Folder Structure

```
/app                # routes, layouts, route groups
/components         # reusable UI + section components
  /ui               # primitives (Button, Cursor, MagneticButton…)
  /sections         # Hero, About, ProjectsGrid, Timeline…
  /three            # R3F scenes, lazy-loaded
/hooks              # useLenis, useScrollProgress, useMediaQuery…
/lib                # sanity client, gsap setup, seo, schema
/utils              # formatters, helpers
/styles             # globals.css, tokens
/public, /assets    # static + optimized media
```

## 8. Performance Budget

- Lazy-load below-the-fold and all Three.js scenes (`next/dynamic`, `ssr: false`).
- Code-split per route; tree-shake; avoid heavy client bundles in RSC pages.
- Images: `next/image`, AVIF/WebP, correct `sizes`, blur placeholders, no CLS.
- Defer non-critical JS; preconnect/preload critical fonts only.
- Target: LCP < 2.5s, CLS < 0.1, TBT < 200ms on mobile.

## 9. Accessibility

- Semantic landmarks, logical heading order, visible focus states.
- All interactive elements keyboard-operable; lightbox + mega menu trap/restore focus.
- WCAG AA contrast (verify gold on dark for small text).
- Full `prefers-reduced-motion` path: disable parallax/scroll-jacking, keep content accessible.

## 10. SEO

- Per-route metadata via Next Metadata API; Open Graph + Twitter cards.
- JSON-LD schema: `Organization`, `RealEstateAgent`, `BreadcrumbList`, `Article` for news.
- `sitemap.xml`, `robots.txt`, canonical URLs, semantic alt text.

## 11. CMS Content Model (Sanity)

| Type | Key fields |
| --- | --- |
| `project` | title, slug, status, hero media, description (portable text), amenities[], timeline[], gallery[], location (geopoint) |
| `galleryImage` | image, alt, category, project ref |
| `newsPost` | title, slug, cover, body, author, publishedAt |
| `testimonial` | quote, author, role, avatar |
| `community` | name, slug, summary, media |

## 12. Build Phases

1. **Scaffold** — Next 15 app, TS strict, Tailwind tokens, fonts, lint/format.
2. **Foundation** — Lenis + GSAP setup, layout, nav, footer, custom cursor.
3. **Landing** — Hero + all home sections with scroll reveals.
4. **Projects** — index, filtering, detail template, timeline, gallery/lightbox.
5. **Secondary pages** — communities, lifestyle, innovation, news, careers, contact.
6. **CMS** — Sanity schemas, client, wire dynamic content.
7. **Polish** — performance pass, a11y pass, SEO/schema, reduced-motion, QA 360→1920.

## 13. Coding-Agent Operating Rules

- Write modular, reusable, typed components; no `any`; no dead code.
- RSC by default; add `"use client"` only for interactive/animated components.
- Centralize GSAP/ScrollTrigger registration once; clean up timelines on unmount.
- Keep animation config in a tokens file so timings/easings are consistent.
- Every section component must accept props and render from CMS data (no hardcoded copy in final pass).
- Provide a `README` with setup, env vars, and CMS instructions.
- Use original placeholder branding and royalty-free/placeholder media; never embed proprietary Hubtown assets.
- When a detail is unspecified, choose the **Default**, document the decision in code comments, and keep going.

## 14. Deliverables

- [ ]  Complete Next.js 15 repo, builds clean, deploys to Vercel
- [ ]  All routes in §4 implemented and responsive
- [ ]  Sanity studio + schemas + seed content
- [ ]  Lighthouse report ≥ 95 on deployed preview
- [ ]  README with setup + CMS docs