# Test Plan and Security Status

## 1. PostGIS and Vector Warnings
**Warning**: TypeORM provides `Point` and `Polygon` types in Postgres when the `postgis` extension is installed. The scaffold has used definitions like `@Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 })` for standard spatial integration.
However, `vector(1536)` mapping for AI chunks is non-standard. TypeORM natively treats this as raw text/varchar without the `pgvector` npm library or explicit raw SQL hooks.
**Expectation**: For complex spatial analysis (heatmaps, infection bounds checking, nearest neighbor vector search), you must fall back to explicit `Raw` query builders or `QueryRunner.query()` where TypeORM's DSL fails.

## 2. Object-Level Ownership
- **Goal**: Endpoints touching `:farmId`, `:fieldId`, `:jobId`, or `:ticketId` must not simply trust the parameter.
- **Test Matrix (TODO)**:
  - User A fetching Farm B details must fail with `403 Forbidden` (`OwnershipGuard`).
  - Farmer editing Field boundary belonging to a linked farm must pass `canActivate()`.
  
## 3. Storage and Revocation of Refresh Tokens
- **Goal**: Refresh tokens must never be stored in plain text.
- **Current Architecture**: The `Session` entity includes `refresh_token_hash`.
- **Implementation (TODO)**: 
  - On login: `refreshHash = bcrypt.hash(token)` -> DB
  - On refresh endpoint: Read hashed token from DB, `bcrypt.compare(token, hashedDbToken)` 
  - Revocation: Set `revoked_at` timestamp. Once revoked, `refresh` must hard-reject.

## 4. Field-Level Response Filtering
- `TransformInterceptor` exists to cleanly strip fields annotated with `@Exclude()` (e.g., password hashes, session secrets) before serialization, so they do not inadvertently leak onto public JSON outputs.

## 5. Security Sanity Checks
- [] Verify Swagger UI doesn't expose vector indices broadly.
- [] Ensure `DemoController` requires Admin role (Scaffold uses `Roles('admin', 'demo_manager')`).
- [] Verify Throttler TTL/limit is tuned appropriately for Telemetry high-volume batch routes.
