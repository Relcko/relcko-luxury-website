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
