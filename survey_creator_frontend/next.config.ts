import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone mode for Docker - creates minimal server.js and static files
  output: 'standalone',

  // Disable Next.js telemetry in production
  telemetry: false,

  // Trailing slash configuration (adjust based on backend API expectations)
  trailingSlash: false,

  // Image optimization settings
  images: {
    unoptimized: false,
  },
};

export default nextConfig;
