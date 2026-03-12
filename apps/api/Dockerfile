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

# Production Stage
FROM node:20-alpine AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo structure needed for production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

WORKDIR /app/apps/api

ENV NODE_ENV=production

# Run Prisma migrations then start the API
# 0.0.0.0 binding is handled in main.ts for Render port detection
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
