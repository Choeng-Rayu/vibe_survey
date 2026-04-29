# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for Next.js 16.2.4 with standalone output
# Node.js 20 Alpine base for minimal image size

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# Install dependencies only when needed
# -----------------------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies for native module compilation
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies using npm ci for deterministic builds
# --omit=dev ensures only production dependencies are installed in this stage
RUN npm ci --omit=dev --legacy-peer-deps

# -----------------------------------------------------------------------------
# Stage 2: Builder
# Build the application with full dependencies (including devDependencies)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies for native module compilation
RUN apk add --no-cache libc6-compat

# Copy package files and install all dependencies (including dev)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Build the Next.js application
# This creates the standalone output in .next/standalone
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 3: Runner
# Production image, copy all the files and run next
# -----------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output from builder
# Next.js 16 standalone output includes server.js and minimal node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose the application port
EXPOSE 3002

# Start the Next.js server using the standalone server.js
# This is the optimal way to run Next.js 16+ in production
CMD ["node", "server.js"]
