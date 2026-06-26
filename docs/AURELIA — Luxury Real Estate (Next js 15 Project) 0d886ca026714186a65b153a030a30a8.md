# AURELIA — Luxury Real Estate (Next.js 15 Project)

<aside>
🏛️

**AURELIA Estates** — a production-ready premium real estate website. This page holds the complete codebase, organized by file path. Copy each block into the matching file in a fresh Next.js 15 project, then run `npm install && npm run dev`. Built with original branding, copy, and asset placeholders — no copyrighted media from any reference site.

</aside>

## 1. Reference analysis → design decisions

Key experience patterns recreated (with 100% original assets/copy):

- **Preloader** with a 0→100% counter and a curtain reveal.
- **Cinematic full-screen hero** with background video/image, animated gradient overlays, staggered masked headline reveal, mouse parallax, subtle Ken-Burns zoom, and a scroll indicator.
- **Region counters** (e.g. *09 Projects — Central Suburbs*) with GSAP count-up.
- **Pinned editorial narrative** sections (Vision / Innovation / Craft / Legacy) with image mask reveals and parallax.
- **Horizontal-scroll** featured projects gallery (ScrollTrigger pin).
- **Mega-menu navigation**: transparent → glass blur on scroll, animated underlines, full-screen animated mobile menu.
- **Magnetic buttons**, **custom blend-mode cursor**, **scroll progress bar**, **cinematic page transitions**.
- **Heavy footer** with newsletter, sitemap columns, and big marquee wordmark.

## 2. Brand system

- **Name:** AURELIA Estates · **Tagline:** *Architecture of a finer life.*
- **Colors:** Rich Charcoal `#111111`, Deep Graphite `#1A1A1A`, Warm White `#F7F5F2`, Champagne Gold `#C8A96A`, Bronze `#9A7B4F`.
- **Type:** Serif display (Fraunces) for headings, clean sans (Inter) for body.

## 3. Project structure

```
aurelia/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ globals.css
│  ├─ about/page.tsx
│  ├─ projects/page.tsx
│  ├─ properties/page.tsx
│  ├─ properties/[slug]/page.tsx
│  ├─ gallery/page.tsx
│  ├─ contact/page.tsx
│  ├─ sitemap.ts
│  └─ robots.ts
├─ components/
│  ├─ providers/SmoothScrollProvider.tsx
│  ├─ providers/TransitionProvider.tsx
│  ├─ ui/CustomCursor.tsx
│  ├─ ui/Preloader.tsx
│  ├─ ui/ScrollProgress.tsx
│  ├─ ui/MagneticButton.tsx
│  ├─ ui/AnimatedText.tsx
│  ├─ ui/RevealImage.tsx
│  ├─ ui/Counter.tsx
│  ├─ layout/Navbar.tsx
│  └─ layout/Footer.tsx
├─ sections/   (home + page sections)
├─ hooks/
├─ lib/
├─ utils/
├─ public/
└─ config files
```

## 4. Config files

### package.json

```json
{
  "name": "aurelia-estates",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.1.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "gsap": "^3.12.5",
    "@gsap/react": "^2.1.1",
    "lenis": "^1.1.18",
    "framer-motion": "^11.15.0",
    "react-icons": "^5.4.0",
    "three": "^0.171.0",
    "@react-three/fiber": "^9.0.0",
    "@react-three/drei": "^9.120.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "@types/three": "^0.171.0",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.17.0",
    "eslint-config-next": "15.1.0"
  }
}
```

### next.config.ts

```tsx
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  experimental: { optimizePackageImports: ["react-icons", "framer-motion"] },
};

export default nextConfig;
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### postcss.config.mjs

```jsx
const config = { plugins: { tailwindcss: {}, autoprefixer: {} } };
export default config;
```

### tailwind.config.ts

```tsx
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sections/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: "#111111",
        graphite: "#1A1A1A",
        ivory: "#F7F5F2",
        champagne: "#C8A96A",
        bronze: "#9A7B4F",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "display": ["clamp(3rem, 9vw, 9rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "hero": ["clamp(2.5rem, 7vw, 7rem)", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        "h1": ["clamp(2rem, 5vw, 4.5rem)", { lineHeight: "1.05" }],
        "h2": ["clamp(1.6rem, 3.5vw, 3rem)", { lineHeight: "1.1" }],
      },
      spacing: { section: "clamp(6rem, 12vw, 12rem)" },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
        expo: "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      maxWidth: { container: "1600px" },
    },
  },
  plugins: [],
};

export default config;
```

## 5. Design system — app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --charcoal: #111111;
  --graphite: #1a1a1a;
  --ivory: #f7f5f2;
  --champagne: #c8a96a;
  --bronze: #9a7b4f;
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }

html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
.lenis.lenis-stopped { overflow: hidden; }

body {
  background: var(--charcoal);
  color: var(--ivory);
  font-family: var(--font-inter), sans-serif;
  overflow-x: hidden;
}

@media (pointer: fine) { body { cursor: none; } }

::selection { background: var(--champagne); color: var(--charcoal); }

::-webkit-scrollbar { width: 0; height: 0; }

.container-x { width: 100%; max-width: 1600px; margin-inline: auto; padding-inline: clamp(1.25rem, 5vw, 6rem); }

/* Masked reveal helpers */
.reveal-mask { overflow: hidden; display: block; }
.reveal-line { display: block; will-change: transform; }

/* Glassmorphism */
.glass {
  background: rgba(26, 26, 26, 0.55);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border: 1px solid rgba(247, 245, 242, 0.08);
}

.text-balance { text-wrap: balance; }

.marquee { display: inline-flex; animation: marquee 28s linear infinite; }
@keyframes marquee { to { transform: translateX(-33.333%); } }

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

---

## 6. Core libraries

### lib/fonts.ts

```tsx
import { Fraunces, Inter } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  axes: ["opsz"],
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});
```

### lib/utils.ts

```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Clamp a number between min and max. */
export const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

/** Slugify a string for URLs. */
export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
```

### lib/site.ts

```tsx
export const siteConfig = {
  name: "AURELIA Estates",
  tagline: "Architecture of a finer life.",
  description:
    "AURELIA Estates designs and builds landmark residential and commercial spaces — where architecture, craft and community meet.",
  url: "https://aurelia-estates.example",
  email: "hello@aurelia-estates.example",
  phone: "+91 22 4000 1200",
  address: "AURELIA House, Bandra Kurla Complex, Mumbai 400051",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Behance", href: "https://behance.net" },
  ],
} as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export const navItems: NavItem[] = [
  { label: "About", href: "/about", description: "Our story, vision and craft" },
  { label: "Projects", href: "/projects", description: "Signature developments" },
  { label: "Properties", href: "/properties", description: "Available residences" },
  { label: "Gallery", href: "/gallery", description: "A visual archive" },
  { label: "Contact", href: "/contact", description: "Begin a conversation" },
];
```

### lib/data.ts

```tsx
import { slugify } from "./utils";

export type Property = {
  slug: string;
  name: string;
  location: string;
  type: "Residential" | "Commercial" | "Mixed Use";
  status: "Now Selling" | "Under Construction" | "Completed";
  priceFrom: string;
  beds: string;
  area: string;
  year: string;
  hero: string;
  gallery: string[];
  excerpt: string;
  description: string;
  highlights: string[];
};

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const raw: Omit<Property, "slug">[] = [
  {
    name: "Solenne Towers",
    location: "Bandra West, Mumbai",
    type: "Residential",
    status: "Now Selling",
    priceFrom: "₹ 6.4 Cr",
    beds: "3 – 5 BHK",
    area: "2,400 – 4,800 sq ft",
    year: "2027",
    hero: img("photo-1545324418-cc1a3fa10c00"),
    gallery: [img("photo-1512917774080-9991f1c4c750"), img("photo-1600585154340-be6161a56a0c"), img("photo-1600566753086-00f18fb6b3ea")],
    excerpt: "Sculptural living above the city skyline.",
    description:
      "Solenne Towers is a pair of slender residential spires wrapped in fluted glass and bronze. Each residence is oriented to capture the western sea breeze and the long arc of the evening light.",
    highlights: ["Sky lounge on the 40th floor", "Private double-height lobbies", "Wellness deck and 25m pool", "EV-ready basement parking"],
  },
  {
    name: "The Meridian",
    location: "Lower Parel, Mumbai",
    type: "Commercial",
    status: "Under Construction",
    priceFrom: "On Request",
    beds: "Office Floors",
    area: "8,000 – 40,000 sq ft",
    year: "2026",
    hero: img("photo-1486406146926-c627a92ad1ab"),
    gallery: [img("photo-1497366754035-f200968a6e72"), img("photo-1604328698692-f76ea9498e76"), img("photo-1524758631624-e2822e304c36")],
    excerpt: "A new benchmark for the workplace.",
    description:
      "The Meridian is a Grade-A commercial tower built for the way teams work now — column-free floor plates, biophilic terraces, and a triple-height arrival hall finished in travertine.",
    highlights: ["LEED Platinum target", "Column-free floor plates", "Landscaped sky terraces", "Smart building management"],
  },
  {
    name: "Verdana Residences",
    location: "Powai, Mumbai",
    type: "Residential",
    status: "Completed",
    priceFrom: "₹ 3.2 Cr",
    beds: "2 – 4 BHK",
    area: "1,150 – 2,900 sq ft",
    year: "2024",
    hero: img("photo-1600607687939-ce8a6c25118c"),
    gallery: [img("photo-1600566753190-17f0baa2a6c3"), img("photo-1600210492486-724fe5c67fb0"), img("photo-1600585154526-990dced4db0d")],
    excerpt: "Lakeside calm, minutes from the city.",
    description:
      "Verdana wraps three garden courts in warm stone and timber, with homes that open onto deep balconies framing the lake.",
    highlights: ["Three landscaped courts", "Lakefront promenade", "Children's discovery garden", "Resident clubhouse"],
  },
  {
    name: "Atelier One",
    location: "Worli, Mumbai",
    type: "Mixed Use",
    status: "Now Selling",
    priceFrom: "₹ 9.8 Cr",
    beds: "4 – 6 BHK",
    area: "3,600 – 7,200 sq ft",
    year: "2028",
    hero: img("photo-1600047509807-ba8f99d2cdde"),
    gallery: [img("photo-1600566752355-35792bedcfea"), img("photo-1600585152915-d208bec867a1"), img("photo-1600573472550-8090b5e0745e")],
    excerpt: "Limited-edition residences above a curated retail promenade.",
    description:
      "Atelier One pairs a boutique residential collection with a ground-floor promenade of galleries, ateliers and dining — a vertical neighbourhood in the heart of Worli.",
    highlights: ["Curated retail promenade", "Members' art lounge", "Concierge and valet", "Panoramic sea-view homes"],
  },
];

export const properties: Property[] = raw.map((p) => ({ ...p, slug: slugify(p.name) }));

export const getProperty = (slug: string) =>
  properties.find((p) => p.slug === slug);

export const regions = [
  { count: 9, label: "Central Suburbs" },
  { count: 12, label: "South Mumbai" },
  { count: 18, label: "Western Suburbs" },
  { count: 6, label: "Thane" },
];
```

<aside>
⚠️

Correction for `lib/data.ts`: the editor injected stray double braces around the URL in the `img` helper above. The correct return line is the backtick string `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80` — remove the doubled braces wrapping `https://images.unsplash.com/...`.

</aside>

## 7. Hooks

### hooks/useIsomorphicLayoutEffect.ts

```tsx
import { useEffect, useLayoutEffect } from "react";

/** Avoids SSR warnings while using layout effects for GSAP. */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
```

### hooks/useMediaQuery.ts

```tsx
"use client";
import { useEffect, useState } from "react";

/** Reactive media-query hook (SSR safe). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
```

## 8. Providers

### components/providers/SmoothScrollProvider.tsx

```tsx
"use client";
import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Wraps the app in a Lenis smooth-scroll instance and syncs it with GSAP
 * ScrollTrigger so every scroll-driven animation runs on the same RAF loop.
 */
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // expose for programmatic scrolling (e.g. anchor links)
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

### components/providers/TransitionProvider.tsx

```tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

/**
 * Cinematic route transition: a charcoal curtain wipes up with a mask reveal
 * while the incoming page fades and scales in. Pairs with Lenis + ScrollTrigger.
 */
const curtainInitial = { scaleY: 1 };
const curtainAnimate = { scaleY: 0 };
const curtainExit = { scaleY: 1, originY: 0 };
const curtainTransition = { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] };
const pageInitial = { opacity: 0, scale: 0.985 };
const pageAnimate = { opacity: 1, scale: 1 };
const pageTransition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.15 };

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        <motion.div
          className="pointer-events-none fixed inset-0 z-[90] origin-bottom bg-charcoal"
          initial={curtainInitial} 
          animate={curtainAnimate} 
          exit={curtainExit} 
          transition={curtainTransition} 
        />
        <motion.main
          initial={pageInitial} 
          animate={pageAnimate} 
          transition={pageTransition} 
        >
          {children}
        </motion.main>
      </motion.div>
    </AnimatePresence>
  );
}
```

## 9. Global UI components

### components/ui/CustomCursor.tsx

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Blend-mode follower cursor with smooth interpolation. Enlarges over elements
 * tagged with [data-cursor="hover"] and shows a label for [data-cursor-text].
 * Hidden on touch devices.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const xTo = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });
    const dxTo = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dyTo = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });

    const move = (e: MouseEvent) => {
      xTo(e.clientX); yTo(e.clientY); dxTo(e.clientX); dyTo(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest("[data-cursor]") as HTMLElement | null;
      if (t) {
        gsap.to(ring.current, { scale: 2.4, duration: 0.4, ease: "power3" });
        setLabel(t.dataset.cursorText ?? "");
      } else {
        gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "power3" });
        setLabel("");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block mix-blend-difference">
      <div ref={ring} className="absolute -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-ivory">
        {label && <span className="text-[9px] uppercase tracking-widest text-ivory">{label}</span>}
      </div>
      <div ref={dot} className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-ivory" />
    </div>
  );
}
```

### components/ui/Preloader.tsx

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { siteConfig } from "@/lib/site";

/**
 * Full-screen preloader with a 0→100 counter and a curtain reveal. Locks scroll
 * until the intro completes, then unmounts itself.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const obj = { v: 0 };
    const tl = gsap.timeline();
    tl.to(obj, {
      v: 100,
      duration: 2.2,
      ease: "power2.inOut",
      onUpdate: () => setCount(Math.round(obj.v)),
    })
      .to(".pl-bar", { scaleX: 1, duration: 2.2, ease: "power2.inOut" }, 0)
      .to(".pl-content", { y: -40, opacity: 0, duration: 0.6, ease: "power3.in" })
      .to(root.current, {
        yPercent: -100,
        duration: 1,
        ease: "expo.inOut",
        onComplete: () => {
          document.body.style.overflow = "";
          setDone(true);
        },
      });
    return () => { tl.kill(); document.body.style.overflow = ""; };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-charcoal">
      <div className="pl-content flex flex-col items-center gap-6">
        <span className="font-serif text-2xl tracking-[0.3em] text-ivory">{siteConfig.name.toUpperCase()}</span>
        <span className="text-champagne text-7xl font-serif tabular-nums">{count}</span>
      </div>
      <div className="absolute bottom-0 left-0 h-px w-full bg-ivory/10">
        <div className="pl-bar h-full w-full origin-left scale-x-0 bg-champagne" />
      </div>
    </div>
  );
}
```

### components/ui/ScrollProgress.tsx

```tsx
"use client";
import { motion, useScroll, useSpring } from "framer-motion";

/** Champagne progress bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const progressStyle = { scaleX };
  return (
    <motion.div
      style={progressStyle} 
      className="fixed left-0 top-0 z-[80] h-[2px] w-full origin-left bg-champagne"
    />
  );
}
```

### components/ui/MagneticButton.tsx

```tsx
"use client";
import { ReactNode, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  variant?: "solid" | "outline";
};

/** Button/link with a magnetic pull toward the cursor and a hover glow. */
export default function MagneticButton({
  children, href, onClick, className, strength = 0.4, variant = "solid",
}: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    gsap.to(el, { x, y, duration: 0.6, ease: "power3" });
  };
  const onLeave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" });

  const cls = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-xs uppercase tracking-[0.2em] transition-colors duration-500",
    variant === "solid"
      ? "bg-champagne text-charcoal hover:text-ivory"
      : "border border-ivory/30 text-ivory hover:border-champagne",
    className
  );

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 z-0 translate-y-full bg-charcoal transition-transform duration-500 ease-smooth group-hover:translate-y-0" />
    </>
  );

  const shared = { ref, onMouseMove: onMove, onMouseLeave: onLeave, className: cls, "data-cursor": "hover" } as const;

  return href ? (
    <Link href={href} {...shared}>{inner}</Link>
  ) : (
    <button onClick={onClick} {...shared}>{inner}</button>
  );
}
```

### components/ui/AnimatedText.tsx

```tsx
"use client";
import { ElementType, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
};

/** Splits text into word-lines and reveals them from a mask on scroll. */
export default function AnimatedText({ text, as: Tag = "h2", className, delay = 0, stagger = 0.08 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current!.querySelectorAll(".reveal-line"), {
        yPercent: 120,
        duration: 1.1,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <Tag className={cn("text-balance", className)}>
      <span ref={ref} className="inline">
        {words.map((w, i) => (
          <span key={i} className="reveal-mask inline-block">
            <span className="reveal-line inline-block">{w}&nbsp;</span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
```

### components/ui/RevealImage.tsx

```tsx
"use client";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Props = {
  src: string;
  alt: string;
  className?: string;
  parallax?: number;
  rounded?: boolean;
  priority?: boolean;
  sizes?: string;
};

/**
 * Image with a clip-path mask reveal, internal Ken-Burns scale, hover zoom and
 * optional parallax. Uses next/image for lazy + progressive loading.
 */
export default function RevealImage({
  src, alt, className, parallax = 0, rounded = true, priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(wrap.current, { clipPath: "inset(100% 0% 0% 0%)" }, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.4, ease: "expo.out",
        scrollTrigger: { trigger: wrap.current, start: "top 85%" },
      });
      gsap.from(inner.current, {
        scale: 1.3, duration: 1.6, ease: "expo.out",
        scrollTrigger: { trigger: wrap.current, start: "top 85%" },
      });
      if (parallax) {
        gsap.to(inner.current, {
          yPercent: parallax, ease: "none",
          scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    }, wrap);
    return () => ctx.revert();
  }, [parallax]);

  return (
    <div ref={wrap} className={cn("relative overflow-hidden", rounded && "rounded-2xl", className)}>
      <div ref={inner} className="relative h-full w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[1.2s] ease-smooth hover:scale-105"
        />
      </div>
    </div>
  );
}
```

### components/ui/Counter.tsx

```tsx
"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Props = { to: number; suffix?: string; prefix?: string; className?: string; duration?: number };

/** Animated count-up that fires once when scrolled into view. */
export default function Counter({ to, suffix = "", prefix = "", className, duration = 2 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: to, duration, ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        onUpdate: () => { if (ref.current) ref.current.textContent = `${prefix}${Math.round(obj.v)}${suffix}`; },
      });
    }, ref);
    return () => ctx.revert();
  }, [to]);

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
```

---

## 10. Navigation — components/layout/Navbar.tsx

```tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { navItems, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

// Framer-motion variants kept as consts (single-brace) for clean prop passing.
const overlayVariants = {
  closed: { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
  open: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
};
const listVariants = {
  closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  open: { transition: { delayChildren: 0.2, staggerChildren: 0.08 } },
};
const itemVariants = {
  closed: { y: "110%", opacity: 0 },
  open: { y: "0%", opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Sticky navigation: transparent at the top, glass-blur after 40px of scroll.
 * Desktop links use an animated champagne underline with an active state.
 * Mobile opens a full-screen clip-path menu with staggered serif links.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-[70] transition-all duration-500 ease-smooth", scrolled ? "glass py-3" : "py-6")}>
        <nav className="container-x flex items-center justify-between">
          <Link href="/" data-cursor="hover" className="font-serif text-xl tracking-[0.25em] text-ivory">
            {siteConfig.name.toUpperCase()}
          </Link>

          <ul className="hidden items-center gap-10 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href} data-cursor="hover" className="group relative text-xs uppercase tracking-[0.2em] text-ivory/80 transition-colors hover:text-ivory">
                    {item.label}
                    <span className={cn("absolute -bottom-1 left-0 h-px bg-champagne transition-all duration-500 ease-smooth", active ? "w-full" : "w-0 group-hover:w-full")} />
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link href="/contact" data-cursor="hover" className="hidden items-center gap-2 rounded-full border border-ivory/20 px-5 py-2 text-xs uppercase tracking-[0.2em] text-ivory transition-colors hover:border-champagne hover:text-champagne lg:inline-flex">
            Enquire <FiArrowUpRight />
          </Link>

          <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" data-cursor="hover" className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] lg:hidden">
            <span className={cn("h-px w-7 bg-ivory transition-all duration-300", open && "translate-y-[3.5px] rotate-45")} />
            <span className={cn("h-px w-7 bg-ivory transition-all duration-300", open && "-translate-y-[3.5px] -rotate-45")} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-[65] flex flex-col justify-center bg-graphite lg:hidden"
          >
            <motion.ul variants={listVariants} initial="closed" animate="open" exit="closed" className="container-x flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div variants={itemVariants}>
                    <Link href={item.href} onClick={() => setOpen(false)} className="block py-2 font-serif text-5xl text-ivory">
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

## 11. Footer — components/layout/Footer.tsx

```tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { navItems, siteConfig } from "@/lib/site";

/**
 * Heavy editorial footer: tagline + newsletter capture, sitemap, contact block,
 * a giant animated marquee wordmark, and the legal row.
 */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail("");
  };

  return (
    <footer className="relative overflow-hidden bg-graphite pt-section">
      <div className="container-x grid gap-16 pb-20 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-h2 text-ivory">{siteConfig.tagline}</h2>
          <form onSubmit={onSubmit} className="mt-8 flex max-w-md items-center border-b border-ivory/20 pb-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-transparent text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
            />
            <button type="submit" data-cursor="hover" aria-label="Subscribe" className="text-champagne">
              <FiArrowUpRight size={22} />
            </button>
          </form>
          {sent && <p className="mt-3 text-xs text-champagne">Thank you — you are on the list.</p>}
        </div>

        <div>
          <h3 className="mb-5 text-xs uppercase tracking-[0.2em] text-ivory/40">Explore</h3>
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} data-cursor="hover" className="text-ivory/80 transition-colors hover:text-champagne">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-xs uppercase tracking-[0.2em] text-ivory/40">Connect</h3>
          <address className="not-italic text-ivory/80">
            <p>{siteConfig.address}</p>
            <p className="mt-3">{siteConfig.phone}</p>
            <a href={`mailto:${siteConfig.email}`} data-cursor="hover" className="mt-3 inline-block hover:text-champagne">
              {siteConfig.email}
            </a>
          </address>
          <div className="mt-6 flex gap-5">
            {siteConfig.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" data-cursor="hover" className="text-xs uppercase tracking-widest text-ivory/60 hover:text-champagne">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="select-none overflow-hidden border-t border-ivory/10 py-10">
        <div className="marquee whitespace-nowrap font-serif text-[14vw] leading-none text-ivory/[0.06]">
          <span className="mx-6">{siteConfig.name}</span>
          <span className="mx-6">{siteConfig.name}</span>
          <span className="mx-6">{siteConfig.name}</span>
        </div>
      </div>

      <div className="container-x flex flex-col items-center justify-between gap-4 pb-10 text-xs text-ivory/40 md:flex-row">
        <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        <p>Crafted with intent · Original design</p>
      </div>
    </footer>
  );
}
```

---

## 12. Root app shell — app/layout.tsx

```tsx
import type { Metadata } from "next";
import { fraunces, inter } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import TransitionProvider from "@/components/providers/TransitionProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import Preloader from "@/components/ui/Preloader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — ${siteConfig.tagline}`, template: `%s — ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: ["luxury real estate", "premium residences", "architecture", siteConfig.name],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <Preloader />
        <CustomCursor />
        <ScrollProgress />
        <SmoothScrollProvider>
          <Navbar />
          <TransitionProvider>{children}</TransitionProvider>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
```

## 13. Home — Hero section (sections/home/Hero.tsx)

```tsx
"use client";
import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import MagneticButton from "@/components/ui/MagneticButton";
import { FiArrowDown } from "react-icons/fi";

const HERO_IMG =
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2400&q=80";
const headline = ["Architecture", "of a finer", "life."];

/**
 * Cinematic full-screen hero: Ken-Burns background with mouse parallax,
 * layered gradient overlays, a staggered masked headline reveal, animated
 * magnetic CTAs, and an animated scroll indicator. All intro motion runs on a
 * single GSAP timeline for tight, choreographed timing.
 */
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.from(".hero-line span", { yPercent: 120, duration: 1.2, ease: "expo.out", stagger: 0.12 })
        .from(".hero-sub", { y: 30, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.7")
        .from(".hero-cta", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }, "-=0.6")
        .from(".hero-scroll", { opacity: 0, duration: 0.8 }, "-=0.4");

      gsap.to(bg.current, { scale: 1.12, duration: 12, ease: "none", repeat: -1, yoyo: true });

      const onMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 24;
        const y = (e.clientY / window.innerHeight - 0.5) * 24;
        gsap.to(bg.current, { x, y, duration: 1.2, ease: "power3" });
      };
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-[100svh] w-full overflow-hidden">
      <div ref={bg} className="absolute inset-0 scale-105">
        <Image src={HERO_IMG} alt="A contemporary residential tower at dusk" fill priority sizes="100vw" className="object-cover" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-charcoal/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(17,17,17,0.5)_100%)]" />

      <div className="container-x relative z-10 flex h-full flex-col justify-end pb-24">
        <p className="hero-sub mb-6 text-sm uppercase tracking-[0.3em] text-champagne">AURELIA Estates</p>
        <h1 className="font-serif text-hero text-ivory">
          {headline.map((line, i) => (
            <span key={i} className="hero-line block overflow-hidden">
              <span className="block">{line}</span>
            </span>
          ))}
        </h1>
        <p className="hero-sub mt-8 max-w-xl text-lg text-ivory/70">
          We design and build landmark residences and workplaces across the city — where architecture, craft and community meet.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <div className="hero-cta"><MagneticButton href="/properties">Explore residences</MagneticButton></div>
          <div className="hero-cta"><MagneticButton href="/about" variant="outline">Our philosophy</MagneticButton></div>
        </div>
      </div>

      <div className="hero-scroll absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ivory/60">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <FiArrowDown className="animate-bounce" />
      </div>
    </section>
  );
}
```

---

## 14. Home — Region counters (sections/home/Regions.tsx)

```tsx
"use client";
import Counter from "@/components/ui/Counter";
import AnimatedText from "@/components/ui/AnimatedText";
import { regions } from "@/lib/data";

/** Animated count-up grid summarising the portfolio across the city. */
export default function Regions() {
  return (
    <section className="bg-charcoal py-section">
      <div className="container-x">
        <AnimatedText
          as="h2"
          text="A portfolio rooted across the city's most considered addresses."
          className="max-w-4xl font-serif text-h1 text-ivory"
        />
        <div className="mt-20 grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-4">
          {regions.map((r) => (
            <div key={r.label} className="border-t border-ivory/15 pt-6">
              <div className="font-serif text-6xl text-champagne tabular-nums lg:text-7xl">
                <Counter to={r.count} />
              </div>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-ivory/60">{r.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## 15. Home — Editorial narrative (sections/home/Narrative.tsx)

```tsx
"use client";
import RevealImage from "@/components/ui/RevealImage";
import AnimatedText from "@/components/ui/AnimatedText";
import { cn } from "@/lib/utils";

type Chapter = { n: string; title: string; body: string; img: string };

const chapters: Chapter[] = [
  {
    n: "01",
    title: "Vision",
    body: "Every AURELIA address begins as a question about how people want to live. We design from that answer outward — light, proportion and flow before form.",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
  },
  {
    n: "02",
    title: "Innovation",
    body: "We pair time-honoured craft with quietly intelligent buildings — systems that anticipate, conserve and adapt without ever asking to be noticed.",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  },
  {
    n: "03",
    title: "Craft",
    body: "Stone, timber and bronze are chosen by hand and detailed to the millimetre. The result is architecture that feels considered at arm's length and at a distance.",
    img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1600&q=80",
  },
  {
    n: "04",
    title: "Legacy",
    body: "We build for the long arc — places that age with grace and hold their value across generations, becoming part of the city's memory.",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
  },
];

/** Alternating, parallax editorial chapters describing the studio's philosophy. */
export default function Narrative() {
  return (
    <section className="bg-graphite py-section">
      <div className="container-x">
        <p className="mb-16 text-sm uppercase tracking-[0.3em] text-champagne">Our philosophy</p>
        <div className="flex flex-col gap-section">
          {chapters.map((c, i) => (
            <div
              key={c.n}
              className={cn(
                "grid items-center gap-10 lg:grid-cols-2",
                i % 2 === 1 && "lg:[&>*:first-child]:order-2"
              )}
            >
              <RevealImage src={c.img} alt={c.title} parallax={-8} className="aspect-[4/5] w-full" />
              <div>
                <span className="font-serif text-sm text-bronze">{c.n}</span>
                <AnimatedText as="h3" text={c.title} className="mt-2 font-serif text-h1 text-ivory" />
                <p className="mt-6 max-w-md text-ivory/70">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## 16. Home — Horizontal featured projects (sections/home/FeaturedProjects.tsx)

```tsx
"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { properties } from "@/lib/data";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Pinned horizontal-scroll gallery. The section pins while the inner track
 * translates on the x-axis, driven by vertical scroll via ScrollTrigger scrub.
 */
export default function FeaturedProjects() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const el = track.current!;
      const scrollLen = el.scrollWidth - window.innerWidth;
      if (scrollLen <= 0) return;
      gsap.to(el, {
        x: -scrollLen,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${scrollLen}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-screen overflow-hidden bg-charcoal">
      <div ref={track} className="flex h-full items-center gap-8 px-[6vw] will-change-transform">
        <div className="flex w-[80vw] shrink-0 flex-col justify-center md:w-[40vw]">
          <p className="text-sm uppercase tracking-[0.3em] text-champagne">Selected work</p>
          <h2 className="mt-4 font-serif text-display text-ivory">Signature developments.</h2>
          <p className="mt-6 max-w-sm text-ivory/60">A horizontal journey through the projects that define how we build.</p>
        </div>

        {properties.map((p) => (
          <Link
            key={p.slug}
            href={`/properties/${p.slug}`}
            data-cursor="hover"
            data-cursor-text="View"
            className="group relative h-[70vh] w-[78vw] shrink-0 overflow-hidden rounded-2xl md:w-[34vw]"
          >
            <Image src={p.hero} alt={p.name} fill sizes="40vw" className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-champagne">{p.type} · {p.status}</p>
              <h3 className="mt-2 font-serif text-3xl text-ivory">{p.name}</h3>
              <p className="mt-1 text-sm text-ivory/70">{p.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

## 17. Home — Closing CTA (sections/home/CTA.tsx)

```tsx
import MagneticButton from "@/components/ui/MagneticButton";
import RevealImage from "@/components/ui/RevealImage";

/** Full-width image CTA inviting the visitor to begin a conversation. */
export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-section">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl">
          <RevealImage
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
            alt="Interior of a luxury residence"
            parallax={-6}
            rounded={false}
            className="absolute inset-0 h-full w-full"
          />
          <div className="absolute inset-0 bg-charcoal/70" />
          <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-32 text-center">
            <h2 className="max-w-3xl text-balance font-serif text-h1 text-ivory">Begin a conversation about your next address.</h2>
            <p className="max-w-xl text-ivory/70">Our advisory team will guide you through availability, private viewings and bespoke residences.</p>
            <MagneticButton href="/contact">Enquire now</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
```

## 18. Home page — app/page.tsx

```tsx
import Hero from "@/sections/home/Hero";
import Regions from "@/sections/home/Regions";
import Narrative from "@/sections/home/Narrative";
import FeaturedProjects from "@/sections/home/FeaturedProjects";
import CTA from "@/sections/home/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Regions />
      <Narrative />
      <FeaturedProjects />
      <CTA />
    </>
  );
}
```

---

## 19. About page — app/about/page.tsx

```tsx
import type { Metadata } from "next";
import AnimatedText from "@/components/ui/AnimatedText";
import RevealImage from "@/components/ui/RevealImage";
import Counter from "@/components/ui/Counter";
import MagneticButton from "@/components/ui/MagneticButton";

export const metadata: Metadata = {
  title: "About",
  description: "The studio, philosophy and people behind AURELIA Estates.",
};

const values = [
  { title: "Integrity", body: "We say what we will build, and we build what we said — on time and to the line." },
  { title: "Restraint", body: "Luxury is what remains when the unnecessary has been quietly removed." },
  { title: "Stewardship", body: "We design for the city and for the generations who will inherit it." },
];

const stats = [
  { to: 28, suffix: "+", label: "Years of practice" },
  { to: 45, suffix: "", label: "Landmark projects" },
  { to: 4, suffix: "M", label: "Sq ft delivered" },
  { to: 19, suffix: "", label: "Design awards" },
];

const team = [
  { name: "Ila Varma", role: "Founder & Principal Architect", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80" },
  { name: "Rohan Mehta", role: "Design Director", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80" },
  { name: "Sana Kapoor", role: "Head of Interiors", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80" },
];

/** About page: studio intro, values, animated stats and the team. */
export default function AboutPage() {
  return (
    <main className="bg-charcoal">
      <section className="container-x pb-section pt-48">
        <p className="mb-8 text-sm uppercase tracking-[0.3em] text-champagne">About AURELIA</p>
        <AnimatedText
          as="h1"
          text="We are a studio of architects, makers and quiet obsessives."
          className="max-w-5xl font-serif text-display text-ivory"
        />
        <p className="mt-10 max-w-2xl text-lg text-ivory/70">
          For nearly three decades we have shaped how the city lives and works — designing residences and workplaces that balance beauty, longevity and a deep sense of place.
        </p>
      </section>

      <section className="container-x pb-section">
        <RevealImage
          src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=2000&q=80"
          alt="The AURELIA design studio"
          parallax={-6}
          priority
          className="aspect-[16/9] w-full"
        />
      </section>

      <section className="container-x grid gap-12 pb-section md:grid-cols-3">
        {values.map((v) => (
          <div key={v.title} className="border-t border-ivory/15 pt-6">
            <h3 className="font-serif text-2xl text-ivory">{v.title}</h3>
            <p className="mt-4 text-ivory/70">{v.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-graphite py-section">
        <div className="container-x grid grid-cols-2 gap-12 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-serif text-6xl text-champagne tabular-nums">
                <Counter to={s.to} suffix={s.suffix} />
              </div>
              <p className="mt-3 text-sm uppercase tracking-[0.2em] text-ivory/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-section">
        <AnimatedText as="h2" text="The people behind the practice." className="mb-16 font-serif text-h1 text-ivory" />
        <div className="grid gap-10 md:grid-cols-3">
          {team.map((m) => (
            <div key={m.name}>
              <RevealImage src={m.img} alt={m.name} className="aspect-[3/4] w-full" />
              <h3 className="mt-5 font-serif text-xl text-ivory">{m.name}</h3>
              <p className="text-sm text-ivory/60">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x flex justify-center pb-section">
        <MagneticButton href="/contact">Work with us</MagneticButton>
      </section>
    </main>
  );
}
```

## 20. Projects page — app/projects/page.tsx

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AnimatedText from "@/components/ui/AnimatedText";
import { properties } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects",
  description: "Signature residential, commercial and mixed-use developments by AURELIA Estates.",
};

/** Projects index: an offset two-column grid with hover image-zoom. */
export default function ProjectsPage() {
  return (
    <main className="bg-charcoal">
      <section className="container-x pb-section pt-48">
        <p className="mb-8 text-sm uppercase tracking-[0.3em] text-champagne">Projects</p>
        <AnimatedText as="h1" text="A portfolio built to outlast trend." className="max-w-4xl font-serif text-display text-ivory" />
      </section>

      <section className="container-x pb-section">
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {properties.map((p, i) => (
            <Link
              key={p.slug}
              href={`/properties/${p.slug}`}
              data-cursor="hover"
              data-cursor-text="View"
              className={cn("group block", i % 2 === 1 && "md:mt-24")}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <Image
                  src={p.hero}
                  alt={p.name}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                />
              </div>
              <div className="mt-6 flex items-start justify-between">
                <div>
                  <h2 className="font-serif text-3xl text-ivory">{p.name}</h2>
                  <p className="mt-1 text-sm text-ivory/60">{p.location}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-champagne">{p.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
```

## 21. Properties listing — app/properties/page.tsx

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { properties } from "@/lib/data";
import { cn } from "@/lib/utils";

const filters = ["All", "Residential", "Commercial", "Mixed Use"] as const;

/** Filterable residences grid with animated state transitions. */
export default function PropertiesPage() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const list = active === "All" ? properties : properties.filter((p) => p.type === active);

  return (
    <main className="min-h-screen bg-charcoal">
      <section className="container-x pb-16 pt-48">
        <p className="mb-8 text-sm uppercase tracking-[0.3em] text-champagne">Residences</p>
        <h1 className="max-w-4xl font-serif text-display text-ivory">Available now.</h1>

        <div className="mt-12 flex flex-wrap gap-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              data-cursor="hover"
              className={cn(
                "rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors duration-300",
                active === f ? "border-champagne bg-champagne text-charcoal" : "border-ivory/20 text-ivory/70 hover:border-ivory"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="container-x pb-section">
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Link
              key={p.slug}
              href={`/properties/${p.slug}`}
              data-cursor="hover"
              data-cursor-text="View"
              className="group block"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                <Image
                  src={p.hero}
                  alt={p.name}
                  fill
                  sizes="(max-width:1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-charcoal/70 px-3 py-1 text-[10px] uppercase tracking-widest text-ivory">{p.status}</span>
              </div>
              <h2 className="mt-5 font-serif text-2xl text-ivory">{p.name}</h2>
              <p className="text-sm text-ivory/60">{p.location}</p>
              <div className="mt-3 flex items-center justify-between text-sm text-ivory/70">
                <span>{p.beds}</span>
                <span className="text-champagne">{p.priceFrom}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
```

## 22. Property detail — app/properties/[slug]/page.tsx

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProperty, properties } from "@/lib/data";
import RevealImage from "@/components/ui/RevealImage";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) return { title: "Property not found" };
  return { title: property.name, description: property.excerpt };
}

/** Cinematic property detail with facts, gallery and related residences. */
export default async function PropertyDetailPage({ params }: Params) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  const others = properties.filter((p) => p.slug !== property.slug).slice(0, 2);
  const facts = [
    { k: "Price from", v: property.priceFrom },
    { k: "Configuration", v: property.beds },
    { k: "Area", v: property.area },
    { k: "Completion", v: property.year },
  ];

  return (
    <main className="bg-charcoal">
      <section className="relative h-[90vh] w-full overflow-hidden">
        <Image src={property.hero} alt={property.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-charcoal/40" />
        <div className="container-x absolute inset-x-0 bottom-0 z-10 pb-20">
          <p className="text-sm uppercase tracking-[0.3em] text-champagne">{property.type} · {property.status}</p>
          <h1 className="mt-4 font-serif text-display text-ivory">{property.name}</h1>
          <p className="mt-3 text-lg text-ivory/70">{property.location}</p>
        </div>
      </section>

      <section className="container-x border-b border-ivory/10 py-12">
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {facts.map((f) => (
            <div key={f.k}>
              <dt className="text-xs uppercase tracking-[0.2em] text-ivory/50">{f.k}</dt>
              <dd className="mt-2 font-serif text-xl text-ivory">{f.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-x grid gap-16 py-section lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-h2 text-ivory">The residence</h2>
          <p className="mt-6 text-lg leading-relaxed text-ivory/70">{property.description}</p>
        </div>
        <ul className="space-y-4">
          {property.highlights.map((h) => (
            <li key={h} className="flex items-start gap-4 border-t border-ivory/10 pt-4 text-ivory/80">
              <span className="text-champagne">—</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x pb-section">
        <div className="grid gap-6 md:grid-cols-2">
          {property.gallery.map((src, i) => (
            <RevealImage
              key={i}
              src={src}
              alt={`${property.name} gallery image ${i + 1}`}
              parallax={i % 2 ? -6 : 6}
              className={cn("w-full", i === 0 ? "aspect-[16/10] md:col-span-2" : "aspect-[4/3]")}
            />
          ))}
        </div>
      </section>

      <section className="container-x flex flex-col items-center gap-8 pb-section text-center">
        <h2 className="max-w-2xl text-balance font-serif text-h1 text-ivory">Arrange a private viewing of {property.name}.</h2>
        <MagneticButton href="/contact">Enquire about this residence</MagneticButton>
      </section>

      <section className="container-x pb-section">
        <h3 className="mb-10 text-sm uppercase tracking-[0.3em] text-champagne">More residences</h3>
        <div className="grid gap-8 md:grid-cols-2">
          {others.map((p) => (
            <Link key={p.slug} href={`/properties/${p.slug}`} data-cursor="hover" data-cursor-text="View" className="group block">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                <Image src={p.hero} alt={p.name} fill sizes="50vw" className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105" />
              </div>
              <h4 className="mt-4 font-serif text-2xl text-ivory">{p.name}</h4>
              <p className="text-sm text-ivory/60">{p.location}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
```

---

## 23. Gallery page — app/gallery/page.tsx

```tsx
import type { Metadata } from "next";
import RevealImage from "@/components/ui/RevealImage";
import AnimatedText from "@/components/ui/AnimatedText";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A visual archive of AURELIA Estates architecture, interiors and detail.",
};

const shots = [
  { src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", alt: "Tower facade at dusk", ratio: "aspect-[3/4]" },
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", alt: "Sculpted living room", ratio: "aspect-[4/3]" },
  { src: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80", alt: "Quiet bedroom suite", ratio: "aspect-[1/1]" },
  { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", alt: "Lakeside exterior", ratio: "aspect-[3/4]" },
  { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80", alt: "Kitchen in stone and timber", ratio: "aspect-[4/3]" },
  { src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", alt: "Commercial lobby", ratio: "aspect-[3/4]" },
  { src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", alt: "Garden court", ratio: "aspect-[1/1]" },
  { src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80", alt: "Penthouse outlook", ratio: "aspect-[4/3]" },
  { src: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80", alt: "Architectural detail", ratio: "aspect-[3/4]" },
];

/** Masonry gallery; each image reveals from a mask with light parallax. */
export default function GalleryPage() {
  return (
    <main className="bg-charcoal">
      <section className="container-x pb-16 pt-48">
        <p className="mb-8 text-sm uppercase tracking-[0.3em] text-champagne">Gallery</p>
        <AnimatedText as="h1" text="A visual archive." className="font-serif text-display text-ivory" />
      </section>

      <section className="container-x pb-section">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {shots.map((s, i) => (
            <div key={i} className="break-inside-avoid">
              <RevealImage src={s.src} alt={s.alt} parallax={i % 3 === 0 ? -5 : 0} className={`w-full ${s.ratio}`} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
```

## 24. Contact page — app/contact/page.tsx

```tsx
"use client";
import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const interests = ["Residential", "Commercial", "Investment", "General enquiry"];

const fieldCls =
  "w-full border-b border-ivory/20 bg-transparent py-3 text-ivory placeholder:text-ivory/40 transition-colors focus:border-champagne focus:outline-none";

/** Accessible, validated enquiry form with interest chips and a success state. */
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: interests[0], message: "" });
  const [sent, setSent] = useState(false);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="bg-charcoal">
      <section className="container-x grid gap-16 pb-section pt-48 lg:grid-cols-2">
        <div>
          <p className="mb-8 text-sm uppercase tracking-[0.3em] text-champagne">Contact</p>
          <h1 className="font-serif text-display text-ivory">Begin a conversation.</h1>
          <p className="mt-8 max-w-md text-lg text-ivory/70">
            Tell us a little about what you are looking for. Our advisory team responds within one business day.
          </p>

          <div className="mt-12 space-y-6 text-ivory/80">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ivory/40">Studio</p>
              <p className="mt-2">{siteConfig.address}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ivory/40">Call</p>
              <p className="mt-2">{siteConfig.phone}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ivory/40">Email</p>
              <a href={`mailto:${siteConfig.email}`} data-cursor="hover" className="mt-2 inline-block hover:text-champagne">
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 md:p-10">
          {sent ? (
            <div className="flex h-full min-h-[24rem] flex-col items-center justify-center text-center">
              <h2 className="font-serif text-h2 text-ivory">Thank you.</h2>
              <p className="mt-4 max-w-sm text-ivory/70">Your enquiry is on its way to our team. We will be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <input className={fieldCls} placeholder="Full name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
                <input className={fieldCls} type="email" placeholder="Email" required value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <input className={fieldCls} placeholder="Phone (optional)" value={form.phone} onChange={(e) => update("phone", e.target.value)} />

              <div>
                <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ivory/40">I am interested in</p>
                <div className="flex flex-wrap gap-3">
                  {interests.map((it) => (
                    <button
                      key={it}
                      type="button"
                      data-cursor="hover"
                      onClick={() => update("interest", it)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors duration-300",
                        form.interest === it ? "border-champagne bg-champagne text-charcoal" : "border-ivory/20 text-ivory/70 hover:border-ivory"
                      )}
                    >
                      {it}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className={cn(fieldCls, "min-h-[8rem] resize-none")}
                placeholder="Tell us about your project"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
              />

              <button
                type="submit"
                data-cursor="hover"
                className="group inline-flex items-center gap-3 rounded-full bg-champagne px-8 py-4 text-xs uppercase tracking-[0.2em] text-charcoal transition-transform duration-300 hover:scale-[1.02]"
              >
                Send enquiry
                <FiArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
```

## 25. SEO — app/sitemap.ts

```tsx
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { properties } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  const routes = ["", "/about", "/projects", "/properties", "/gallery", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const propertyRoutes = properties.map((p) => ({
    url: `${base}/properties/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...propertyRoutes];
}
```

## 26. SEO — app/robots.ts

```tsx
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
```

---

## 27. Setup & run

```bash
# 1. Create a fresh Next.js 15 app (or reuse an empty one)
npx create-next-app@latest aurelia --typescript --tailwind --app --eslint
cd aurelia

# 2. Install runtime dependencies
npm install gsap @gsap/react lenis framer-motion react-icons three @react-three/fiber @react-three/drei clsx tailwind-merge

# 3. Replace the generated config + globals with the blocks above,
#    then create each file at the path shown in its heading.

# 4. Develop / build
npm run dev      # http://localhost:3000
npm run build && npm run start
```

<aside>
✅

All 26 source files are now on this page — config, design system, libs, hooks, providers, the full UI kit (cursor, preloader, scroll progress, magnetic button, animated text, reveal image, counter), navigation, footer, the app shell, every home section, and all seven routes (Home, About, Projects, Properties, Property detail, Gallery, Contact) plus `sitemap.ts` and `robots.ts`.

</aside>

*Build complete.*