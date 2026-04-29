# syntax=docker/dockerfile:1

# -----------------------------------------------------------------------------
# Stage 1: Build
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the NestJS application
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production
# -----------------------------------------------------------------------------
FROM node:20-alpine AS production

# Set NODE_ENV
ENV NODE_ENV=production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create app directory and set permissions
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create non-root user for security
# The node user (uid 1000) is provided by the node image
USER node

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
CMD curl -f http://localhost:3000/health || exit 1

# Start the application
# Note: For ESM with NodeNext, the output is dist/main.js
CMD ["node", "dist/main.js"]
