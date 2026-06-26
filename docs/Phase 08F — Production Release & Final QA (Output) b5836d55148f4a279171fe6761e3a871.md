# Phase 08F — Production Release & Final QA (Output)

<aside>
📐

**Read first — frozen single source of truth.** Refined Build Spec, Master Prompt, CMS QA Freeze (v1.2), SEO QA Freeze (v1.0), Projects Listing QA Freeze (v1.0), and Performance Optimization (08E) are all **FROZEN**. This is the **final readiness pass**: no new product features, no redesign. Work is limited to **operational scaffolding** (error/not-found routes, monitoring placeholders), **documentation**, and **verification checklists** — never the internals of homepage, project, CMS, adapter, or discovery code.

</aside>

<aside>
⚠️

**Capability boundary.** Authored in Notion, not compiled, deployed, or tested. Every gate, Lighthouse score, and QA box here is a **task for you to run** in the real repo/CI. Monitoring/analytics are **vendor-neutral placeholders** — wire your chosen provider at the marked seams.

</aside>

## 1. Production readiness architecture

Five readiness pillars, each additive and provider-agnostic:

| Pillar | What it adds | Surface (all additive) |
| --- | --- | --- |
| Resilience | Error boundaries, not-found, fallbacks, recovery | `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`, route `error.tsx` |
| Observability | Error + performance monitoring, structured logging | `lib/observability/*` (placeholder seams) |
| Analytics | Pageview + event seams, Web Vitals RUM | `lib/analytics/*`, `WebVitals` (08E) |
| Security | Headers, CSP, env hygiene, form/draft protection | `next.config.ts` headers, `middleware.ts`, env docs |
| Release ops | Build, deploy, rollback, post-deploy verification | docs + checklists (this page) |

**Guardrail:** every file below is *new* and sits *around* the frozen app. None imports into or edits a frozen component.

## 2. Error handling strategy

### 2.1 Route-level `error.tsx` (client, recoverable)

```tsx
// app/error.tsx  (new, additive) — catches errors in the route subtree
"use client"

import { useEffect } from "react"
import { captureError } from "@/lib/observability"

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    captureError(error, { boundary: "route" })
  }, [error])

  return (
    <section className="error-state" role="alert" aria-live="assertive">
      <h1 className="error-state__title">Something went wrong</h1>
      <p className="error-state__body">
        We hit an unexpected issue loading this page. You can try again.
      </p>
      <button className="button button--primary" onClick={() => reset()}>
        Try again
      </button>
    </section>
  )
}
```

### 2.2 Global error boundary (client, wraps root)

```tsx
// app/global-error.tsx  (new) — last-resort boundary, replaces the root layout
"use client"

import { useEffect } from "react"
import { captureError } from "@/lib/observability"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    captureError(error, { boundary: "global", fatal: true })
  }, [error])

  return (
    <html lang="en">
      <body>
        <main className="error-state error-state--fatal" role="alert">
          <h1 className="error-state__title">This page didn’t load</h1>
          <p className="error-state__body">Please refresh to continue.</p>
          <button className="button button--primary" onClick={() => reset()}>
            Reload
          </button>
        </main>
      </body>
    </html>
  )
}
```

### 2.3 `not-found.tsx` (server, 404)

```tsx
// app/not-found.tsx  (new) — global 404; reuses frozen layout primitives
import Link from "next/link"
import { Container } from "@/components/ui/Container"

export default function NotFound() {
  return (
    <Container variant="content">
      <section className="error-state">
        <p className="error-state__eyebrow">404</p>
        <h1 className="error-state__title">Page not found</h1>
        <p className="error-state__body">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link className="button button--primary" href="/">
          Back to home
        </Link>
      </section>
    </Container>
  )
}
```

<aside>
ℹ️

For a missing project, the detail route should call `notFound()` from `next/navigation` when the frozen loader returns nothing — that is a **call-site addition** in `app/projects/[slug]/page.tsx`, not a change to any frozen component or loader. A route-scoped `app/projects/[slug]/not-found.tsx` can give a tailored “residence not found” message.

</aside>

### 2.4 Loading states & recovery

| Mechanism | Source | Behavior |
| --- | --- | --- |
| Route skeletons | `loading.tsx` (08E §4.3) | Streamed shell while data resolves |
| `error.tsx` `reset()` | §2.1 | Re-renders the segment without full reload |
| `global-error` reload | §2.2 | Recovers from root-level faults |
| `notFound()` → 404 | §2.3 | Clean 404 for missing slugs |
| Form failure | Frozen 08C `useActionState` | Inline error, preserves input, retas-safe |

**Error-state CSS** (additive, token-based, fixed layout to avoid CLS):

```css
/* === Phase 08F — error & not-found states (additive) ================= */
.error-state {
  display: flex; flex-direction: column; align-items: flex-start;
  gap: 1rem; max-width: 32rem; margin-block: 6rem;
}
.error-state--fatal { min-height: 100dvh; justify-content: center; }
.error-state__eyebrow { font-size: 0.875rem; letter-spacing: 0.1em; opacity: 0.6; }
.error-state__title { font-family: var(--font-display); font-size: 2rem; }
.error-state__body { color: var(--text-muted); }
```

## 3. Monitoring & analytics strategy (vendor-neutral placeholders)

<aside>
🔌

**No vendor lock-in.** Each concern is a thin interface with a no-op default. Swap the implementation for Sentry / Datadog / PostHog / Plausible / GA4 at the seam without touching call sites. Nothing here imports a specific SDK.

</aside>

### 3.1 Error monitoring — `lib/observability/index.ts`

```tsx
// lib/observability/index.ts  (new, additive, server+client safe)
type ErrorContext = Record<string, unknown>

export function captureError(error: unknown, context?: ErrorContext): void {
  // Placeholder: route to your provider (Sentry.captureException, etc.)
  if (process.env.NODE_ENV !== "production") {
    console.error("[captureError]", error, context)
  }
  // e.g. globalThis.__monitor?.captureException?.(error, context)
}
```

### 3.2 Structured logging — `lib/observability/logger.ts`

```tsx
// lib/observability/logger.ts  (new) — leveled, JSON-friendly, no PII
type Level = "debug" | "info" | "warn" | "error"

function emit(level: Level, message: string, meta?: Record<string, unknown>) {
  const entry = { level, message, ts: new Date().toISOString(), ...meta }
  // Placeholder sink: stdout (captured by platform log drain) or provider.
  console[level === "debug" ? "log" : level](JSON.stringify(entry))
}

export const log = {
  debug: (m: string, meta?: Record<string, unknown>) => emit("debug", m, meta),
  info: (m: string, meta?: Record<string, unknown>) => emit("info", m, meta),
  warn: (m: string, meta?: Record<string, unknown>) => emit("warn", m, meta),
  error: (m: string, meta?: Record<string, unknown>) => emit("error", m, meta),
}
```

### 3.3 Analytics — `lib/analytics/index.ts`

```tsx
// lib/analytics/index.ts  (new) — pageview + event seams
export type AnalyticsEvent =
  | { type: "pageview"; path: string }
  | { type: "project_view"; slug: string }
  | { type: "filter_apply"; facet: string; value: string }
  | { type: "lead_submit"; formId: string }

export function track(event: AnalyticsEvent): void {
  // Placeholder: forward to your analytics provider; respect consent.
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return
  navigator.sendBeacon?.("/api/track", JSON.stringify(event))
}
```

### 3.4 Integration points (where seams attach — additive only)

| Concern | Seam | Notes |
| --- | --- | --- |
| Error monitoring | `captureError` in `error.tsx` / `global-error.tsx` (§2) | Already wired in boundaries |
| Performance (RUM) | `WebVitals` reporter (08E §8.4) → `/api/vitals` | Field LCP/CLS/INP |
| Performance (server) | `log.info` around slow loaders (optional, call-site) | No loader edit; wrap at route if needed |
| Logging | `log.*` in route handlers / Server Actions | Platform log drain captures stdout |
| Analytics pageview | `track({ type: "pageview" })` in a client listener | Consent-gated |
| Analytics events | `track(…)` at interaction call sites | Discovery/forms emit optionally |

<aside>
ℹ️

Analytics/event emission at discovery & form call sites is **optional and additive** — if added, it wraps existing handlers, never alters frozen discovery or form logic. Default state ships with analytics **disabled** until `NEXT_PUBLIC_ANALYTICS_ENABLED=true`.

</aside>

## 4. Security review

### 4.1 Environment variables

| Variable | Scope | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | public | Safe to expose (project id) |
| `NEXT_PUBLIC_SANITY_DATASET` | public | Safe to expose (dataset name) |
| `SANITY_API_READ_TOKEN` | **server-only** | Never `NEXT_PUBLIC_`; used by frozen loaders |
| `SANITY_REVALIDATE_SECRET` | **server-only** | Validates revalidation webhook |
| `SANITY_PREVIEW_SECRET` | **server-only** | Guards draft-mode enable route |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical/OG base (08B) |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | public | Feature flag, default off |
- **Rule:** only `NEXT_PUBLIC_*` reaches the client. Tokens stay server-side and must never be logged. Validate presence at boot (fail fast) without printing values.

### 4.2 Security headers + CSP — `next.config.ts` `headers()` (additive)

```tsx
// next.config.ts — add a headers() function (composes with 08E config)
async headers() {
  const csp = [
    "default-src 'self'",
    "img-src 'self' https://cdn.sanity.io data: blob:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline'", // tighten with nonces if feasible
    "connect-src 'self' https://*.sanity.io https://*.api.sanity.io",
    "frame-ancestors 'self'", // Studio embeds itself only
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ")

  return [
    {
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ]
}
```

<aside>
⚠️

`/studio` may need a relaxed CSP (Sanity Studio uses inline workers/blobs). Scope a separate `source: "/studio/:path*"` block rather than loosening the global policy. Prefer nonce-based `script-src` over `'unsafe-inline'` once verified against the build.

</aside>

### 4.3 Remaining security surface

| Area | Posture |
| --- | --- |
| Rate limiting | Assume edge/platform rate limit on `/api/*` (form submit, revalidate, track). Document expected limits; no app-level limiter added this phase |
| Form protections | Frozen 08C: Server Actions (no exposed endpoint), schema validation, honeypot/timing checks; add platform bot protection at the edge |
| Draft-mode protection | Enable route must require `SANITY_PREVIEW_SECRET`; `draftMode()` cookie is httpOnly; never enable from public input |
| Token handling | Read token server-only; never in client bundle, logs, or error payloads; rotate on leak |
| Webhook auth | Revalidate route validates `SANITY_REVALIDATE_SECRET`  • signature before `revalidateTag/Path` |
| Dependency hygiene | `npm audit` in CI; pin/refresh lockfile; Dependabot/renovate optional |

## 5. QA verification checklists

### 5.1 Desktop (≥ 1280px)

- [ ]  Home, `/projects`, `/projects/[slug]`, `/studio` render without layout breaks.
- [ ]  Hover/focus states correct; no horizontal scroll at 1280/1440/1920.
- [ ]  Sticky/nav elements behave; images crisp on 2× displays.

### 5.2 Tablet (768–1024px)

- [ ]  Grid reflows to 2-up; discovery filter panel collapses gracefully.
- [ ]  Touch targets ≥ 44px; no clipped content in portrait & landscape.

### 5.3 Mobile (360–430px)

- [ ]  Single-column layouts; discovery controls usable one-handed.
- [ ]  Forms keyboard-friendly (correct `inputmode`/`autocomplete`).
- [ ]  No CLS on image/font load; tap targets not crowded.

### 5.4 Accessibility (WCAG 2.1 AA)

- [ ]  Keyboard-only path through nav → discovery → filters → results → detail → form.
- [ ]  Visible focus rings everywhere; logical tab order; focus trap-free.
- [ ]  Screen reader: landmarks, headings hierarchy, labelled controls, live result count.
- [ ]  Color contrast ≥ 4.5:1 (text) / 3:1 (UI); respects `prefers-reduced-motion`.
- [ ]  Images have meaningful `alt`; decorative images empty `alt`.
- [ ]  Forms: associated labels, error messaging announced, required state conveyed.

### 5.5 Lighthouse (mobile + desktop)

- [ ]  Performance ≥ 95 • Accessibility ≥ 95 • Best Practices ≥ 95 • SEO ≥ 95.
- [ ]  LCP < 2.0s • CLS < 0.05 • INP < 200ms (08E targets).
- [ ]  No console errors; no failed requests; no mixed content.

### 5.6 CMS workflows

- [ ]  Create → publish a project → appears on `/projects` after revalidation.
- [ ]  Edit → publish → change reflected; unpublish → removed/404 on detail.
- [ ]  Draft mode preview shows unpublished edits; exit preview restores cached prod.
- [ ]  Required fields enforced in Studio; `ownershipModel` (v1.2) optional and filterable.

### 5.7 Forms

- [ ]  Valid submit succeeds; success state shown; lead recorded at destination.
- [ ]  Invalid submit shows inline errors; input preserved; no crash.
- [ ]  Honeypot/timing rejects bots; double-submit guarded; network failure handled.

### 5.8 Discovery

- [ ]  Search, category, status, city, country, ownership filters each narrow results.
- [ ]  Multiple active filters combine (AND across facets, OR within facet).
- [ ]  Sort: newest / A–Z / status correct; active-filter pills remove individually; clear-all works.
- [ ]  Empty state appears at zero matches; result count accurate; works with JS disabled (SSR list).

### 5.9 SEO

- [ ]  Each route has unique title/description; canonical correct; OG/Twitter tags present.
- [ ]  `sitemap.xml` lists static routes + all project slugs; `robots.txt` correct.
- [ ]  JSON-LD validates (Organization/WebSite + per-project structured data).
- [ ]  No `noindex` leak in production; `/studio` excluded from indexing.

## 6. Deployment & rollback guide

### 6.1 Build process

```bash
npm ci                 # clean, lockfile-exact install
npm run lint           # zero errors
npx tsc --noEmit       # zero type errors
npm run build          # production build (App Router + ISR)
# optional: ANALYZE=true npm run build  (bundle audit, 08E)
```

### 6.2 Environment variables (set in platform, per environment)

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=https://www.example.com
NEXT_PUBLIC_ANALYTICS_ENABLED=false
SANITY_API_READ_TOKEN=...          # server-only
SANITY_REVALIDATE_SECRET=...       # server-only
SANITY_PREVIEW_SECRET=...          # server-only
```

### 6.3 Production configuration

- [ ]  Node version pinned (`.nvmrc` / engines) matches CI & platform.
- [ ]  ISR `revalidate` set (08E §6); Sanity webhook → revalidate route configured with secret.
- [ ]  Image `remotePatterns` includes `cdn.sanity.io`; CDN/edge caching on.
- [ ]  Security headers/CSP (§4.2) deployed; HTTPS + HSTS enforced; custom domain + canonical aligned.

### 6.4 Deployment sequence

1. Merge to release branch → CI runs lint + types + build (must be green).
2. Deploy to **preview/staging**; run §5 smoke checks + Lighthouse.
3. Verify CMS publish → revalidate round-trip on staging.
4. Promote build to **production** (immutable deployment).
5. Confirm DNS/domain, env vars, and webhook target point to prod.
6. Warm key routes; confirm ISR cache populates.

### 6.5 Rollback strategy

- **Instant:** re-promote the previous immutable deployment (platform “promote/rollback”) — no rebuild.
- **Content:** revert/unpublish the offending document in Sanity → trigger revalidation (content rolls back independently of code).
- **Config:** restore prior env vars; redeploy if a secret/flag caused the fault.
- **Trigger criteria:** failed post-deploy checks, error-rate spike (§3 monitoring), or Core Web Vitals regression.

### 6.6 Post-deployment verification

- [ ]  Smoke: home, `/projects`, a real `/projects/[slug]`, `/studio`, a 404 path.
- [ ]  Submit a test lead end-to-end; confirm receipt at destination.
- [ ]  Publish a trivial CMS edit; confirm it appears within the revalidate window.
- [ ]  Re-run Lighthouse on prod URLs; confirm ≥ 95 and CWV targets.
- [ ]  Monitoring receiving events; no error spikes; logs flowing; analytics flag intentional.
- [ ]  `sitemap.xml` / `robots.txt` reachable; canonical host correct; no mixed content.

## 7. Final Architecture Freeze

<aside>
🧊

**FINAL ARCHITECTURE FREEZE — 26 Jun 2026.** Every layer below is frozen as the single source of truth. The 08F operational scaffolding (error/not-found routes, observability/analytics seams, security headers) is **additive only** and joins the frozen surface at the versions noted. No further implementation may modify any frozen layer without a new requirements review.

</aside>

| Layer | Phase | Frozen version | Status |
| --- | --- | --- | --- |
| Design system / tokens / UI primitives | 01–02 | v1.0 | 🔒 Frozen |
| Animation system | 03 | v1.0 | 🔒 Frozen |
| Homepage architecture | 04–06 | v1.0 | 🔒 Frozen |
| Project architecture & detail route | 07 | v1.0 | 🔒 Frozen |
| CMS Foundation (schemas, loaders, adapters) | 08A | v1.2 | 🔒 Frozen |
| Project interface (additive registry) | 08A–08D | v1.6.0 | 🔒 Frozen |
| SEO & metadata | 08B | v1.0 | 🔒 Frozen |
| Lead-capture forms | 08C | v1.0 | 🔒 Frozen |
| Discovery & filtering engine | 08D | v1.0 | 🔒 Frozen |
| Projects Listing route (`/projects`) | 08D | v1.0 | 🔒 Frozen |
| Performance optimization | 08E | v1.0 | 🔒 Frozen |
| Production readiness scaffolding | 08F | v1.0 | ➕ Additive, now frozen |

**Invariants that must hold across any future change:**

- Additive-only contract preserved (no field removed/retyped/made required).
- Single-source enums in `lib/project.ts` (no duplication).
- Frozen components imported, never edited; new work sits *around* them.
- CMS data layer (`sanityFetch`/`defineLive`) untouched; caching via route segments only.
- Discovery filtering/sorting/search stays pure in `lib/discovery`.

## 8. Project completion summary

<aside>
🏁

**The Luxury Real Estate Website is feature-complete and production-ready (pending local CI gates + deploy).** All planned phases (01–08F) are delivered and frozen. The codebase is a layered, additive-only, CMS-driven Next.js App Router application with a premium editorial design system, full SEO, lead capture, client-side discovery, performance optimization, and production hardening.

</aside>

### 8.1 What was built (end to end)

| Capability | Outcome |
| --- | --- |
| Design & motion | Token-driven UI primitives + accessible animation system |
| Homepage | Editorial, server-rendered, CMS-backed sections |
| Projects | Detail route with gallery, adjacent navigation, structured data |
| CMS | Sanity schemas, typed loaders/adapters, draft mode, live preview, tag revalidation |
| SEO | Per-route metadata, canonical/OG, sitemap, robots, JSON-LD |
| Forms | Server-Action lead capture with validation + bot protection |
| Discovery | Pure client-side search/filter/sort engine mounted on `/projects` |
| Performance | Bundle, rendering, image/font, caching, and Core Web Vitals strategy |
| Production readiness | Error boundaries, observability/analytics seams, security headers, full QA + deploy/rollback playbook |

### 8.2 Standing constraints honored throughout

- Strict TypeScript; zero-error lint/type gates as release criteria.
- Additive-only evolution; every freeze respected.
- No vendor lock-in for monitoring/analytics.
- Accessibility (WCAG 2.1 AA) and Core Web Vitals (Lighthouse ≥ 95) as targets.

### 8.3 Owner's remaining actions (outside Notion)

- Run the §6.1 build gates and §5 QA checklists in the real repo/CI.
- Wire chosen monitoring/analytics providers at the §3 seams.
- Set env vars + secrets, configure the Sanity revalidation webhook, deploy, and run §6.6 post-deploy verification.

<aside>
⛔

**STOP — project complete.** Phase 08F and the Final Architecture Freeze are delivered. **No further implementation phases should follow without a new requirements review.**

</aside>