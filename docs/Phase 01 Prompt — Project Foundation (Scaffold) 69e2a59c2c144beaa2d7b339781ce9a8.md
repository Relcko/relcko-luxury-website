# Phase 01 Prompt — Project Foundation (Scaffold)

<aside>
🧱

Phase 1 of 12. Run this **after** the Master Prompt. Scope is foundation only — no UI features, no animations, no hero, no CMS.

</aside>

## How to use

1. Paste the [Master Prompt](notion-211) first, with `PHASE_NUMBER` = `01` and `PHASE_NAME` = `Project Foundation`.
2. Then paste the prompt block below as the phase tasks.
3. Corresponding roadmap rows: **P01-001 → P01-012** in the [task database](Luxury%20Real%20Estate%20Website%20%E2%80%94%20Implementation%20Tasks%2028e9cfcefcbc4a7f990ab5be1feb7f17.md).

## The prompt (copy everything in the block)

```
PHASE 01 — PROJECT FOUNDATION (SCAFFOLD ONLY)

Objective: Establish the project's technical foundation per the master spec. Build NO UI features, NO animations, NO hero, and NO CMS in this phase. The result is a clean, typed, themeable, buildable skeleton with all routes as placeholders.

Do exactly the following and nothing more:

1. Initialize a Next.js 15 app using the App Router with TypeScript (React 19). Pin versions to match the master spec.
2. Configure strict TypeScript (strict: true, no implicit any, noUncheckedIndexedAccess) with an @/* path alias.
3. Install and configure Tailwind CSS (content globs for /app and /components; globals imported in root layout).
4. Set up ESLint + Prettier (with Tailwind class sorting) and matching lint/format/type-check npm scripts. Resolve all rule conflicts.
5. Create the exact folder structure from the master spec: /app, /components/ui, /components/sections, /components/three, /hooks, /lib, /utils, /styles, /public, /assets (use .gitkeep for empty dirs).
6. Define design tokens as CSS variables from the master spec color palette (--bg-base #0B0B0B, --bg-elevated #121212, --accent-gold #C8A26A, --text-primary #F7F7F5, --text-muted) and map them into the Tailwind theme. Add a 4px-based spacing scale.
7. Implement the dark theme system at the root (dark luxury palette applied globally, color-scheme set, no FOUC).
8. Configure font loading via next/font (display + body fonts with CSS variables; avoid layout shift). If licensed display fonts are unavailable, use a high-quality fallback pairing and document it.
9. Install these dependencies WITHOUT initializing/using them yet (no animation code in this phase): lenis, gsap, @gsap/react, framer-motion, three, @react-three/fiber, @react-three/drei, split-type.
10. Build a minimal root layout (html/body, font variables, theme, shared <main> landmark). No navbar/footer UI features beyond a bare structural placeholder if strictly needed for layout.
11. Create placeholder pages for every route in the master spec: /, /projects, /projects/[slug], /communities, /lifestyle, /innovation, /news, /careers, /contact. Each renders a simple heading placeholder only. Navigation between them must work (no 404s).
12. Add Git configuration: .gitignore (node_modules, .next, env files), .nvmrc (pin Node), and an initial conventional commit history.
13. Add environment variable scaffolding: .env.example documenting required vars (site URL, future CMS keys) with NO secrets committed.
14. Write a README documenting setup, scripts, and env vars.

Constraints:
- Strict TypeScript, zero `any`.
- No hero section, no animations, no scroll engine initialization, no CMS, no real content.
- Reusable structure only; do not pre-build feature components.

Definition of done for Phase 01:
- `pnpm dev` runs with no errors; all routes resolve.
- `lint`, `format:check`, `type-check`, and production `build` all pass cleanly.
- Folder structure, tokens, and theme match the master spec.
- A fresh clone can be set up purely from the README.

When done, STOP. Summarize created files, confirm each acceptance criterion (map to P01-001 … P01-012), report the QA checklist results, and wait for my approval before Phase 02.
```

## What this phase intentionally excludes

- No animations or Lenis/GSAP initialization (libraries installed only).
- No hero, navbar mega-menu, or any section UI.
- No CMS wiring or content.

Those arrive in later phases (Design System → Navigation → Hero → …) per the roadmap.