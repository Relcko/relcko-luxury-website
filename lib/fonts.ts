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
