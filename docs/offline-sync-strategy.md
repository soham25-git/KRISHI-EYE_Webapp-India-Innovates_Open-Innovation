# Offline & Sync Strategy (Web + Mobile)

## Goals
- Keep essential app screens usable in low-connectivity areas
- Cache support contacts, farm details, recent jobs, analytics summaries, and recent AI answers
- Provide a smooth demo experience even when network is weak

## Web PWA
- Cache the app shell and core assets
- Cache recent farm, field, job, analytics, and support responses
- Use cache-first for static assets
- Use stale-while-revalidate for read-heavy APIs
- Show a clear offline banner and last-synced timestamp
- Keep critical read views available even when disconnected

## Mobile app
- Persist user profile, farm list, field list, recent jobs, analytics summaries, support contacts, and recent advisory answers
- Queue low-risk writes such as feedback and ticket creation for later sync
- Preload seeded demo data for expo mode
- Allow a read-only fallback mode if sync is unavailable

## UX rules
- Never hide the offline/sync state
- Keep replay and analytics views available from cached data
- Show graceful empty states instead of generic errors
- Mark cached content with “last updated” timestamps
- Prevent confusing duplicate submissions with local pending indicators

## Technical notes
- Web: service worker + indexed storage for cached API payloads
- Mobile: local SQLite or equivalent persistence
- API sync should be idempotent where possible
- Analytics and demo payloads should be compressed if large
