// Prisma configuration for Prisma v7+
// Loads environment variables from .env and provides the connection URL for migrations.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  datasource: {
    // Prefer DIRECT_URL for direct connections (required for migrations with connection pooling).
    // Fall back to DATABASE_URL if DIRECT_URL is not defined.
    url: env("DIRECT_URL") ?? env("DATABASE_URL"),
  },
});
