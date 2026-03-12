# Repo Folder Structure (Web + App, Design-Heavy Demo Ready)

```text
farmer-platform/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── public/
│   │   ├── styles/
│   │   └── tests/
│   ├── mobile/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── storage/
│   │   └── tests/
│   ├── api/
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── farms/
│   │   │   ├── fields/
│   │   │   ├── tractors/
│   │   │   ├── jobs/
│   │   │   ├── telemetry/
│   │   │   ├── analytics/
│   │   │   ├── support/
│   │   │   ├── admin/
│   │   │   ├── ai-proxy/
│   │   │   └── common/
│   │   └── test/
│   └── ai-service/
│       ├── app/
│       │   ├── api/
│       │   ├── ingest/
│       │   ├── retrieval/
│       │   ├── rerank/
│       │   ├── answer/
│       │   ├── moderation/
│       │   └── common/
│       └── tests/
├── packages/
│   ├── ui/
│   ├── charts/
│   ├── maps/
│   ├── types/
│   ├── api-client/
│   ├── localization/
│   ├── config/
│   └── security/
├── docs/
│   ├── PRD_TODO.md
│   ├── repo-folder-structure.md
│   ├── database-schema.md
│   ├── api-routes.md
│   ├── design-system.md
│   ├── offline-sync-strategy.md
│   ├── ai-guardrails.md
│   ├── automation-and-tools.md
│   └── security-and-privacy.md
├── prompts/
│   ├── antigravity-orchestrator.md
│   ├── antigravity-frontend-web.md
│   ├── antigravity-frontend-mobile.md
│   ├── antigravity-backend-api.md
│   ├── antigravity-ai-systems.md
│   └── antigravity-automation-agent.md
├── infra/
│   ├── docker/
│   ├── ci-cd/
│   └── deployment/
├── scripts/
├── .env.example
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
└── README.md