# Production Dockerfile for NestJS API
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo config
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/ ./packages/

# Install dependencies (ignoring scripts to avoid premature prisma generate if schema is missing)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy the rest of the backend source
COPY apps/api/ ./apps/api/

# Generate prisma client & build
WORKDIR /app/apps/api
RUN npx prisma generate
RUN pnpm run build

# Production Stage
FROM node:20-alpine AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built assets
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

WORKDIR /app/apps/api

ENV NODE_ENV=production

# Start the NestJS backend (Render requires 0.0.0.0 binding, handled in main.ts)
CMD ["node", "dist/main.js"]
