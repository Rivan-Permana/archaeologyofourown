---
review: security threat model
target: ../ARCHITECTURE-SPINE.md (draft, 2026-11-18)
inputs: ../.memlog.md, PRD prd-archaeologyofourown-2026-11-17/prd.md (FR-11–FR-34)
date: 2026-11-18
method: trust boundaries + STRIDE, design-level (no code exists)
verdict: REVISE BEFORE BUILD — 1 critical, 5 high, 7 medium, 5 low
---

# Security review — Architecture Spine

## Verdict

The spine gets the big calls right: static public pages with no runtime D1, server-side Access JWT verification that fails closed, a private contributions bucket with no `r2.dev`, IP never persisted, uniform subscribe response, CSPRNG Reference Numbers, MPL-only BlockNote. It is not yet safe to build from, because one origin hosts both untrusted content (public pages, contributor uploads) and the Editor Dashboard, and the spine is silent on response headers, upload content typing, the build token's reach, and preview URLs. Each finding below ends with an AD-level fix that can be added to the spine.

## Trust boundaries

| # | Boundary | Untrusted input |
| --- | --- | --- |
| B1 | Internet → `POST /api/contribute`, `POST /api/subscribe` | multipart body, file bytes, filenames, declared MIME, Turnstile token, IP |
| B2 | Internet → `GET /media/*` | object key |
| B3 | Internet → `/admin/*`, `/api/admin/*` via Access | Access cookie/JWT, hostname (production, workers.dev, preview URLs) |
| B4 | Contributor data → Editor browser (review sheet, full-size photo, conversion canvas) | story, names, photos |
| B5 | D1 → build (`scripts/snapshot.ts`) → static assets | whatever the services return |
| B6 | Workers Builds environment (npm deps, build scripts) → Cloudflare API token | supply chain |
| B7 | Worker → Workers Logs, D1 Time Travel, old Worker versions | PII persistence |

## Findings

### [CRITICAL] S-1 Contributor upload can run script on the Dashboard origin (content-type confusion)

- **Threat (STRIDE: Elevation of privilege, Information disclosure):** AD-8 applies magic-byte checks only to `media.ingest()`; AD-9 says only "schema validation" for `/api/contribute`, and nothing fixes how private photos are served to Editors. The naive implementation stores `file.type` (attacker-chosen) as R2 `httpMetadata` and streams the object back with it. An attacker submits an HTML or SVG file (or a JPEG/HTML polyglot) declared as `text/html`/`image/svg+xml`. When the Editor opens the "full-size photo" (FR-30 workflow, so it is guaranteed to happen), the script runs on the same origin as `/api/admin/**`, the browser sends the `CF_Authorization` cookie, Access injects a valid JWT, and the script can export all Subscribers, read every Contribution, delete data or publish.
- **Location:** AD-8, AD-9; FR-12 ("verified from file contents") is not carried into AD-9.
- **Fix (amend AD-9 and AD-8):** Both `/api/contribute` and `media.ingest()` run one shared `sniffImage(bytes)` that accepts only JPEG/PNG/WebP by magic bytes and returns the server-derived MIME; the client-declared type and filename are discarded (store a generated key `uuid.ext`). Every response that returns stored bytes (`/media/*` and the admin photo route) sets the derived `Content-Type`, `X-Content-Type-Options: nosniff`, `Content-Security-Policy: default-src 'none'; img-src 'self'; sandbox`, and `Content-Disposition: inline; filename="<uuid>.<ext>"`. SVG is never accepted anywhere.

### [HIGH] S-2 Public pages and the Dashboard share one origin, so any public XSS is admin takeover

- **Threat (EoP):** Public pages, `/media/*` and `/admin` live on the same host. The Access cookie is host-scoped, so script running on any public page (BlockNote HTML, captions, alt text, credits, contributor text promoted via FR-31, a compromised island dependency) can call `/api/admin/**` with Editor rights when an Editor browses the public site, which they do after every publish. Static assets also bypass the Worker, so the spine sets no CSP, HSTS, `frame-ancestors` or `nosniff` for them.
- **Location:** AD-1 (`run_worker_first` excludes public paths), AD-6, AD-7; no AD covers response headers.
- **Fix (new AD "Response headers and origin isolation"):** (1) `public/_headers` for static assets and middleware for on-demand routes set a strict hash-based CSP (`script-src 'self' 'sha256-…'`, no `unsafe-inline`, `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'none'`), HSTS, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`. (2) When the custom domain is attached, serve the Dashboard on its own hostname (e.g. `admin.` subdomain routed to the same Worker) and put Access only on that host; record this as the planned end state in AD-1. (3) Inline data for islands (Artefact of the Day pool) goes in `<script type="application/json">` with `<` escaped, or a static JSON file, never string-built script.

### [HIGH] S-3 Preview URLs and old versions run with production bindings and outlive deletions

- **Threat (Information disclosure, Tampering):** The spine assumes previews are Access-protected and have no production bindings. On Workers, preview URLs (per version and per alias) run with the Worker's own bindings, i.e. production D1 and both R2 buckets, and are public unless Access is turned on for them. Any branch pushed to GitHub that Workers Builds builds becomes a public URL running unreviewed code against real PII. Version preview URLs also keep serving old static assets, so unpublished Articles, deleted Artefacts and removed contributor credits stay reachable after FR-22/FR-32 deletion.
- **Location:** Environments table ("Preview" row, both `[ASSUMPTION]`s), AD-1, AD-10.
- **Fix (amend AD-1):** Set `preview_urls: false` in `wrangler.jsonc` and disable non-production branch builds in Workers Builds for v1. If previews are needed later, they use a separate Worker name with its own D1/R2 seeded with Placeholder fixtures only. Enable Cloudflare Access on the `workers.dev` hostname for `/admin` and `/api/admin`, and put every future hostname (custom domain) into the same Access application so the pinned AUD stays valid; set `workers_dev: false` once the custom domain is live.

### [HIGH] S-4 Build token gives every npm dependency read access to all PII

- **Threat (Information disclosure, Supply chain):** AD-2 makes the build read remote D1 with a custom `CLOUDFLARE_API_TOKEN` (D1 read + Workers deploy). D1 token permissions are account-wide, not table- or database-scoped, so any dependency install script or build-time package (BlockNote → Tiptap/ProseMirror/Mantine, Astro integrations, `@blocknote/server-util`) can read the Subscribers and Contributions tables and deploy arbitrary code to the Worker. The snapshot also only needs published content.
- **Location:** AD-2, AD-3, Config and secrets row, memlog assumption on the build token.
- **Fix (amend AD-2):** The build gets no D1 permission. The Worker exposes `GET /api/build/snapshot` returning only the public DTO (S-5), authenticated by an Access service token (or a dedicated HMAC secret) that is set only in Workers Builds; `scripts/snapshot.ts` fetches it. The build token then needs only the Workers Builds default deploy scope. Add: committed lockfile, `npm ci`, exact versions, install scripts disabled except an explicit allowlist, and a ≥7-day age delay on dependency updates.

### [HIGH] S-5 Build snapshot has no public-field allowlist, and island props serialize whole objects into HTML

- **Threat (Information disclosure):** AD-2 says the snapshot holds "published content through the services layer", not which fields. Service read models will carry `created_by`/`updated_by` Editor emails, `source_contribution_id`, internal notes, draft translations of a published parent, and Reference Numbers. Astro serializes every prop passed to a `client:*` island into page HTML, so the Artefact of the Day pool would publish all of it. FR-31's "email never copied into the Artefact" does not cover Editor emails or internal links.
- **Location:** AD-2, AD-5 (translation-level vs parent-level publication status is unspecified).
- **Fix (amend AD-2):** Define public DTOs in `src/shared/public.ts` with Zod `.strict()` schemas (`PublicArticle`, `PublicArtefact`) listing allowed fields; the snapshot endpoint maps rows through them and includes a translation only when that translation is itself published. Islands receive only DTO fields they render. A post-build check fails the deploy if `dist/` contains `@` email patterns, `AOO-` Reference Numbers, or any file under `dist/**/admin`.

### [HIGH] S-6 The rate limit in AD-9 cannot be built with the Rate Limiting binding

- **Threat (Denial of service, abuse):** The Workers Rate Limiting binding supports periods of 10 or 60 seconds only and counts per Cloudflare location, so "5/hour" and "20/hour" (FR-15, FR-19 testable consequences) are not expressible and are trivially exceeded by hitting other locations. Keying on a full IPv6 address lets one host rotate through a /64. Order also matters: Turnstile is in the multipart body, so up to 50 MB is parsed before the token is checked. With 50 MB per submission, a few hundred passing submissions exhaust the R2 free tier and bury the review queue.
- **Location:** AD-9.
- **Fix (amend AD-9):** (1) Keep the binding as a burst limit (e.g. 2/60 s). (2) Enforce the hourly limit in one Durable Object keyed by `HMAC(daily-rotating secret, IPv4 or IPv6 /64)` with storage entries expiring by alarm at the window end, which keeps "IP used only within the window". (3) A global daily cap on Contributions and stored bytes. (4) Order: reject `Content-Length` > 51 MB → burst limit → Turnstile token sent in a request header and verified (check `success`, `hostname`, `action`) → only then read the body → hourly limit → validation. Verify the binding limits against current Cloudflare docs at setup.

### [MEDIUM] S-7 BlockNote HTML sanitisation is unspecified

- **Threat:** "Sanitises against the schema's allowed elements" names no library and no attribute/URL policy. `javascript:`/`data:` link hrefs, image `src` outside `/media/`, and the custom `catalogueRecord` render function (which takes contributor-derived text via FR-31) are the injection paths. The Dashboard preview (FR-27) must render through the same code, on the admin origin.
- **Location:** AD-6.
- **Fix:** One `renderBlocks()` in `src/shared/blocks.ts` used by build and preview: BlockNote → HTML → allowlist sanitizer (tags per block type, attributes per tag, `href` limited to `https:`, `mailto:`, same-site relative; `src` limited to `/media/`); custom blocks build output with escaped text nodes only. Rule: no `set:html`/`dangerouslySetInnerHTML` anywhere except `renderBlocks()` output.

### [MEDIUM] S-8 GPS check is a denylist and raw contribution photos keep location data

- **Threat:** "Rejects files carrying EXIF/XMP GPS" requires parsing JPEG APP1 (EXIF and XMP), PNG `eXIf`/`iTXt`, WebP `EXIF`/`XMP ` chunks; any miss publishes a location (FR-29). Client-side re-encoding is not a server control. Raw Contribution photos kept indefinitely hold contributors' home coordinates.
- **Location:** AD-8.
- **Fix:** `media.ingest()` rejects any image carrying any metadata segment or chunk outside a structural allowlist (JPEG: SOI/APP0/ICC APP2/DQT/SOF/DHT/SOS/EOI; PNG: critical chunks + `iCCP`/`sRGB`/`gAMA`/`pHYs`; WebP: `VP8*`/`ALPH`/`ICCP`/`ANIM*`). Same check on dimensions: reject above a pixel cap (e.g. 40 MP) in both contribute and ingest, which also stops decompression bombs that crash the conversion canvas (iOS Safari caps canvas area).

### [MEDIUM] S-9 CSRF on `/api/admin/**`

- **Threat:** The Access cookie is sent on cross-site requests depending on its SameSite setting; any admin endpoint that accepts form-encoded or `text/plain` bodies, or a state change via GET, is forgeable.
- **Location:** AD-7.
- **Fix:** Middleware on `/api/admin/**` rejects non-GET requests unless `Content-Type: application/json` and `Sec-Fetch-Site: same-origin` (fallback `Origin` equals the request host). No state change on GET. Set the Access application cookie to SameSite=Strict, HttpOnly, with binding cookie on.

### [MEDIUM] S-10 Access policy is the only authorization check

- **Threat:** AD-7 verifies the token but treats any valid token for the AUD as an Editor. A common Access misconfiguration (OTP with an "Everyone" include, a service-token policy added later) silently grants everyone with an email full PII access.
- **Location:** AD-7.
- **Fix:** Middleware also requires an `email` claim and checks it against an `EDITOR_EMAILS` secret (Worker secret, never in the repo); missing or mismatched fails closed. Path guard derives from the route (`/admin` and `/api/admin` after URL normalization, case-insensitive), plus each admin service function takes the verified actor as a required argument.

### [MEDIUM] S-11 Deletion is incomplete across copies

- **Threat:** FR-22/FR-32 deletion of a Contribution does not reach: photos copied into `MEDIA` and the Artefact created from it (FR-31), `activity_log` rows that name the subject, orphan R2 objects from a Worker killed between R2 write and D1 write (AD-9 cleanup only runs on caught errors), D1 Time Travel (up to 30 days), browser caches of `immutable` media, old Worker versions (S-3).
- **Location:** AD-4, AD-9, AD-10, Deferred (Backups).
- **Fix:** `contributions.delete()` lists linked Artefacts and requires the Editor to unpublish/delete them in the same flow, deletes their `MEDIA` objects and triggers a rebuild. `activity_log` stores entity type, id and action only, never emails, names or story text. `rebuilds.reconcile()` (rename to a general reconcile) deletes `CONTRIBUTIONS` objects older than 24 h with no row. Privacy note states Time Travel's retention window.

### [MEDIUM] S-12 Workers Logs may store IPs and Editor emails despite the convention

- **Threat:** Automatic invocation logs and uncaught-exception logs can carry request metadata and headers (`CF-Connecting-IP`, `Cf-Access-Jwt-Assertion` containing the Editor email) and Zod error messages that echo input values, contradicting AD-9's "never written to logs".
- **Location:** Errors and logging convention, AD-9.
- **Fix:** Set `observability.logs.invocation_logs: false` in `wrangler.jsonc`; wrap every route in one error handler that logs only `{ event, code, id }`; never log Zod issues or `Error.message` from parsing user input.

### [MEDIUM] S-13 Rebuild polling needs a runtime API token the spine does not scope

- **Threat:** AD-3 polls the Workers Builds API from the Worker, which needs a Cloudflare token at runtime. Reusing the build token would put deploy rights inside the request path.
- **Location:** AD-3, Config and secrets row.
- **Fix:** Separate secret `BUILDS_READ_TOKEN` with Workers Builds read only; `DEPLOY_HOOK_URL` treated as a secret (it triggers builds) and called only from `rebuilds.request()`.

### [MEDIUM] S-14 Contribute endpoint buffers up to 50 MB in a 128 MB isolate

- **Threat:** `request.formData()` on a 5×10 MB body plus magic-byte reads can exceed Worker memory and fail mid-write, leaving orphans (S-11).
- **Location:** AD-9.
- **Fix:** Stream each part to R2 (`put` with the part stream) after reading only the first bytes for sniffing, or upload photos one per request against a short-lived server-issued upload ticket created after Turnstile passes.

### [LOW] S-15 License gate is a rule, not a check

- **Location:** AD-6. **Fix:** CI step fails if the dependency tree contains `@blocknote/xl-*` or any GPL/AGPL license (license checker over the lockfile).

### [LOW] S-16 Reference Number must not become a credential

- **Location:** AD-5, FR-22. **Fix:** State that a Reference Number alone never authorizes withdrawal; the Editor confirms by replying to the stored address (From headers are spoofable).

### [LOW] S-17 Subscriber CSV export formula injection

- **Location:** FR-32 export. **Fix:** Prefix cells starting with `=`, `+`, `-`, `@`, tab or CR with `'`.

### [LOW] S-18 Prerendered admin pages would skip middleware

- **Location:** AD-7, source tree. **Fix:** Every `src/pages/admin/**` and `src/pages/api/**` exports `prerender = false`; the post-build check in S-5 fails on any `dist/**/admin` file.

### [LOW] S-19 `/media/*` key and scope

- **Location:** AD-8. **Fix:** Route validates the key against `^[0-9a-f-]{36}\.(jpg|png|webp)$` and reads only `MEDIA`; draft images in `MEDIA` are unguessable but public, so state that `MEDIA` holds "public or soon-public" images only.

## Positive observations

- Server-side JWT verification with pinned issuer and AUD, failing closed (AD-7).
- No public runtime database reads; public attack surface is three endpoints (AD-2).
- Private contribution bucket, no `r2.dev`, random keys (AD-8).
- IP never persisted, uniform subscribe response, non-sequential CSPRNG Reference Numbers (AD-5, AD-9).
- Editor allowlist kept out of the repo; neutral resource names; `.dev.vars` git-ignored; fixtures on `contoh.id`.
- Retention and deletion share service functions; R2-before-D1 delete order (AD-10).

## Suggested spine edits (summary)

1. New AD-13 "Response headers and origin isolation" (S-1, S-2, S-9).
2. AD-1: preview URLs off, Access on every hostname, admin hostname at custom-domain time (S-3).
3. AD-2: public DTO snapshot fetched from the Worker; build token without D1; post-build leak check (S-4, S-5, S-18).
4. AD-8: shared `sniffImage` + metadata allowlist + pixel cap for both upload paths (S-1, S-8).
5. AD-9: Durable Object hourly limiter, header Turnstile before body, streaming uploads, global cap (S-6, S-14).
6. AD-4/AD-10: PII-free activity log, cascading deletion, orphan reconcile (S-11).
7. AD-7: `EDITOR_EMAILS` secret check, CSRF guard (S-9, S-10).
