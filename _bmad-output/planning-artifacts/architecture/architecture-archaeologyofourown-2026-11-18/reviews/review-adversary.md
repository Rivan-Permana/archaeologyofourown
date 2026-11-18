# Adversarial review: compliant-but-incompatible unit pairs

Target: `ARCHITECTURE-SPINE.md` (draft, 2026-11-18). Lens: two epics one level down, each obeying every AD to the letter, still build incompatibly.

**Verdict: not build-ready.** 3 critical and 9 high holes. Most come from the spine naming owners (services) without naming the state each one owns: which row is "the published version", which level holds Publication Status, who owns a MEDIA object, which unit owns the daily Artefact choice, and what the activity log may contain.

## Critical

### C1. Autosave publishes half-typed edits (admin articles + editor × rebuild/publishing)
- **Unit A (articles editor)** autosaves a few seconds after typing stops (UX "Autosave status") through `articles.update()` into the single `article_translation` row. AD-4 compliant.
- **Unit B (rebuild/publishing)** runs `scripts/snapshot.ts`, which reads every `published` row (AD-2), and AD-3 says *any edit to published content* calls `rebuilds.request()`.
- **Result:** every autosave on a published Article fires a rebuild, and any rebuild triggered by anyone (an Artefact publish, say) ships whatever half-finished text sits in the row. "Draft never visible" (FR-27) holds for new Articles only, not for edits to live ones. No "Update" step exists between saving and going live.
- **AD fix (new AD-13 Published revision):** published content is a frozen copy. Each translation keeps a working copy (`body_draft`, fields) written by autosave, plus a `published_*` copy written only by an explicit Terbitkan or Perbarui action. The snapshot reads only the published copy. `rebuilds.request()` is called only from publish, update-published, unpublish and delete, never from autosave. The same applies to Artefacts.

### C2. Deleting a person's data leaves their email in the activity log (subscribers/data × activity log)
- **Unit A (activity, AD-4)** writes a human-readable row for every change, for example "Deleted subscriber a@contoh.id" or "Rejected AOO-7K3F9Q from Budi: not relevant". The UX decision bar also stores the internal note "with the decision in Aktivitas".
- **Unit B (subscribers/data, FR-32)** deletes the Subscriber or Contribution row and its photos.
- **Result:** FR-32 fails ("email no longer exists"), because the email, name or story text survives in `activity_log`, which nothing ever deletes. Related problem: on a public `POST /api/contribute` no Editor identity exists (AD-7), so the activity unit either rejects the write or records the Contributor's email as the actor.
- **AD fix (tighten AD-4):** `activity_log` columns are fixed: `id, at, actor (Editor email or the literal 'public' / 'system'), action, entity_type, entity_id, ref (Reference Number or slug only)`. No subject email, name, story or note. Review notes live on a `contribution_review` row that is deleted with the Contribution. Deletion on request also scrubs `ref` for that entity.

### C3. Artefact of the Day never changes daily (public site × rebuild/cron)
- **Unit A (public site)** prerenders the home page (AD-2) and picks "today's" Artefact at build time. No JavaScript is needed for the first Artefact (FR-9).
- **Unit B (retention cron, AD-10)** runs only `purgeRejected` and `reconcile`. Rebuilds happen only on publish (AD-3).
- **Result:** the "daily" Artefact is whatever was current at the last publish, possibly days old. If the swap island instead picks the daily Artefact on the client, the no-JS HTML and the JS view disagree. "Show another" needs the pool, but AD-2 allows no runtime endpoint for it. FR-10's tint has no stated place of computation either.
- **AD fix (new AD):** one function `pickDaily(poolIds, jakartaDate)` in `src/shared/` (a stable hash over sorted published Artefact IDs) is used by both the build and the island. The cron gains a 00:00 WIB `rebuilds.request('daily')` so the no-JS HTML stays correct. The pool, including the precomputed tint and contrast fallback, ships as a static JSON asset written by the snapshot step.

## High

### H1. Publication Status lives at two levels (admin articles × public site)
- **A (articles)** puts `status` on the `article` parent (AD-5 says only "parent + translation").
- **B (public site / snapshot)** follows the UX language tabs ("kosong / draf / terbit"; "publishing publishes each language version that has content") and filters on a per-translation status.
- **Result:** the two schemas or queries disagree. EN goes live while still being drafted, or never goes live at all. Listings for FR-1 break.
- **Fix (tighten AD-5):** `status` and `published_at` sit on the translation row. The parent has no status. "Published" in the snapshot, the Artefact pool and the delete guard (FR-27) means at least one translation is published.

### H2. Rebuild coalescing drops a publish (rebuild × articles/artefacts)
- **A** publishes at t=0. `rebuilds.request()` POSTs the Deploy Hook, and the build starts and takes its snapshot at t=5.
- **B** publishes at t=10. AD-3 coalesces it into the "queued" row, so no new hook is sent.
- **Result:** B's change is not in the build, yet the dashboard shows "live" for it. The rule allows this because the row says `queued` while the build has already read D1.
- **Fix (tighten AD-3):** every content change bumps a monotonic `content_version`. The snapshot records the version it read. A rebuild counts as "live" for a request only if its deployed version is at or above the request's version; otherwise `reconcile()` or the next poll fires another hook. Alternatively, coalesce only while the hook has not yet been sent (debounce before the POST, not after).

### H3. Preview and public pages render differently (admin articles preview × public site build)
- **A (preview, FR-27)** is an on-demand `/admin` route, so it renders BlockNote JSON at request time in workerd (or in the browser with BlockNote's own renderer).
- **B (build)** renders with `@blocknote/server-util` in Node and then sanitises (AD-6).
- **Result:** two render paths, which AD-2 is meant to prevent. `server-util` depends on DOM shims that may not run in workerd, so the preview unit is pushed to a different renderer and the two outputs drift (sanitiser, `catalogueRecord` output).
- **Fix (tighten AD-6):** one function `renderArticleHtml(doc)` in `src/shared/render.ts`, used by both the snapshot and preview. Confirm at setup that it runs in workerd; if it does not, preview calls the same function in the browser. Preview must also render the working copy (see C1).

### H4. Nobody owns a MEDIA object (artefacts + media × articles)
- **A (artefacts)** deletes an Artefact, or replaces an image, and deletes the matching `MEDIA` keys through `media`.
- **B (articles)** references the same key as a hero or body image, or embeds that Artefact's Catalogue Record (UX: "can embed an existing Artefact's record").
- **Result:** broken images in published Articles. In addition, the live static site and any failed-rebuild fallback (AD-3) still point to deleted keys until the next successful deploy.
- **Fix (new AD):** a `media_asset` table owned by `services/media`, with references from Article heroes, body blocks and Artefact images. Deleting an asset that is still referenced is refused. Unreferenced objects are removed by `reconcile()` only after a rebuild that no longer references them is live. The `catalogueRecord` block must state whether it holds a copy of the values or an Artefact ID resolved at build when published (and what it shows when it is not).

### H5. Converted Artefact versus Contribution deletion and retention (review/conversion × retention cron × data)
- **A (conversion, FR-31)** creates a draft Artefact linked to its source. The ER diagram shows `CONTRIBUTION |o--o| ARTEFACT` without saying which side holds the key, and the converted images may be copied or referenced.
- **B (cron / deletion on request)** deletes the Contribution with its `CONTRIBUTIONS` objects (AD-10). The Editor can also change the decision to *rejected* after conversion, which starts the 90-day purge.
- **Result:** a foreign-key failure blocks the deletion, or the Artefact loses its source link and its images if they were referenced rather than copied.
- **Fix (tighten AD-8 / AD-10):** `artefact.source_contribution_id` is nullable with `ON DELETE SET NULL`. Conversion always writes new `MEDIA` keys through `media.ingest()` and never references `CONTRIBUTIONS` keys. Rejecting an already converted Contribution is either allowed with a note (and the purge leaves the Artefact intact) or refused. Pick one and state it.

### H6. Body-image uploads are rejected because they skip re-encoding (editor × media)
- **A (block editor)** wires BlockNote's `uploadFile` straight to `/api/admin/media`. AD-8 only requires the crop island for contribution conversion.
- **B (media)** rejects any file with GPS EXIF (AD-8).
- **Result:** most phone photos fail to upload in the Article body and hero, which works against FR-29 ("location metadata is removed on upload").
- **Fix (tighten AD-8):** every admin image upload path (hero, body block, Artefact image, conversion) goes through one browser function, `reencodeImage()`, before `media.ingest()`. The server's GPS rejection stays as a backstop and returns a code that tells the Editor to re-crop.

### H7. Admin mutations outside the protected prefix (any admin epic × auth)
- **A (an admin epic)** uses Astro Actions (`/_actions/*`) or posts a form to its own `/admin/...` page. Neither is forbidden.
- **B (auth, AD-7)** applies Access and JWT middleware only to `/admin/*` and `/api/admin/*`.
- **Result:** `/_actions/*` mutations reach services with no identity check, so FR-26 is broken.
- **Fix (tighten AD-7):** mutations are allowed only under `/api/admin/**` (or `/api/subscribe` and `/api/contribute`). Astro Actions are forbidden. The middleware denies by default every on-demand path outside an explicit public allowlist.

### H8. Category is undefined (contribution flow × admin artefacts)
- **A (contribute)** hard-codes the Category options in `src/shared/schemas.ts` for the form.
- **B (artefacts)** creates a `category` table, or free text, for the Catalogue Record.
- **Result:** conversion (FR-31) cannot map one to the other, and filters and labels drift.
- **Fix (tighten AD-5):** Category is a fixed enum in `src/shared/enums.ts` with i18n labels, defined the same way as Editorial Series.

### H9. Services cannot run in both the Worker and the build script (services × snapshot build)
- **A (services)** read `env.DB` (D1 binding) and `env.MEDIA` from the Worker context.
- **B (snapshot, AD-2)** runs in Node during Workers Builds, "through the services layer", where no binding exists.
- **Result:** either the snapshot duplicates its queries outside the services (which breaks AD-2 and AD-4), or the services gain environment branches.
- **Fix (tighten AD-4):** services take a `Db` object (and storage) as a parameter. The Worker passes the binding-backed client; the build passes a client over the D1 HTTP API using the token assumed in the memlog. Read functions used by the snapshot must not touch R2.

## Medium (8)

- **M1. Two definitions of the rejection date.** The review unit shows the deletion date from `activity_log`, while the cron purges by `updated_at`. After a decision changes, they disagree. Fix: `contribution.rejected_at` is set and cleared only by `contributions.decide()`. The cron query and the UI date both use `rejected_at + 90d`.
- **M2. Two writers of rebuild status.** The dashboard poll writes `building`/`live` while `reconcile()` marks the same row `failed` as stale. Fix: one writer, `rebuilds.refresh()`, with transitions that only move forward.
- **M3. Email normalisation.** Subscribe stores the email as typed, while deletion and search match it exactly, so FR-17 dedupe and FR-32 deletion miss mixed-case addresses. Fix: the shared Zod schema trims and lowercases, and both tables have a unique index on the normalised value.
- **M4. Two Editors editing at once.** Autosave from two tabs or two Editors is last-write-wins on the whole BlockNote JSON. Fix: an `updated_at` check sent with every save, and an `edit_conflict` code on mismatch.
- **M5. Localised child fields.** Artefact image alt text per language (FR-28) has no stated shape: `artefact_image.alt_id/alt_en` versus a translation table. Fix: AD-5 states the rule for translatable child rows.
- **M6. Article date.** Ordering (FR-4) uses an Editor-set `date` in one unit and `published_at` in another, on either the parent or the translation. Fix: name the column and its level.
- **M7. Orphans from media.ingest.** `media.ingest()` writes R2 and then D1, and a failure leaves an orphaned object. AD-9 states cleanup only for `/api/contribute`. Fix: every R2-then-D1 service uses one compensation rule, plus a sweep in `reconcile()`.
- **M8. Rebuild trigger set.** Which services may call `rebuilds.request()` is not listed. Conversion creates a draft and must not rebuild, and subscriber deletion must not either. Fix: list the callers in AD-3.

## Low (2)

- **L1. Slug changes.** Changing the slug of a published Article silently breaks shared URLs. Fix: lock the slug after first publish, or keep redirects.
- **L2. Previews without bindings.** Preview deployments have no production bindings, so `/media/*` and admin routes fail there. State a separate preview D1 and R2, or that previews are public-only.
