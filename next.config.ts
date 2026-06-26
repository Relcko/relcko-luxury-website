import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Spec §8: serve modern formats by default.
    formats: ["image/avif", "image/webp"],
    // Tuned to responsive breakpoints (360 → 2560).
    deviceSizes: [360, 640, 768, 828, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images aggressively at the edge.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // CMS image host (Sanity).
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  experimental: {
    // Trim client bundles from heavy libs.
    optimizePackageImports: ["gsap", "split-type", "framer-motion", "@react-three/drei"],
  },
};

export default nextConfig;
