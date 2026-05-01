import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build output configuration
  output: 'standalone',
  
  // Development server configuration - Next.js uses 3003 for this app
  // Note: Port is set via package.json script or CLI, not in config

  // Image optimization configuration
  images: {
    domains: ['localhost'],
    remotePatterns: [],
  },

  // API route configuration
  api: {
    // Ensure proper API handling in standalone mode
    externalResolver: false,
  },

  // TypeScript configuration
  typescript: {
    // Skip type checking during production build
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Skip linting during production build
    ignoreDuringBuilds: false,
  },

  // Webpack configuration for standalone builds
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side webpack configuration
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
