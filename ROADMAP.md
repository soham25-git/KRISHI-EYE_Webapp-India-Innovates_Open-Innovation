# KRISHI-EYE — Security Implementation Roadmap

## Phase 1: Security Specification (Laying the Foundation)
- [x] Create `docs/authorization-matrix.md` to define BOLA/BFLA guards (S-01, S-05)
- [x] Create `docs/rate-limit-policy.md` for consistent throttling (S-13)
- [x] Create `docs/csp-policy.md` for web frontend (S-11)
- [x] Create `docs/data-retention-policy.md` for DPDP compliance (S-09, S-10, S-25)

## Phase 2: AI Service Hardening (Immediate Fixes)
- [x] Protect `/admin/ingest` with internal auth dependency (S-02)
- [x] Implement SSRF-safe URL validator for ingest service (S-18)
- [x] Implement basic instruction-boundary sanitization for prompt inputs (S-07)

## Phase 3: Backend (NestJS) Security (Wait for initialization)
- [ ] Implement `OwnershipGuard` with BOLA enforcement (S-01)
- [ ] Implementation of OTP rate limiting and lockout (S-04)
- [ ] Implementation of Refresh Token rotation (S-06)
- [ ] Implementation of Demo/Reset endpoint environment gating (S-03)
- [ ] Implementation of Admin MFA/Step-up placeholder (S-02)

## Phase 4: Web Frontend Security (Next.js)
- [ ] Configure `Content-Security-Policy` in `next.config.js` or middleware (S-11)
- [ ] Implementation of secure cookie handling and CORS (S-8, S-12)
- [ ] Implementation of offline cache encryption placeholder (S-14)

## Phase 5: Verification
- [ ] Audit-log verification for critical actions (S-20)
- [ ] Run security test checklist (from review)
