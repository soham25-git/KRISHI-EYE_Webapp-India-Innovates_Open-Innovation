# 🏗️ System Architecture

## High-Level Flow

```mermaid
graph LR
    subgraph Clients
        Mobile[Mobile App<br/>Expo 55]
        Web[Web Dashboard<br/>Next.js 16]
    end
    subgraph Backend
        API[NestJS 11 API]
        AI[FastAPI RAG Service]
    end
    subgraph AI Pipeline
        CV[CV Models]
        KB[PGVector Knowledge Base]
    end
    Mobile --> API
    Web --> API
    API --> AI
    AI --> CV
    AI --> KB
```

## Request Flow

```mermaid
sequenceDiagram
    participant F as Farmer (Mobile/Web)
    participant API as NestJS API
    participant AI as FastAPI AI Service
    participant CV as Vision Pipeline
    participant KB as Knowledge Base

    F->>+API: Upload crop image / Ask question
    API->>+AI: Forward to AI service
    AI->>CV: Run vision pipeline
    CV-->>AI: Segmentation + classification results
    AI->>KB: RAG retrieval for advisory
    KB-->>AI: Relevant ICAR/KVK documents
    AI-->>-API: Detection results + grounded advisory
    API-->>-F: Heatmap + treatment plan + sources
```

## Computer Vision Pipeline

| Stage | Model | Input | Output |
|-------|-------|-------|--------|
| 1. Leaf Segmentation | YOLOv8n-seg | Field image | Individual leaf masks |
| 2. Infection Classification | MobileNetV2 | Cropped leaf | Disease type + confidence |
| 3. Lesion Segmentation | U-Net | Infected leaf | Precise lesion boundaries |
| 4. Spray Planning | Heatmap algorithm | Detection map | 6-lane boom spray pattern |

## Advisory Pipeline

The AI service uses a RAG (Retrieval-Augmented Generation) architecture:
- Verified agricultural knowledge from ICAR, KVK, and CIBRC sources
- Vector similarity search via PGVector
- Grounded responses with explicit source citations and confidence scores
- Safety boundary: abstains and routes to local KVK when knowledge is insufficient
