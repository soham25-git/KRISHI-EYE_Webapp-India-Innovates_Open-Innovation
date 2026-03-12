# KRISHI-EYE — Content Security Policy (CSP)

> **Status:** Specification
> **Goal:** Eliminate XSS, clickjacking, and data-exfiltration vectors.

## 1 — Baseline Directives (P0)

Required for **production** environment:

```text
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' https://api.krishieye.app;
font-src 'self' data: https:;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
object-src 'none';
manifest-src 'self';
worker-src 'self' blob:;
upgrade-insecure-requests;
report-uri /api/v1/csp-report;
```

## 2 — Environment-Specific Variations

| Source | Local (Dev) | Staging | Production |
|--------|-------------|---------|------------|
| `connect-src` | `localhost:*` | `staging.krishieye.app` | `api.krishieye.app` |
| `script-src` | `'unsafe-eval'` (Hot Reload) | `'self'` | `'self'` |
| `img-src` | `*` (placeholders) | `self, data:, https:` | `self, data:, https:` |

## 3 — Map-Specific Considerations (Leaflet/MapLibre)
If using external tilesets or assets (e.g., Google Maps/OpenStreetMap):
- `img-src` must include tileset domains: `*.tile.openstreetmap.org`, `*.google.com`, `*.gstatic.com`.
- `connect-src` must include vector tile endpoints.

## 4 — Deployment checklist
- [ ] Add `Content-Security-Policy` header to all HTML responses.
- [ ] Implement `POST /api/v1/csp-report` endpoint for violation monitoring.
- [ ] Start in `Report-Only` mode for initial 7 days of staging.
- [ ] Switch to enforcement after log verification of zero legitimate blocks.

---

> [!NOTE] 
> No **inline scripts** (`<script>...</script>`) or **inline handlers** (`onclick="..."`) are permitted. Use event listeners and external `.js` files exclusively.
