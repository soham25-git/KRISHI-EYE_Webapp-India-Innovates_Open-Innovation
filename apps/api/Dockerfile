# Production Dockerfile for NestJS API
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/
RUN pnpm install --no-frozen-lockfile --ignore-scripts
COPY apps/api/ ./apps/api/
WORKDIR /app/apps/api
RUN npx prisma generate
RUN pnpm run build
FROM node:20-alpine AS production
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
RUN pnpm install --prod --no-frozen-lockfile --ignore-scripts
EXPOSE 3000
CMD ["node", "apps/api/dist/main"]
