import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import { ThemeProvider } from "@/providers/theme-provider";
import { AnimationProvider } from "@/providers/animation-provider";
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
      <head>
        {/* Warm up the CMS image CDN before the poster request fires. */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body>
        <ThemeProvider>
          <AnimationProvider>
            <main id="main-content">{children}</main>
          </AnimationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
