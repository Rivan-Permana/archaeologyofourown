# Review: rubric walker + input reconciliation

Target: `ARCHITECTURE-SPINE.md` (draft, 2026-11-18), decision record `.memlog.md`.
Inputs reconciled: PRD `prd.md` + `addendum.md` (2026-11-17), UX `DESIGN.md` + `EXPERIENCE.md` (2026-11-18).
Method: good-spine checklist from `references/reviewer-gate.md`, then every PRD FR, NFR, constraint and UX behavioural rule checked against the ADs, conventions, seed and Deferred list. Platform claims marked "verify" were not checked against live Cloudflare docs in this pass.

## Verdict

Not ready to finalize: the paradigm and most ADs are sound and well bounded, but two Rules are unenforceable or contradict an FR as written (Artefact of the Day daily rotation under a build-once static site; per-hour limits on a binding that only supports 10 s / 60 s windows), and several cross-unit data decisions (working copy for published content, Placeholder flag, preview rendering path, public DTO for the snapshot) are left for builders to choose independently.

## Checklist walk

| Checklist item | Result |
| --- | --- |
| Fixes the real divergence points, misses none | Partial. Misses: published-vs-working copy, per-language publication state, Placeholder flag, preview render path, snapshot public projection, upload protocol, styling approach (Tailwind or not). |
| Every AD Rule enforceable and prevents its divergence | AD-9 not enforceable as written (rate-limit periods). AD-2 contradicts FR-9 daily change. AD-6 "rendered at build" leaves preview unaddressed. Others OK. |
| Nothing under Deferred lets two units diverge | "Image resizing/variants" contradicts PRD §8 and SM-4; "Backups" covers D1 only, silent on R2. |
| Named tech verified-current | Memlog records npm versions for most packages. Not recorded: Node 24.22.x, jose 6.2.17, Zod (left as `4.x`, unpinned), drizzle-kit (missing). Tailwind 4.3.5 verified in memlog but absent from the spine with no decision. |
| Ratifies brownfield | N/A (greenfield: repo holds only `docs/`, `_bmad*`). |
| Covers the driving spec's capabilities | Mostly; gaps below (FR-9, FR-8 canonical, FR-25, FR-27 preview, FR-32 deletion completeness, §6.3 launch gate, SM-1 analytics, §8 performance). |
| Inherited parent spine not weakened | No parent spine. Note: the spine overrides addendum hosting (Pages → Workers); the memlog records it, but the addendum itself is not updated (offer upstream update per SKILL Update rule). |
| Every owned dimension decided, deferred or open | Silent or thin: testing strategy and CI gate, migration timing in the pipeline, staging/preview isolation, R2 backup, analytics, security headers/CSRF, free-tier fit. |

## Critical

**C1. Artefact of the Day cannot change daily on a build-once static home page (FR-9, FR-10; AD-2, AD-10).**
AD-2 prerenders home at build; rebuilds happen only on publish. FR-9 requires the featured Artefact to change at 00:00 Asia/Jakarta, identical for every reader, with no-JS showing that day's Artefact. The cron runs at 02:00 and never rebuilds. "Show another" also needs the pool in the browser, but AD-2 allows no public runtime endpoint for it, and the runtime tint (EXPERIENCE: "at runtime for Tampilkan lainnya") needs a decided source.
Fix: add an AD: a second Cron Trigger at 17:00 UTC (00:00 WIB) calls `rebuilds.request()`; the deterministic pick is one shared function in `src/shared/` keyed by Jakarta date over published Artefact IDs sorted by ID; the build emits the public pool as a static JSON asset; tint (light and dark clamp) is computed once at image ingest and stored on the image row, so build and swap read the same values. Alternative: keep home static and pick client-side, which fails FR-9's no-JS clause, so reject it.

**C2. AD-9 rate limits are not expressible with the Workers Rate Limiting binding (FR-15, FR-19).**
The binding's `period` accepts only 10 or 60 seconds and counts per location, eventually consistent. "5/hour" and "20/hour" cannot be configured. (verify at setup, but this matches current docs as known.)
Fix: amend AD-9: hourly counter in a Durable Object (or KV with `expirationTtl: 3600`) keyed by a salted hash of the IP, value is a count only, TTL equals the window; the IP itself is never written. Keep the binding as a burst guard if wanted. This also answers UX Open Question 3 (the real window for "Coba lagi nanti").

## High

**H1. Autosave on published content would leak half-edited text into the next rebuild (FR-27, FR-33; UX autosave, "Perbarui").**
UX autosaves every ~2 s and says autosave never changes the public site; publishing an edit is an explicit "Perbarui". The spine stores one body per translation and AD-3 says any edit to published content triggers a rebuild. Either autosave triggers rebuilds every few seconds, or an unrelated rebuild publishes another Editor's unfinished edit.
Fix: add to AD-5: each translation carries a working copy (autosave target) and a published copy; Terbitkan/Perbarui copies working → published and calls `rebuilds.request()`; the snapshot reads only published copies. Publication Status lives on the translation row (tab states kosong/draf/terbit), with the parent "published" when at least one translation is. Add an `updated_at` version check on autosave so two Editors do not silently overwrite each other (last-write-wins rejected with a stable `code`).

**H2. Draft preview has no rendering path (FR-27 "Preview shows the public reading layout"; AD-6).**
AD-6 renders BlockNote JSON to HTML only at build; drafts never enter the snapshot. Preview is therefore either a second renderer (the divergence AD-2 claims to prevent) or `@blocknote/server-util` inside the Worker (runtime compatibility and CPU cost unverified).
Fix: one shared `renderArticle(json) → sanitized HTML` in `src/shared/` used by the build and by the preview; decide whether preview runs it in the browser island (likely, avoids Worker CPU) or on-demand in `/admin/artikel/[id]/pratinjau`, and that the public Article layout component accepts that HTML from either source.

**H3. Deferred "image resizing" contradicts PRD §8 and SM-4.**
§8 requires modern formats at appropriate sizes and LCP ≤ 2.5 s on mobile; SM-4 wants Lighthouse ≥ 90. Serving 10 MB uploads as hero images fails both.
Fix: since every image already passes through the crop island (AD-8), decide there: re-encode to WebP at quality ~0.8 and emit 2–3 fixed widths (e.g. 640/1280/2000), store width/height on the image row, render `srcset` with explicit dimensions. No new service needed.

**H4. Preview environment assumption is likely false; no staging; migration timing undecided (Environments seed, AD-4).**
Workers preview URLs and branch builds run versions with the same bindings as production unless separate `env` blocks exist, so preview builds write to production D1/R2 through the public endpoints. Preview hostnames may also escape the Access app scope. AD-4 says migrations use `wrangler d1 migrations apply` but not when (before snapshot? in build command? manual?).
Fix: decide one of (a) `preview_urls: false` and no branch builds in v1, or (b) a `staging` wrangler env with its own D1 and buckets. Put `wrangler d1 migrations apply --remote` in the build command before `scripts/snapshot.ts`, with additive-only migrations so a rebuild never runs older code against a newer schema.

**H5. Placeholder labelling and the launch gate are not landed (FR-25, PRD §6.3, UX Placeholder marker).**
Production runs with Placeholders during client review, but the seed says Placeholders exist only in local fixtures. Nothing marks a record as Placeholder, so the renderer cannot show "Contoh / Placeholder". Nothing keeps the pre-launch site out of search engines.
Fix: add `is_placeholder` on article, artefact and image rows (and a placeholder flag for i18n copy such as the manifesto); the renderer shows the marker from that flag; a `PUBLIC_LAUNCH` build variable controls `robots` noindex and a build check that fails launch builds while placeholder records are published.

**H6. Personal data can survive deletion through `activity_log` and leak through the snapshot (FR-14, FR-21, FR-31, FR-32, PRD §9).**
AD-4 writes an activity row for every deletion and decision; nothing stops it from holding the Subscriber's email, Contributor name, story title or the reject note, which then outlives the 90-day purge and deletion on request ("email no longer exists"). The snapshot JSON is public static output, yet no rule says which fields may enter it (`source_contribution_id`, Contributor email via joins).
Fix: AD-4 addition: activity rows store actor email, action, entity type and ID or Reference Number only; notes live on the Contribution row and are deleted with it. AD-2 addition: `scripts/snapshot.ts` writes explicit public DTOs (allowlisted fields) defined in `src/shared/`, also used for the Show-another pool.

**H7. Upload protocol undecided against Worker limits (FR-12, FR-13, AD-9).**
UX needs per-photo progress and per-file retry; AD-9 implies one multipart request writing all photos, then the row. Up to 50 MB through `request.formData()` meets the Worker's 128 MB memory and, on the Free plan, the 10 ms CPU limit (the spine never states the plan). Magic-byte checks on Contribution photos are stated only for `media.ingest()`, not for the contribute path.
Fix: decide: one XHR multipart request streamed per part to R2 (progress apportioned by byte offset), or per-photo PUTs to `/api/contribute/photo` returning a temporary key and a final JSON commit carrying the Turnstile token. State the Workers plan (Free vs Paid) in the seed. Move the magic-byte check into a shared function used by both paths.

**H8. Path-scoped Access on a `workers.dev` hostname is assumed, not verified (AD-7).**
AD-7 protects only `/admin/*` and `/api/admin/*`. Access on `workers.dev` is commonly enabled per whole hostname; if a path-scoped self-hosted app is not possible there, v1 must either buy the custom domain earlier or put the whole review-phase site behind Access. The fail-closed middleware keeps data safe, but the Editor sign-in flow would break.
Fix: tag as `[ASSUMPTION: verify path-scoped Access app on workers.dev at setup]` with the fallback named (attach custom domain before the Dashboard goes live).

**H9. The build script calls services that are written against the Worker D1 binding (AD-2, paradigm diagram).**
`scripts/snapshot.ts` runs in Node during Workers Builds, where no D1 binding exists. Two units can diverge on how services get a DB client (D1 HTTP API, `getPlatformProxy` remote, or `wrangler d1 export`).
Fix: rule that services take the Drizzle client as a parameter (no module-level binding import), and name the build-time source (e.g. `getPlatformProxy` with remote D1, or Drizzle's D1 HTTP driver with the build token). Add the token's scopes (D1 read, Workers deploy) and the runtime token for Workers Builds status polling to the secrets list.

## Medium

1. **Masked email is cosmetic unless the server masks it** (UX Masked email, PRD §9). Rule: review API returns the masked form; "Tampilkan" calls a reveal endpoint that writes an activity row.
2. **"Lokasi foto · sudah dihapus" on the review sheet is false for raw Contribution photos** (EXPERIENCE strip vs AD-8 storing raw). Either strip GPS segments at intake or change the strip copy to show it only after conversion. Upstream UX update needed either way.
3. **Session-expiry 401** (UX State Patterns): Access usually answers an expired session on `fetch` with a redirect or CORS failure, not a 401. Decide how islands detect expiry (opaque redirect → `code: session_expired`) and that the middleware returns JSON 401 for `/api/admin/**`.
4. **Tint computation source** (FR-10): build-time image decoding needs a library or a stored value; covered if C1's "store at ingest" fix is taken.
5. **BlockNote schema gaps** (AD-6 vs UX block editor): image block needs alt text per language and credit; inline "Bahasa" mark must render `lang`; sanitizer allowlist must keep `lang`. Name these in `blocks.ts`.
6. **`@blocknote/mantine` vs AD-12 and "no third-party UI kit"**: Mantine brings its own theme and colours. Decide `@blocknote/ariakit` or `shadcn`, or a Mantine theme generated from tokens.
7. **Styling approach undecided**: memlog verified Tailwind 4.3.5 but the spine neither adopts nor rejects it. Two builders will diverge (utilities vs `tokens.css` + component CSS).
8. **Public script loading not ruled** (PRD §8, UX motion): islands list omits Article-page scripts (reading progress, ToC highlight, share, header reveal). Add: GSAP loaded only on home; Article page uses small vanilla scripts or CSS scroll timeline; text readable before scripts.
9. **Analytics for SM-1 silent**: Cloudflare Web Analytics auto-injection does not apply on `workers.dev`; decide the beacon snippet (cookieless) or Workers Analytics Engine, consistent with "no third-party trackers".
10. **Testing strategy and CI gate silent**: Workers Builds deploys on push to `main` with no typecheck/test step named. Decide the build command (`astro check`, unit tests for services, axe or Playwright smoke on key pages) and where they run.
11. **R2 has no backup; D1 Time Travel retains deleted personal data** for its window (7 days Free / 30 days Paid). Deferred should name R2 explicitly; privacy note should state the backup window.
12. **CSRF and security headers**: admin mutations rely on the Access cookie; add an `Origin` check on `/api/admin/**` POST/PUT/DELETE and a CSP for public and admin pages (rendered Article HTML, Turnstile, BlockNote).
13. **Artefact image alt and caption per language** (FR-28): the ER shows `ARTEFACT_IMAGE` without translations; add per-language alt or an `artefact_image_translation` row.
14. **Custom domain "no code change" is inaccurate** (Deferred, FR-8): `site`, canonical and OG URLs, Turnstile hostnames and the Access app all change; it needs a config change and rebuild.
15. **Original photo retention until publish** (UX crop assumption): say the original stays in `CONTRIBUTIONS` and conversion never deletes it, so FR-21/FR-32 deletion remains the only removal path.

## Low

1. Cron Triggers run in UTC: write `0 19 * * *` for 02:00 WIB (and `0 17 * * *` for the C1 rebuild).
2. 404: set `assets.not_found_handling: "404-page"` so unknown paths get the bilingual not-found page.
3. Secrets list: add the Turnstile site key (public var) and D1/account IDs for the build.
4. Normalize emails (trim, lowercase) before the Subscriber unique check (FR-17).
5. AD-1 neutral naming should also cover the Zero Trust team domain and Turnstile widget name (PRD §9 identity).
6. Record Node, jose and drizzle-kit versions in the memlog; pin Zod to an exact version.
7. Fonts: decide subsets (latin, latin-ext) and preload of the display face for LCP.
8. Add one line confirming free-tier fit (Workers Builds minutes, Durable Object/KV quota, Access seats) for PRD §9 cost.
9. Turnstile widget hostnames must include `workers.dev` and later the custom domain.
10. `media.ingest()` should record width and height for CLS-free rendering (pairs with H3).
11. Reading time computed at build from the published BlockNote JSON per language; state it so card and Article agree.
12. Missing-translation notice (FR-2) needs a decided mechanism (query flag on the other-language home).

## Quiet qualities checklist (requested)

| Quality | Status |
| --- | --- |
| Privacy (no IP storage, no trackers, private photos) | Landed (AD-8, AD-9, conventions); gaps H6, M1, M2, M11 |
| Tone and voice | Landed via AD-11 error codes and i18n files; copy rules are UX-owned, fine |
| Accessibility (WCAG 2.2 AA) | Not named in the spine; depends on AD-12 and UX. M5, M6 and the testing gap (M10) |
| Performance (LCP, readable before scripts) | AD-2 helps; H3 and M8 contradict or leave it open |
| No email in resource names | Landed (AD-1, conventions); L5 extends it |
| Placeholder labelling | Not landed (H5) |
| Autosave | Not landed; conflicts with AD-3 (H1) |
| Crop | Landed (AD-8 island re-encode); H3 extends it; M15 |
| Masked email | Not landed (M1) |
| Reading progress | Silent (M8); UI-only, low risk |
| Rebuild status | Landed (AD-3) with flagged assumptions; daily rebuild needed for C1; runtime polling token missing (H9) |
| Launch gate (§6.3) | Not landed (H5) |

## Dimensions

| Dimension | Status |
| --- | --- |
| Deployment | Decided (AD-1, Workers Builds) |
| Environments | Thin: preview assumption likely wrong, no staging (H4) |
| Ops / observability | Workers Logs decided; alerts deferred; no alert on failed cron or rebuild beyond the Dashboard (acceptable for v1, say so) |
| Backups | D1 only (M11) |
| Secrets | Decided, incomplete (H9, L3) |
| Migrations | Tool decided, timing silent (H4) |
| Local dev | Decided (astro dev / wrangler dev, seed) |
| Testing strategy | Silent (M10) |

## Counts

Critical 2 · High 9 · Medium 15 · Low 12.
