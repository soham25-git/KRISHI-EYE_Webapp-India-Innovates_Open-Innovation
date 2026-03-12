# KRISHI-EYE Web Frontend Shell Specification

## Overview
Build the Expo-ready, premium dark-themed web frontend shell for the KRISHI-EYE platform.

## Approved Features & Requirements
1. **Next.js App Router** initialized in `apps/web`.
2. **Tailwind CSS & shadcn/ui** default configuration.
3. **App-level UI boundaries:** `loading.tsx`, `error.tsx`, and `not-found.tsx`.
4. **Middleware:** `middleware.ts` placeholder for future protected routes.
5. **Theme Tokens:** `lib/theme` or `lib/design-tokens` for shared dark-theme tokens (avoiding pure black, large touch-friendly controls).
6. **Common UI Components:**
   - `components/map`: Tractor playback, route trail, heat legend, replay controls, reduced-motion handling.
   - `components/charts`: Reusable analytics graphs.
   - `components/common`: Offline-banner, empty-state, and error-state components.
7. **Mock Data:** `lib/mock-data` for seeded telemetry, jobs, analytics, support contacts, and AI sample content.
8. **Core Pages (Responsive Desktop + Mobile Web):**
   - Dashboard (`/dashboard`)
   - Map (`/map`)
   - Analytics (`/analytics`)
   - Help Directory (`/help`)
   - Ask AI (`/ask-ai`)

## Current Status
- Spec Finalized.
- Proceeding to initialization.
