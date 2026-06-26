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
