# 🛠️ Technology Stack

## Frontend (apps/web)
- Next.js 14.2 (App Router)
- Tailwind CSS + shadcn/ui
- React Query (data fetching)
- PWA (offline-ready)

## Backend (apps/api)
- NestJS 10 (modular)
- Prisma ORM (PostgreSQL)
- JWT Auth
- CORS + Rate limiting

## AI Service (apps/ai-service)
- FastAPI (high-throughput)
- ONNX Runtime (YOLOv8/EfficientNet)
- PGVector (RAG vector store)
- Celery (async tasks)

## Deployment
| Service | Platform | Root Dir | Env Vars |
|---------|----------|----------|----------|
| Frontend | Vercel | apps/web | NEXT_PUBLIC_API_URL |
| Backend | Render | apps/api | DATABASE_URL |
| AI | Render | apps/ai-service | MODEL_PATH |
