# Production Dockerfile for NestJS API
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo config + workspace packages
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/

# Install all dependencies (including dev for build tooling)
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Copy backend source
COPY apps/api/ ./apps/api/

# Generate prisma client & build
WORKDIR /app/apps/api
RUN npx prisma generate
RUN pnpm run build

# ---- Production Stage ----
FROM node:20-alpine AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo structure (no node_modules — we reinstall fresh to avoid broken pnpm symlinks)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

# Install production deps fresh (fixes pnpm symlink issue)
RUN pnpm install --prod --no-frozen-lockfile --ignore-scripts

# Generate Prisma client in production image
WORKDIR /app/apps/api
RUN npx prisma generate

ENV NODE_ENV=production

# Run migrations then start (0.0.0.0 binding handled in main.ts)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
