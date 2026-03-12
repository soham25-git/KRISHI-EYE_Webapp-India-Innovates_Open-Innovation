# 🛠️ Technology Stack

## Mobile App (`apps/mobile`)
- Expo React Native
- Tab-based navigation (Home, Map, Ask, Help, Profile)
- Offline-first local data layer
- Dark theme with large touch targets

## Web Dashboard (`apps/web`)
- Next.js 14.2 (App Router)
- Tailwind CSS + shadcn/ui
- PWA-ready
- Responsive layout (desktop + mobile viewport)

## Backend API (`apps/api`)
- NestJS 11 (modular architecture)
- Prisma ORM (PostgreSQL)
- JWT authentication (HttpOnly secure cookies)
- CORS + rate limiting + Helmet security headers

## AI Service (`apps/ai-service`)
- FastAPI (async, high-throughput)
- RAG pipeline with PGVector
- Grounded advisory with source citations
- Safety abstention boundary

## Computer Vision Models
- YOLOv8n-seg — leaf segmentation
- MobileNetV2 — infection classification
- U-Net — lesion area segmentation

## Deployment

| Service | Platform | Root Dir | Key Env Vars |
|---------|----------|----------|--------------|
| Mobile | Expo (EAS Build) | `apps/mobile` | `API_URL` |
| Web | Vercel | `apps/web` | `NEXT_PUBLIC_API_URL` |
| API | Render | `apps/api` | `DATABASE_URL`, `JWT_SECRET` |
| AI | Render | `apps/ai-service` | `LLM_API_KEY` |
