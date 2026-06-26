# System Architecture Index — Luxury Real Estate Website

<aside>
📍

**Official entry point for the entire project.** This is a documentation index, not an implementation phase. Every linked architecture is **frozen** and serves as the single source of truth. Future work must follow the Development Rules below and begin with a new requirements review (see Future Requirements).

</aside>

## 1. Master Documents

The binding contracts every phase reads before making changes.

- [Luxury Real Estate Website — Refined Build Spec (Coding Agent Brief)](Luxury%20Real%20Estate%20Website%20%E2%80%94%20Refined%20Build%20Spec%20(C%201063e5037979422b923a1be7e7b29257.md) — The master specification: tech stack (Next.js App Router + Sanity), design system, routes, folder structure, performance budget, accessibility, SEO, and CMS expectations.
- [Claude Code — Master Prompt (use before every phase)](Claude%20Code%20%E2%80%94%20Master%20Prompt%20(use%20before%20every%20phas%20731a085e7ef84e8f9dfd51cdd225c3de.md) — The standing operating contract: read the spec, respect frozen architecture, additive-only changes, strict TypeScript, stop for approval.
- [Luxury Real Estate Website — Implementation Tasks](Luxury%20Real%20Estate%20Website%20%E2%80%94%20Implementation%20Tasks%2028e9cfcefcbc4a7f990ab5be1feb7f17.md) — The task roadmap database tracking every phase and work item from scaffold to launch.

## 2. Homepage

Cinematic, scroll-driven homepage. **Architecture frozen** — additive only.

- **Hero** — [Phase 05A — Hero Architecture & Layout](Phase%2005A%20Build%20%E2%80%94%20Hero%20Architecture%20&%20Layout%20(Outp%20d5466f3b712a4c0389ef1425d6c740bf.md) · [Phase 05B — Cinematic Hero Motion System](Phase%2005B%20Build%20%E2%80%94%20Cinematic%20Hero%20Motion%20System%20(Ou%20943fa87a737a446a9cb6d702a35afd3f.md) · [Phase 05C — Hero Performance & Polish](Phase%2005C%20Build%20%E2%80%94%20Hero%20Performance%20&%20Polish%20(Outpu%205a95d7b717a84c81a302a562a7146073.md)
- **Homepage Sections** — [Phase 06A — Featured Projects](Phase%2006A%20Build%20%E2%80%94%20Featured%20Projects%20(Output)%20564e87d422d840d2a1d4a435e8d481bc.md) · [Phase 06B — About Relcko & Digital Ownership](Phase%2006B%20Build%20%E2%80%94%20About%20Relcko%20&%20Digital%20Ownership%20d6333158e68f421694655baeb2a7daf7.md) · [Phase 06C — Ownership Journey](Phase%2006C%20Build%20%E2%80%94%20Ownership%20Journey%20(Output)%20a05f7f6c3da04742883e4c77ca04dd1f.md) · [Phase 06D — Platform Advantages & Trust](Phase%2006D%20Build%20%E2%80%94%20Platform%20Advantages%20&%20Trust%20(Out%2093a7de3f2622475195f1466d91cb5563.md) · [Phase 06F — Vision & Roadmap](Phase%2006F%20Build%20%E2%80%94%20Vision%20&%20Roadmap%20(Output)%20fe515440c96149f08faac19024d738a3.md) · [Phase 06G — Gallery & Media Showcase](Phase%2006G%20Build%20%E2%80%94%20Gallery%20&%20Media%20Showcase%20(Output%201db8614ca97f4cdab9db7f54ab2c7786.md) · [Phase 06H — Call to Action & Footer Transition](Phase%2006H%20Build%20%E2%80%94%20Premium%20Call%20to%20Action%20&%20Footer%20%2014bded7312db4cf084f5bf9dfc732d26.md) · [Phase 04 — Premium Navigation System](Phase%2004%20Build%20%E2%80%94%20Premium%20Navigation%20System%20(Output%20cf4ade48cd21417a9b479f14dbb51c4b.md)
- **Homepage QA Freeze** — No standalone homepage QA-freeze page exists; the homepage architecture is declared **frozen** across the Phase 05–06 build pages and reaffirmed in every later phase's constraints. Treat the Phase 05/06 build pages above as the frozen record.

## 3. Project Detail

Dynamic, CMS-ready project detail page at `app/projects/[slug]/`, composed of editorial sections.

- **Phases 07A–07H** — [07A — Project Detail Architecture](07A%20%E2%80%94%20Project%20Detail%20Architecture%20c25863e2fcfc422f9065348afe3e2690.md) · [07B — Premium Project Hero](07B%20%E2%80%94%20Premium%20Project%20Hero%205b5c2be723254391af6255553efb4bd7.md) · [07C — Project Overview & Highlights](07C%20%E2%80%94%20Project%20Overview%20&%20Highlights%2092eac9a468b440b49a9aee1a32eebf7e.md) · [07D — Amenities & Lifestyle](07D%20%E2%80%94%20Amenities%20&%20Lifestyle%20f7c188600cad426fa85bd285ea74b51c.md) · [07E — Immersive Gallery & Media](07E%20%E2%80%94%20Immersive%20Gallery%20&%20Media%20c287ea16e99c4767b79d56a2ab8bfcd8.md) · [07F — Location & Connectivity](07F%20%E2%80%94%20Location%20&%20Connectivity%20b4a01946d2d243158353db32f3c9820c.md) · [07G — Investment & Digital Ownership](07G%20%E2%80%94%20Investment%20&%20Digital%20Ownership%20c10c2cc008d14961a1039b63c26a6e44.md) · [07H — Resources, Related Projects & Final Inquiry](07H%20%E2%80%94%20Resources,%20Related%20Projects%20&%20Final%20Inquiry%201774ea007cb94676802d04e5ed79995a.md)
- **Project Schema** — [Schema: project](Schema%20project%2019eb0d57adc44195be1cbca818959aba.md)
- **Project Interface Registry** — [Project Interface — Additive Optional Field Registry](Project%20Interface%20%E2%80%94%20Additive%20Optional%20Field%20Regist%2096456b1cccfc4bb8ab9623f8932d6ef4.md) — The single ledger of every additive optional field added to the frozen `lib/project.ts` interface.
- **Project Detail QA Freeze** — [Project Detail — QA Freeze (Phases 07A–07H)](Project%20Detail%20%E2%80%94%20QA%20Freeze%20(Phases%2007A%E2%80%9307H)%2003ab7b56b3c649c89a9c41318b4b167e.md)

## 4. CMS

Sanity-backed content layer. Schemas, queries, generated types, adapters, and loaders are the data backbone.

- **CMS Foundation** — [Phase 08A Build — CMS Foundation (Sanity)](Phase%2008A%20Build%20%E2%80%94%20CMS%20Foundation%20(Sanity)%20(Output)%20e2328e2ec84b45df8cd2287c809a76b4.md)
- **CMS QA Freeze** — [CMS Foundation — QA Freeze (Phase 08A)](CMS%20Foundation%20%E2%80%94%20QA%20Freeze%20(Phase%2008A)%20c17e2181321b430bb5af0edd16c37442.md)
- **Content Flow** — Sanity → GROQ projection → generated/bridge types → adapter mapping → typed loaders → Server Components. Documented in [Phase 08A Build](Phase%2008A%20Build%20%E2%80%94%20CMS%20Foundation%20(Sanity)%20(Output)%20e2328e2ec84b45df8cd2287c809a76b4.md) (queries + loaders) and locked in the [CMS QA Freeze](CMS%20Foundation%20%E2%80%94%20QA%20Freeze%20(Phase%2008A)%20c17e2181321b430bb5af0edd16c37442.md).
- **Adapter Layer** — `adapters/projectSections.ts` mappers (`toProject`, section mappers) — the boundary that converts raw CMS shapes into the frozen `Project` interface. See §10 of [Phase 08A Build](Phase%2008A%20Build%20%E2%80%94%20CMS%20Foundation%20(Sanity)%20(Output)%20e2328e2ec84b45df8cd2287c809a76b4.md).

## 5. SEO

CMS-driven SEO living entirely in `lib/seo/` + App Router route files, consuming only frozen adapter loaders.

- **SEO Architecture** — [Phase 08B Build — SEO & Metadata System](Phase%2008B%20Build%20%E2%80%94%20SEO%20&%20Metadata%20System%20(Output)%2089083326701743d5b8da767afb9b5b1b.md)
- **SEO QA Freeze** — [SEO & Metadata — QA Freeze (Phase 08B)](SEO%20&%20Metadata%20%E2%80%94%20QA%20Freeze%20(Phase%2008B)%207d8e2e2e5b2d40fab94aca056c464995.md)
- **Metadata Pipeline** — `resolveSeo` → `buildMetadata` → Next Metadata API, plus Open Graph, Twitter, canonicals, robots, sitemap, robots.txt, and JSON-LD. Documented in [Phase 08B Build](Phase%2008B%20Build%20%E2%80%94%20SEO%20&%20Metadata%20System%20(Output)%2089083326701743d5b8da767afb9b5b1b.md).

## 6. Discovery

Pure, client-side discovery and filtering over existing project data.

- **Discovery System** — [Phase 08D Build — Discovery & Filtering System](Phase%2008D%20Build%20%E2%80%94%20Discovery%20&%20Filtering%20System%20(Ou%2055d7d604a0df4abc956d04cd46e18969.md) — Pure engine (`lib/discovery/`), hooks (`hooks/discovery/`), and presentational components (`components/discovery/`).
- **Projects Listing Integration** — [Projects Listing — Integration & QA Freeze (Phase 08D)](Projects%20Listing%20%E2%80%94%20Integration%20&%20QA%20Freeze%20(Phase%20%205dc75e40db3f4e0990fb54815b34f2dd.md) — Wires the engine into `app/projects/` via two additive route files, reusing the frozen loaders.

## 7. Design System

Foundational primitives every feature reuses.

- **Design Tokens** — [Phase 02 Build — Design System](Phase%2002%20Build%20%E2%80%94%20Design%20System%20(Output)%20648f0d3340664512bf36758cbcce108e.md) (`lib/design/tokens.ts`, CSS variables: `--bg-base`, `--accent-gold`, etc.)
- **UI Components** — [Phase 02 Build — Design System](Phase%2002%20Build%20%E2%80%94%20Design%20System%20(Output)%20648f0d3340664512bf36758cbcce108e.md) (Container, Heading, Text, Section, Stack, Surface, Input, etc.)
- **Animation System** — [Phase 03 Build — Animation Engine](Phase%2003%20Build%20%E2%80%94%20Animation%20Engine%20(Output)%206977ca74a610460d859370fea1a4a7f9.md) (motion primitives, variants, scroll engine)

## 8. Production

Operational readiness, performance, and release.

- **Performance Optimization** — [Phase 08E — Performance Optimization & Production Readiness](Phase%2008E%20Build%20%E2%80%94%20Performance%20Optimization%20&%20Produ%20bca9c53146874aec8d842d00cf4f70c8.md)
- **Production Release** — [Phase 08F — Production Release & Final QA](Phase%2008F%20%E2%80%94%20Production%20Release%20&%20Final%20QA%20(Output)%20b5836d55148f4a279171fe6761e3a871.md)
- **Final Architecture Freeze** — §7 of [Phase 08F — Production Release & Final QA](Phase%2008F%20%E2%80%94%20Production%20Release%20&%20Final%20QA%20(Output)%20b5836d55148f4a279171fe6761e3a871.md) — The consolidated, all-layers freeze.

## 9. Version History

Frozen versions of each subsystem as of 26 Jun 2026.

| Subsystem | Frozen Version | Record |
| --- | --- | --- |
| Homepage | Frozen (Phases 04–06, 25 Jun 2026) | [Phase 05–06 build pages](Phase%2005A%20Build%20%E2%80%94%20Hero%20Architecture%20&%20Layout%20(Outp%20d5466f3b712a4c0389ef1425d6c740bf.md) |
| Project Architecture | `lib/project.ts` v1.6.0 · Project Detail frozen (07A–07H) | [Project Detail QA Freeze](Project%20Detail%20%E2%80%94%20QA%20Freeze%20(Phases%2007A%E2%80%9307H)%2003ab7b56b3c649c89a9c41318b4b167e.md) |
| CMS | v1.2 (v1.0 foundation → v1.1 forms → v1.2 ownershipModel) | [CMS QA Freeze](CMS%20Foundation%20%E2%80%94%20QA%20Freeze%20(Phase%2008A)%20c17e2181321b430bb5af0edd16c37442.md) |
| SEO | v1.0 | [SEO QA Freeze](SEO%20&%20Metadata%20%E2%80%94%20QA%20Freeze%20(Phase%2008B)%207d8e2e2e5b2d40fab94aca056c464995.md) |
| Discovery | Engine (08D) + Projects Listing v1.0 | [Projects Listing QA Freeze](Projects%20Listing%20%E2%80%94%20Integration%20&%20QA%20Freeze%20(Phase%20%205dc75e40db3f4e0990fb54815b34f2dd.md) |
| Production | Performance (08E) + Production Readiness (08F) | [Phase 08F Final Freeze](Phase%2008F%20%E2%80%94%20Production%20Release%20&%20Final%20QA%20(Output)%20b5836d55148f4a279171fe6761e3a871.md) |

## 10. Dependency Map

How the major subsystems depend on one another. Arrows mean *"depends on / builds upon."*

- **Design System (02/03)** → foundation for everything. No dependencies; depended on by all UI.
- **Homepage (04–06)** → depends on Design System + Animation. Self-contained UI; no CMS coupling at freeze.
- **Project Interface (`lib/project.ts`)** → the shared type contract. Depended on by Project Detail, CMS adapters, SEO, and Discovery.
- **CMS Foundation (08A)** → depends on the Project Interface. Produces typed data via the **Adapter Layer**, the single boundary between raw CMS and the app.
- **Project Detail (07A–07H)** → depends on Design System + Project Interface; consumes CMS data through adapter loaders.
- **SEO (08B)** → depends on CMS adapter loaders + Project Interface only. No schema/adapter edits.
- **Discovery (08D)** → depends on the Project Interface (reads existing fields); pure engine with no CMS/adapter coupling. **Projects Listing Integration** depends on Discovery + frozen loaders + SEO metadata.
- **Production (08E/08F)** → wraps the entire app: performance, error/not-found routes, monitoring placeholders, security headers. Touches only new files *around* frozen internals.

In short: **Design System → Project Interface → CMS/Adapters → (Project Detail, SEO, Discovery) → Production.**

## 11. Development Rules

Standing rules that govern all future work.

1. **Frozen architecture** — Homepage, project, CMS schemas, adapters, and discovery logic are frozen. Do not redesign them.
2. **Additive changes only** — New work adds new optional fields, new files, and new components around frozen internals. No breaking edits.
3. **Adapter boundary** — All raw CMS data crosses into the app exclusively through the adapter layer. UI and features never read raw CMS shapes directly.
4. **CMS-driven UI** — Components are prop-driven and CMS-ready. Content comes from the CMS via typed loaders, not hardcoded into components.
5. **No duplicated enums** — Reuse the canonical enums in `lib/project.ts` (categories, statuses, ownership models). Never redefine them elsewhere.
6. **Pure discovery engine** — The discovery/filtering engine stays pure and side-effect-free; UI state lives in hooks, not the engine.
7. **QA freeze before major architecture changes** — Any major architectural change must be preceded by a QA freeze of the current state, recorded as a freeze page.

## 12. Future Requirements

The project is complete and fully frozen. **Any future feature must begin with a new requirements review before any architecture changes are made.**

The required sequence for future work:

1. **Requirements review** — Define the new feature and its scope against the frozen architecture.
2. **Impact assessment** — Identify which frozen subsystems are affected and confirm the change can be additive.
3. **QA freeze checkpoint** — If a major architecture change is unavoidable, freeze current state first.
4. **Additive implementation** — Build new optional fields, files, and components without breaking frozen internals.
5. **New QA freeze** — Record the new frozen version and update this index.

<aside>
⛔

No further implementation phases should proceed without a new requirements review. This document is the official entry point for the project.

</aside>