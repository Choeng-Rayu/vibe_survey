import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build output configuration
  output: 'standalone',
  
  // Image optimization configuration - Updated for Next.js 16
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // Turbopack configuration for Next.js 16
  turbopack: {},
};

export default nextConfig;
