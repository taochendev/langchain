import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Better handling of client-side differences
  reactStrictMode: true,
  // Better development experience
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
