# 🛠️ Technology Stack

## Mobile App (`apps/mobile`)
- Expo 55 (React Native 0.83)
- Tab-based navigation (Home, Map, Ask, Help, Profile)
- Offline-first local data layer
- Dark theme with large touch targets

## Web Dashboard (`apps/web`)
- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4 + shadcn/ui
- PWA-ready
- Responsive layout (desktop + mobile viewport)

## Backend API (`apps/api`)
- NestJS v11 (modular architecture)
- Prisma ORM v5 (PostgreSQL)
- JWT authentication (HttpOnly secure cookies)
- CORS + Helmet security headers

## AI Service (`apps/ai-service`)
- FastAPI v0.110+ (async, high-throughput)
- RAG pipeline with PGVector
- Grounded advisory with source citations
- Safety abstention boundary

## Computer Vision Models
- YOLOv8n-seg — leaf segmentation
- MobileNetV2 — infection classification
- U-Net — lesion area segmentation

## Deployment

| Service | Platform | Root Dir | Typical Env Vars |
|---------|----------|----------|------------------|
| Mobile | Expo (EAS Build) | `apps/mobile` | `API_URL` |
| Web | Vercel | `apps/web` | `NEXT_PUBLIC_API_URL` |
| API | Render | `apps/api` | `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV` |
| AI | Render | `apps/ai-service` | `DATABASE_URL`, `LLM_API_KEY`, `ALLOWED_ORIGINS` |
