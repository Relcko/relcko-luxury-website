# Phase 02 Build — Design System (Output)

<aside>
🎨

Implementation output for **Phase 02 — Design System** only. Built against the [Refined Build Spec](Luxury%20Real%20Estate%20Website%20%E2%80%94%20Refined%20Build%20Spec%20(C%201063e5037979422b923a1be7e7b29257.md) (single source of truth) and the [Claude Code — Master Prompt](notion-211). Tokens + reusable primitives only — no hero, nav, footer, animations, CMS, forms, or page sections.

</aside>

<aside>
ℹ️

**Delivery & verification reminder:** every file below is complete and copy‑paste ready, but I can't run a terminal here — these aren't executed. After applying, run the §9 verification block (`type-check`, `lint`, `build`) on your machine. I won't move to Phase 03 until you confirm it's green.

</aside>

## 1. Design token architecture

The system has **three coordinated layers**, with the CSS layer as the source of truth:

1. **`@theme` tokens in `app/globals.css`** — the canonical, themeable values: color, fluid type scale, spacing base, radius, shadow, breakpoints, container widths. Tailwind v4 auto-generates utilities from each token (`bg-bg-base`, `text-2xl`, `rounded-lg`, `shadow-md`, `xs:`/`3xl:` variants, `max-w-content`), so components reference **tokens via utilities — never raw values**.
2. **`:root` runtime CSS variables** — values consumed as variables rather than utilities (z-index), used like `z-[var(--z-sticky)]`.
3. **TypeScript token modules** (`lib/design/*`, `lib/animation/tokens.ts`) — values needed in TS/logic: z-index numbers, icon px sizes, breakpoint px (for future `useMediaQuery`), shared class fragments (focus ring), and motion timings. These mirror the CSS tokens so there is one conceptual system.

**Rule enforced everywhere:** no inline magic values; every spacing/color/size resolves to a token.

## 2. `app/globals.css` (replaces Phase 01 version)

```css
@import "tailwindcss";

@theme {
  /* ===== Color system (Spec §5) ===== */
  --color-bg-base: #0b0b0b;
  --color-bg-elevated: #121212;
  --color-bg-surface: #1a1a1a;
  --color-accent-gold: #c8a26a;
  --color-accent-gold-hover: #d8b681;
  --color-accent-gold-muted: rgba(200, 162, 106, 0.16);
  --color-text-primary: #f7f7f5;
  --color-text-muted: rgba(247, 247, 245, 0.64);
  --color-text-subtle: rgba(247, 247, 245, 0.4);
  --color-text-inverse: #0b0b0b;
  --color-border: rgba(247, 247, 245, 0.12);
  --color-border-strong: rgba(247, 247, 245, 0.24);
  --color-danger: #e5484d;
  --color-success: #46a758;

  /* ===== Typography ===== */
  --font-display: var(--font-display-sans), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-body-sans), ui-sans-serif, system-ui, sans-serif;

  /* Fluid type scale (clamp) — Spec §5 */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --text-3xl: clamp(1.875rem, 1.5rem + 1.8vw, 2.75rem);
  --text-4xl: clamp(2.5rem, 1.9rem + 3vw, 4rem);
  --text-5xl: clamp(3.25rem, 2.2rem + 5vw, 6rem);

  /* ===== Spacing (4px base) ===== */
  --spacing: 0.25rem;

  /* ===== Radius ===== */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

  /* ===== Shadows (dark-tuned) ===== */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.45);
  --shadow-lg: 0 24px 60px rgba(0, 0, 0, 0.55);
  --shadow-glow: 0 0 0 1px var(--color-accent-gold-muted),
    0 8px 32px rgba(200, 162, 106, 0.12);

  /* ===== Breakpoints (360 → 1920) ===== */
  --breakpoint-xs: 22.5rem;
  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 80rem;
  --breakpoint-2xl: 96rem;
  --breakpoint-3xl: 120rem;

  /* ===== Container widths ===== */
  --container-narrow: 48rem;
  --container-content: 80rem;
  --container-max: 1600px;
}

:root {
  color-scheme: dark;

  /* ===== Z-index scale ===== */
  --z-base: 0;
  --z-raised: 10;
  --z-sticky: 100;
  --z-overlay: 200;
  --z-modal: 300;
  --z-popover: 400;
  --z-toast: 500;
  --z-max: 999;
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

/* Spec §9: respect reduced-motion globally */
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

## 3. Token modules (TypeScript)

### lib/design/tokens.ts

```tsx
/**
 * TS-side design tokens that mirror the CSS @theme / :root tokens for values
 * needed in logic. Styling values live in globals.css; these exist for
 * JS consumers (z-index, icon px, JS breakpoints, control sizing).
 */
export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 100,
  overlay: 200,
  modal: 300,
  popover: 400,
  toast: 500,
  max: 999,
} as const;
export type ZIndexToken = keyof typeof zIndex;

/** Icon sizing in px (Spec: consistent icon sizing). */
export const iconSize = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;
export type IconSize = keyof typeof iconSize;

/** Shared control heights for inputs/buttons (token-driven sizing). */
export const controlHeight = {
  sm: "h-9",
  md: "h-11",
  lg: "h-13",
} as const;
export type ControlSize = keyof typeof controlHeight;

/** Breakpoint px values for JS (future useMediaQuery). Mirror @theme. */
export const breakpoints = {
  xs: 360,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
  "3xl": 1920,
} as const;
export type Breakpoint = keyof typeof breakpoints;
```

### lib/design/styles.ts

```tsx
/**
 * Shared, token-driven class fragments reused across primitives so focus and
 * transition behavior never diverge (no duplicated styles).
 */
export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base";

export const transitionBase =
  "transition-colors duration-200 ease-out motion-reduce:transition-none";
```

### lib/animation/tokens.ts (motion tokens — values only)

```tsx
/**
 * Motion tokens (Spec §13). Values only — no engine imported or initialized.
 * GSAP/Framer Motion (Phase 03+) read from these so timings/easings stay
 * consistent across the site.
 */
export const duration = {
  fast: 0.3,
  base: 0.6,
  slow: 1.2,
} as const;

export const delay = {
  none: 0,
  short: 0.08,
  stagger: 0.12,
} as const;

/** Cubic-bezier control points (Framer Motion / GSAP compatible). */
export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;
```

## 4. UI primitives

### components/ui/container.tsx (moved here from components/layout; now variant-aware)

```tsx
import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type ContainerSize = "narrow" | "content" | "max";

export interface ContainerProps {
  as?: ElementType;
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
}

const sizeStyles: Record<ContainerSize, string> = {
  narrow: "max-w-narrow",
  content: "max-w-content",
  max: "max-w-[var(--container-max)]",
};

/** Centered, max-width layout wrapper with responsive gutters (Spec §5). */
export function Container({
  as: Tag = "div",
  size = "max",
  className,
  children,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-6 md:px-10 lg:px-16",
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

### components/ui/section.tsx

```tsx
import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Container } from "@/components/ui/container";
import type { ContainerSize } from "@/components/ui/container";

export type SectionSpacing = "sm" | "md" | "lg";

export interface SectionProps {
  as?: ElementType;
  spacing?: SectionSpacing;
  containerSize?: ContainerSize;
  /** When true, render children full-bleed with no inner Container. */
  bleed?: boolean;
  className?: string;
  children: ReactNode;
}

const spacingStyles: Record<SectionSpacing, string> = {
  sm: "py-16 md:py-20",
  md: "py-24 md:py-32",
  lg: "py-32 md:py-48",
};

/** Vertical-rhythm wrapper for page sections (Spec §5 “sections breathe”). */
export function Section({
  as: Tag = "section",
  spacing = "md",
  containerSize = "max",
  bleed = false,
  className,
  children,
}: SectionProps) {
  return (
    <Tag className={cn(spacingStyles[spacing], className)}>
      {bleed ? children : <Container size={containerSize}>{children}</Container>}
    </Tag>
  );
}
```

### components/ui/heading.tsx

```tsx
import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "sm" | "md" | "lg" | "xl" | "display";

export interface HeadingProps {
  /** Semantic tag override; defaults to h{level}. */
  as?: ElementType;
  level?: HeadingLevel;
  size?: HeadingSize;
  className?: string;
  children: ReactNode;
}

const sizeStyles: Record<HeadingSize, string> = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
  display: "text-5xl",
};

/**
 * Editorial heading. Semantic level (a11y) is decoupled from visual size so
 * heading order stays correct regardless of styling.
 */
export function Heading({
  as,
  level = 2,
  size = "lg",
  className,
  children,
}: HeadingProps) {
  const Tag: ElementType = as ?? (`h${level}` as ElementType);
  return (
    <Tag
      className={cn(
        "font-display font-medium leading-[1.05] tracking-tight text-text-primary",
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

### components/ui/text.tsx

```tsx
import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type TextSize = "xs" | "sm" | "base" | "lg" | "xl";
export type TextTone = "primary" | "muted" | "subtle" | "accent";

export interface TextProps {
  as?: ElementType;
  size?: TextSize;
  tone?: TextTone;
  className?: string;
  children: ReactNode;
}

const sizeStyles: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const toneStyles: Record<TextTone, string> = {
  primary: "text-text-primary",
  muted: "text-text-muted",
  subtle: "text-text-subtle",
  accent: "text-accent-gold",
};

export function Text({
  as: Tag = "p",
  size = "base",
  tone = "muted",
  className,
  children,
}: TextProps) {
  return (
    <Tag
      className={cn(
        "font-body leading-relaxed",
        sizeStyles[size],
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

### components/ui/button.tsx

```tsx
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { focusRing, transitionBase } from "@/lib/design/styles";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-gold text-text-inverse hover:bg-accent-gold-hover font-medium",
  secondary:
    "border border-border-strong text-text-primary hover:border-accent-gold hover:text-accent-gold",
  ghost: "text-text-primary hover:bg-bg-surface",
  link: "h-auto px-0 text-accent-gold underline-offset-4 hover:underline",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-13 px-8 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-display tracking-tight",
        "disabled:pointer-events-none disabled:opacity-50",
        transitionBase,
        focusRing,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  );
});
```

### components/ui/badge.tsx

```tsx
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export type BadgeVariant = "solid" | "outline" | "muted";

export interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  solid: "bg-accent-gold text-text-inverse",
  outline: "border border-accent-gold text-accent-gold",
  muted: "bg-accent-gold-muted text-accent-gold",
};

export function Badge({ variant = "muted", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em]",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
```

### components/ui/surface.tsx

```tsx
import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type SurfaceElevation = "flat" | "raised" | "floating";

export interface SurfaceProps {
  as?: ElementType;
  elevation?: SurfaceElevation;
  bordered?: boolean;
  className?: string;
  children: ReactNode;
}

const elevationStyles: Record<SurfaceElevation, string> = {
  flat: "bg-bg-elevated",
  raised: "bg-bg-elevated shadow-md",
  floating: "bg-bg-surface shadow-lg",
};

/** Base elevated panel. Card and future overlays build on this. */
export function Surface({
  as: Tag = "div",
  elevation = "flat",
  bordered = true,
  className,
  children,
}: SurfaceProps) {
  return (
    <Tag
      className={cn(
        "rounded-lg",
        bordered && "border border-border",
        elevationStyles[elevation],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

### components/ui/card.tsx

```tsx
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Surface } from "@/components/ui/surface";
import type { SurfaceElevation } from "@/components/ui/surface";

export interface CardProps {
  elevation?: SurfaceElevation;
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}

export interface CardSlotProps {
  className?: string;
  children: ReactNode;
}

export function Card({
  elevation = "raised",
  interactive = false,
  className,
  children,
}: CardProps) {
  return (
    <Surface
      elevation={elevation}
      className={cn(
        "overflow-hidden",
        interactive &&
          "transition-colors duration-200 ease-out hover:border-accent-gold motion-reduce:transition-none",
        className,
      )}
    >
      {children}
    </Surface>
  );
}

export function CardHeader({ className, children }: CardSlotProps) {
  return (
    <div className={cn("flex flex-col gap-2 p-6 pb-0 md:p-8 md:pb-0", className)}>
      {children}
    </div>
  );
}

export function CardBody({ className, children }: CardSlotProps) {
  return <div className={cn("p-6 md:p-8", className)}>{children}</div>;
}

export function CardFooter({ className, children }: CardSlotProps) {
  return (
    <div
      className={cn("flex items-center gap-3 p-6 pt-0 md:p-8 md:pt-0", className)}
    >
      {children}
    </div>
  );
}
```

### components/ui/label.tsx

```tsx
import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: ReactNode;
}

export function Label({ className, required = false, children, ...props }: LabelProps) {
  return (
    <label className={cn("text-sm font-medium text-text-primary", className)} {...props}>
      {children}
      {required ? (
        <span className="ml-1 text-accent-gold" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );
}
```

### components/ui/input.tsx

```tsx
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { focusRing, transitionBase } from "@/lib/design/styles";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-11 w-full rounded-md border bg-bg-elevated px-4 text-base text-text-primary",
        "placeholder:text-text-subtle",
        invalid ? "border-danger" : "border-border",
        transitionBase,
        focusRing,
        className,
      )}
      {...props}
    />
  );
});
```

### components/ui/textarea.tsx

```tsx
import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { focusRing, transitionBase } from "@/lib/design/styles";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid = false, rows = 4, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid || undefined}
        className={cn(
          "w-full resize-y rounded-md border bg-bg-elevated px-4 py-3 text-base text-text-primary",
          "placeholder:text-text-subtle",
          invalid ? "border-danger" : "border-border",
          transitionBase,
          focusRing,
          className,
        )}
        {...props}
      />
    );
  },
);
```

### components/ui/divider.tsx

```tsx
import { cn } from "@/utils/cn";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Divider({ orientation = "horizontal", className }: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        "bg-border",
        className,
      )}
    />
  );
}
```

### components/ui/stack.tsx

```tsx
import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type StackDirection = "row" | "col";
export type StackGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type StackAlign = "start" | "center" | "end" | "stretch";
export type StackJustify = "start" | "center" | "end" | "between";

export interface StackProps {
  as?: ElementType;
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  className?: string;
  children: ReactNode;
}

const gapStyles: Record<StackGap, string> = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};

const alignStyles: Record<StackAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyStyles: Record<StackJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

/** Flexbox layout primitive (vertical by default). */
export function Stack({
  as: Tag = "div",
  direction = "col",
  gap = "md",
  align = "stretch",
  justify = "start",
  wrap = false,
  className,
  children,
}: StackProps) {
  return (
    <Tag
      className={cn(
        "flex",
        direction === "col" ? "flex-col" : "flex-row",
        gapStyles[gap],
        alignStyles[align],
        justifyStyles[justify],
        wrap && "flex-wrap",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

### components/ui/grid.tsx

```tsx
import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";

export type GridCols = 1 | 2 | 3 | 4 | 6 | 12;
export type GridGap = "none" | "sm" | "md" | "lg";

export interface GridProps {
  as?: ElementType;
  cols?: GridCols;
  gap?: GridGap;
  className?: string;
  children: ReactNode;
}

/** Responsive column counts: collapse on mobile, expand at sm/md/lg. */
const colStyles: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  12: "grid-cols-4 md:grid-cols-8 lg:grid-cols-12",
};

const gapStyles: Record<GridGap, string> = {
  none: "gap-0",
  sm: "gap-4",
  md: "gap-6 md:gap-8",
  lg: "gap-8 md:gap-12",
};

export function Grid({
  as: Tag = "div",
  cols = 12,
  gap = "md",
  className,
  children,
}: GridProps) {
  return (
    <Tag className={cn("grid", colStyles[cols], gapStyles[gap], className)}>
      {children}
    </Tag>
  );
}
```

### components/ui/index.ts (barrel)

```tsx
export { Button } from "./button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./button";
export { Badge } from "./badge";
export type { BadgeProps, BadgeVariant } from "./badge";
export { Card, CardHeader, CardBody, CardFooter } from "./card";
export type { CardProps, CardSlotProps } from "./card";
export { Container } from "./container";
export type { ContainerProps, ContainerSize } from "./container";
export { Divider } from "./divider";
export type { DividerProps } from "./divider";
export { Grid } from "./grid";
export type { GridProps, GridCols, GridGap } from "./grid";
export { Heading } from "./heading";
export type { HeadingProps, HeadingLevel, HeadingSize } from "./heading";
export { Input } from "./input";
export type { InputProps } from "./input";
export { Label } from "./label";
export type { LabelProps } from "./label";
export { Section } from "./section";
export type { SectionProps, SectionSpacing } from "./section";
export { Stack } from "./stack";
export type {
  StackProps,
  StackDirection,
  StackGap,
  StackAlign,
  StackJustify,
} from "./stack";
export { Surface } from "./surface";
export type { SurfaceProps, SurfaceElevation } from "./surface";
export { Text } from "./text";
export type { TextProps, TextSize, TextTone } from "./text";
export { Textarea } from "./textarea";
export type { TextareaProps } from "./textarea";
```

## 5. Refactor: dogfood the system

`components/layout/container.tsx` from Phase 01 is **removed** (consolidated into `components/ui/container.tsx`). `placeholder-screen.tsx` is rewritten to consume the new primitives — proving the system and removing bespoke markup:

### components/ui/placeholder-screen.tsx

```tsx
import { Section } from "@/components/ui/section";
import { Stack } from "@/components/ui/stack";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface PlaceholderScreenProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PlaceholderScreen({
  eyebrow,
  title,
  description,
}: PlaceholderScreenProps) {
  return (
    <Section spacing="lg" className="flex min-h-[70vh] items-center">
      <Stack gap="md" align="start">
        <Badge variant="outline">{eyebrow}</Badge>
        <Heading level={1} size="display">
          {title}
        </Heading>
        {description ? (
          <Text size="lg" className="max-w-xl">
            {description}
          </Text>
        ) : null}
      </Stack>
    </Section>
  );
}
```

## 6. UI library folder structure

```
components/
└─ ui/
   ├─ index.ts            # barrel export (single import surface)
   ├─ badge.tsx
   ├─ button.tsx
   ├─ card.tsx            # Card + CardHeader/Body/Footer
   ├─ container.tsx
   ├─ divider.tsx
   ├─ grid.tsx
   ├─ heading.tsx
   ├─ input.tsx
   ├─ label.tsx
   ├─ placeholder-screen.tsx
   ├─ section.tsx
   ├─ stack.tsx
   ├─ surface.tsx
   ├─ text.tsx
   └─ textarea.tsx
lib/
├─ design/
│  ├─ tokens.ts           # z-index, icon px, control sizes, JS breakpoints
│  └─ styles.ts           # shared focus/transition class fragments
└─ animation/
   └─ tokens.ts           # motion tokens (values only)
```

## 7. Reusable components created

| Component | Variants / key props | A11y |
| --- | --- | --- |
| **Button** | `variant`: primary/secondary/ghost/link • `size`: sm/md/lg • native button attrs • ref | focus ring, disabled state, default `type=button` |
| **Container** | `size`: narrow/content/max • `as` | semantic `as` |
| **Section** | `spacing`: sm/md/lg • `containerSize`  • `bleed`  • `as` | renders `<section>` landmark |
| **Heading** | `level` 1–6 (semantic) • `size` sm→display • `as` | level decoupled from size for correct order |
| **Text** | `size` xs→xl • `tone`: primary/muted/subtle/accent • `as` | — |
| **Badge** | `variant`: solid/outline/muted | — |
| **Card** (+Header/Body/Footer) | `elevation`: flat/raised/floating • `interactive` | composable slots |
| **Surface** | `elevation`  • `bordered`  • `as` | base panel |
| **Input** | `invalid`  • native input attrs • ref | `aria-invalid`, focus ring |
| **Textarea** | `invalid`  • `rows`  • native attrs • ref | `aria-invalid`, focus ring |
| **Label** | `required`  • native label attrs | pairs via `htmlFor`; required marker `aria-hidden` |
| **Divider** | `orientation`: horizontal/vertical | `role=separator`  • `aria-orientation` |
| **Stack** | `direction`  • `gap`  • `align`  • `justify`  • `wrap`  • `as` | — |
| **Grid** | `cols`: 1/2/3/4/6/12 (responsive) • `gap`  • `as` | — |

All are strict-typed, dark-theme native (token-driven), variant-based via typed `Record` maps (no new deps), and responsive.

## 8. How future sections will consume these

Sections (Phase 03+) import only from the `@/components/ui` barrel and compose primitives — never raw HTML/utilities for layout, type, or color. Example shape of a future section (illustrative, **not** built this phase):

```tsx
import { Section, Grid, Stack, Heading, Text, Badge, Button } from "@/components/ui";

export function AboutSection({ heading, body }: { heading: string; body: string }) {
  return (
    <Section spacing="lg" containerSize="content">
      <Stack gap="lg">
        <Badge variant="muted">About</Badge>
        <Heading level={2} size="xl">{heading}</Heading>
        <Text size="lg">{body}</Text>
        <Button variant="secondary">Discover more</Button>
      </Stack>
    </Section>
  );
}
```

Benefits: spacing/type/color stay consistent automatically; a token change in `globals.css` propagates everywhere; sections receive content as props (CMS-ready per Spec §13); motion tokens are ready for GSAP/Framer Motion wiring in later phases.

## 9. Verification (run before approving)

```bash
npm run type-check   # 0 errors (strict)
npm run lint         # 0 errors
npm run format:check
npm run build        # succeeds
npm run dev          # routes render via refactored primitives
```

## 10. Scope confirmation

**Built:** full token set (color, type, spacing, grid, breakpoints, radius, shadow, z-index, motion values, container widths, icon/component sizing, theme utilities) + 14 reusable primitives + barrel + dogfooded placeholder screen.

**Deliberately NOT built:** hero, navbar, footer, GSAP/ScrollTrigger/Lenis, three.js, CMS, API routes, contact forms, project cards, gallery, homepage sections.

Maps to roadmap tasks **P02-001 → P02-006** in the [task database](Luxury%20Real%20Estate%20Website%20%E2%80%94%20Implementation%20Tasks%2028e9cfcefcbc4a7f990ab5be1feb7f17.md).