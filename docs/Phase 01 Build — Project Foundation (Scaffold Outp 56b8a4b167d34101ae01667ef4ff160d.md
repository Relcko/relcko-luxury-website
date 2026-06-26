# Phase 01 Build — Project Foundation (Scaffold Output)

<aside>
🏗️

Implementation output for **Phase 01 — Project Foundation** only. Built strictly against the [Refined Build Spec](Luxury%20Real%20Estate%20Website%20%E2%80%94%20Refined%20Build%20Spec%20(C%201063e5037979422b923a1be7e7b29257.md) (single source of truth) and the [Claude Code — Master Prompt](notion-211). Foundation only — no hero, nav, footer, animations, CMS, or interactive components.

</aside>

<aside>
ℹ️

**How this is delivered:** every file below is complete and copy‑paste ready. Run the install commands, then create each file with the exact contents shown. Result: a clean, strict‑typed, themeable, buildable skeleton with all routes as placeholders.

</aside>

## 1. Apply & install

```bash
# 1) Scaffold the base app once (Next 15 + React 19 + TS + Tailwind + ESLint)
npx create-next-app@latest lumiere-estates \
  --ts --app --eslint --tailwind --src-dir=false \
  --import-alias "@/*" --use-npm

cd lumiere-estates

# 2) Runtime dependencies (installed, NOT initialized this phase)
npm install gsap lenis framer-motion three \
  @react-three/fiber @react-three/drei split-type \
  clsx tailwind-merge

# 3) Dev dependencies
npm install -D @types/three prettier prettier-plugin-tailwindcss \
  eslint-config-prettier @eslint/eslintrc
```

<aside>
⚠️

**ScrollTrigger** is not a separate package — it ships inside `gsap` and is imported from `gsap/ScrollTrigger` when wired up in Phase 02. Nothing from GSAP/Lenis/Framer Motion/R3F is imported or initialized in Phase 01; they are installed only.

</aside>

Then replace/create the files in sections 4–5 below.

## 2. Folder structure

```
.
├─ app/                      # App Router routes + root layout
│  ├─ globals.css            # Tailwind v4 import + @theme design tokens
│  ├─ layout.tsx             # Root layout: fonts, ThemeProvider, <main>
│  ├─ page.tsx               # / (Home placeholder)
│  ├─ projects/
│  │  ├─ page.tsx            # /projects
│  │  └─ [slug]/page.tsx     # /projects/[slug]
│  ├─ communities/page.tsx
│  ├─ lifestyle/page.tsx
│  ├─ innovation/page.tsx
│  ├─ news/
│  │  ├─ page.tsx            # /news
│  │  └─ [slug]/page.tsx     # /news/[slug]
│  ├─ careers/page.tsx
│  └─ contact/page.tsx
├─ components/
│  ├─ layout/container.tsx   # Max-width (1600px) layout primitive
│  ├─ ui/placeholder-screen.tsx  # Shared DRY placeholder for routes
│  ├─ sections/.gitkeep      # (Phase 03+) Hero, About, Grid…
│  └─ three/.gitkeep         # (Phase 04+) R3F scenes, lazy-loaded
├─ providers/theme-provider.tsx
├─ hooks/.gitkeep            # (Phase 02+) useLenis, useScrollProgress…
├─ lib/
│  ├─ animation/tokens.ts    # Durations/easings (values only, no engine)
│  ├─ env.ts                 # Type-safe env access
│  ├─ fonts.ts               # next/font configuration
│  └─ site.ts                # Site config + nav routes (single source)
├─ utils/cn.ts               # clsx + tailwind-merge helper
├─ types/index.ts            # Shared TS types
├─ public/                   # static files
├─ assets/.gitkeep           # optimized media (Phase 03+)
├─ .editorconfig
├─ .env.example
├─ .gitignore
├─ .nvmrc
├─ .prettierignore
├─ .prettierrc.json
├─ eslint.config.mjs
├─ next.config.ts
├─ postcss.config.mjs
├─ package.json
├─ README.md
└─ tsconfig.json
```

The tree mirrors **§7** of the spec (`/app`, `/components/{ui,sections,three}`, `/hooks`, `/lib`, `/utils`, `/styles`-as-`app/globals.css`, `/public`, `/assets`). Empty‑by‑design folders carry a `.gitkeep` so the architecture is committed without dead code.

## 3. Dependencies installed

### Runtime

| Package | Purpose | Spec ref |
| --- | --- | --- |
| `next` 15 / `react` 19 / `react-dom` 19 | Framework + UI runtime | §3 |
| `gsap` | Animation + ScrollTrigger (via `gsap/ScrollTrigger`) | §3 |
| `lenis` | Smooth scroll engine | §3 |
| `framer-motion` | Micro-interactions | §3 |
| `three` | WebGL core | §3 |
| `@react-three/fiber` | React renderer for three.js | §3 |
| `@react-three/drei` | R3F helpers | §3 |
| `split-type` | Text line/word/char reveals | §3 |
| `clsx` | Conditional class names | support |
| `tailwind-merge` | Resolve Tailwind class conflicts | support |

### Dev

| Package | Purpose |
| --- | --- |
| `typescript`, `@types/node`, `@types/react`, `@types/react-dom` | Types (from create-next-app) |
| `@types/three` | three.js types |
| `tailwindcss` 4 + `@tailwindcss/postcss` | Styling + PostCSS plugin |
| `eslint`, `eslint-config-next` | Linting (from create-next-app) |
| `eslint-config-prettier`, `@eslint/eslintrc` | Disable conflicts + flat-config compat |
| `prettier`, `prettier-plugin-tailwindcss` | Formatting + class sorting |

<aside>
🧩

**Husky / lint-staged: intentionally NOT added.** Your prompt scoped these as “if included in the master spec.” The spec (§1, §13) calls for lint/format but never mandates git hooks, so per the Master Prompt’s “never add architecture unless instructed” rule they are omitted. Say the word and I’ll add them in a follow-up.

</aside>

## 4. Configuration files

### package.json (scripts excerpt)

```json
{
  "name": "lumiere-estates",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20.11.0" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noEmit": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### next.config.ts

```tsx
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Spec §8: serve modern formats by default.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Trim client bundles from heavy libs (no runtime behavior yet).
    optimizePackageImports: ["framer-motion", "@react-three/drei"],
  },
};

export default nextConfig;
```

### postcss.config.mjs

```jsx
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### eslint.config.mjs

```jsx
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "prettier",
  ),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  { ignores: [".next/**", "node_modules/**"] },
];

export default eslintConfig;
```

### .prettierrc.json

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### .prettierignore

```
.next
node_modules
pnpm-lock.yaml
package-lock.json
```

### .editorconfig

```
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true
```

### .nvmrc

```
20.11.0
```

### .gitignore

```
# dependencies
/node_modules
# next.js
/.next/
/out/
# production
/build
# misc
.DS_Store
*.pem
# debug
npm-debug.log*
# env files
.env*.local
.env
# typescript
*.tsbuildinfo
next-env.d.ts
```

### .env.example

```
# Public site URL (used for canonical URLs / metadata in later phases)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# --- Sanity CMS (Phase 06 — declared now, unused in Phase 01) ---
# NEXT_PUBLIC_SANITY_PROJECT_ID=
# NEXT_PUBLIC_SANITY_DATASET=production
# SANITY_API_READ_TOKEN=
```

## 5. Application files

### app/globals.css

```css
@import "tailwindcss";

/* Dark luxury design tokens — Refined Build Spec §5 */
@theme {
  --color-bg-base: #0b0b0b;
  --color-bg-elevated: #121212;
  --color-accent-gold: #c8a26a;
  --color-text-primary: #f7f7f5;
  --color-text-muted: rgba(247, 247, 245, 0.64);

  /* Typefaces wired from next/font CSS variables (lib/fonts.ts) */
  --font-display: var(--font-display-sans), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-body-sans), ui-sans-serif, system-ui, sans-serif;

  /* Layout */
  --container-max: 1600px;
}

:root {
  color-scheme: dark;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  background-color: var(--color-bg-base);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Spec §9: respect reduced-motion globally from day one */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### lib/fonts.ts

```tsx
import { Inter, Space_Grotesk } from "next/font/google";

/** Body/UI typeface — Inter (Spec §5). */
export const fontBody = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-sans",
});

/**
 * Display/Headline typeface.
 * Spec §5 requests Neue Montreal / Suisse Int'l (licensed). Per the spec's
 * "Default" fallback rule, we use Space Grotesk — a high-quality grotesk with
 * similar tight, editorial character — until licensed fonts are self-hosted.
 */
export const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-display-sans",
});

/** Combined CSS variable classes applied on <html>. */
export const fontVariables = `${fontBody.variable} ${fontDisplay.variable}`;
```

### lib/env.ts

```tsx
/**
 * Centralized, type-safe environment access. Keeping reads in one module means
 * later phases validate new CMS/server keys here rather than scattering
 * process.env lookups across the codebase.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const env = {
  siteUrl,
  isProduction: process.env.NODE_ENV === "production",
} as const;

export type Env = typeof env;
```

### lib/site.ts

```tsx
import { env } from "@/lib/env";

export interface NavRoute {
  readonly label: string;
  readonly href: string;
}

export const siteConfig = {
  name: "Lumi\u00e8re Estates",
  shortName: "Lumi\u00e8re",
  description:
    "A premium real estate developer crafting cinematic living experiences.",
  url: env.siteUrl,
} as const;

/**
 * Primary navigation routes (Spec §4). Placeholder pages consume this now; the
 * Navigation component (Phase 02) renders from the same source so routes never
 * drift between nav and pages.
 */
export const navRoutes: readonly NavRoute[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Communities", href: "/communities" },
  { label: "Lifestyle", href: "/lifestyle" },
  { label: "Innovation", href: "/innovation" },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
] as const;
```

### lib/animation/tokens.ts

```tsx
/**
 * Animation design tokens (Spec §13). Centralized so durations/easings stay
 * consistent once GSAP/Framer Motion are wired in Phase 02.
 * NOTE: values only — no animation engine is imported or initialized here.
 */
export const duration = {
  fast: 0.3,
  base: 0.6,
  slow: 1.2,
} as const;

export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;
```

### utils/cn.ts

```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### types/index.ts

```tsx
import type { ReactNode } from "react";

/** Shared prop contract for components that wrap children. */
export interface WithChildren {
  children: ReactNode;
}
```

### providers/theme-provider.tsx

```tsx
"use client";

import { createContext, useContext } from "react";
import type { WithChildren } from "@/types";

type Theme = "dark";

interface ThemeContextValue {
  readonly theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "dark" });

/**
 * The brand is a fixed dark luxury palette (Spec §5), so the provider locks the
 * theme to "dark" and exposes it via context. A future multi-theme requirement
 * would only change this file.
 */
export function ThemeProvider({ children }: WithChildren) {
  const value: ThemeContextValue = { theme: "dark" };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
```

### components/layout/container.tsx

```tsx
import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Max-width (1600px) layout wrapper with responsive gutters (Spec §5). */
export function Container({
  as: Tag = "div",
  className,
  children,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] px-6 md:px-10 lg:px-16",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

### components/ui/placeholder-screen.tsx

```tsx
import { Container } from "@/components/layout/container";

interface PlaceholderScreenProps {
  eyebrow: string;
  title: string;
  description?: string;
}

/**
 * Shared scaffold screen for Phase 01 placeholder routes. Keeps every route DRY
 * and visually consistent; real sections replace these in later phases.
 */
export function PlaceholderScreen({
  eyebrow,
  title,
  description,
}: PlaceholderScreenProps) {
  return (
    <Container
      as="section"
      className="flex min-h-[70vh] flex-col justify-center py-32"
    >
      <p className="text-sm uppercase tracking-[0.3em] text-accent-gold">
        {eyebrow}
      </p>
      <h1 className="mt-4 font-display text-5xl leading-tight md:text-7xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-6 max-w-xl text-lg text-text-muted">{description}</p>
      ) : null}
    </Container>
  );
}
```

### app/layout.tsx

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s \u00b7 ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <main id="main-content">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

<aside>
📝

The root `metadata` only sets a default/template **title** and description — just enough to avoid an empty `<title>`. Full SEO (Open Graph, JSON-LD, sitemap, robots) is deliberately deferred to **Phase 09** per scope.

</aside>

### app/page.tsx

```tsx
import { PlaceholderScreen } from "@/components/ui/placeholder-screen";

export default function HomePage() {
  return (
    <PlaceholderScreen
      eyebrow="Lumi\u00e8re Estates"
      title="Foundation ready."
      description="Phase 01 scaffold is in place. Sections arrive in later phases."
    />
  );
}
```

### app/projects/page.tsx

```tsx
import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/ui/placeholder-screen";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return <PlaceholderScreen eyebrow="Portfolio" title="Projects" />;
}
```

### app/projects/[slug]/page.tsx

```tsx
import { PlaceholderScreen } from "@/components/ui/placeholder-screen";

interface ProjectDetailPageProps {
  // Next 15: dynamic route params are async.
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  return (
    <PlaceholderScreen
      eyebrow="Project"
      title={slug}
      description="Project detail placeholder."
    />
  );
}
```

### app/communities/page.tsx

```tsx
import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/ui/placeholder-screen";

export const metadata: Metadata = { title: "Communities" };

export default function CommunitiesPage() {
  return <PlaceholderScreen eyebrow="Places" title="Communities" />;
}
```

### app/lifestyle/page.tsx

```tsx
import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/ui/placeholder-screen";

export const metadata: Metadata = { title: "Lifestyle" };

export default function LifestylePage() {
  return <PlaceholderScreen eyebrow="Living" title="Lifestyle" />;
}
```

### app/innovation/page.tsx

```tsx
import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/ui/placeholder-screen";

export const metadata: Metadata = { title: "Innovation" };

export default function InnovationPage() {
  return <PlaceholderScreen eyebrow="Future" title="Innovation" />;
}
```

### app/news/page.tsx

```tsx
import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/ui/placeholder-screen";

export const metadata: Metadata = { title: "News" };

export default function NewsPage() {
  return <PlaceholderScreen eyebrow="Journal" title="News" />;
}
```

### app/news/[slug]/page.tsx

```tsx
import { PlaceholderScreen } from "@/components/ui/placeholder-screen";

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsArticlePage({
  params,
}: NewsArticlePageProps) {
  const { slug } = await params;
  return (
    <PlaceholderScreen
      eyebrow="Article"
      title={slug}
      description="News article placeholder."
    />
  );
}
```

### app/careers/page.tsx

```tsx
import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/ui/placeholder-screen";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return <PlaceholderScreen eyebrow="Team" title="Careers" />;
}
```

### app/contact/page.tsx

```tsx
import type { Metadata } from "next";
import { PlaceholderScreen } from "@/components/ui/placeholder-screen";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return <PlaceholderScreen eyebrow="Say hello" title="Contact" />;
}
```

### .gitkeep files

Create empty `.gitkeep` files in: `components/sections/`, `components/three/`, `hooks/`, `assets/`.

## 6. Architectural decisions & rationale

| Decision | Why |
| --- | --- |
| **Tailwind v4 `@theme` tokens** | Spec §5 asks for tokens via `@theme`/CSS vars. v4 turns each token into both a CSS variable and a utility (`bg-bg-base`, `text-accent-gold`), so design and code never diverge. |
| **`@/*` → project root alias** | Matches create-next-app default and the Master Prompt; gives clean absolute imports (`@/lib`, `@/components`) with zero `../../` chains. |
| **Strict TS + `noUncheckedIndexedAccess`  • `verbatimModuleSyntax`  • `noUnusedLocals/Parameters`** | Spec demands zero `any` and production-grade types; these flags catch unsafe indexing, enforce explicit `import type`, and keep the tree dead-code-free. |
| **`next/font` (Space Grotesk + Inter)** | Spec §5 fonts are licensed; the “Default” rule says pick a high-quality fallback. `next/font` self-hosts + avoids layout shift. Swap to Neue Montreal/Suisse later by editing `lib/fonts.ts` only. |
| **Dark-locked `ThemeProvider`** | Brand is a single dark palette (§5). Context centralizes it without shipping an unused theme-switcher (no over-engineering). |
| **`navRoutes` in `lib/site.ts`** | One source of truth for routes; placeholder pages and the future nav both read it, preventing drift. |
| **`PlaceholderScreen`  • `Container` primitives** | Establishes the reusable component architecture and keeps all 11 routes DRY — no duplicated page markup. |
| **`lib/animation/tokens.ts` (values only)** | Spec §13 wants animation config centralized; defining tokens now (without importing GSAP) honors “installed, not initialized.” |
| **Libraries installed but untouched** | GSAP/Lenis/Framer Motion/R3F/drei are in `package.json` only; no imports, so zero added client JS and no animation surface this phase. |
| **Husky/lint-staged omitted** | Not in the master spec; Master Prompt forbids adding architecture beyond it. |

## 7. Verification (definition of done)

Run these — all must be clean:

```bash
npm run type-check   # tsc --noEmit → 0 errors (strict)
npm run lint         # next lint → 0 errors
npm run format:check # prettier → all files formatted
npm run build        # next build → succeeds
npm run dev          # all routes resolve, no 404s
```

Expected: every route renders its placeholder, dark theme + gold accent applied, fonts load with no layout shift, no console errors.

## 8. Scope confirmation

**Built:** folder structure, design tokens, theme provider, global layout, font loading, env setup, utility libs, shared component architecture, absolute imports + path aliases, all tooling config, placeholder routes, libraries installed.

**Deliberately NOT built (later phases):** hero, navigation, footer, animations, GSAP timelines, ScrollTrigger, Lenis init, three.js scenes, CMS, API routes, forms, SEO implementation, project cards, gallery, interactive components.

Maps to roadmap tasks **P01-001 → P01-012** in the [task database](Luxury%20Real%20Estate%20Website%20%E2%80%94%20Implementation%20Tasks%2028e9cfcefcbc4a7f990ab5be1feb7f17.md).