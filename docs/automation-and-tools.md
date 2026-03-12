# Free-First Automation and Tools

## Core development
- GitHub Free for repo, issues, and projects
- GitHub Actions for CI/CD
- pnpm + Turborepo for monorepo management
- Docker for local database and service setup

## Automation
- n8n self-hosted for free workflows
- Use n8n for support contact imports, scheduled syncs, alerts, and admin workflows (See: [n8n Specs](file:///c:/Files/KRISHI-EYE/Webapp/automation/workflows/n8n-specs.md))
- Use GitHub Actions for tests, preview builds, linting, type checks, and security scans (See: [.github/workflows](file:///c:/Files/KRISHI-EYE/Webapp/.github/workflows/))
- Use cron jobs or scheduled workflows for demo-data reseeding and ingestion refreshes

## Design and prototyping
- Figma free tier for wireframes and polished mockups
- Figma Community for dashboard, map, and mobile UI inspiration
- Excalidraw for flows and architecture sketches
- Storybook for component previews

## Content and data ops
- Google Sheets as a temporary admin-friendly source for seeded support contacts
- n8n workflow: Sheet or CSV -> backend API import
- Markdown docs in repo for prompt-driven AI development

## Quality and testing
- Playwright for web E2E testing
- Expo emulator/device testing for mobile
- Bruno or Postman for API testing
- ESLint, Prettier, and TypeScript checks
- Dependency scanning with free GitHub tools or open-source scanners
- Scheduled health checks and security audits (See: [Automation Design Spec](file:///C:/Users/soham/.gemini/antigravity/brain/15c0b585-b29d-44ac-90d6-8b8e01f0a670/automation_design_spec.md))

## Suggested workflow split
- Antigravity for scaffolding and specialist implementation
- GitHub Actions for verification and scheduled monitoring
- n8n for recurring admin automations and data syncs
- Manual review for AI answer quality, security, and UX polish
