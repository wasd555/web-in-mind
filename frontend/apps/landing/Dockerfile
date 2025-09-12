# syntax=docker/dockerfile:1.7

# Multi-stage build for Next.js (standalone) inside a Turborepo monorepo

ARG NODE_VERSION=20.18.1

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

# Install OS deps
RUN apk add --no-cache libc6-compat bash

# Enable corepack and pnpm/npm if needed; project uses npm per root packageManager
RUN corepack enable || true

# Copy manifests from the monorepo root (which is under ./frontend)
COPY frontend/package.json ./frontend/package.json
COPY frontend/package-lock.json ./frontend/package-lock.json
COPY frontend/turbo.json ./frontend/turbo.json

# Copy workspace manifests for landing app and packages to compute install graph
COPY frontend/apps/landing/package.json ./frontend/apps/landing/package.json
COPY frontend/packages/ui/package.json ./frontend/packages/ui/package.json
COPY frontend/packages/eslint-config/package.json ./frontend/packages/eslint-config/package.json
COPY frontend/packages/typescript-config/package.json ./frontend/packages/typescript-config/package.json


FROM base AS deps
# Install dependencies from the frontend workspace root to support workspaces
WORKDIR /app/frontend
RUN npm ci --no-audit --no-fund


FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Bring node_modules from deps
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules

# Copy full repository needed for build
COPY . .

# Build only the landing app
WORKDIR /app/frontend/apps/landing

# Ensure Next standalone output
RUN npm run build


FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# For Next.js standalone output
# .next/standalone contains node_modules and server code
COPY --from=builder /app/frontend/apps/landing/.next/standalone ./
COPY --from=builder /app/frontend/apps/landing/.next/static ./frontend/apps/landing/.next/static
COPY --from=builder /app/frontend/apps/landing/public ./frontend/apps/landing/public

# Expose port used by Next start
EXPOSE 3000

# Start the server
CMD ["node", "frontend/apps/landing/server.js"]


