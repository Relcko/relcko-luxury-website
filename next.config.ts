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
