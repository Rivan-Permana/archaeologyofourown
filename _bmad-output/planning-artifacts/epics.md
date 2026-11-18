---
status: final
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-archaeologyofourown-2026-11-17/prd.md
  - _bmad-output/planning-artifacts/prds/prd-archaeologyofourown-2026-11-17/addendum.md
  - _bmad-output/planning-artifacts/ux-designs/ux-archaeologyofourown-2026-11-17/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-archaeologyofourown-2026-11-17/EXPERIENCE.md
  - _bmad-output/planning-artifacts/architecture/architecture-archaeologyofourown-2026-11-18/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/architecture/architecture-archaeologyofourown-2026-11-18/ARCHITECTURE-OVERVIEW.md
excludedDocuments:
  - docs/PRD.md (superseded by the PRD above)
  - docs/DESIGN.md (superseded by the UX DESIGN.md above)
---

# Archaeology of Our Own - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Archaeology of Our Own, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

PRD IDs are kept. FR-16 (interim console review) is retired and not reused.

- FR-1: Readers can view the home page, privacy note and every translated Article in Indonesian (default, `/`) or English (`/en/`); an Article may exist in one language only; each page's `lang` matches its language, `hreflang` alternates are declared only for existing language versions, and listings (Latest Articles, Editorial Series, Related Articles) show only Articles available in that language.
- FR-2: Readers can switch language from any page and land on the equivalent page; on an Article without a translation the switch leads to the other language's home page with a notice that the Article is not yet available in that language.
- FR-3: The Masthead shows the publication name, a one-line manifesto, "read articles" (primary) and "contribute an artefact" (secondary), all visible without scrolling at 375×812 and 1440×900; the primary action moves focus to the Latest Articles section.
- FR-4: Readers see the six most recent Articles ordered by date newest first, the newest featured larger, each card a single link showing Editorial Series, title, excerpt, date and reading time.
- FR-5: Readers see the four Editorial Series, each with a one-line description and its latest Article; an Editorial Series with no Article shows "coming soon" instead of a broken link.
- FR-6: Readers can read an Article with Editorial Series label, title, standfirst, author, date, reading time, hero image with caption and credit, and a body of headings, paragraphs, pull quotes, captioned images and an embedded Catalogue Record; the body column is at most 68 characters wide; every image has alt text and, where it shows an Artefact, a credit.
- FR-7: Readers see up to three other Articles from the same Editorial Series at the end of an Article; the current Article is never listed as related to itself.
- FR-8: Every public page exposes a title, description, Open Graph image and canonical URL, and Articles also expose `Article` structured data, so a shared Article URL previews its title, description and hero image.
- FR-9: The Artefact of the Day changes every day at 00:00 Asia/Jakarta, chosen deterministically from the published Artefact pool so all readers see the same Artefact on the same Jakarta date; "Show another" replaces it with a random different Artefact without reload; without JavaScript the first Artefact is shown and the button is hidden.
- FR-10: The Artefact of the Day section background takes a tint from the featured Artefact image's dominant colour, keeping text contrast at least 4.5:1, otherwise falling back to the default surface colour.
- FR-11: Contributors can submit a Contribution without an account with name or pseudonym, email, artefact title, story (up to 5,000 characters), Category and consent (all required), year or estimated year and provenance (optional) and 1–5 photos (required); a missing required field shows an error beside it and a top summary linking to each error; the consent statement covers ownership/rights and permission to publish, crop, edit and translate with credit after review, and links to the privacy note.
- FR-12: Contributors can attach only JPG, PNG or WebP photos up to 10 MB each, at most five; an invalid or oversized file is rejected by name with the rule stated while other valid files remain; type is verified from file contents; a sixth file cannot be added.
- FR-13: Contributors see per-photo previews and upload progress and, on success, a Reference Number (short, non-sequential, human-readable, e.g. `AOO-7K3F9Q`) with a note that the Editor may contact them by email and that they can withdraw before publication by replying with the Reference Number; a failed submission preserves entered text and photos and says what to do next; without JavaScript the form explains that JavaScript is needed for human verification and links the privacy note.
- FR-14: The system stores each Contribution and its photos privately with Review Status *pending*; no Contribution, photo or Contributor email is reachable from any public URL; every stored Contribution has a Reference Number, consent timestamp, page language and creation time.
- FR-15: The system rejects automated and excessive Contributions: no valid human-verification token is rejected; more than 5 per network address per hour gets "try again later"; network addresses are never stored with records (only a keyed hash held up to 1 hour); site-wide caps of 100 Contributions per day and 5 GB of stored Contribution photos pause submissions; photos are downscaled (longest edge ≤ 3000 px) and stripped of metadata in the browser and verified again on the server.
- FR-17: Readers can subscribe to the Newsletter with an email; the system stores email, language and time; an invalid email is rejected before and after submission; subscribing twice with the same email stores one Subscriber.
- FR-18: The Newsletter shows the same confirmation whether the email is new or already subscribed (no enumeration).
- FR-19: Newsletter subscriptions require the same human verification as Contributions with a limit of 20 per network address per hour; network addresses are never stored with records, only a keyed hash held up to 1 hour.
- FR-20: Readers can read a privacy note in both languages describing what is stored for Subscribers and Contributors, why, for how long, and how to request deletion.
- FR-21: The system deletes rejected Contributions and their photos 90 days after rejection; Subscribers and other Contributions are kept until deletion is requested; a Contribution converted into an Artefact cannot be rejected until that Artefact is deleted; deleted data may persist in point-in-time backups for up to 7 days.
- FR-22: The Editor can delete a Subscriber or a Contribution (with its photos) on request from the Editor Dashboard; deleting a Contribution also unpublishes any Artefact converted from it and deletes that Artefact's copied photos; requests are honoured only from the stored email (or quoting the Reference Number from that address) and the privacy note states a 30-day response time.
- FR-23: The public site shows a light or dark theme according to the reader's device setting.
- FR-24: The Masthead has one scroll-linked "strata" animation and sections reveal on scroll; with `prefers-reduced-motion: reduce` no element moves on scroll.
- FR-25: All Placeholder content is visibly labelled "Placeholder" until replaced.
- FR-26: Editors sign in to the Editor Dashboard with a one-time code sent to an allowlisted email (no passwords); a non-allowlisted email cannot reach any Dashboard page or data endpoint; every Dashboard data request verifies the Editor identity on the server.
- FR-27: Editors can create, edit, preview, publish, unpublish and delete Articles with separate ID and EN versions, Editorial Series, author, date, standfirst, hero image with caption and credit, and a rich body; a Draft is never public; Preview shows the public reading layout; delete asks for confirmation and a published Article must be unpublished first; slugs are unique per language and a duplicate is rejected with a message.
- FR-28: Editors can create, edit, publish, unpublish and delete Artefacts with a Catalogue Record and 1–5 images; only published Artefacts enter the Artefact of the Day pool; every image requires alt text in each language the Artefact is published in.
- FR-29: Editors can upload JPG, PNG or WebP images up to 10 MB for Articles and Artefacts; location metadata is removed on upload, so no published image contains GPS metadata.
- FR-30: Editors can list Contributions filtered by Review Status (oldest first by default), open one with all fields and full-size photos, approve or reject it with an internal note and change a decision; each Review Status change records the Editor's email and time; rejected Contributions show their FR-21 deletion date.
- FR-31: Editors can convert an approved Contribution into a draft Artefact with the Catalogue Record pre-filled, Contributor credit from the chosen name or pseudonym and location metadata removed from copied photos; the Contributor's email is never copied; the Artefact links back to its source Contribution in the Dashboard only.
- FR-32: Editors can search Subscribers, export them as CSV (email, language, sign-up date only) and delete a Subscriber or a Contribution (with photos) on request; afterwards the email no longer exists in Subscribers or Contributions and any Artefact converted from a deleted Contribution is unpublished with its copied photos deleted.
- FR-33: Publishing, unpublishing or editing published content triggers a Rebuild whose status (queued, building, live, failed) is shown in the Dashboard; a change appears on the public site within 2 minutes under normal conditions; a failed Rebuild shows a retry action and the previously live site stays online.
- FR-34: The Dashboard keeps an activity log of who created, published, unpublished, deleted or reviewed what, and when.

### NonFunctional Requirements

- NFR1: Accessibility: both surfaces meet WCAG 2.2 AA (PRD §8).
- NFR2: Accessibility: colour contrast meets WCAG 2.2 AA for text (4.5:1) and non-text controls and focus (3:1) in light and dark public themes and the admin light theme.
- NFR3: Accessibility: every control is operable by keyboard.
- NFR4: Accessibility: focus is visible on every control.
- NFR5: Accessibility: form fields are labelled and errors are programmatically associated with their fields.
- NFR6: Accessibility: uploads and submissions have live status announcements.
- NFR7: Performance: home and Article pages are readable before scripts load.
- NFR8: Performance: Largest Contentful Paint ≤ 2.5 s under Lighthouse default mobile throttling on home and Article pages.
- NFR9: Performance: images are served in modern formats at appropriate sizes.
- NFR10: Reliability: a failed upload or submission never loses what the Contributor typed (and the Editor's text in the Dashboard is likewise preserved).
- NFR11: Security: all input is validated on the server.
- NFR12: Security: uploaded files are checked by content, not extension or declared type.
- NFR13: Security: stored Contribution photos are never publicly addressable.
- NFR14: Security: secrets are kept out of the repository.
- NFR15: Localisation: all public interface text and errors (and future emails) exist in Indonesian and English; the Editor Dashboard interface is Indonesian.
- NFR16: Privacy: store only the fields listed in FR-11 and FR-17 plus system fields (Reference Number, Review Status, timestamps, language, reviewer email).
- NFR17: Privacy: network addresses are never stored with records; only a keyed hash is held for up to 1 hour for rate limiting.
- NFR18: Privacy: database point-in-time backups retain deleted data for at most 7 days, and this is disclosed in the privacy note.
- NFR19: Privacy: photos are downscaled and stripped of metadata in the browser before upload and verified on the server; photos may carry location data, so they stay private until processed.
- NFR20: Privacy/capacity: site-wide caps of 100 Contributions per day and 5 GB of stored Contribution photos.
- NFR21: Privacy: no third-party trackers; analytics is cookieless only.
- NFR22: Privacy: Contributor emails are never shown publicly.
- NFR23: Safety: the Editor can check Contributions for other people's faces, addresses or copyrighted material before publishing (crop or reject), and nothing is auto-published.
- NFR24: Cost: v1 runs on the Cloudflare Workers Free plan [ASSUMPTION in PRD §12].
- NFR25: Identity: no project name, URL or storage name is derived from the owner's personal email.
- NFR26: Editor Dashboard is usable on laptop and tablet; on phone, reviewing Contributions is supported.
- NFR27: Editor Dashboard destructive actions require confirmation and unsaved changes warn before leaving a page.
- NFR28: Rebuild latency: a published change is live within about 2 minutes under normal conditions.
- NFR29: Voice: interface copy is sentence case, short sentences, verbs for actions, errors that say what to do (PRD §10).
- NFR30: Scope guardrails: no marketplace features, no search or faceted filters, no reader or author accounts, comments or likes, no automatic publication of Contributions, no newsletter sending in v1 (PRD §5).
- NFR31: Launch gate: the public opening requires 4 real Articles, one per Editorial Series, each in Indonesian and English (PRD §6.3).
- NFR32: Launch gate: 6 real Artefacts with Catalogue Records and image rights cleared.
- NFR33: Launch gate: the final manifesto line is in place.
- NFR34: Launch gate: a privacy note approved by the client is published; consent wording is client-approved.
- NFR35: Launch gate: Placeholders are allowed only on the provider subdomain during review; the Success Metrics period starts on the public launch date.
- NFR36: Measurability SM-1: Article page views and total visits are measurable with Cloudflare Web Analytics (cookieless) on public pages.
- NFR37: Measurability SM-2 and SM-3: unique Subscribers and Contributions reaching a review decision are countable from storage.
- NFR38: Quality bar SM-4: Lighthouse mobile ≥ 90 in all four categories on home and Article pages.
- NFR39: Counter-metrics SM-C1 and SM-C2: no interruptive sign-up prompts, pop-ups or incentives; no features that push raw Contribution volume at the cost of consent quality.

### Additional Requirements

**Starter template:** none. There is no third-party starter template. Epic 1 Story 1 is the Astro + `@astrojs/cloudflare` scaffold per AD-1, with the source tree from the Architecture Structural Seed.

- AR1 (AD-1): Scaffold one Astro 7.4.12 project built by `@astrojs/cloudflare` 14.4.8 as a single Cloudflare Worker with static assets (Node 24.22.x, React 19.3.1 islands), using the source tree in the Architecture Structural Seed (`src/middleware.ts`, `pages/`, `islands/`, `components/`, `server/{services,db,storage,durable,auth}`, `shared/`, `content/snapshot/` git-ignored, `i18n/`, `styles/`, `public/_headers`, `scripts/`).
- AR2 (AD-1): `wrangler.jsonc` with `assets.run_worker_first` for `/admin/*`, `/api/*`, `/media/*`, `assets.not_found_handling: "404-page"`, `preview_urls: false`, `observability.logs.invocation_logs: false`, bindings for D1, two R2 buckets, the Durable Object and the cron; adapter `imageService: 'passthrough'`; no Astro sessions and no `SESSION` KV (confirm opt-out at setup, else neutral name).
- AR3 (AD-1, PRD §9): Neutral names for the `workers.dev` account subdomain, Zero Trust team domain, Turnstile widget, Worker, D1, buckets and Durable Object; never derived from a personal email or name.
- AR4 (AD-1, AD-4): Workers Builds builds `main` only (no branch builds, no preview environment); design every request to fit Workers Free limits (10 ms CPU, 128 MB per request).
- AR5 (Conventions): Build pipeline `npm ci --ignore-scripts` (allowlisted install scripts) → license check → `astro check` and unit tests → `scripts/snapshot.ts` → `astro build` → leak check → `wrangler deploy`; lockfile committed with exact versions.
- AR6 (AD-6): CI license check fails on `@blocknote/xl-*` or any GPL/AGPL dependency; only MPL-2.0 `@blocknote/*` 0.57.0 packages allowed.
- AR7 (AD-4): Drizzle 0.45.4 schema in `src/server/db/schema.ts` as the only table definition; drizzle-kit 0.31.11 migrations, additive-only, applied by the maintainer with `wrangler d1 migrations apply --remote` before merge (PR template checkbox); `Db` client factory usable from Worker, scripts and tests.
- AR8 (AD-5, AD-15, AD-3, AD-4): D1 tables: `article` + `article_translation`, `artefact` + `artefact_translation` (working fields, `published_*` fields, Publication Status, `published_at`, `revision` per translation), `media_asset`, `media_ref`, `media_ref_translation`, `contribution`, `contribution_photo`, `contribution_review`, `subscriber`, `activity_log`, `rebuilds`, `site_state` (`content_version`); `artefact.source_contribution_id` nullable `ON DELETE SET NULL`; `is_placeholder` on `article`, `artefact`, `media_asset`.
- AR9 (AD-5): UUID v4 text primary keys via `crypto.randomUUID()`; ISO 8601 UTC timestamps displayed in Asia/Jakarta; slug unique per (`lang`, `slug`) and locked after first publish; `article.date` Editor-set, defaulting to first publish time.
- AR10 (AD-5): Reference Number generator `AOO-` + 6 Crockford base32 characters from a CSPRNG, unique, never sequential; a Reference Number alone never authorizes withdrawal.
- AR11 (AD-5): Fixed enums in `src/shared/enums.ts` for Editorial Series (`temuan`, `jejak-proses`, `ingatan-bersama`, `stratigrafi`) and Category (`budaya-visual`, `proses`, `ingatan`) with labels in i18n files; no table, no free text.
- AR12 (Conventions): Shared Zod schemas (`astro/zod`) per input in `src/shared/schemas.ts`, used by island and endpoint; emails trimmed and lowercased with a unique or lookup index.
- AR13 (Conventions): API shape `{ ok: true, data }` / `{ ok: false, error: { code, field? } }` with stable snake_case codes localized client-side; one route error wrapper logging only `{ event, code, id }` (never emails, story text, IPs, headers, Zod issues or parser messages).
- AR14 (AD-2): Layered code: routes → services → data/storage; services take `Db` and storage handles as parameters and own every write; islands talk only to `/api/**` and presigned R2 URLs.
- AR15 (AD-2): Build snapshot endpoint `GET /api/build/snapshot`, authenticated by a Cloudflare Access service token (set only in Workers Builds variables, no D1 rights), mapping rows through Zod `.strict()` DTOs `PublicArticle`, `PublicArtefact`, `PublicMedia` in `src/shared/public.ts` with only published copies of published translations plus `content_version`.
- AR16 (AD-2): Prebuild `scripts/snapshot.ts` (Node) fetches the snapshot, renders Article HTML, writes `src/content/snapshot/*.json`; Astro content collections load only that snapshot; all public pages (home, Article, privacy, contribute, 404) are prerendered and never query D1 at request time.
- AR17 (AD-2): Post-build leak check `scripts/check-dist.ts` fails the deploy if `dist/` contains an email pattern, an `AOO-` Reference Number or any `admin` path.
- AR18 (AD-3): `content_version` in `site_state` incremented in the same D1 batch as every publish, Perbarui, unpublish and delete of published content; only those service functions call `rebuilds.request(version)` (never autosave, drafts, conversion, review decisions or Subscriber changes).
- AR19 (AD-3): Deploy hook integration: `rebuilds.request()` records a `rebuilds` row and POSTs secret `DEPLOY_HOOK_URL`, storing `build_uuid`; the build writes `dist/version.json`; single writer `rebuilds.refresh()` polls the Workers Builds API with `BUILDS_READ_TOKEN`, moves rows forward only (`queued` → `building` → `live` | `failed`), marks `live` only when deployed `/version.json` ≥ target, and re-fires the hook if a build succeeded below target.
- AR20 (AD-4): Every create, update, delete, publish, review decision and deletion-on-request writes an `activity_log` row (`id, at, actor, action, entity_type, entity_id, ref`) in the same D1 batch; `actor` is the verified Editor email or `public`/`system`; `ref` holds only a Reference Number or slug and is nulled on deletion on request; review notes live only on `contribution_review`.
- AR21 (AD-4): Every service writing R2 then D1 deletes its R2 objects on failure.
- AR22 (AD-6): BlockNote JSON article bodies per translation (working and published copies); `src/shared/blocks.ts` schema with custom `catalogueRecord` block (Artefact ID only, resolved at snapshot, omitted if unpublished), image blocks with per-language alt text and credit, inline language mark rendering `lang`.
- AR23 (AD-6): One `renderArticleHtml(doc, document)` in `src/shared/render.ts` with allowlist sanitizer (tags per block, attributes per tag, `href` limited to `https:`, `mailto:` and same-site relative, `src` limited to `/media/`), used by the build (Node with `@blocknote/server-util`) and admin preview (browser); reading time computed from published JSON in the same module; no `set:html`/`dangerouslySetInnerHTML` elsewhere.
- AR24 (AD-7): Cloudflare Access application (email one-time PIN, Editor allowlist only in the Access policy) protecting `/admin/*`, `/api/admin/*`, `/api/build/*` on every hostname including `workers.dev` (verify path-scoped app at setup; fallback whole hostname behind Access until launch); Access service token for the build.
- AR25 (AD-7): Deny-by-default middleware on every on-demand path: public only `/api/subscribe`, `/api/contribute/*`, `/media/*`; on protected paths verify `Cf-Access-Jwt-Assertion` with `jose` 6.2.17 against the team certs, pinning issuer and AUD, require `email` in secret `EDITOR_EMAILS` (or service token for `/api/build/*`), fail closed on missing header or config; expired session returns JSON 401 `session_expired`.
- AR26 (AD-7): CSRF and method rules: mutations only under `/api/admin/**` plus public endpoints; no Astro Actions or form posts to pages; GET never changes state; non-GET admin requests require `Content-Type: application/json` and `Sec-Fetch-Site: same-origin` (fallback `Origin` equals host); every admin service function takes the verified actor as a required argument; no password, session or user table.
- AR27 (AD-8): Two R2 buckets: private `CONTRIBUTIONS` (random keys, read only via `/api/admin/**`) and `MEDIA` served by `GET /media/<key>` with key regex `^[0-9a-f-]{36}(-w\d+)?\.(jpg|png|webp)$`; no `r2.dev` URL; bucket CORS allows PUT from the site origin only.
- AR28 (AD-8): Shared `sniffImage(bytes)` accepting only JPEG, PNG, WebP by magic bytes, rejecting metadata segments outside the structural allowlist and images above 40 megapixels (`photo_metadata` code); client-declared type and filename discarded.
- AR29 (AD-8): Byte-serving responses (`/media/*`, admin photo route) set server-derived `Content-Type`, `nosniff`, sandbox CSP `default-src 'none'; img-src 'self'; sandbox`, `Content-Disposition: inline; filename="<uuid>.<ext>"`; `/media/*` `Cache-Control: public, max-age=31536000, immutable`, admin photos `private, no-store`.
- AR30 (AD-8, AD-13): Shared `reencodeImage()` in `src/islands/lib/` re-encoding every upload in the browser (long edge ≤ 3000 px, JPEG or WebP quality 0.85, metadata dropped).
- AR31 (AD-9): Public write guard chain for `POST /api/subscribe` and `POST /api/contribute/start`: body > 64 KB rejected → hourly limit → Turnstile `siteverify` (check `success`, `hostname`, `action`) → Zod validation → service; no upload URL before Turnstile passes; `finish` needs the upload token, not a new Turnstile pass.
- AR32 (AD-9): SQLite Durable Object class `RateLimiter`: per-network instances keyed by `HMAC-SHA256(RL_HMAC_KEY, IPv4 or IPv6 /64)` holding a count only, deleted by alarm 1 hour after the window opens (5/hour contribute, 20/hour subscribe); one global instance enforcing 100 Contributions per Asia/Jakarta day and 5 GB stored photo bytes (reserve at `start`, correct at `finish`, release on purge/delete), returning `capacity_reached` before any upload URL; raw IP never written to D1, R2, DO storage or logs.
- AR33 (AD-9): Turnstile widget (neutral name, managed mode) with secret `TURNSTILE_SECRET` and public site-key variable.
- AR34 (AD-13): Presigned upload protocol shared by contributions and editor media: `start` validates count (contributions 1–5) and sizes (≤ 10 MB), creates the record `uploading`, returns an upload token and one SigV4 presigned PUT URL per file (random key, 10-minute expiry, WebCrypto in `src/server/storage/presign.ts`, secrets `R2_ACCESS_KEY_ID`/`R2_SECRET_ACCESS_KEY` scoped to the two buckets); `finish` heads each object, sniffs first and last 64 KB, stores MIME, width, height, deletes failures and returns per-file codes; the Worker never reads a whole photo body.
- AR35 (AD-13): Endpoints `POST /api/contribute/start`, `POST /api/contribute/finish` (assigns Reference Number, record → `received`, Review Status `pending`), `POST /api/admin/media/start` and its finish (staged under `staging/` in `MEDIA`, never matched by `/media/*`, copied by stream to the final key with derived `Content-Type`).
- AR36 (AD-14): Working copy and frozen published copy per translation: autosave writes working fields only and never requests a rebuild; Terbitkan and Perbarui copy working → published, set Publication Status and `published_at`, bump `content_version`, request a rebuild; unpublish clears published state; every save carries `revision` and a mismatch returns `edit_conflict`.
- AR37 (AD-15): `services/media` owns `media_asset` (WebP width variants 640/1280/2000 without upscaling, MIME, dimensions, light and dark clamped tint, `is_placeholder`) and `media_ref`; tint is computed in the crop island and validated and stored at ingest; deleting a referenced asset is refused; `media.collect()` removes unreferenced objects only after a rebuild without the reference is `live`; public pages render `srcset` with explicit dimensions.
- AR38 (AD-15): Conversion (FR-31) runs each Contribution photo through the crop island and the upload protocol into new `MEDIA` assets; it never references `CONTRIBUTIONS` keys.
- AR39 (AD-10): One Cron Trigger `0 19 * * *` UTC (02:00 WIB) calling in order `contributions.purgeRejected()` (R2 first, then rows, plus activity entry), `contributions.purgeStaleUploads()`, `media.purgeStaleUploads()` (still `uploading` after 24 hours), `media.collect()`, a sweep of orphaned `CONTRIBUTIONS` objects older than 24 hours, and `rebuilds.refresh()`.
- AR40 (AD-10): `rejected_at` set and cleared only by `contributions.decide()`; deletion date = `rejected_at + 90 days` for both Dashboard and cron; `decide()` returns `converted_contribution` when an Artefact references the Contribution; deletion on request reuses the same service functions, unpublishes Artefacts with that `source_contribution_id` (bumping `content_version`) and deletes copied media assets.
- AR41 (AD-11): Astro i18n routing, Indonesian default without prefix, English under `/en/`; route pairs `/` ↔ `/en/`, `/artikel/[slug]` ↔ `/en/articles/[slug]`, `/kirim` ↔ `/en/contribute`, `/privasi` ↔ `/en/privacy`; interface strings in `src/i18n/{id,en}.json`; Dashboard UI Indonesian only.
- AR42 (AD-12): `src/styles/tokens.css` mirrors the DESIGN.md YAML tokens 1:1 (public and admin scopes); plain component CSS (no Tailwind); no literal colours, radii or font stacks in components; BlockNote uses `@blocknote/mantine` with a Mantine 9.8.1 theme built from the same tokens.
- AR43 (AD-12): Self-hosted fonts via `@fontsource-variable/fraunces` (subsets `latin` and `latin-ext` only, only the display weight preloaded) and `@fontsource-variable/inter` 5.3.0.
- AR44 (AD-12): GSAP 3.15.1 + ScrollTrigger loaded on the home page only; other public pages use small vanilla scripts; every new screen passes `antislop` and `unslop` before review.
- AR45 (AD-16): Build writes the published Artefact pool as a static JSON asset of `PublicArtefact` DTOs with stored tint; one `pickDaily(poolIds, date)` in `src/shared/daily.ts` (stable hash of the Asia/Jakarta date over ascending IDs) shared by build and swap island; prerendered home shows the build-day pick; the island recomputes for the current Jakarta date and swaps if different; no cron or rebuild for the daily change.
- AR46 (AD-17): Security headers via `public/_headers` for static assets and middleware for on-demand responses: CSP `default-src 'self'; script-src 'self'` plus build hashes for Astro inline scripts, `https://challenges.cloudflare.com`, `https://static.cloudflareinsights.com`; `connect-src 'self' https://cloudflareinsights.com`; `frame-src https://challenges.cloudflare.com`; `img-src 'self' data:`; `style-src 'self' 'unsafe-inline'`; `object-src 'none'; base-uri 'none'; frame-ancestors 'none'` (verify Astro 7 CSP hashing at setup); HSTS, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` on all responses.
- AR47 (AD-17): Island data passed only as static JSON or `<script type="application/json">` with `<` escaped, never string-built script.
- AR48 (AD-18): Placeholder flag rendering (marker from `is_placeholder` only; placeholder copy flagged in i18n files) and launch gate: build variable `PUBLIC_LAUNCH` default false → `<meta name="robots" content="noindex">`, `X-Robots-Tag: noindex` in `_headers`, `robots.txt` disallow all; with `PUBLIC_LAUNCH=true` the build fails if any published record or copy string is flagged Placeholder.
- AR49 (Conventions): Cloudflare Web Analytics beacon (cookieless) on public pages only; no other analytics or tracking.
- AR50 (Conventions): Secrets and config: Worker secrets `TURNSTILE_SECRET`, `DEPLOY_HOOK_URL`, `BUILDS_READ_TOKEN`, `ACCESS_AUD`, `ACCESS_TEAM_DOMAIN`, `EDITOR_EMAILS`, `RL_HMAC_KEY`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`; Workers Builds variables: Access service token ID and secret, `PUBLIC_LAUNCH`; local values in git-ignored `.dev.vars`; missing auth config fails closed.
- AR51 (Conventions): Personal data in admin API: review endpoints return the masked email; the full address comes only from a reveal endpoint that writes an activity row; Subscriber CSV export prefixes cells starting with `=`, `+`, `-`, `@`, tab or CR with `'`.
- AR52 (Conventions, Environments): Local environment with `astro dev` / `wrangler dev`, local D1, R2 and Durable Object, seeded only with Placeholder fixtures via `scripts/seed.ts`; fixtures use `contoh.id` and pseudonyms, never real emails or names.
- AR53 (Deferred, for awareness): custom domain, separate admin hostname, email notifications and double opt-in, search, extended observability, scheduled backups, Drizzle 1.0 and Workers Paid are out of v1; D1 Time Travel provides the 7-day restore window.

### UX Design Requirements

Design tokens and foundations

- UX-DR1: Implement `src/styles/tokens.css` from the DESIGN.md YAML public colour tokens (paper, surface, ink, ink-muted, line, accent, on-accent and each `-dark` value) with dark resolution under `prefers-color-scheme: dark`, where every public token `x` resolves to `x-dark`.
- UX-DR2: Implement admin colour tokens (admin-room, admin-rail, admin-rail-hover, admin-sheet, admin-sheet-footer, admin-button-hover, admin-text, admin-muted, admin-control, admin-line, admin-accent, admin-accent-press, admin-on-accent), light only in v1.
- UX-DR3: Implement public typography tokens (display, manifesto, h1, h2, h3, standfirst, body, small, meta, meta-catalogue) with Fraunces for display/headings and Inter for body/meta; tabular figures for meta; uppercase tracked 0.08em only for meta-catalogue.
- UX-DR4: Implement admin typography tokens (admin-title, admin-editor-title, admin-standfirst, admin-heading, admin-reading, admin-editor-body, admin-body, admin-ui, admin-small, admin-meta, admin-strip-value); Fraunces only for publishable titles and standfirst, Inter elsewhere, sentence case.
- UX-DR5: Implement spacing tokens (4px scale 1–32, gutter-desktop, margin-mobile, max-width 1440px, measure 68ch, admin-nav-width, admin-rail-width, admin-room-padding, admin-sheet-max, admin-sheet-padding-top, admin-sheet-padding, admin-measure 60ch) and radius tokens (none for all public elements; admin-xs 6, admin-sm 8, admin-md 10, admin-lg 14; no pills).
- UX-DR6: Elevation rules: no shadows on the public site; in admin, depth from the tonal stack plus hairlines, with the single `admin-overlay` shadow used only on the Slash menu, Confirm dialog and crop tool.
- UX-DR7: Accent usage rule: public accent text only on paper (never on surface or tint; use a paper chip or ink with accent icon), admin accent text only on sheet or room (never on rail); errors use accent plus icon and text, never colour alone.
- UX-DR8: Icons use Phosphor Light only, one family and weight per surface; no decorative illustrations or arrows.

Public components

- UX-DR9: Masthead component: name at display token, manifesto (max 52ch), Placeholder marker while manifesto awaits client text, "Baca artikel" primary and "Kirim artefak" secondary (stacked full width at 375), ID/EN switch top right, five unlabelled `aria-hidden` strata bands with 1px ink rules, specified fills and heights (desktop 48/12/88/20/40px, mobile 28/8/48/12/28px) and a 12px accent find mark in the third band; all above the fold at 375×812 and 1440×900 (ref `mockups/public-home.html`).
- UX-DR10: Header component: wordmark, anchor nav (Articles, Artefact of the Day, Contribute, Newsletter), ID/EN switch with Phosphor globe, skip link as first focusable element, Menu button on mobile; thin sticky bar with bottom rule and accent current-section underline; on home hidden and `inert` while the Masthead is in view, then revealed; visible and sticky from the top on other pages; anchors on non-home pages resolve to `/#section`.
- UX-DR11: Mobile menu panel: full-screen on paper with Articles, Artefact of the Day, Contribute, Newsletter and ID/EN switch at h3 separated by rules; close button; traps focus, moves focus to first item, `Esc`/close/item selection closes and returns focus to Menu button; page scroll locked while open.
- UX-DR12: Language switch: accessible names "Bahasa Indonesia" / "English" with `lang` and `hreflang`, current language underlined 2px accent; present in Masthead, header, mobile menu and footer; keeps the equivalent page.
- UX-DR13: Public buttons and links: primary (accent, on-accent text, square, min 48px, hover darkens 8%), secondary (ink border, hover surface fill), link (ink with 1px accent underline offset 3px, hover 2px); busy/disabled at 40% opacity with focus ring kept, using `aria-disabled="true"` (never native `disabled` on a focused button); quiet text buttons and ToC links ≥ 24×24px.
- UX-DR14: Article card: 3:2 image, accent series label on paper, h3 title, 2-line excerpt, date · reading time; title is the only link with hit area stretched over the card and focus outline around the card; hover underlines the title only, image never moves.
- UX-DR15: Featured article card: article card spanning 2 columns with h2 title, used for the newest Article.
- UX-DR16: Series block: series name (h3), one-line description, latest Article link, count (meta), "Segera hadir / Coming soon" without link when empty; hover turns the rule accent.
- UX-DR17: Catalogue card: 4:5 image, inventory number and year in meta-catalogue, h3 title, Category tag, provenance (small); hover underlines title only.
- UX-DR18: Catalogue Record block: bordered key/value list (inventory number, year, Category, provenance, contributor credit) with meta-catalogue labels; reused in cards, Articles, Artefact of the Day and the success screen.
- UX-DR19: Category tag: 1px ink border, meta text, label in page language (*ingatan* / *memory*).
- UX-DR20: Artefact of the Day component: large image, Catalogue Record block, "Tampilkan lainnya / Show another" button (hidden without JS or with one Artefact); swap crossfades 0.4s, tint transitions 0.6s, button busy during swap, new Artefact announced politely; fetch failure keeps current Artefact (silent retry once, then short inline note).
- UX-DR21: Tint clamp algorithm: dominant colour to OKLCH keeping hue and chroma; light theme raise lightness to relative luminance ≥ 0.62; dark theme lower to ≤ 0.038; reduce chroma if out of sRGB gamut; verify text 4.5:1 and borders/focus 3:1 for every foreground pair, else fall back to surface/surface-dark.
- UX-DR22: Article page layout: series label, h1 title, standfirst, byline with date and reading time, hero image with caption and credit, 68ch body, pull quote in Fraunces roman at h2 size (no italic, no rule), inline captioned images, Catalogue Record block, Related Articles row; text readable before scripts and images load, progressive images with no blocking layout shift.
- UX-DR23: Reading progress bar: 2px accent line pinned under the sticky header, tracks the Article body only, `aria-hidden`, Article pages only.
- UX-DR24: Table of contents: only when the Article has three or more h2 headings; small-text list, current heading marked with an accent left rule; sidebar on desktop, collapsed disclosure above the body on mobile; links move focus to the heading.
- UX-DR25: Share control: "Salin tautan / Copy link" secondary-style text button plus native share where available; copy confirmation "Tautan tersalin / Link copied" in a polite live region.
- UX-DR26: Contribute invitation home section: short copy and primary "Kirim artefak / Contribute an artefact" button linking to the Contribute page.
- UX-DR27: Contribute page as a new surface (`/kirim`, `/en/contribute`) with routes, `hreflang` pairs and FR-8 metadata, hosting the contribution form (ref `mockups/public-kirim.html`).
- UX-DR28: Text field and textarea: label above, 1px ink border, square, min 48px, helper text (small, muted), live character count to 5,000 on story; validate on blur and on submit; error = accent border plus message with Phosphor warning icon linked via `aria-describedby`; disabled state.
- UX-DR29: File drop zone (contribution uploader): dashed ink border, upload icon, "drag or choose photos", visible real "Pilih foto" button carrying focus, limits line; drag-over state (accent border, surface fill, ink text); thumbnail grid with filename, size, remove button, per-file progress; per-file error (file-type label in ink with accent warning icon); sixth file blocked with reason; per-file states "Menyiapkan foto…", "Mengunggah {n}%", "Terunggah" announced via `aria-live`; per-file retry.
- UX-DR30: Consent checkbox: 20px square, label linking to privacy note in a new view without losing the form, accent fill when checked, focus ring; error = 2px ink border plus message and icon, never an outline.
- UX-DR31: Contribution form: one column max 640px, groups About you · About the artefact · Photos · Consent, Turnstile (managed mode, page language, page theme) above submit; error summary at top (1px accent border on paper, h3 heading, one link per failed field) receiving focus; submitting state with busy button and progress; Turnstile failure "Verifikasi gagal…" in the summary with widget reset and entries kept.
- UX-DR32: Contribution success screen: replaces the form, h1 heading receives focus, Reference Number on its own line at h2 with tabular figures, summary in a Catalogue Record block, review note and withdrawal instructions.
- UX-DR33: Contribution failure states: whole-submit failure or offline keeps all text and photos with "Kiriman belum terkirim…" message; rate-limited and site-wide cap messages from Voice and Tone; no-JS notice with privacy link.
- UX-DR34: Newsletter form: label, email input, consent text, Turnstile, submit; status as visible small text below the button inside `aria-live="polite"` (ink; error with accent icon); same confirmation for new and existing emails; inline invalid-email message before submit; no pop-ups.
- UX-DR35: Placeholder marker "Contoh" (ID) / "Placeholder" (EN) in accent border on paper, always visible on Placeholder content; Placeholder image as a plain surface slot at the real aspect ratio with the marker and placeholder alt text, no textures or gradients.
- UX-DR36: Footer: name and one-line description, links "Catatan privasi / Privacy note" and "Kirim artefak / Contribute an artefact", ID/EN switch, copyright; links 44px tall, muted text, ink links with accent underline; in page language on every public page.
- UX-DR37: Not-found page: same chrome as Article pages with sticky header, h1 heading, one sentence in ID and one in EN each with `lang`, links "Ke beranda / Go home" and "Artikel terbaru / Latest articles"; served for unknown paths and unpublished/deleted Articles; no illustration.
- UX-DR38: Public layout grid: 12 columns desktop (max 1440, 32px gutters), 6 tablet, 4 mobile with 16px side gutter; sections separated by full-width rules with a sentence-case meta label; no section numbers; header collapses to Menu below the tablet breakpoint.
- UX-DR39: Home page section order: Masthead, Latest Articles, Artefact of the Day, Editorial Series, Contribute invitation, Newsletter, footer.

Public motion

- UX-DR40: Masthead strata signature motion: five bands separate vertically on scroll (GSAP ScrollTrigger scrub from Masthead top at viewport top to Masthead bottom at viewport top); band gap, easing and header-reveal timing tuned in a motion prototype with `emil-design-eng`.
- UX-DR41: Fade-up (0.6s, power3.out, translateY 24px, once) only on the Masthead content and the Artefact of the Day; every other section static; no motion inside Article text, no image scale on hover.
- UX-DR42: Reduced motion (public and admin): under `prefers-reduced-motion: reduce` no scrub (bands closed), no fade-up, instant swaps, no transitions, static building indicator; nothing moves on scroll.

Admin components

- UX-DR43: Admin three-column layout: nav (200px), queue rail (300px), room (32px padding) holding the sheet (max 900px, 48px top and 64px side padding); editor screens drop the rail and centre the sheet; below 1100px columns stack (nav wraps to a row, room padding 16px, sheet 24px top and 20px sides).
- UX-DR44: Dashboard nav: publication name over "Ruang editor", items Artikel, Artefak, Kiriman, Pelanggan, Aktivitas at admin-ui with right-aligned muted counts (pending Kiriman count); hover rail fill; active item with sheet background, inset hairline, weight 500, 3px admin-text left bar and `aria-current="page"`; `/admin` lands on Kiriman filtered to pending.
- UX-DR45: Queue rail: Review Status filter links "Menunggu", "Disetujui", "Ditolak" with 2px underline and `aria-current`; heading "Menunggu dibaca" and sub-line "{n} kiriman, yang terlama di atas"; ordered queue items (title, right-aligned waiting age, meta line Reference Number · Contributor · Category · photo count), hover rail-hover, active with 3px bar and `aria-current`; arrow keys move through items.
- UX-DR46: Catalogue-record strip (admin signature): read-only `dl` in one ruled row (2px admin-text top rule, hairline bottom and dividers, muted labels over 15px tabular values); opening strip No. referensi, Diterima, Urutan ("1 dari 7"), Kiriman tertua with waiting time in accent 500 on sheet only; closing strip Tahun, Kategori, Izin muat, "Lokasi foto · sudah dihapus"; cells wrap below 1100px.
- UX-DR47: Review sheet: opening strip, Fraunces title (max 24ch), muted byline with Contributor name, masked email and city, hero photo slot with "Foto 1 dari N" caption, strip of photo slots, story at admin-reading within 60ch, closing strip, decision bar; rejected items show their deletion date; focus moves to the sheet heading on queue advance (ref `mockups/dashboard-review.html`).
- UX-DR48: Masked email: first character, bullets (hidden from AT) and domain, accessible label "email disamarkan, domain {domain}"; quiet "Tampilkan" button (accessible name "Tampilkan email kontributor") reveals the full address in place via the reveal endpoint, then disappears with focus moved to the address.
- UX-DR49: Photo lightbox: full-size photo over dimmed room, caption "Foto n dari N", previous/next/close in admin secondary style, arrow keys move, `Esc` closes and returns focus to the thumbnail, focus trapped.
- UX-DR50: Decision bar: sheet-footer background, note label "Catatan untuk editor lain", textarea (min 72px) with helper text; buttons Jadikan artefak (primary), Setujui (secondary), Tolak (quiet); right-aligned "Berikutnya: {judul}" link; Tolak with empty note shows "Tulis alasan singkat sebelum menolak." and moves focus to the field; Tolak with note rejects at once without dialog, `role="status"` confirms with the deletion date and a persistent "Batalkan" button; sheet advances to the next item after a decision; save failure keeps note and does not advance.
- UX-DR51: Admin buttons: primary (admin-accent, hover/press accent-press), secondary (sheet bg, admin-control border, hover button-hover), quiet (muted text, hover text colour, underline offset 4px, ≥ 24×24px hit area); 48px high; busy/disabled 40% opacity with focus ring and `aria-disabled`; press scale 0.98 over 150ms `cubic-bezier(.22,1,.36,1)`; one primary action per sheet.
- UX-DR52: Admin text field: sheet bg, admin-control border, admin-sm radius, 12px padding, admin focus ring; error = accent border, accent warning icon and admin-text message below.
- UX-DR53: Admin focus ring (2px admin-accent, offset 3px on `:focus-visible`) on every interactive admin element; background-colour transitions 150ms; all transitions off under reduced motion.
- UX-DR54: Rebuild status tag: right of the editor heading on published content only; states "Situs sedang dibangun ulang, sekitar 2 menit" (indicator animates at most 5 seconds, static under reduced motion), "Sudah tayang", "Gagal dibangun. Situs lama tetap tayang." with secondary "Coba lagi"; updated by polling and announced via `role="status"`.
- UX-DR55: Autosave status: muted text at the editor footer left, saves the working draft about 2 seconds after typing stops, "Menyimpan…" then "Tersimpan · HH.MM" (not announced); on published content "Draf tersimpan. Tekan Perbarui untuk menayangkan."; failure "Belum tersimpan" with quiet "Coba lagi", announced once, retries on next pause; no "Simpan draf" button; `edit_conflict` refuses the save and asks the Editor to reload.
- UX-DR56: Publication Status label: read-only tag "Draf" / "Terbit" (rebuild-tag anatomy) on Artikel and Artefak list rows and in the editor header; text carries the state.
- UX-DR57: Language tabs (ID | EN): ARIA tablist with two tabs (`aria-selected`, `aria-controls`, roving tabindex, Left/Right arrows), each language's fields in a tabpanel with `lang`; active tab on sheet tone, weight 500, 2px admin-text underline; tab label shows translation status ("kosong" / "draf" / "terbit").
- UX-DR58: Editorial Series picker: native radio group in a fieldset with legend "Seri editorial", four bordered 40px options with 16px dot (selected: 5px admin-text ring, admin-text border, weight 500); required before Terbitkan; arrow keys select.
- UX-DR59: Block editor (BlockNote with Mantine theme from tokens): language tabs, series picker, Fraunces title and muted standfirst, body blocks at admin-editor-body within 60ch; footer with autosave status left, Pratinjau (secondary) and Terbitkan/Perbarui (primary) right; per-block quiet "Opsi blok" handle (24×24px, visible on hover and focus) with menu Pindah ke atas, Pindah ke bawah, Hapus blok; "Tambah blok" button; drag reorder with focus kept and a polite position status; labelled textbox roles and semantic output; inline "Bahasa" mark sets `lang`; image and Catalogue Record blocks as labelled groups with per-language alt text required; tested with VoiceOver and NVDA.
- UX-DR60: Slash menu: floating admin-overlay list (admin-md radius) opened at caret on `/` or from "Tambah blok"; items heading, quote, image, Catalogue Record; filters as typed; combobox + listbox with `aria-activedescendant`; polite "{n} pilihan" count; Enter inserts, announces "Blok {jenis} ditambahkan" and moves focus into the block; `Esc` closes leaving `/` or returns focus to "Tambah blok".
- UX-DR61: Catalogue Record block (editor): bordered inline form in admin tokens with inventory number, title, year or estimated year, Category, provenance, contributor credit; can embed an existing Artefact's record.
- UX-DR62: Image crop tool: admin-overlay dialog over dimmed room, image on rail, crop frame with four focusable corner handles (24×24px, named "Bingkai potongan", "Sudut kiri atas"…), arrow keys move frame/handle; row 1 aspect radios Bebas/1:1/4:5/3:2, Perkecil/Perbesar, four Geser buttons, size in muted meta; row 2 Putar kiri/kanan, Atur ulang; footer Batal/Terapkan; `Esc` discards; polite "Potongan {w} × {h} piksel" and rotation announcements; emits WebP 640/1280/2000 variants and computes the clamped tint; focus trapped; not available on phone.
- UX-DR63: Confirm dialog: admin-overlay at small width, admin-lg radius, dimmed room, title, one-sentence consequence naming the object, Batal (secondary) then destructive action (primary, last); used only for delete and unpublish; `Esc` cancels; focus trapped and returned to trigger.
- UX-DR64: Unsaved-changes guard: Confirm dialog anatomy, triggered when leaving (nav click, back, tab close) with changes not yet autosaved or an unsaved review note; stay or discard.
- UX-DR65: Admin empty state: centred heading (admin-heading), muted sentence max 36ch, one secondary button, no illustration; empty queue copy "Tidak ada kiriman yang menunggu" with "Lihat yang disetujui"; Aktivitas empty line without action; "Tulis artikel" on empty Artikel.
- UX-DR66: Admin loading state: lists and queue rail rows at real height in admin-rail-hover with "Memuat kiriman…"; sheet skeleton with strip, title line, photo slots and flat story bars at real size; no shimmer; saving buttons keep their label while busy; the sheet keeps the last Contribution until the next arrives.
- UX-DR67: Admin inline error states with accent icon, admin-text message and one recovery action: queue ("Muat ulang"), sheet ("Coba lagi"), photo ("Foto n tidak bisa dimuat."), decision ("Simpan lagi"), upload ("{nama file} gagal diunggah. Foto lain tetap ada.").
- UX-DR68: Session-expired handling: drafts, unsent review note and decision text kept in local browser storage until the server confirms; on 401 `session_expired` a full-width notice "Sesi berakhir. Masuk lagi, tulisan Anda tetap di sini." with primary "Masuk lagi" opening Access sign-in in a new tab; the save retries on return.
- UX-DR69: Admin lists (Artikel, Artefak, Pelanggan, Aktivitas): plain rows on the sheet with hairline separators, title and muted meta; Artikel/Artefak with Publication Status label and "Tulis artikel" action; Pelanggan search field, CSV export, delete on request and "Tidak ada pelanggan dengan email itu." no-results line keeping the search text; Aktivitas read-only newest first.
- UX-DR70: Phone behaviour: Dashboard review flow works full width (queue list → one Contribution → decision bar); Artikel and Artefak editors and the crop tool show the phone note "Buka di laptop atau tablet untuk menyunting." with no action.
- UX-DR71: Admin motion: only state changes (queue advance, status tag, dialog) with short fades ≤ 200ms; the building indicator is the only looping motion.

Accessibility floor (cross-cutting)

- UX-DR72: Focus never obscured by the sticky header: `scroll-padding-top` on `html` equals header height plus the 2px progress bar.
- UX-DR73: Deliberate focus moves: Masthead primary → Latest Articles heading; error summary; success heading; dialog open/close; Tolak without reason → note field; queue advance → sheet heading; Slash menu insert → new block.
- UX-DR74: Live regions for uploads, submissions, Newsletter result, Artefact swap, copy-link, autosave failure, rejection, crop size, block insert and Rebuild status; routine autosave not announced.
- UX-DR75: Selected states in the Dashboard (nav, queue, Review Status filter, language tabs) have a visible cue ≥ 3:1 besides tone, plus `aria-current` / `aria-selected`; admin control borders ≥ 3:1 on sheet, footer, room and rail; line tokens never used as control boundaries.
- UX-DR76: Drag-and-drop (file drop zone, block reorder, crop frame) always has a visible single-pointer button alternative and a keyboard path (WCAG 2.5.7, 2.1.1).
- UX-DR77: Target sizes: public and admin buttons ≥ 48px, series radio options 40px, quiet buttons, ToC links and crop handles ≥ 24×24px, all others ≥ 24px (WCAG 2.5.8).
- UX-DR78: Language attributes: `lang` matches page language, `hreflang` only for existing versions, Dashboard content fields carry `lang` per tab, inline other-language passages carry `lang`.

Microcopy

- UX-DR79: Public microcopy in ID and EN from EXPERIENCE.md Voice and Tone (CTAs, photo error, required field, submit failed, rate limited, cap reached, photo preparation, network-address helper, success and follow-up, newsletter success, missing translation, series empty, no-JS, verification failed, not found) stored in `src/i18n/{id,en}.json`; sentence case, no em dashes; manifesto, consent and privacy wording flagged pending client approval.
- UX-DR80: Dashboard microcopy (ID only) from EXPERIENCE.md Voice and Tone (queue rail, strip labels, decision and rejection lines, editor footer, autosave, rebuild status, language tab, crop tool, block editor announcements, empty, loading, error and session-expired lines); guiding tone with counts and ages, no em dashes.

### FR Coverage Map

FR-1: Epic 1 - Language versions of home, privacy and translated Articles
FR-2: Epic 1 - Language switch to the equivalent page
FR-3: Epic 1 - Masthead with name, manifesto and two actions
FR-4: Epic 1 - Latest Articles listing
FR-5: Epic 1 - Editorial Series overview
FR-6: Epic 1 - Article reading view
FR-7: Epic 1 - Related Articles
FR-8: Epic 1 - Metadata for sharing and search
FR-9: Epic 1 - Artefact of the Day daily pick and Show another
FR-10: Epic 1 - Image-derived tint with contrast clamp
FR-11: Epic 3 - Contribution form
FR-12: Epic 3 - Photo rules
FR-13: Epic 3 - Upload feedback and Reference Number
FR-14: Epic 3 - Private storage with Review Status pending
FR-15: Epic 3 - Abuse protection for Contributions
FR-16: retired (interim console review replaced by Epic 5)
FR-17: Epic 2 - Subscribe
FR-18: Epic 2 - No enumeration
FR-19: Epic 2 - Abuse protection for subscriptions
FR-20: Epic 1 - Privacy note page
FR-21: Epic 6 - Retention of rejected Contributions (90 days)
FR-22: Epic 6 - Deletion on request
FR-23: Epic 1 - Theme follows device
FR-24: Epic 1 - Motion with reduced-motion support
FR-25: Epic 1 - Placeholder labelling
FR-26: Epic 4 - Editor sign-in
FR-27: Epic 4 - Manage Articles
FR-28: Epic 4 - Manage Artefacts
FR-29: Epic 4 - Upload and manage images
FR-30: Epic 5 - Review Contributions
FR-31: Epic 5 - Convert a Contribution into an Artefact
FR-32: Epic 6 - Manage Subscribers and personal data
FR-33: Epic 4 - Publish and Rebuild status
FR-34: Epic 4 - Activity log

Launch checklist (not build work, tracked outside stories): NFR31-NFR35 (real Articles and Artefacts, manifesto, privacy and consent approval, Turnstile fallback contact).

## Epic List

### Epic 1: Read the bilingual publication
Readers can open the home page, Articles, Editorial Series, Artefact of the Day and the privacy note in Indonesian and English, with Placeholder content, on the neutral workers.dev address. Includes the Astro + Cloudflare scaffold (AD-1), design tokens, security headers, the build snapshot path with seeded content, and noindex until the launch gate.
**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6, FR-7, FR-8, FR-9, FR-10, FR-20, FR-23, FR-24, FR-25

### Epic 2: Get updates
Readers can subscribe to the Newsletter safely, with human verification and hourly per-network limits.
**FRs covered:** FR-17, FR-18, FR-19

### Epic 3: Contribute an artefact
Readers can send an artefact story with up to five photos from /kirim; photos are downscaled in the browser, uploaded directly to private storage, verified, and acknowledged with a Reference Number; a daily job removes abandoned uploads.
**FRs covered:** FR-11, FR-12, FR-13, FR-14, FR-15

### Epic 4: Editors publish on their own
Editors sign in with an email code, write Articles in the block editor, manage Artefacts and images, publish or update content through a rebuild they can watch, and see an activity log.
**FRs covered:** FR-26, FR-27, FR-28, FR-29, FR-33, FR-34

### Epic 5: Review contributions
Editors work through the Contribution queue, approve or reject with a reason, and convert approved Contributions into draft Artefacts with cropped, metadata-free photos.
**FRs covered:** FR-30, FR-31

### Epic 6: Privacy and data retention
Editors find a person's data by email, export Subscribers and delete a person's data on request (including derived Artefacts and their copied photos); the daily job from Epic 3 also purges rejected Contributions after 90 days.
**FRs covered:** FR-21, FR-22, FR-32

## Epic 1: Read the bilingual publication

Readers can open the home page, Articles, Editorial Series, Artefact of the Day and the privacy note in Indonesian and English, with Placeholder content, on the neutral workers.dev address, readable before scripts load and hidden from search engines until the launch gate.

Implementation-craft rule for every story in this document that builds UI: before review the screen passes `antislop` and `unslop`, then the matching skills (`emil-design-eng` for motion, `better-layout` / `better-typography` / `better-colors` for layout, type and colour, `better-writing` or `design:ux-copy` for ID and EN copy, `fixing-accessibility` for the a11y pass); findings are fixed or recorded in the story's dev notes.

### Story 1.1: Project scaffold and bilingual shell on workers.dev

As a maintainer,
I want the Astro project running as one Cloudflare Worker with static assets, deployed from `main` to a neutral workers.dev address,
So that every later story ships through the same build, headers and noindex baseline.

Covers: AR1, AR2, AR3, AR4, AR5, AR6, AR41, AR42, AR46, AR48, AR50, AR53, UX-DR78, NFR14, NFR24, NFR25, NFR30

**Acceptance Criteria:**

**Given** an empty repository and no third-party starter
**When** the project is scaffolded
**Then** it uses Astro 7.4.12 with `@astrojs/cloudflare` 14.4.8 (`imageService: 'passthrough'`), React 19.3.1 for islands, Node 24.22.x, Wrangler 4.164.0, exact versions in a committed lockfile
**And** the source tree matches the Architecture Structural Seed (`src/middleware.ts`, `pages/`, `islands/`, `components/`, `server/{services,db,storage,durable,auth}`, `shared/`, `content/snapshot/` git-ignored, `i18n/`, `styles/`, `public/_headers`, `scripts/`)

**Given** `wrangler.jsonc`
**When** it is reviewed
**Then** it declares one Worker with static assets, `assets.run_worker_first` for `/admin/*`, `/api/*` and `/media/*`, `assets.not_found_handling: "404-page"`, `preview_urls: false`, `observability.logs.invocation_logs: false`
**And** no Astro sessions and no `SESSION` KV binding exist (opt-out confirmed at setup; if the adapter forces one, it gets a neutral name and the decision is noted)
**And** later bindings (D1, R2, Durable Object, cron) are added only by the stories that first use them (AD-1)

**Given** the Cloudflare account
**When** the Worker and its workers.dev subdomain are named
**Then** the Worker, subdomain and every resource name are neutral and not derived from any personal email or name (AR3, NFR25)

**Given** Astro i18n routing (AD-11)
**When** a reader opens `/` and `/en/`
**Then** each shows a minimal shell with the publication name, a one-line placeholder text and a language link, in Indonesian at `/` (`<html lang="id">`) and English at `/en/` (`<html lang="en">`)
**And** interface strings come only from `src/i18n/id.json` and `src/i18n/en.json`, and route pairs are declared once in `src/i18n/routes.ts` (later stories register their pairs there; components link only to registered routes)

**Given** `src/styles/tokens.css`
**When** the shell renders
**Then** the file exists as the single token source with the public colour, type and spacing token names from DESIGN.md (values may be filled in Story 1.2) and components contain no literal colours, radii or font stacks (AR42)

**Given** `public/_headers` and the middleware
**When** any static page or on-demand response is fetched
**Then** it carries the AD-17 CSP (`default-src 'self'; script-src 'self'` plus Astro inline-script hashes, `https://challenges.cloudflare.com`, `https://static.cloudflareinsights.com`; `connect-src 'self' https://cloudflareinsights.com`; `frame-src https://challenges.cloudflare.com`; `img-src 'self' data:`; `style-src 'self' 'unsafe-inline'`; `object-src 'none'; base-uri 'none'; frame-ancestors 'none'`), HSTS, `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`
**And** Astro 7 CSP hashing is verified at setup and the result recorded; the browser console shows no CSP violation on the shell

**Given** the build variable `PUBLIC_LAUNCH` is unset or false
**When** the site is deployed
**Then** every page has `<meta name="robots" content="noindex">`, `_headers` sends `X-Robots-Tag: noindex` and `robots.txt` disallows all (AR48)

**Given** Workers Builds connected to the repository
**When** a commit lands on `main`
**Then** the pipeline runs `npm ci --ignore-scripts` (allowlisted install scripts only) → license check → `astro check` and unit tests → `astro build` → `wrangler deploy`, with snapshot and leak-check steps added by Story 1.6
**And** only `main` builds; branch builds and preview environments are off (AR4)
**And** the license check fails the build on any `@blocknote/xl-*` package or any GPL or AGPL dependency (AR6)

**Given** the secrets list in AR50
**When** the repository is inspected
**Then** no secret value is committed, `.dev.vars` is git-ignored with a committed `.dev.vars.example` listing names only, and missing auth config makes protected paths fail closed (NFR14)
**And** deferred items (custom domain, admin hostname, email sending, search, Workers Paid) are not built (AR53)

**Given** the v1 scope guardrails
**When** any story in this document is planned
**Then** it adds no marketplace features, search or faceted filters, reader or author accounts, comments or likes, automatic publication of Contributions or Newsletter sending (NFR30)

### Story 1.2: Design tokens, self-hosted fonts and device theme

As a reader,
I want the publication to follow my device's light or dark setting with legible type,
So that reading is comfortable in either theme.

Covers: FR-23, UX-DR1, UX-DR3, UX-DR5, UX-DR6, UX-DR7, UX-DR8, AR42, AR43, NFR2

**Acceptance Criteria:**

**Given** the DESIGN.md YAML public tokens
**When** `tokens.css` is filled
**Then** it mirrors them 1:1: colours (paper, surface, ink, ink-muted, line, accent, on-accent and each `-dark` value), typography (display, manifesto, h1, h2, h3, standfirst, body, small, meta, meta-catalogue), spacing (4px scale 1 to 32, gutter-desktop, margin-mobile, max-width 1440px, measure 68ch) and radius none for every public element
**And** a unit test parses DESIGN.md YAML and fails if any public token is missing or differs in `tokens.css`

**Given** a device set to dark mode
**When** any public page loads
**Then** every public token `x` resolves to `x-dark` under `prefers-color-scheme: dark`, with no flash of the other theme and no theme toggle (FR-23)

**Given** the fonts
**When** a page loads
**Then** Fraunces (`@fontsource-variable/fraunces`, subsets `latin` and `latin-ext` only) is used for display and headings and Inter (`@fontsource-variable/inter` 5.3.0) for body and meta, both self-hosted, with only the display weight preloaded and no request to any font CDN
**And** meta uses tabular figures and only meta-catalogue is uppercase with 0.08em tracking

**Given** the public styles
**When** reviewed
**Then** there are no shadows on the public site (UX-DR6), accent text appears only on paper (UX-DR7), errors use accent plus icon plus text, and icons are Phosphor Light only with no decorative illustrations or arrows (UX-DR8)

**Given** every text and control token pair in light and dark
**When** the contrast check script runs
**Then** text pairs meet 4.5:1 and non-text controls and focus meet 3:1 (NFR2), and the script runs in CI
**And** the token preview page passes the implementation-craft rule (`better-colors`, `better-typography`)

### Story 1.3: Public chrome: header, mobile menu, language switch, footer and not-found page

As a reader,
I want consistent navigation, a language switch and a helpful not-found page on every public page,
So that I always know where I am and can move between languages.

Covers: FR-1, FR-2, UX-DR10, UX-DR11, UX-DR12, UX-DR36, UX-DR37, UX-DR38, UX-DR72, UX-DR77, UX-DR78, UX-DR79, AR41, NFR3, NFR4, NFR15, NFR29

**Acceptance Criteria:**

**Given** any public page
**When** it renders
**Then** the header shows the wordmark, anchor nav for sections that exist on the home page, and the ID/EN switch with a Phosphor globe; a skip link is the first focusable element
**And** on non-home pages the header is sticky from the top and anchors resolve to `/#section` (or `/en/#section`)
**And** `html` has `scroll-padding-top` equal to header height plus 2px so focused elements are never hidden (UX-DR72)

**Given** a viewport below the tablet breakpoint
**When** the reader activates Menu
**Then** a full-screen panel on paper lists the nav items and ID/EN switch at h3 separated by rules, focus moves to the first item and is trapped, page scroll is locked
**And** `Esc`, the close button or selecting an item closes it and returns focus to Menu

**Given** the language switch
**When** it renders in header, mobile menu and footer
**Then** links have accessible names "Bahasa Indonesia" / "English" with `lang` and `hreflang`, the current language is underlined 2px accent, and selecting the other language opens the equivalent page from the `routes.ts` pairs (FR-2)

**Given** any public page
**When** its head is inspected
**Then** `lang` matches the page language and `hreflang` alternates are declared only for language versions that exist (FR-1, UX-DR78)

**Given** the footer
**When** it renders on every public page
**Then** it shows the name and one-line description, the privacy-note link and the Contribute link only when those routes are registered, the ID/EN switch and copyright, in the page language, with 44px-tall links (UX-DR36)

**Given** an unknown path
**When** it is requested
**Then** the prerendered 404 page is served with HTTP 404, sticky header, an h1, one sentence in ID and one in EN each with its own `lang`, and links "Ke beranda / Go home" and "Artikel terbaru / Latest articles"; no illustration (UX-DR37)

**Given** the layout grid
**When** viewed at 1440, 768 and 375 wide
**Then** it uses 12 columns (max 1440, 32px gutters), 6 columns and 4 columns with a 16px side gutter, sections separated by full-width rules with a sentence-case meta label and no section numbers, and no horizontal scroll at 375 (UX-DR38)

**Given** keyboard-only use
**When** tabbing through the chrome
**Then** every control is reachable, shows a visible focus ring and has a target of at least 24×24px (NFR3, NFR4, UX-DR77)
**And** the chrome passes the implementation-craft rule (including `better-writing` for ID/EN strings, sentence case, no em dashes)

### Story 1.4: Content schema, media serving and Placeholder seed

As a maintainer,
I want the content tables, the public media route and a local seed of Placeholder fixtures with images,
So that public pages can be built and tested against realistic content without real data.

Covers: FR-25, AR7, AR8, AR9, AR11, AR22, AR27, AR29, AR52, NFR16

**Acceptance Criteria:**

**Given** `src/server/db/schema.ts` (Drizzle 0.45.4, the only table definition)
**When** the first migration is generated with drizzle-kit 0.31.11
**Then** it creates `article`, `article_translation`, `artefact`, `artefact_translation`, `media_asset`, `media_ref`, `media_ref_translation` and `site_state` (with `content_version` starting at 0), and no other table
**And** translations hold working fields, `published_*` fields, Publication Status (`draft` | `published`), `published_at` and `revision`; `article`, `artefact` and `media_asset` have `is_placeholder`; artefact holds the Catalogue Record fields (inventory number, year or estimated year, Category, provenance, contributor credit)
**And** keys are UUID v4 text from `crypto.randomUUID()`, timestamps ISO 8601 UTC, and (`lang`, `slug`) is unique on `article_translation` (AR9)

**Given** the D1 binding
**When** `wrangler.jsonc` is updated
**Then** it binds one neutrally named D1 database, a `Db` client factory in `src/server/db/client.ts` works from the Worker, Node scripts and tests, and the PR template carries the "migrations applied with `wrangler d1 migrations apply --remote` before merge" checkbox (AR7)

**Given** `src/shared/enums.ts`
**When** Editorial Series and Category are used anywhere
**Then** only `temuan`, `jejak-proses`, `ingatan-bersama`, `stratigrafi` and `budaya-visual`, `proses`, `ingatan` are accepted, with labels and one-line descriptions in the i18n files (AR11)

**Given** `src/shared/blocks.ts`
**When** a body JSON document is validated
**Then** it accepts headings, paragraphs, quotes, image blocks (media id, per-language alt text, caption, credit), the custom `catalogueRecord` block (Artefact ID only) and an inline language mark, and rejects anything else (AR22)

**Given** the `MEDIA` R2 bucket (neutral name, no `r2.dev` URL) bound in `wrangler.jsonc`
**When** `GET /media/<key>` is requested (added to the middleware public allowlist)
**Then** only keys matching `^[0-9a-f-]{36}(-w\d+)?\.(jpg|png|webp)$` are served, with the `Content-Type` stored on the `media_asset` row, `X-Content-Type-Options: nosniff`, CSP `default-src 'none'; img-src 'self'; sandbox`, `Content-Disposition: inline; filename="<uuid>.<ext>"` and `Cache-Control: public, max-age=31536000, immutable` (AR27, AR29)
**And** any other key, including anything under `staging/`, or a key with no object returns 404; the route reads through `services/media` and never lists the bucket
**And** tests cover a valid variant key, a `staging/` key, a path-traversal attempt and an unknown key

**Given** `scripts/seed.ts` on a local environment
**When** it runs
**Then** it creates Placeholder fixtures only, all with `is_placeholder = true`: at least 7 Articles across three of the four Editorial Series (one series left empty), at least one Article in Indonesian only, Articles with three or more h2 headings and with a `catalogueRecord` block, at least 3 published Artefacts and one draft, with published copies filled and `content_version` bumped
**And** it generates plain Placeholder images (a flat surface-colour fill at each fixture's real aspect ratio) as WebP variants 640, 1280 and 2000 wide, puts them in the local `MEDIA` bucket under UUID keys, and writes their `media_asset` rows (variants, MIME, dimensions, a neutral surface tint, `is_placeholder = true`) and the `media_ref` rows for Article heroes, body image blocks and Artefact images, with Placeholder alt text in each language
**And** fixtures use pseudonyms and only the `contoh.id` domain, never real names or emails (AR52)
**And** running the seed twice yields the same rows and objects (idempotent)
**And** the dev notes record that `scripts/seed.ts` writes local D1 and R2 directly as a fixture tool, an accepted exception to services owning every write (AD-4); it never runs against remote resources

### Story 1.5: Build snapshot endpoint with public DTOs

As a maintainer,
I want an authenticated snapshot endpoint that returns only published, public fields,
So that the build can never pull private or draft data into the public site.

Covers: AR13, AR14, AR15, AR24, AR25, NFR11

**Acceptance Criteria:**

**Given** `src/shared/public.ts`
**When** the DTOs are defined
**Then** `PublicArticle`, `PublicArtefact` and `PublicMedia` are Zod `.strict()` schemas holding only published copies of published translations (title, standfirst, slug, series, author, date, body JSON, hero media, related data, Catalogue Record fields, alt text, caption, credit, tint, dimensions, `is_placeholder`)
**And** a unit test proves an unknown or private field (for example a working copy or `source_contribution_id`) makes parsing fail

**Given** `GET /api/build/snapshot`
**When** called with a valid Cloudflare Access service token
**Then** it returns `{ ok: true, data: { content_version, articles, artefacts, media } }` with draft translations and unpublished entities omitted
**And** a `catalogueRecord` block pointing at an unpublished Artefact is omitted from the returned data

**Given** the deny-by-default middleware
**When** `/api/build/*` is requested without a valid `Cf-Access-Jwt-Assertion` for the service token (missing header, wrong issuer or AUD, expired token, or missing `ACCESS_AUD` / `ACCESS_TEAM_DOMAIN` config)
**Then** it returns JSON 401 or 403 and never reaches the route; any other on-demand path not yet registered as public returns 404 (fail closed)
**And** the verifier in `src/server/auth` uses `jose` 6.2.17 against the team certs, pinning issuer and AUD; the Access application covers `/api/build/*` on the workers.dev hostname with a service-token policy, and the token ID and secret live only in Workers Builds variables (AR24)

**Given** route code
**When** reviewed
**Then** the route calls a service that takes `Db` as a parameter (routes → services → data, AR14) and every route uses the one error wrapper that logs only `{ event, code, id }` and returns `{ ok: false, error: { code } }` (AR13)

### Story 1.6: Article rendering, prebuild snapshot and leak check

As a reader,
I want Articles rendered as static, sanitized HTML at build time,
So that pages are fast, safe and never expose private data.

Covers: AR5, AR16, AR17, AR23, AR47, NFR7

**Acceptance Criteria:**

**Given** `renderArticleHtml(doc, document)` in `src/shared/render.ts`
**When** it renders a BlockNote JSON body
**Then** it outputs semantic `h2`, `h3`, `p`, `blockquote`, `figure` with `figcaption`, the Catalogue Record markup and `lang` on inline language marks
**And** an allowlist sanitizer limits tags per block, attributes per tag, `href` to `https:`, `mailto:` and same-site relative, `src` to `/media/`; a fixture with `<script>`, `javascript:` links, `onerror` attributes and external `src` renders none of them
**And** reading time is computed from the published JSON in the same module and the function runs in Node (with `@blocknote/server-util`) and in the browser with identical output for the same input (snapshot test)

**Given** `scripts/snapshot.ts`
**When** the build runs
**Then** it fetches the snapshot with the service token, renders each Article body, writes `src/content/snapshot/*.json`, and Astro content collections load only those files
**And** if the snapshot fetch fails or returns invalid DTOs the build fails and the previously deployed site stays live

**Given** every public page, current and future (home, Article and 404 now, and each page later stories add)
**When** built
**Then** it is prerendered and no public page queries D1 at request time
**And** data for islands is passed only as static JSON or `<script type="application/json">` with `<` escaped (AR47), and no `set:html` or `dangerouslySetInnerHTML` exists outside `render.ts` (a lint rule enforces it)

**Given** `scripts/check-dist.ts` runs after `astro build`
**When** `dist/` contains an email pattern, an `AOO-` followed by six Crockford characters, or any `admin` path
**Then** the deploy fails with the offending file named; a fixture test proves each case fails and a clean build passes
**And** the pipeline order is now complete: install → license check → `astro check` and tests → snapshot → build → leak check → deploy (AR5)

### Story 1.7: Home Masthead and Latest Articles

As a reader,
I want to see what the publication is and its newest Articles on the home page,
So that I can start reading right away.

Covers: FR-3, FR-4, FR-25, UX-DR9, UX-DR13, UX-DR14, UX-DR15, UX-DR35, UX-DR39, UX-DR73, NFR8

**Acceptance Criteria:**

**Given** the home page at 375×812 and 1440×900
**When** it loads
**Then** the Masthead shows the name at display size, the manifesto (max 52ch) with the Placeholder marker while it awaits client text, "Baca artikel / Read articles" (primary) and "Kirim artefak / Contribute an artefact" (secondary, rendered only when the Contribute route is registered), stacked full width at 375, and the ID/EN switch top right, all without scrolling (FR-3)
**And** five `aria-hidden` strata bands with 1px ink rules, the specified fills and heights (desktop 48/12/88/20/40px, mobile 28/8/48/12/28px) and a 12px accent find mark in the third band render statically (ref `mockups/public-home.html`)

**Given** the reader activates "Baca artikel"
**When** the page scrolls to Latest Articles
**Then** focus moves to the Latest Articles heading (UX-DR73)

**Given** the snapshot has seven or more Articles in the page language
**When** Latest Articles renders
**Then** the six newest by date show newest first, the newest as a featured card spanning two columns with an h2 title, each card showing series label, title, 2-line excerpt, date · reading time and a 3:2 image (FR-4, UX-DR14, UX-DR15)
**And** the title is the only link with its hit area stretched over the card, focus outlines the card, hover underlines the title only and the image never moves
**And** Articles not available in the page language are not listed

**Given** fewer than six Articles exist in the page language
**When** the section renders
**Then** it shows only those that exist with no empty slots

**Given** Placeholder content
**When** any Placeholder Article, image or manifesto renders
**Then** it shows the marker "Contoh" (ID) / "Placeholder" (EN) in an accent border on paper, and a Placeholder image is a plain surface slot at the real aspect ratio with placeholder alt text (FR-25, UX-DR35)

**Given** public buttons
**When** rendered
**Then** primary and secondary follow UX-DR13 (square, min 48px, hover rules, busy and disabled at 40% with `aria-disabled="true"` and focus ring kept)
**And** home sections follow UX-DR39 order, with later sections inserted by their own stories
**And** the page passes the implementation-craft rule

### Story 1.8: Article page

As a reader,
I want to read an Article with its images, Catalogue Record and related Articles,
So that I get the full story in a comfortable layout.

Covers: FR-1, FR-2, FR-6, FR-7, UX-DR18, UX-DR19, UX-DR22, UX-DR23, UX-DR24, UX-DR25, UX-DR74, AR37, NFR1, NFR7, NFR9

**Acceptance Criteria:**

**Given** a published Article
**When** a reader opens `/artikel/[slug]` or `/en/articles/[slug]`
**Then** the page shows series label, h1 title, standfirst, byline with author, date and reading time, hero image with caption and credit, and the rendered body in a column no wider than 68ch, with pull quotes in Fraunces roman at h2 size (no italic, no rule) (FR-6, UX-DR22)
**And** every image has alt text, and images showing an Artefact carry a credit
**And** images render `srcset` from the stored width variants with explicit width and height, so there is no blocking layout shift (AR37, NFR9)

**Given** scripts are blocked
**When** the Article loads
**Then** all text, images and links are readable (NFR7)

**Given** an embedded Catalogue Record
**When** it renders
**Then** it is a bordered key/value list (inventory number, year, Category, provenance, contributor credit) with meta-catalogue labels, and the Category tag uses a 1px ink border with the label in the page language (UX-DR18, UX-DR19)

**Given** other Articles in the same Editorial Series and language
**When** the Related Articles row renders
**Then** it shows up to three of them, never the current Article; with none it is omitted (FR-7)

**Given** an Article with three or more h2 headings
**When** the page renders
**Then** a table of contents shows (sidebar on desktop, collapsed disclosure above the body on mobile), the current heading has an accent left rule, and a link moves focus to its heading; with fewer than three h2 headings no table of contents renders (UX-DR24)

**Given** an Article page
**When** the reader scrolls
**Then** a 2px accent `aria-hidden` progress bar under the sticky header tracks the body only (UX-DR23)

**Given** the share control
**When** the reader activates "Salin tautan / Copy link"
**Then** the URL is copied and "Tautan tersalin / Link copied" is announced in a polite live region; native share appears only where supported (UX-DR25)

**Given** an Article that exists in Indonesian only
**When** the reader switches to English
**Then** they land on `/en/` with a notice that the Article is not yet available in English, and the Indonesian page declares no English `hreflang` (FR-1, FR-2)

**Given** a slug that is unknown or unpublished
**When** requested
**Then** the 404 page is served
**And** the page passes the implementation-craft rule and an axe check with zero violations (NFR1)

### Story 1.9: Editorial Series section

As a reader,
I want to see the four Editorial Series with their latest Article,
So that I understand how the publication is organised.

Covers: FR-5, UX-DR16

**Acceptance Criteria:**

**Given** the home page
**When** the Editorial Series section renders in its UX-DR39 position
**Then** all four series appear with name (h3), one-line description, a link to the latest Article in the page language and an Article count in meta (FR-5)

**Given** a series with no Article in the page language
**When** it renders
**Then** it shows "Segera hadir / Coming soon" with no link

**Given** pointer hover on a series block
**When** hovered
**Then** its rule turns accent and nothing else moves
**And** the section passes the implementation-craft rule

### Story 1.10: Artefact of the Day

As a reader,
I want one featured Artefact each day with the option to see another,
So that I can browse the catalogue without searching.

Covers: FR-9, FR-10, AR45, AR47, UX-DR17, UX-DR18, UX-DR20, UX-DR21, UX-DR74, NFR2

**Acceptance Criteria:**

**Given** `pickDaily(poolIds, date)` in `src/shared/daily.ts`
**When** called with the same ascending ID list and the same Asia/Jakarta date
**Then** it returns the same ID every time (stable hash), and unit tests cover the 23:59 and 00:00 WIB boundary and a pool of one

**Given** the build
**When** it runs
**Then** it writes the published Artefact pool as a static JSON asset of `PublicArtefact` DTOs with stored tint, and the prerendered home shows the build-day pick with its large image and Catalogue Record block (UX-DR18)

**Given** the home page loads on a later Jakarta date than the build
**When** the swap island runs
**Then** it recomputes the pick for the current Jakarta date and swaps if different, without a rebuild or cron (AR45)

**Given** "Tampilkan lainnya / Show another"
**When** the reader activates it
**Then** a random different Artefact replaces the current one without reload, crossfading 0.4s with the tint transitioning 0.6s, the button busy during the swap, and the new title announced politely (FR-9, UX-DR20)
**And** if the pool fetch fails, the current Artefact stays, one silent retry happens, then a short inline note appears

**Given** JavaScript is off, or the pool holds one Artefact
**When** the section renders
**Then** the first pick shows and the button is hidden

**Given** `clampTint()` in `src/shared/tint.ts`
**When** given a dominant colour
**Then** it converts to OKLCH keeping hue and chroma, raises lightness to relative luminance ≥ 0.62 (light) or lowers it to ≤ 0.038 (dark), reduces chroma when out of sRGB gamut, and returns surface or surface-dark when any text pair falls below 4.5:1 or borders and focus below 3:1 (FR-10, UX-DR21)
**And** unit tests cover a saturated red, a near-black, a near-white and an out-of-gamut input; the seed from Story 1.4 now stores tints computed by this function instead of the neutral surface tint, and accent text never sits on the tint (UX-DR7)

**Given** catalogue cards where they appear
**When** rendered
**Then** they use a 4:5 image, inventory number and year in meta-catalogue, h3 title, Category tag and provenance, hover underlining the title only (UX-DR17)
**And** the section passes the implementation-craft rule

### Story 1.11: Masthead strata motion and section reveal

As a reader,
I want a quiet signature motion on the Masthead that respects my motion settings,
So that the site feels crafted without distracting me.

Covers: FR-24, UX-DR10, UX-DR40, UX-DR41, UX-DR42, AR44

**Acceptance Criteria:**

**Given** the home page
**When** the reader scrolls from Masthead top at viewport top to Masthead bottom at viewport top
**Then** the five strata bands separate vertically via GSAP 3.15.1 ScrollTrigger scrub, with gap, easing and header-reveal timing tuned in a motion prototype using `emil-design-eng` (UX-DR40)
**And** GSAP loads on the home page only; other pages ship no GSAP (AR44)

**Given** the home header
**When** the Masthead is in view
**Then** the header is hidden and `inert`, and it is revealed once the Masthead leaves view (UX-DR10)

**Given** the Masthead content and the Artefact of the Day
**When** they enter view the first time
**Then** they fade up once (0.6s, power3.out, translateY 24px); every other section is static, nothing moves inside Article text and no image scales on hover (UX-DR41)

**Given** `prefers-reduced-motion: reduce`
**When** any public page scrolls
**Then** bands stay closed, there is no fade-up and swaps are instant; no element moves on scroll (FR-24, UX-DR42)
**And** scrolling stays smooth (no long tasks over 50ms from scroll handlers in a performance trace) and the motion passes `emil-design-eng` plus the implementation-craft rule

### Story 1.12: Privacy note page

As a reader,
I want a privacy note in my language,
So that I know what is stored about Subscribers and Contributors, why, for how long and how to ask for deletion.

Covers: FR-20, FR-1, NFR18, NFR15, UX-DR79

**Acceptance Criteria:**

**Given** `/privasi` and `/en/privacy`
**When** a reader opens either
**Then** the page states what is stored for Subscribers (email, language, time) and Contributors (fields from FR-11, Reference Number, Review Status, timestamps), why, for how long (rejected Contributions deleted 90 days after rejection; others kept until deletion is requested), that network addresses are never stored and a keyed hash is kept up to 1 hour, that deleted data may persist in backups up to 7 days, and how to request deletion with a 30-day response time (FR-20, NFR18)
**And** the route pair is registered so the footer link and language switch work, with matching `hreflang`

**Given** the wording
**When** stored in the i18n files
**Then** it is flagged pending client approval so the launch gate can find it, and contains no email address (the contact route is described, not written as an address)
**And** the page passes the implementation-craft rule with `better-writing` for both languages

### Story 1.13: Sharing metadata, cookieless analytics and launch gate

As the publication owner,
I want correct share previews, cookieless page counts and a build that refuses to launch with Placeholders,
So that sharing works, success can be measured and nothing unfinished goes public.

Covers: FR-8, FR-25, AR48, AR49, NFR8, NFR21, NFR36, NFR38

**Acceptance Criteria:**

**Given** every public page
**When** its head is inspected
**Then** it has a title, description, Open Graph image and canonical URL in the page language, and Article pages also expose `Article` JSON-LD with headline, date, author and hero image (FR-8)
**And** a shared Article URL previews its title, description and hero image (checked with a social preview validator)

**Given** public pages
**When** loaded
**Then** the Cloudflare Web Analytics beacon is present and sets no cookies; no other analytics or tracker is loaded, and admin and API responses have no beacon (AR49, NFR21, NFR36)

**Given** `PUBLIC_LAUNCH=true`
**When** the build runs and any published record has `is_placeholder = true` or any copy string is flagged Placeholder
**Then** the build fails naming each flagged item; with no flags it removes the noindex meta, `X-Robots-Tag` and the disallow-all `robots.txt` (AR48)

**Given** home and an Article page with seed content
**When** Lighthouse runs with default mobile throttling
**Then** LCP is ≤ 2.5s and all four categories score ≥ 90 (NFR8, NFR38), recorded in the story notes

## Epic 2: Get updates

Readers can subscribe to the Newsletter safely, with human verification, hourly per-network limits and no way to learn whether an email is already subscribed.

### Story 2.1: Subscribe endpoint with the public write guard chain

As a reader,
I want my Newsletter sign-up stored once and safely,
So that I get updates without my email being exposed or duplicated.

Covers: FR-17, FR-18, FR-34, AR12, AR13, AR20, AR25, AR31, AR33, AR50, NFR11, NFR16, NFR17

**Acceptance Criteria:**

**Given** the second migration
**When** it is applied
**Then** it creates only the `subscriber` table (id, email, language, created_at) with a unique index on the trimmed, lowercased email (AR12, NFR16) and the `activity_log` table with exactly the columns `id, at, actor, action, entity_type, entity_id, ref` (AR20)

**Given** `src/server/services/activity.ts`
**When** a service writes
**Then** `activity.entry({ actor, action, entityType, entityId, ref })` returns a Drizzle statement the caller adds to its own D1 batch, so the row commits or fails with the write it records (AD-4)
**And** `actor` accepts only a verified Editor email, `public` or `system`; `ref` accepts only a Reference Number, a slug or null, and a unit test proves an email-shaped `ref` is rejected
**And** this service is reused by every later story that writes; no later story creates another activity table or helper

**Given** the shared Turnstile check in `src/server/services/turnstile.ts`
**When** a token is verified
**Then** it calls `siteverify` with `TURNSTILE_SECRET` and accepts only when `success` is true and `hostname` and `action` match; the widget uses a neutral name in managed mode and the site key is a public variable (AR33)

**Given** `POST /api/subscribe` (registered as public in the middleware allowlist)
**When** a request arrives
**Then** the chain runs in order: body larger than 64 KB rejected (`payload_too_large`) → Turnstile (`verification_failed`) → Zod schema from `src/shared/schemas.ts` (`invalid_email`, field `email`) → `subscribers.subscribe()` (AR31); the per-network limit is inserted before Turnstile by Story 2.2
**And** responses use `{ ok: true, data }` / `{ ok: false, error: { code, field? } }` (AR13)

**Given** a valid new email or an email already subscribed
**When** the request succeeds
**Then** both return the identical response body, status and timing class, and only one Subscriber row exists for that email (FR-17, FR-18)
**And** a new Subscriber row and its activity row (actor `public`, action `subscriber_created`, ref null) are written in the same D1 batch; a repeat email writes neither, and no email ever reaches `activity_log` (AR20)

**Given** any subscribe request
**When** logs are inspected
**Then** they hold only `{ event, code, id }`; no email, IP, header or Zod issue text appears (NFR17)
**And** unit tests cover invalid email, duplicate email, missing token, failed token and oversized body

### Story 2.2: Per-network hourly limit with the RateLimiter Durable Object

As the publication owner,
I want sign-ups limited per network without storing anyone's address,
So that bots cannot flood the list and readers' privacy is kept.

Covers: FR-19, AR32, NFR17

**Acceptance Criteria:**

**Given** the SQLite Durable Object class `RateLimiter` bound in `wrangler.jsonc` with a neutral name
**When** a public write is checked
**Then** the instance is keyed by `HMAC-SHA256(RL_HMAC_KEY, address)` where IPv4 uses the full address and IPv6 its /64, the instance stores a count only, and an alarm deletes it 1 hour after the window opens (AR32)

**Given** a network that has made 20 subscribe requests this hour
**When** it sends the 21st
**Then** it is rejected with `rate_limited` before Turnstile runs, and the client shows the "try again later" line (FR-19)

**Given** the limiter
**When** D1, R2, Durable Object storage and logs are inspected after requests
**Then** no raw IP appears anywhere; a test asserts the stored key is the HMAC and the count is the only value (NFR17)
**And** the class exposes a generic `hit(scope, limit)` so Epic 3 reuses it with a different limit, and a missing `RL_HMAC_KEY` fails closed with `unavailable`

### Story 2.3: Newsletter section on the home page

As a reader,
I want a calm sign-up form on the home page,
So that I can subscribe without pop-ups or pressure.

Covers: FR-17, FR-18, UX-DR34, UX-DR74, UX-DR79, NFR5, NFR6, NFR15, NFR39

**Acceptance Criteria:**

**Given** the home page
**When** the Newsletter section renders in its UX-DR39 position
**Then** it shows a label, email input, consent text, the Turnstile widget (page language and theme) and a submit button, and the header nav gains its Newsletter anchor (UX-DR34)

**Given** an invalid email
**When** the reader leaves the field or submits
**Then** an inline message linked by `aria-describedby` appears before any request is sent (NFR5)

**Given** a successful submit, new or repeat email
**When** the response arrives
**Then** the same confirmation shows as small ink text below the button inside `aria-live="polite"` (FR-18, NFR6)

**Given** `rate_limited`, `verification_failed` or a network error
**When** it occurs
**Then** the matching ID or EN line from Voice and Tone shows with an accent icon, the widget resets and the typed email is kept

**Given** the whole site
**When** reviewed
**Then** there are no sign-up pop-ups, interruptive prompts or incentives (NFR39)
**And** the section passes the implementation-craft rule, with copy via `better-writing` or `design:ux-copy`

## Epic 3: Contribute an artefact

Readers can send an artefact story with up to five photos from `/kirim`; photos are downscaled and stripped in the browser, uploaded directly to private storage, verified by content, and acknowledged with a Reference Number. A daily job removes abandoned uploads and releases their reserved capacity.

### Story 3.1: Contribute page and form fields

As a contributor,
I want a clear form that tells me exactly what is needed,
So that I can describe my artefact without guessing.

Covers: FR-11, FR-3, UX-DR26, UX-DR27, UX-DR28, UX-DR30, UX-DR31, UX-DR33, UX-DR79, AR12, NFR5, NFR15, NFR29

**Acceptance Criteria:**

**Given** the route pair `/kirim` ↔ `/en/contribute` registered in `routes.ts`
**When** a reader opens either
**Then** a prerendered page with FR-8 metadata and `hreflang` pairs shows the form in one column max 640px, grouped About you · About the artefact · Photos · Consent (ref `mockups/public-kirim.html`, UX-DR27)
**And** the Masthead "Kirim artefak" action, the footer link and a new home Contribute invitation section (short copy and primary "Kirim artefak / Contribute an artefact" button, UX-DR26) now appear and link here

**Given** the fields
**When** rendered
**Then** name or pseudonym, email, artefact title, story (max 5,000 with a live character count), Category (from `enums.ts`) and consent are required; year or estimated year and provenance are optional; labels sit above fields, 1px ink border, square, min 48px (FR-11, UX-DR28)

**Given** the consent checkbox
**When** rendered
**Then** it is a 20px square whose label covers ownership or rights and permission to publish, crop, edit and translate with credit after review, linking to the privacy note in a new view without losing the form (UX-DR30)
**And** the consent text is flagged pending client approval in the i18n files

**Given** a missing or invalid required field
**When** the reader leaves it or submits
**Then** an accent border plus message with Phosphor warning icon appears beside it via `aria-describedby`, and on submit an error summary at the top (1px accent border, h3 heading, one link per failed field) receives focus (UX-DR31, NFR5)
**And** validation uses the shared Zod schema later reused by the endpoint (AR12)

**Given** JavaScript is off
**When** the page loads
**Then** a notice explains that JavaScript is needed for human verification and links the privacy note, and no form that would fail is offered (UX-DR33)
**And** the page passes the implementation-craft rule, with `better-writing` or `design:ux-copy` on all ID and EN form copy

### Story 3.2: Contribution start endpoint with presigned uploads and site-wide caps

As a contributor,
I want my photos to go straight to private storage after I pass verification,
So that large photos upload reliably and are never public.

Covers: FR-14, FR-15, AR8, AR21, AR27, AR31, AR32, AR34, AR35, NFR13, NFR16, NFR17, NFR20, NFR24

**Acceptance Criteria:**

**Given** a new migration
**When** applied
**Then** it creates only `contribution` (id, intake status `uploading` | `received`, Review Status default `pending`, name, email lowercased with a lookup index, title, story, Category, year, provenance, consent_at, lang, created_at, nullable reference_number unique) and `contribution_photo` (id, contribution_id, r2_key, size, mime, width, height, status) (FR-14, NFR16)

**Given** the private `CONTRIBUTIONS` R2 bucket (neutral name)
**When** configured
**Then** keys are random UUIDs, no `r2.dev` URL is enabled, CORS allows PUT from the site origin only, and no route serves its objects publicly (AR27, NFR13)

**Given** `POST /api/contribute/start` with fields and 1 to 5 file sizes
**When** the guard chain runs (body > 64 KB → `RateLimiter.hit` 5 per hour per network → Turnstile → Zod → service)
**Then** no upload URL is issued unless all pass (AR31)
**And** a sixth file, a size over 10 MB or zero files is rejected with a per-file code

**Given** the global `RateLimiter` instance
**When** `start` is called
**Then** it rejects with `capacity_reached` once 100 Contributions have started this Asia/Jakarta day or reserved photo bytes would exceed 5 GB, before any upload URL; otherwise it reserves the declared bytes (AR32, NFR20)

**Given** a passing request
**When** `contributions.start()` runs
**Then** it creates the record `uploading` and its photo rows, and returns an upload token plus one SigV4 presigned PUT URL per file (random key, 10-minute expiry) signed with WebCrypto in `src/server/storage/presign.ts` using `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` scoped to the two buckets (AR34, AR35)
**And** if the D1 write fails after any R2 action, created R2 objects are deleted (AR21)

**Given** any start request
**When** storage and logs are inspected
**Then** no raw IP is stored and no email or story text is logged; the request stays within Workers Free limits (no photo bytes pass through the Worker) (NFR17, NFR24)

### Story 3.3: Contribution finish with content verification and Reference Number

As a contributor,
I want my upload confirmed and a Reference Number returned,
So that I know my Contribution arrived and can refer to it.

Covers: FR-12, FR-13, FR-14, FR-34, AR10, AR20, AR28, AR29, AR32, AR34, AR35, NFR12, NFR19

**Acceptance Criteria:**

**Given** `sniffImage(bytes)` in `src/server/storage/sniff-image.ts`
**When** it inspects the first and last 64 KB of an object
**Then** it accepts only JPEG, PNG and WebP by magic bytes, rejects metadata segments outside the structural allowlist (EXIF, XMP, GPS) and images above 40 megapixels with `photo_metadata` or `photo_type`, and ignores the client's declared type and filename (AR28, NFR12)
**And** fixture tests cover a renamed PDF, a JPEG with GPS EXIF, an oversized PNG and a valid WebP

**Given** `POST /api/contribute/finish` with a valid upload token (no new Turnstile pass needed)
**When** it runs
**Then** it heads each object, sniffs it, stores MIME, width and height, deletes failed objects and returns per-file codes (AR34)
**And** when at least one photo is valid it assigns a Reference Number `AOO-` plus 6 Crockford base32 characters from a CSPRNG (unique, retried on collision, never sequential), sets intake `received` with Review Status `pending`, and corrects the global byte reservation to the actual stored size (AR10, AR32, AR35)
**And** the same D1 batch writes an activity row through `services/activity` from Story 2.1 (actor `public`, action `contribution_received`, ref the Reference Number); no name, email or story text is written to `activity_log` (AR20)

**Given** all photos fail or the token is expired or reused
**When** `finish` is called
**Then** the record stays `uploading`, no Reference Number is assigned and a stable code is returned

**Given** the Worker
**When** `finish` runs
**Then** it never reads a whole photo body; a test asserts only ranged reads are used

**Given** a stored Contribution
**When** any public URL is tried (snapshot, `/media/*`, static assets)
**Then** no Contribution, photo or email is reachable; the leak check stays green (FR-14)

### Story 3.4: Photo uploader with in-browser downscale and per-file feedback

As a contributor,
I want to see each photo prepared, uploaded and checked,
So that I know which photo has a problem and can fix only that one.

Covers: FR-12, FR-13, FR-15, AR30, UX-DR29, UX-DR74, UX-DR76, UX-DR77, NFR6, NFR19

**Acceptance Criteria:**

**Given** `reencodeImage()` in `src/islands/lib/`
**When** a photo is added
**Then** it is re-encoded in the browser to long edge ≤ 3000 px as JPEG or WebP at quality 0.85 with all metadata dropped, before any upload (AR30, FR-15, NFR19)
**And** a test confirms an EXIF GPS JPEG comes out with no metadata segments

**Given** the drop zone
**When** rendered
**Then** it has a dashed ink border, upload icon, "drag or choose photos" text, a real "Pilih foto" button carrying focus and a limits line; drag-over shows an accent border with surface fill (UX-DR29)
**And** the button is the single-pointer and keyboard alternative to drag-and-drop (UX-DR76)

**Given** files are chosen
**When** one is not JPG, PNG or WebP or is over 10 MB
**Then** it is rejected by filename with the rule stated (type label in ink with accent warning icon), and the other valid files stay (FR-12)

**Given** five photos are attached
**When** the reader tries to add a sixth
**Then** it is not added and the reason is shown

**Given** valid photos
**When** they are prepared and uploaded to their presigned URLs
**Then** each shows a thumbnail, filename, size, remove button and per-file progress, with states "Menyiapkan foto…", "Mengunggah {n}%", "Terunggah" announced through `aria-live` (NFR6)
**And** a failed file offers a per-file retry without affecting the others
**And** the uploader passes the implementation-craft rule and `fixing-accessibility`

### Story 3.5: Submit, success and failure screens

As a contributor,
I want a clear result after I send my artefact,
So that I either have my Reference Number or know exactly what to do next.

Covers: FR-11, FR-13, FR-15, UX-DR31, UX-DR32, UX-DR33, UX-DR73, UX-DR74, UX-DR79, NFR6, NFR10

**Acceptance Criteria:**

**Given** a valid form with photos and a passed Turnstile widget (page language, page theme, above submit)
**When** the reader submits
**Then** the button shows busy with progress, the island calls `start`, uploads, then `finish`

**Given** `finish` succeeds
**When** the success screen replaces the form
**Then** its h1 receives focus, the Reference Number is on its own line at h2 size with tabular figures, the summary shows in a Catalogue Record block, and the text says the Editor may contact them by email and that they can withdraw before publication by replying with the Reference Number (FR-13, UX-DR32)

**Given** Turnstile fails
**When** the reader submits
**Then** "Verifikasi gagal…" appears in the error summary, the widget resets and all entries are kept (UX-DR31)

**Given** the whole submit fails or the browser is offline
**When** the error occurs
**Then** all text and photos stay, "Kiriman belum terkirim…" explains what to do next, and retry resumes without re-entering anything (NFR10, UX-DR33)

**Given** `rate_limited` or `capacity_reached`
**When** returned
**Then** the matching Voice and Tone line shows in the page language, entries are kept, and the network-address helper line explains that only a scrambled code is kept for up to 1 hour

**Given** each submission state
**When** it changes
**Then** it is announced in a polite live region (NFR6, UX-DR74)
**And** the flow passes the implementation-craft rule with `better-writing` or `design:ux-copy` on every ID and EN message (sentence case, no em dashes)

### Story 3.6: Daily cleanup of abandoned uploads

As the publication owner,
I want abandoned Contribution uploads and orphaned photos removed every night,
So that private photos never linger and the 5 GB capacity is not used up by uploads that never finished.

Covers: FR-14, FR-15, AR20, AR21, AR32, AR39, NFR17, NFR20

**Acceptance Criteria:**

**Given** `wrangler.jsonc`
**When** this story ships
**Then** it declares one Cron Trigger `0 19 * * *` (UTC, 02:00 WIB) and the Worker's `scheduled` handler calls `src/server/cron.ts`, which runs an ordered list of steps (AR39)
**And** the list holds, in AD-10 order, `contributions.purgeStaleUploads()` then the orphaned `CONTRIBUTIONS` sweep; later stories insert their steps into this same list at their AD-10 positions and never add a second trigger or handler
**And** a failure in one step is logged only as `{ event, code }` and the following steps still run

**Given** Contribution records still `uploading` 24 hours after `start`
**When** `contributions.purgeStaleUploads()` runs
**Then** their `CONTRIBUTIONS` objects are deleted first, then their photo and contribution rows with an activity row each (actor `system`, action `upload_purged`, ref null) in the same D1 batch through `services/activity` (AR20, AR21)
**And** their reserved photo bytes are released from the global `RateLimiter` instance, so the 5 GB cap counts only stored photos (AR32, NFR20)
**And** if an R2 deletion fails the rows stay for the next run, so no photo is left without a record

**Given** `CONTRIBUTIONS` objects older than 24 hours whose key matches no `contribution_photo` row
**When** the orphan sweep runs
**Then** they are deleted; objects younger than 24 hours are left alone so in-flight uploads are never touched

**Given** the job
**When** tested locally with `wrangler dev --test-scheduled` and fixtures dated by the test
**Then** a 25-hour-old `uploading` record and its objects are gone with capacity released, a 23-hour-old one and every `received` Contribution are untouched, and a 25-hour-old orphan object is gone
**And** the logs hold no email, name, Reference Number or IP (NFR17)

## Epic 4: Editors publish on their own

Editors sign in with an email code, write Articles in the block editor, manage Artefacts and images, publish or update content through a rebuild they can watch, and see an activity log.

### Story 4.1: Editor sign-in and server-side identity check

As an Editor,
I want to sign in with a one-time code sent to my allowlisted email,
So that only Editors can reach the Dashboard and its data.

Covers: FR-26, AR24, AR25, AR26, AR50, NFR11, NFR14

**Acceptance Criteria:**

**Given** the Cloudflare Access application (neutral team domain)
**When** configured
**Then** it protects `/admin/*`, `/api/admin/*` and `/api/build/*` on the workers.dev hostname with email one-time PIN and the Editor allowlist only in the Access policy, keeping the build service-token policy from Story 1.5; the path-scoped app is verified at setup, and if path scoping fails the whole hostname goes behind Access until launch and the decision is recorded (AR24)

**Given** the middleware extended for Editors
**When** a request reaches `/admin/*` or `/api/admin/*`
**Then** it verifies `Cf-Access-Jwt-Assertion` with the shared `jose` verifier (issuer and AUD pinned) and requires the `email` claim to be in secret `EDITOR_EMAILS`; otherwise it returns 403 and never runs the route (FR-26, AR25)
**And** a missing header, missing `EDITOR_EMAILS`, `ACCESS_AUD` or `ACCESS_TEAM_DOMAIN` fails closed
**And** an expired Access session on `/api/admin/*` returns JSON 401 `session_expired`

**Given** a non-GET request to `/api/admin/**`
**When** `Content-Type` is not `application/json` or `Sec-Fetch-Site` is not `same-origin` (fallback: `Origin` not equal to host)
**Then** it is rejected with 403 before the route runs (AR26)
**And** GET never changes state, there are no Astro Actions or form posts to pages, and no password, session or user table exists

**Given** admin services
**When** reviewed
**Then** every admin service function takes the verified actor email as a required argument, never read from the request body
**And** tests cover allowlisted email, non-allowlisted email, forged header, expired token, missing config and cross-site POST

### Story 4.2: Dashboard shell, admin tokens and navigation

As an Editor,
I want a calm, consistent Dashboard frame in Indonesian,
So that I can move between Kiriman, Artikel, Artefak, Pelanggan and Aktivitas quickly.

Covers: UX-DR2, UX-DR4, UX-DR5, UX-DR6, UX-DR7, UX-DR8, UX-DR43, UX-DR44, UX-DR51, UX-DR52, UX-DR53, UX-DR65, UX-DR66, UX-DR67, UX-DR70, UX-DR71, UX-DR75, UX-DR77, UX-DR80, AR41, AR42, NFR1, NFR2, NFR15, NFR26

**Acceptance Criteria:**

**Given** `tokens.css`
**When** the admin scope is added
**Then** admin colours (admin-room, admin-rail, admin-rail-hover, admin-sheet, admin-sheet-footer, admin-button-hover, admin-text, admin-muted, admin-control, admin-line, admin-accent, admin-accent-press, admin-on-accent, light only), admin typography (admin-title to admin-strip-value), admin spacing (nav 200px, rail 300px, room 32px, sheet max 900px, sheet padding 48/64px, admin measure 60ch) and radii admin-xs 6, sm 8, md 10, lg 14 (no pills) mirror DESIGN.md 1:1, checked by the token test (UX-DR2, UX-DR4, UX-DR5)

**Given** `/admin`
**When** an Editor opens it
**Then** it redirects to `/admin/kiriman` (filtered to pending once Epic 5 ships; until then an empty state) inside the three-column layout: nav, rail and room with sheet; below 1100px columns stack with room padding 16px and sheet 24px top and 20px sides (UX-DR43)
**And** the Dashboard UI is Indonesian only (AR41, NFR15)

**Given** the nav
**When** rendered
**Then** it shows the publication name over "Ruang editor" and items Artikel, Artefak, Kiriman, Pelanggan, Aktivitas with right-aligned muted counts; the active item has sheet background, inset hairline, weight 500, 3px admin-text left bar and `aria-current="page"` (UX-DR44, UX-DR75)
**And** a nav item whose section is not built yet opens the shared empty state; each section's own story replaces it, so no link is ever broken

**Given** shared admin components
**When** built
**Then** buttons (primary, secondary, quiet; 48px high; busy and disabled at 40% with `aria-disabled` and focus ring; press scale 0.98 over 150ms), text fields (admin-sm radius, error with accent icon and message), the 2px admin-accent focus ring offset 3px on every interactive element, empty state, loading skeleton at real size without shimmer, and inline error with one recovery action exist and are used by later stories (UX-DR51, UX-DR52, UX-DR53, UX-DR65, UX-DR66, UX-DR67)
**And** only `admin-overlay` uses a shadow, depth otherwise comes from tone and hairlines (UX-DR6); control borders reach 3:1 on sheet, footer, room and rail (UX-DR75)

**Given** admin motion
**When** state changes
**Then** only fades of 200ms or less run, and all transitions are off under reduced motion (UX-DR71)

**Given** laptop, tablet and phone widths
**When** the shell renders
**Then** it is usable on laptop and tablet; on phone, editor routes show "Buka di laptop atau tablet untuk menyunting." with no action (UX-DR70, NFR26)
**And** the shell passes the implementation-craft rule and an axe check with zero violations; Dashboard copy follows Voice and Tone with no em dashes (UX-DR80)

### Story 4.3: Article list and draft editing with autosave

As an Editor,
I want to create an Article and have my draft saved automatically in both languages,
So that I never lose work and drafts never become public.

Covers: FR-27, AR9, AR36, UX-DR55, UX-DR56, UX-DR57, UX-DR58, UX-DR64, UX-DR68, UX-DR69, UX-DR78, NFR10, NFR27

**Acceptance Criteria:**

**Given** `/admin/artikel`
**When** an Editor opens it
**Then** Articles list as plain rows with title, muted meta and a Publication Status label "Draf" / "Terbit", with a "Tulis artikel" action; empty shows the empty state with "Tulis artikel" (UX-DR56, UX-DR69)

**Given** "Tulis artikel"
**When** pressed
**Then** `/admin/artikel/baru` opens on the ID tab with the EN tab labelled "kosong"; the tabs are an ARIA tablist with roving tabindex and Left/Right arrows, each tabpanel carrying its `lang` (UX-DR57, UX-DR78)
**And** fields: Editorial Series radio group (fieldset legend "Seri editorial", four 40px options, arrow keys select, UX-DR58), author, date (defaults to first publish time), slug, title in Fraunces and muted standfirst per language

**Given** the Editor stops typing for about 2 seconds
**When** autosave runs
**Then** only working fields are written with the current `revision`, the footer shows "Menyimpan…" then "Tersimpan · HH.MM" (not announced), and no rebuild is requested (AR36, UX-DR55)
**And** a stale `revision` returns `edit_conflict`, the save is refused and the Editor is asked to reload
**And** a failed save shows "Belum tersimpan" with "Coba lagi", announced once, and retries on the next pause

**Given** a slug already used in the same language
**When** saved
**Then** it is rejected with a message on the slug field (FR-27, AR9)

**Given** the Access session expires mid-edit
**When** a save returns 401 `session_expired`
**Then** the draft stays in local browser storage, a full-width notice "Sesi berakhir. Masuk lagi, tulisan Anda tetap di sini." with "Masuk lagi" opens sign-in in a new tab, and the save retries on return; local storage is cleared only after the server confirms (UX-DR68, NFR10)

**Given** changes not yet autosaved
**When** the Editor clicks nav, goes back or closes the tab
**Then** the unsaved-changes guard (Confirm dialog anatomy) offers stay or discard (UX-DR64, NFR27)

**Given** any draft
**When** the public site is rebuilt
**Then** the draft is not in the snapshot or on any public page
**And** every create writes an activity row in the same batch; the screen passes the implementation-craft rule

### Story 4.4: Block editor for Article bodies

As an Editor,
I want a block editor with headings, quotes, images and Catalogue Records,
So that I can write rich Articles without markup.

Covers: FR-27, AR6, AR14, AR22, AR23, AR26, AR42, UX-DR59, UX-DR60, UX-DR61, UX-DR73, UX-DR74, UX-DR76, UX-DR78, NFR1, NFR3

**Acceptance Criteria:**

**Given** the BlockNote island (`@blocknote/core`, `react`, `mantine` 0.57.0 under MPL-2.0, Mantine 9.8.1)
**When** it loads in the Article editor
**Then** its Mantine theme is built from `tokens.css` admin tokens, body blocks render at admin-editor-body within 60ch, and the license check still passes with no `@blocknote/xl-*` (AR6, AR42)

**Given** `/` at the caret or "Tambah blok"
**When** pressed
**Then** the Slash menu (admin-overlay, admin-md radius, combobox + listbox with `aria-activedescendant`) lists heading, quote, image and Catalogue Record, filters as typed and announces "{n} pilihan"; Enter inserts, announces "Blok {jenis} ditambahkan" and moves focus into the block; `Esc` closes leaving `/` or returns focus to "Tambah blok" (UX-DR60, UX-DR73)

**Given** a block
**When** its "Opsi blok" handle (24×24px, visible on hover and focus) is used
**Then** the menu offers Pindah ke atas, Pindah ke bawah, Hapus blok as the single-pointer alternative to dragging; after a move focus stays on the block and a polite status names its new position (UX-DR59, UX-DR76)

**Given** a read-only `GET /api/admin/artefacts?q=` created in this story
**When** an Editor types in the Catalogue Record picker
**Then** the route calls a new read function in `services/artefacts` that matches inventory number or title (working copy) and returns at most 20 items with id, inventory number, title and Publication Status; it changes no state and writes no activity row (AR14, AR26)
**And** the Artefacts it finds are the ones already in D1 (seeded fixtures until Editors can create Artefacts)

**Given** the Catalogue Record block
**When** inserted
**Then** it opens an Artefact picker (combobox + listbox with `aria-activedescendant`, filters as typed, announces "{n} pilihan") and the block stores only the chosen Artefact ID, as `blocks.ts` requires (AD-6, AR22)
**And** the block then shows that Artefact's record read-only in a bordered group (inventory number, title, year or estimated year, Category, provenance, contributor credit) with a "Draf" label when the Artefact is not published, and "Ganti artefak" reopens the picker
**And** the inline creation form from UX-DR61 is not built: AD-6 allows only an Artefact ID in the block, so Editors create Artefacts in the Artefak section; this deviation from UX-DR61 is recorded in the story's dev notes (UX-DR61)

**Given** a selected passage
**When** the "Bahasa" mark is applied
**Then** the output carries `lang` on that passage (UX-DR78)

**Given** the editor content
**When** saved
**Then** it validates against `src/shared/blocks.ts`; title, standfirst and body are labelled textboxes (body `aria-multiline="true"`), image and Catalogue Record blocks are labelled groups, and the output is semantic
**And** image blocks already in a document (seeded fixtures) render and validate, but the image item stays hidden from the Slash menu until a later story adds the upload and crop flow
**And** the editor is tested with VoiceOver and NVDA and passes the implementation-craft rule (NFR1, NFR3)

### Story 4.5: Media upload pipeline

As an Editor,
I want every image I upload checked by content and stored as a tracked media asset,
So that only clean JPEG, PNG or WebP files without location data can become public.

Covers: FR-29, FR-34, AR7, AR20, AR21, AR27, AR28, AR34, AR35, AR37, NFR12, NFR19

**Acceptance Criteria:**

**Given** a new migration
**When** applied
**Then** it only adds `status` (`uploading` | `ready`, default `ready`) and `created_at` to `media_asset`, so seeded assets stay servable and `/media/*` serves only `ready` assets (AR7)

**Given** the `MEDIA` bucket and `GET /media/*` from Story 1.4
**When** this story configures upload
**Then** the bucket CORS allows PUT from the site origin only, and uploads land under `staging/`, which `/media/*` never serves (AR27)

**Given** `POST /api/admin/media/start` (JSON, same-origin, verified Editor)
**When** called with 1 to 3 declared variant sizes of at most 10 MB each
**Then** `services/media` creates a `media_asset` record with status `uploading` and returns an upload token plus one SigV4 presigned PUT URL per variant (random `staging/` key, 10-minute expiry) from the shared `presign.ts` of Story 3.2 (AR34, AR35)
**And** a size over 10 MB, more than 3 variants or zero variants is rejected with a per-file code before any URL is issued

**Given** `POST /api/admin/media/finish` with the upload token and the computed light and dark tint
**When** it runs
**Then** each staged object is checked with `head` (size ≤ 10 MB) and ranged reads of its first and last 64 KB through the shared `sniffImage()` from Story 3.3, so wrong types and metadata segments (EXIF, XMP, GPS) are rejected with `photo_type` or `photo_metadata` (AR28, NFR12)
**And** passing objects are copied by stream to their final key `<uuid>-w<width>.webp` with the derived `Content-Type`, staged objects are deleted, and the `media_asset` row stores variants, MIME, dimensions, the tint validated against the `clampTint()` bounds of Story 1.10, and `is_placeholder = false` (AR35, AR37)
**And** the same D1 batch writes an activity row (actor the Editor email, action `media_created`, ref null) (AR20)
**And** on any D1 failure the staged and final R2 objects are deleted (AR21)

**Given** `services/media`
**When** an Article hero, body image block or Artefact image is attached or detached
**Then** `media.attach()` and `media.detach()` write or remove the `media_ref` row and its `media_ref_translation` rows (per-language alt text, caption, credit), and are the only writers of those tables (AR37)
**And** deleting a `media_asset` that still has a `media_ref` row is refused with `asset_in_use` (AR37)

**Given** a GPS-tagged JPEG and a renamed PDF sent straight to a presigned URL, bypassing the browser re-encode
**When** `finish` runs
**Then** both are rejected, their objects are deleted and no `media_asset` becomes ready; an integration test proves it (NFR19)
**And** the Worker never reads a whole image body; a test asserts only ranged reads and stream copies are used

### Story 4.6: Crop tool island and editor image integration

As an Editor,
I want to crop, rotate and caption images in the editor before they upload,
So that published images are the right size and shape and carry alt text and credit.

Covers: FR-6, FR-29, AR30, AR37, UX-DR21, UX-DR62, UX-DR67, UX-DR70, UX-DR74, UX-DR76, NFR9, NFR19

**Acceptance Criteria:**

**Given** a JPG, PNG or WebP up to 10 MB chosen in the editor
**When** it is added
**Then** the crop tool opens: admin-overlay dialog, crop frame with four focusable corner handles (24×24px, named "Bingkai potongan", "Sudut kiri atas"…), arrow keys move frame or handle, aspect radios Bebas/1:1/4:5/3:2, Perkecil/Perbesar, four Geser buttons, Putar kiri/kanan, Atur ulang, footer Batal/Terapkan, `Esc` discards, focus trapped, polite "Potongan {w} × {h} piksel" and rotation announcements (UX-DR62, UX-DR76)
**And** a wrong type or oversized file is rejected by name before upload

**Given** Terapkan
**When** pressed
**Then** the shared `reencodeImage()` produces WebP variants 640, 1280 and 2000 wide without upscaling, with all metadata dropped, and the island computes the light and dark tint from the canvas with `clampTint()` (AR30, AR37, UX-DR21)
**And** the variants and tint go through the Story 4.5 pipeline, with per-file progress announced politely (UX-DR74)

**Given** the Article editor
**When** this story ships
**Then** the hero image field (with alt text, caption and credit per language) and the image item in the Slash menu of Story 4.4 become available, both using this crop flow and `media.attach()` (FR-6)
**And** the island is built as a reusable component taking a source image and returning a ready `media_asset` id, so other screens can open it

**Given** a failed upload
**When** it happens
**Then** "{nama file} gagal diunggah. Foto lain tetap ada." shows with retry (UX-DR67); on phone the crop tool is not offered (UX-DR70)

**Given** a published image
**When** it is fetched from `/media/*`
**Then** it renders with explicit width and height from the stored variant (NFR9) and contains no GPS or EXIF metadata, checked with exiftool on a GPS-tagged source (NFR19)
**And** the crop tool passes the implementation-craft rule including `emil-design-eng` for its motion

### Story 4.7: Rebuild requests and status

As an Editor,
I want to see whether my published change is building, live or failed,
So that I know when readers can see it and can retry if it fails.

Covers: FR-33, AR18, AR19, AR50, UX-DR42, UX-DR54, UX-DR74, NFR28

**Acceptance Criteria:**

**Given** a new migration
**When** applied
**Then** it creates `rebuilds` (id, target_version, build_uuid, status `queued` | `building` | `live` | `failed`, timestamps)

**Given** `rebuilds.request(version)`
**When** called
**Then** it records a row and POSTs the secret `DEPLOY_HOOK_URL`, storing the returned `build_uuid`, and the build writes `dist/version.json` with its `content_version` (AR19)
**And** only publish, Perbarui, unpublish and delete-of-published service functions may call it; a test fails if autosave, drafts, conversion, review decisions or Subscriber changes do (AR18)

**Given** `rebuilds.refresh()` as the single writer
**When** it polls the Workers Builds API with `BUILDS_READ_TOKEN`
**Then** rows only move forward, a row becomes `live` only when the deployed `/version.json` is at or above its target, and if a build succeeded below target the hook is fired again

**Given** a published item's editor header
**When** a rebuild is in progress, live or failed
**Then** the tag reads "Situs sedang dibangun ulang, sekitar 2 menit" (indicator animates at most 5 seconds, static under reduced motion), "Sudah tayang", or "Gagal dibangun. Situs lama tetap tayang." with a secondary "Coba lagi"; it updates by polling and is announced via `role="status"` (UX-DR54, UX-DR42)

**Given** a failed build
**When** "Coba lagi" is pressed
**Then** a new request fires and the previously live site stays online throughout (FR-33)

**Given** normal conditions
**When** `rebuilds.request()` is triggered from a test script against the deployed Worker
**Then** the row reaches `live` within about 2 minutes, measured on three runs and recorded (NFR28)

### Story 4.8: Preview, publish, update, unpublish and delete Articles

As an Editor,
I want to preview an Article and publish, update, unpublish or delete it myself,
So that I control what readers see without a developer.

Covers: FR-27, FR-29, FR-33, AR18, AR20, AR23, AR36, UX-DR55, UX-DR56, UX-DR63, UX-DR73, NFR27

**Acceptance Criteria:**

**Given** "Pratinjau"
**When** pressed
**Then** the working copy renders in the public reading layout using the same `renderArticleHtml()` in the browser (AR23)

**Given** "Terbitkan" on a translation with series, title, slug, standfirst and alt text for the hero and every image block in that language
**When** pressed with the translation's current `revision`
**Then** in one D1 batch the working copy is copied to the published copy, Publication Status becomes `published`, `published_at` is set, the slug locks, `content_version` increments and an activity row (action `article_published`, ref the slug) is written; then a rebuild is requested (AR18, AR20, AR36)
**And** a missing required field blocks publishing with the field named
**And** a stale `revision` returns `edit_conflict`, nothing is published and the Editor is asked to reload

**Given** the hero or an image block without alt text in the language being published
**When** "Terbitkan" or "Perbarui" is pressed
**Then** publishing is refused, the image is marked and its alt text field for that language is named and receives focus (FR-29)

**Given** a published translation edited afterwards
**When** autosave runs
**Then** the footer reads "Draf tersimpan. Tekan Perbarui untuk menayangkan." and the public site does not change until "Perbarui" is pressed (UX-DR55)

**Given** "Perbarui" on a published translation whose working copy differs from its published copy
**When** pressed with the translation's current `revision`
**Then** in one D1 batch the working copy is copied to the published copy, Publication Status stays `published`, `published_at` keeps the first publish time, the slug stays locked, `content_version` increments and an activity row (action `article_updated`, ref the slug) is written; then a rebuild is requested (FR-33, AR18, AR20, AR36)
**And** the same required-field and alt-text checks as "Terbitkan" apply, with the field named
**And** a stale `revision` returns `edit_conflict`, the published copy is unchanged and the Editor is asked to reload
**And** after the rebuild is `live` the public Article shows the updated text, and the footer returns to "Tersimpan · HH.MM"

**Given** unpublish or delete
**When** chosen
**Then** a Confirm dialog (admin-lg radius, title, one sentence naming the Article, Batal then the destructive action last, `Esc` cancels, focus trapped and returned) asks first (UX-DR63, NFR27)
**And** deleting a published Article is refused until it is unpublished
**And** unpublish clears published state, bumps `content_version` and requests a rebuild; afterwards the Article URL returns 404

**Given** list rows and the editor header
**When** the state changes
**Then** the Publication Status label shows "Draf" or "Terbit" (UX-DR56)
**And** the screen passes the implementation-craft rule

### Story 4.9: Manage Artefacts

As an Editor,
I want to create and publish Artefacts with a Catalogue Record and images,
So that they appear in Articles and in the Artefact of the Day pool.

Covers: FR-28, FR-29, AR20, AR36, AR37, UX-DR56, UX-DR57, UX-DR63, UX-DR69

**Acceptance Criteria:**

**Given** `/admin/artefak`
**When** opened
**Then** Artefacts list with title, inventory number and the Publication Status label; empty shows the empty state with one action (UX-DR69)

**Given** the Artefact editor
**When** an Editor fills the Catalogue Record (inventory number, title per language, year or estimated year, Category, provenance, contributor credit) and adds 1 to 5 images via the crop tool from Story 4.6
**Then** the record autosaves as a working copy per translation, with the language tabs from Story 4.3 (UX-DR57)
**And** a sixth image cannot be added and zero images blocks publishing

**Given** "Terbitkan" or "Perbarui" on an Artefact translation
**When** an image lacks alt text in that language
**Then** publishing is refused naming the image and language, and otherwise the copy, `revision` check, `content_version` bump, activity row and rebuild request follow Story 4.8 (FR-28, FR-29, AR36)

**Given** a published Artefact
**When** the rebuild is live
**Then** it is in the Artefact of the Day pool JSON; unpublished or draft Artefacts are not, and a `catalogueRecord` block that embeds an unpublished Artefact is omitted from the public Article

**Given** unpublish or delete
**When** confirmed in the Confirm dialog
**Then** it behaves as Story 4.8 (delete refused while published, `content_version` bump, rebuild, activity row) (UX-DR63, AR20)
**And** the screen passes the implementation-craft rule

### Story 4.10: Activity log view

As an Editor,
I want to see who created, published, unpublished, deleted or reviewed what and when,
So that the team can trace every change.

Covers: FR-34, AR20, UX-DR65, UX-DR69

**Acceptance Criteria:**

**Given** the `activity_log` table and `services/activity` from Story 2.1, already written by every earlier story
**When** this story ships
**Then** it adds only a read function `activity.list({ before, limit })` and the `/admin/aktivitas` page; it creates no table, migration or writer (AR20)

**Given** `/admin/aktivitas`
**When** an Editor opens it
**Then** entries list newest first, read-only, as plain rows with hairline separators showing time in Asia/Jakarta, actor, action and object (Reference Number or slug when present); with no entries it shows "Belum ada aktivitas. Setiap keputusan dan terbitan akan tercatat di sini." with no action (FR-34, UX-DR65, UX-DR69)
**And** the list paginates beyond 50 rows, the Aktivitas nav item opens it, and it passes the implementation-craft rule

**Given** the page
**When** its HTML and network responses are inspected
**Then** no email other than the Editor actor appears, and rows for public writes show actor `public` (FR-34)

## Epic 5: Review contributions

Editors work through the Contribution queue, approve or reject with a reason, and convert approved Contributions into draft Artefacts with cropped, metadata-free photos.

### Story 5.1: Contribution queue

As an Editor,
I want a queue of Contributions with the oldest pending first,
So that nobody waits longer than necessary for a decision.

Covers: FR-30, UX-DR44, UX-DR45, UX-DR65, UX-DR66, UX-DR67, UX-DR75, NFR37

**Acceptance Criteria:**

**Given** `/admin/kiriman`
**When** an Editor opens it
**Then** the queue rail shows filter links "Menunggu", "Disetujui", "Ditolak" (2px underline and `aria-current` on the active one), heading "Menunggu dibaca" and "{n} kiriman, yang terlama di atas", defaulting to pending, oldest first (FR-30, UX-DR45)
**And** only Contributions with intake `received` are listed; `uploading` records never appear

**Given** queue items
**When** rendered
**Then** each shows title, right-aligned waiting age and a meta line Reference Number · Contributor · Category · photo count; hover uses rail-hover, the active item has a 3px bar and `aria-current`, and arrow keys move through items (UX-DR45, UX-DR75)

**Given** the nav
**When** pending Contributions exist
**Then** Kiriman shows the pending count (UX-DR44), countable from storage for SM-3 (NFR37)

**Given** an empty pending queue
**When** shown
**Then** "Tidak ada kiriman yang menunggu" with "Lihat yang disetujui" appears (UX-DR65)

**Given** loading or a load failure
**When** it occurs
**Then** rows show at real height with "Memuat kiriman…", or an inline error with "Muat ulang" (UX-DR66, UX-DR67)
**And** the queue passes the implementation-craft rule

### Story 5.2: Review sheet with private photos and masked email

As an Editor,
I want to read one Contribution with full-size photos and the email masked by default,
So that I can judge it while exposing personal data only when needed.

Covers: FR-30, FR-34, AR20, AR26, AR29, AR51, UX-DR46, UX-DR47, UX-DR48, UX-DR49, UX-DR70, UX-DR73, NFR22, NFR23, NFR26

**Acceptance Criteria:**

**Given** `/admin/kiriman/{Reference Number}`
**When** opened
**Then** the sheet shows the opening strip (No. referensi, Diterima, Urutan "1 dari 7", and for the oldest pending item "Kiriman tertua" with waiting time in accent 500 on sheet only), Fraunces title (max 24ch), muted byline with Contributor name and masked email, hero photo with "Foto 1 dari N", photo strip, story at admin-reading within 60ch, and the closing strip (Tahun, Kategori, Izin muat, "Lokasi foto · sudah dihapus") (ref `mockups/dashboard-review.html`, UX-DR46, UX-DR47)
**And** strip cells wrap below 1100px and the review endpoint returns only the masked email (AR51)

**Given** the masked email (first character, bullets hidden from AT, domain; label "email disamarkan, domain {domain}")
**When** the Editor activates "Tampilkan" (accessible name "Tampilkan email kontributor")
**Then** the island sends `POST /api/admin/contributions/{Reference Number}/reveal-email` (JSON, same-origin, empty body), which returns the full address and writes an activity row (actor the Editor email, action `email_revealed`, ref the Reference Number only) in one D1 batch; the address replaces the mask in place and focus moves to it (UX-DR48, NFR22, AR51)
**And** a GET to that path returns 405 and reveals nothing, so no link, prefetch or crawler can change state or expose the address (AR26)

**Given** a Contribution photo
**When** requested through the admin photo route
**Then** it streams from `CONTRIBUTIONS` only to a verified Editor with server-derived `Content-Type`, `nosniff`, sandbox CSP, `Content-Disposition: inline` and `Cache-Control: private, no-store` (AR29)
**And** a broken photo shows "Foto n tidak bisa dimuat."

**Given** the lightbox
**When** a thumbnail is activated
**Then** the full-size photo shows over the dimmed room with "Foto n dari N", previous, next and close; arrow keys move, `Esc` closes and returns focus to the thumbnail, focus is trapped (UX-DR49)
**And** the Editor can check for faces, addresses or copyrighted material at full size before any decision (NFR23)

**Given** a phone width
**When** an Editor reviews
**Then** the flow works full width: queue list → one Contribution → decision area (UX-DR70, NFR26)
**And** the sheet passes the implementation-craft rule and `fixing-accessibility`

### Story 5.3: Approve, reject and change a decision

As an Editor,
I want to approve or reject with an internal note and change my mind later,
So that decisions are deliberate, traceable and reversible.

Covers: FR-30, FR-21, AR8, AR20, AR40, UX-DR50, UX-DR64, UX-DR68, UX-DR73, UX-DR74, NFR10, NFR23

**Acceptance Criteria:**

**Given** a new migration
**When** applied
**Then** it creates only `contribution_review` (contribution_id, note, decided_by, decided_at) and adds nullable `rejected_at` to `contribution` (AR8)

**Given** the decision bar
**When** rendered
**Then** it has the note label "Catatan untuk editor lain" with helper text, a textarea of at least 72px, Setujui (secondary), Tolak (quiet), and a right-aligned "Berikutnya: {judul}" link; Jadikan artefak is added by Story 5.4 (UX-DR50)

**Given** Setujui
**When** pressed
**Then** `contributions.decide()` sets Review Status `approved`, stores the note on `contribution_review`, records the Editor email and time, writes an activity row (no note text) in the same batch, and the sheet advances with focus on the next sheet heading (AR20, UX-DR73)

**Given** Tolak with an empty note
**When** pressed
**Then** nothing is saved, "Tulis alasan singkat sebelum menolak." appears on the field and focus moves there

**Given** Tolak with a note
**When** pressed
**Then** it rejects at once without a dialog, `decide()` sets `rejected_at`, and a `role="status"` line reads "Kiriman ditolak. Foto dan data dihapus pada {tanggal}." with a persistent "Batalkan" button, the date being `rejected_at + 90 days` in Asia/Jakarta (FR-21, AR40)

**Given** a decided Contribution
**When** the Editor changes the decision or presses "Batalkan"
**Then** `decide()` updates the status, clears `rejected_at` when leaving `rejected`, and logs the change with Editor and time (FR-30)
**And** rejected items under "Ditolak" show their deletion date

**Given** a save failure or an expired session
**When** a decision is sent
**Then** the note stays (kept in local storage until the server confirms), "Simpan lagi" is offered and the sheet does not advance; on `session_expired` the session notice from Story 4.3 appears (UX-DR68, NFR10)
**And** an unsent note triggers the unsaved-changes guard on leaving (UX-DR64); nothing is ever published automatically (NFR23)
**And** the bar passes the implementation-craft rule with `better-writing` on Dashboard lines

### Story 5.4: Convert a Contribution into a draft Artefact

As an Editor,
I want to turn an approved Contribution into a draft Artefact with cropped, clean photos,
So that I can publish community artefacts without retyping or leaking personal data.

Covers: FR-31, AR8, AR20, AR38, AR40, UX-DR50, UX-DR62, NFR19, NFR22

**Acceptance Criteria:**

**Given** a new migration
**When** applied
**Then** it adds nullable `artefact.source_contribution_id` referencing `contribution` with `ON DELETE SET NULL` (AR8)

**Given** "Jadikan artefak" (primary, the one primary action on the sheet)
**When** pressed on a pending or approved Contribution
**Then** it approves if pending and opens a new draft Artefact with the Catalogue Record pre-filled (title, year, Category, provenance) and contributor credit from the chosen name or pseudonym; the Contributor's email is never copied (FR-31, NFR22)

**Given** each Contribution photo the Editor keeps
**When** converted
**Then** it opens in the crop tool from Story 4.6 and goes through `reencodeImage()` and the media upload protocol into new `MEDIA` assets with no metadata; no `media_asset` references a `CONTRIBUTIONS` key (AR38, NFR19)

**Given** the draft Artefact
**When** viewed in the Dashboard
**Then** it links back to its source Contribution; the snapshot DTO excludes that link (strict DTO test) (FR-31)
**And** conversion does not request a rebuild and writes an activity row (AR20)

**Given** a Contribution referenced by an Artefact
**When** an Editor tries to reject it
**Then** `decide()` returns `converted_contribution` and the bar explains that the Artefact must be deleted first (AR40)


## Epic 6: Privacy and data retention

Editors find a person's data by email, export Subscribers and delete a person's data on request (including derived Artefacts and their copied photos); the daily job from Epic 3 is extended to purge rejected Contributions after 90 days and to clean up editor media.

### Story 6.1: Extend the daily job with retention and media cleanup

As the publication owner,
I want rejected Contributions removed 90 days after rejection and unused images cleaned up by the existing daily job,
So that we keep personal data only as long as the privacy note says.

Covers: FR-21, AR32, AR37, AR39, AR40, NFR17, NFR18, NFR20

**Acceptance Criteria:**

**Given** the Cron Trigger and `src/server/cron.ts` step list from Story 3.6
**When** this story ships
**Then** it adds steps to that list without a new trigger or handler, so the order is exactly `contributions.purgeRejected()`, `contributions.purgeStaleUploads()`, `media.purgeStaleUploads()`, `media.collect()`, the orphaned `CONTRIBUTIONS` sweep and `rebuilds.refresh()` (AR39)
**And** `wrangler.jsonc` still declares one Cron Trigger `0 19 * * *`, and a test asserts the step order
**And** a failure in one step is still logged only as `{ event, code }` and the following steps still run

**Given** a Contribution rejected more than 90 days ago (`rejected_at + 90 days` before now)
**When** `purgeRejected()` runs
**Then** its R2 photos are deleted first, then its photo, review and contribution rows, with an activity row (actor `system`, ref the Reference Number) in the same batch, and its photo bytes are released from the global capacity (FR-21, AR32, AR40, NFR20)
**And** a Contribution rejected 89 days ago or referenced by an Artefact is not touched

**Given** media assets still `uploading` 24 hours after `media/start`
**When** `media.purgeStaleUploads()` runs
**Then** their `staging/` objects and rows are deleted

**Given** `media.collect()`
**When** it runs
**Then** it deletes the `MEDIA` objects and row of every asset with no `media_ref` only after a rebuild without that reference is `live` (AR37)

**Given** the job
**When** tested locally with `wrangler dev --test-scheduled` and seeded fixtures dated by the test
**Then** each new step's effect is asserted, the Story 3.6 steps still pass, no email or IP is logged, and the privacy note's 90-day and 7-day backup statements match behaviour (NFR17, NFR18)

### Story 6.2: Subscriber list, lookup by email and CSV export

As an Editor,
I want to find a person's Subscriber record and Contributions by email and export the list safely,
So that we can answer deletion requests and send the Newsletter elsewhere.

Covers: FR-22, FR-32, FR-34, AR12, AR20, AR26, AR51, UX-DR65, UX-DR69, NFR22, NFR37

**Acceptance Criteria:**

**Given** `/admin/pelanggan`
**When** opened
**Then** Subscribers list as plain rows with masked email, language and sign-up date, with the total count (SM-2, NFR37); an empty list shows the empty state (UX-DR65, UX-DR69)

**Given** an email typed into "Cari berdasarkan email"
**When** the Editor searches
**Then** the island sends `POST /api/admin/lookup` with `{ email }` in a JSON body (never in a URL), the email is trimmed and lowercased with the shared Zod schema, and the lookup uses the unique index on `subscriber` and the lookup index on `contribution` from Story 3.2 for an exact match (AR12, AR26)
**And** it returns the matching Subscriber (masked email, language, sign-up date) and every matching Contribution as Reference Number, title, Review Status and masked email, each Contribution linking to its review sheet (FR-22, FR-32, AR51)
**And** the same request writes an activity row (actor the Editor email, action `email_lookup`, ref null) with no email in any column (AR20, NFR22)

**Given** no Subscriber and no Contribution match
**When** the result returns
**Then** the line "Tidak ada pelanggan atau kiriman dengan email itu." appears and the search text stays (UX-DR69)

**Given** "Ekspor CSV"
**When** pressed
**Then** the island sends `POST /api/admin/subscribers/export` (JSON, same-origin), which writes an activity row recording the export without listing emails and returns the CSV, and the browser builds the download from the response blob (FR-32, AR20, AR26, AR51)
**And** the CSV holds only email, language and sign-up date columns, and any cell starting with `=`, `+`, `-`, `@`, tab or CR is prefixed with `'`
**And** a GET to the export or lookup path returns 405 with no data (AR26)
**And** a test feeds a formula-like email and asserts the prefix
**And** the screen passes the implementation-craft rule

### Story 6.3: Delete a person's data on request

As an Editor,
I want to delete a Subscriber or a Contribution with everything derived from it,
So that we honour deletion requests completely within 30 days.

Covers: FR-22, FR-32, AR18, AR20, AR21, AR32, AR37, AR40, UX-DR63, UX-DR74, NFR22, NFR27

**Acceptance Criteria:**

**Given** a Subscriber or Contribution found through the Story 6.2 lookup, or opened from its row or review sheet
**When** the Editor chooses "Hapus atas permintaan"
**Then** a Confirm dialog names the object and states the consequence, including that any Artefact converted from it will be unpublished and its copied photos deleted; the dialog reminds that requests are honoured only from the stored email or quoting the Reference Number from that address (FR-22, UX-DR63, NFR27)

**Given** deletion of a Subscriber is confirmed
**When** it runs
**Then** the row is deleted with an activity row in the same batch, and a lookup for that email returns no Subscriber (FR-32)

**Given** deletion of a Contribution is confirmed
**When** it runs
**Then** using the same service functions as the purge: its `CONTRIBUTIONS` photos are deleted first, then its rows, and its photo bytes are released from the global capacity (AR21, AR32, AR40)
**And** in the same service call and D1 batch, every Artefact with that `source_contribution_id` is unpublished (published copies cleared, `content_version` bumped) and `media.detach()` removes all of that Artefact's image `media_ref` and `media_ref_translation` rows, so the copied assets have no reference left; then one rebuild is requested (AR18, AR37)
**And** existing activity rows for the Contribution have `ref` set to null, and the deletion writes its own activity row with ref null (AR20)
**And** if any R2 deletion fails the D1 rows stay and the Editor sees an error with retry, so no orphaned personal data remains silently (AR21)

**Given** a copied asset from that Artefact is also used by an Article hero or image block
**When** the Editor confirms deletion
**Then** the deletion is refused before anything changes, and the dialog names each Article to edit first, so no published Article is left pointing at a deleted image (AR37)

**Given** the unpublish rebuild for that deletion is `live`
**When** the next daily job runs `media.collect()`
**Then** every copied asset's `MEDIA` objects and `media_asset` row are gone and `GET /media/<key>` returns 404 for each variant; an integration test asserts this (FR-22, AR37)

**Given** the deletion is done
**When** the same email is looked up again through Story 6.2
**Then** it exists in neither Subscribers nor Contributions; the result is announced via `role="status"` (FR-32, UX-DR74)

**Given** the privacy note from Story 1.12
**When** reviewed against this flow
**Then** it states the 30-day response time and the 7-day backup window, and the flow matches it (FR-22)
**And** the flow passes the implementation-craft rule

### Launch checklist (not build work)

These are client and content tasks tracked outside the stories; the build enforces only the Placeholder gate (Story 1.13).

- NFR31: Four real Articles, one per Editorial Series, each in Indonesian and English, written and published by the Editors.
- NFR32: Six real Artefacts with Catalogue Records and image rights cleared.
- NFR33: The final manifesto line supplied by the client replaces the Placeholder.
- NFR34: The privacy note and the consent wording approved by the client and their pending flags cleared, including the Turnstile fallback contact route.
- NFR35: Placeholders used only on the workers.dev address during review; `PUBLIC_LAUNCH=true` set for the public opening, and the Success Metrics period starts on the public launch date.
