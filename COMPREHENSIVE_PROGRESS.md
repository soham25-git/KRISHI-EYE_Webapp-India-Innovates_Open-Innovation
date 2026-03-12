# KRISHI-EYE: Comprehensive Project Progress & Audit Report

> **Generated on:** 2026-03-11
> **Location:** `c:\Files\KRISHi-EYE\Webapp\`
> **Status:** Entering Production-Readiness / Hardening Phase

---

## 1. Project Vision (What We Wanted to Build)

**The Objective:**
To build **KRISHI-EYE**, a centralized, edge-computing intelligence platform for modern agriculture. The system is designed to allow farmers and fleet operators to monitor autonomous/semi-autonomous IoT tractors, view real-time telemetry, track agricultural threats (like fungi and nematodes), schedule jobs, and interact with an AI-driven agronomic advisory service.

**Target Architecture:**
- **Web App (`apps/web`)**: The primary web-based command center for fleet operators. Built with Next.js App Router, Tailwind CSS, and shadcn/ui on a premium dark theme.
- **Mobile App (`apps/mobile`)**: An Android-first, offline-ready native app for field workers built in Expo (React Native).
- **Backend API (`apps/api`)**: The unified global relator. Built in NestJS, utilizing PostgreSQL (via Prisma ORM), handling JWT auth, role-based access, and IoT data ingestion.
- **AI Service (`apps/ai-service`)**: A Python/FastAPI microservice providing RAG-backed LLM insights for crop disease queries and hardware troubleshooting.
- **Monorepo Architecture**: Utilizing `pnpm` workspaces for shared packages (`@farmer-platform/types`, `@farmer-platform/ui`).

---

## 2. Minute Details of What We Have Built & Accomplished

### A. Architectural & Foundational Refactoring
- **Codebase Migration & Cleanup**: Cleaned the entire workspace to adhere to professional GitHub standards. Stripped old reference files, generated a `.gitignore`, and completely mapped the project into `ARCHITECTURE.md` and `STACK.md`.
- **Global Branding Standardization**: Executed deep repository sweeps to dynamically rename the platform from "KRISHi-EYE" (inconsistent casing) to **"KRISHI-EYE"** across all SQL migrations, React components, Next.js metadata, and mock datasets.
- **ORM Reformation**: Successfully transitioned the NestJS backend from a legacy TypeORM implementation to a modern **Prisma** schema. 
- **Security Scaffolding (Phase 1 & 2)**: 
  - Drafted comprehensive security docs (`authorization-matrix.md`, `csp-policy.md`, etc.).
  - Configured ThrottlerModule for rate-limiting.
  - Initialized `OwnershipGuard`, custom decorators (`@Roles()`), and basic instruction-boundary sanitization for the AI ingest service.

### B. Web Frontend Delivery (`apps/web`)
- **Web Shell Scaffolded**: Next.js 16 (React 19) shell successfully built with strict responsive boundaries (`loading.tsx`, `error.tsx`, `not-found.tsx`).
- **Authentication UX Upgrades**:
  - Implemented a robust **Phone Normalizer** algorithm (`normalizePhone`) natively catching dashed, spaced, and mismatched Indian country codes (e.g., converting `99999 99999`, `+91 9999999999`, and `919999999999` directly to `+91XXXXXXXXXX`).
  - Implemented UX notification boxes explicitly clarifying the demo status of the OTP service ("Live SMS is resting, use `123456`").
- **Dashboard & Routing Fixes**: Prevented an infinite `404 Not Found` redirection loop by safely deleting the conflicting `src/app/page.tsx` shadowing the `(dashboard)` route group. 
- **The Heatmap Simulator (Crown Jewel)**:
  - Discarded the generic random-walk grid and built a fully custom **Row-Based Field Heatmap** (`FarmHeatmap`).
  - **Boustrophedon Traversal**: The tractor dynamically drives up a row, shifts, and drives down the next row, authentically replicating a physical boom sprayer.
  - **Fog of War & Scanning**: Plots naturally transition from "Unscanned" to "Scanned" via an advanced Camera Field-of-View (FOV) detection algorithm that peeks 3 blocks ahead of the moving tractor.
  - **Treatment Boom**: As the tractor passes over the 6 distinct infection classes (Fungi, Bacteria, Virus, Phytophthora, Pests, Nematodes), it flags them as "Treated", overlaying a checkmark while preserving the historical crop-health diagnosis in the hover inspector.
  - Rebranded telemetry on the dashboard to speak the farmer's language (e.g., "Acres Scanned", "Treatment Efficiency").

---

## 3. What Needs Further Improvement (Remaining Debt)

### Backend & API
1. **Live SMS/OTP Hookup**: The authentication system completely relies on a mock generation returning `123456`. A real provider (Twilio/AWS SNS) must be integrated into `auth.service.ts`.
2. **Telemetry Sockets**: The `FarmHeatmap` UI is brilliant but purely hallucinatory (it relies on a React `setInterval`). The backend must be configured to emit live `Socket.io` coordinates from physical tractors, which the frontend must subscribe to natively.
3. **TypeORM Purge**: Some legacy `@InjectRepository` or `package.json` TypeORM dependencies are still hovering in the background following the Prisma migration. These must be aggressively purged to reduce bundle size and startup conflict risks.
4. **Security Hardening (Phase 3 & 4)**: We still need to migrate from `localStorage` JWTs to **HTTP-Only Secure Cookies**, implement Refresh Token rotation, and enforce Next.js `Content-Security-Policy` headers.

### Mobile Application
1. **Data Binding**: The Expo Android shell was scaffolded (Tab navigation, offline banners, core screens) but is entirely disjointed from the NestJS backend. We must bind API calls via `Axios`/`fetch` to populate the real Dashboard and AI chats.

---

## 4. Current Issues We Are Facing

1. **Automation Environment Instability (`target closed: EOF`)**: The internal Playwright subagent responsible for capturing browser screenshots and executing complex DOM checks has suffered catastrophic port-binding crashes locally (`http://localhost:8081`). Moving forward, standard browser verification must mostly rely on physical developer interaction or strict unit tests rather than pixel-based automation until it stabilizes.
2. **Environment Variable Parity**: The Next.js frontend currently aims blindly for `http://localhost:3000`. `NEXT_PUBLIC_API_URL` needs to be consistently loaded and managed to prevent `ERR_CONNECTION_REFUSED` when services boot out of order.
3. **Seed Data Drift**: As the `FarmHeatmap` gets more complex, the backend Prisma seeds need to be updated to match the 16x8 row-based geometries and 7-class health enum structures expected by the frontend UI. 

---

### Conclusion
KRISHI-EYE has advanced dramatically from an architectural ideation phase to a fully tactile, locally stabilized, highly polished application. The database is upgraded, the security parameters are mapped, and the frontend prototype accurately reflects multi-million dollar precision-agriculture software. 

**Next Immediate Focus Goal:** 
Connect the NestJS Backend deeply to the Next.js Frontend via authenticated APIs, followed directly by Vercel/Render deployment orchestration.
