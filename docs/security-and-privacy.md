# Security and Privacy

## Security goals
- Protect farmer identity, farm data, contact history, and advisory logs
- Minimize stored personal data
- Prevent unauthorized access across farms and users
- Protect APIs from abuse, scraping, and misconfiguration
- Build privacy and trust into the product from day one

## Data classification
- Public: organization directory metadata that is intentionally public
- Internal: demo datasets, non-sensitive analytics aggregates
- Sensitive: user identity, phone number, farm location, advisory history, support tickets
- Restricted: admin credentials, secrets, API keys, audit data

## Authentication
- Use OTP-based login for users
- Use short-lived access tokens and refresh tokens
- Hash refresh tokens in the database
- Support session revocation
- Add device/session visibility for users and admins

## Authorization
- Use role-based access control across farmer, staff, admin, and support roles
- Enforce farm-level authorization checks on every farm, field, job, and ticket endpoint
- Never trust client-side role checks alone
- Use server-side ownership validation for all object IDs

## API protections
- Rate-limit login, OTP, AI chat, and telemetry/demo endpoints
- Validate all request bodies with strict DTO/schema validation
- Enforce pagination and query limits
- Prevent mass assignment by allowlisting writable fields
- Use idempotency where duplicate submissions are possible
- Maintain a clear API inventory and versioning strategy

## Web protections
- Enforce HTTPS in production
- Add strict security headers
- Add Content-Security-Policy
- Add secure cookie settings when cookies are used
- Restrict CORS to approved origins only
- Sanitize rich text and user-generated content
- Avoid inline scripts wherever possible

## Mobile protections
- Store tokens in secure storage, not plain local storage
- Do not cache sensitive secrets in logs
- Mask sensitive fields in debug screens
- Use certificate pinning later if needed for production-hardening

## Data protections
- Encrypt data in transit
- Encrypt sensitive data at rest where feasible
- Hash tokens and secrets
- Rotate secrets and API keys
- Back up databases regularly
- Test restore procedures, not only backup creation

## Logging and monitoring
- Keep audit logs for admin actions and sensitive record changes
- Log authentication, permission failures, and suspicious activity
- Avoid logging sensitive payload contents unnecessarily
- Set alerts for repeated failures, abuse spikes, and unusual access patterns

## AI and knowledge security
- Track knowledge source provenance
- Restrict who can upload or activate knowledge sources
- Review and moderate source content before production use
- Log model outputs for evaluation with privacy-aware storage
- Prevent prompt injection from untrusted external content during retrieval

## Privacy and compliance posture
- Ask for clear consent where personal or advisory history is stored
- Keep privacy policy and consent versions tracked
- Support account deletion or data removal workflows later
- Retain only data that has product value
- Publish a clear explanation of why data is collected

## Secure development workflow
- Use environment variables for secrets
- Never commit secrets to the repository
- Run dependency checks regularly
- Use separate dev, staging, and production environments
- Gate production deploys through CI checks
- Review API changes for auth and object-level access impact

## Security MVP checklist
- [ ] HTTPS enforced
- [ ] CSP configured
- [ ] CORS allowlist configured
- [ ] Access and refresh token flow implemented
- [ ] Role and ownership checks covered in tests
- [ ] Rate limits added
- [ ] Input validation enabled
- [ ] Audit logs created
- [ ] Secrets isolated from repo
- [ ] Backups enabled
- [ ] Admin routes protected
