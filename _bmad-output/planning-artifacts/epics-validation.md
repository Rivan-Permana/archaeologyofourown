# Epics validation (step 4, checks 1–5)

Target: `epics.md` (status draft, steps 1–3). Architecture reference: `ARCHITECTURE-SPINE.md` (AD-1 to AD-18).
Known context applied: FR-16 retired; NFR31–35 in the launch checklist on purpose; no third-party starter, Story 1.1 is the AD-1 scaffold.

| Check | Result | Open items |
| --- | --- | --- |
| 1. FR coverage | FAIL | 3 |
| 2. Architecture implementation | FAIL | 4 |
| 3. Story quality | FAIL | 6 |
| 4. Epic structure | PASS (with notes) | 0 |
| 5. Dependency validation | FAIL | 2 epic-level + forward pairs from check 3 |

---

## 1. FR coverage: FAIL

Every FR (FR-1 to FR-34, FR-16 retired) maps to at least one story, and the coverage map matches the story `Covers:` lines. Three FRs have acceptance criteria that do not fully satisfy them:

1.1 **FR-22 / FR-32, copied photos never deleted (Story 6.3).** The AC unpublishes the converted Artefact and deletes its copied media assets "once no longer referenced". An unpublished Artefact keeps its `media_ref` rows, so the assets stay referenced forever; AD-15 also refuses deletion of a referenced asset. The FR requires the copied photos to be deleted.
   Fix: in 6.3, inside the same service call, remove the converted Artefact's `media_ref` rows for the copied assets (or delete the Artefact if it was never independently edited), then let `media.collect()` remove the objects after the unpublish rebuild is `live`; add an AC that asserts the objects are gone after the next cron run.

1.2 **FR-32 / FR-22, no way to find a Contribution by email (Stories 6.2, 6.3).** 6.3 asserts "Subscribers and Contributions are searched for that email", but only Subscriber search exists (6.2); the review UI shows masked emails only and lists by Reference Number. A deletion request that quotes only an email cannot be located, and the "no longer exists in Contributions" check cannot be performed.
   Fix: add to 6.2 an exact-email lookup (trimmed, lowercased, uses the lookup index from 3.2) that returns matching Subscribers and Contribution Reference Numbers with masked emails, writes an activity row without the email, and is a non-GET `/api/admin/**` call.

1.3 **FR-33, Perbarui not specified (Story 4.8).** The AC only says the public site does not change "until Perbarui is pressed". Nothing states that Perbarui copies working to published, bumps `content_version`, writes an activity row and requests a rebuild (AD-3, AD-14).
   Fix: add a Given/When/Then for Perbarui mirroring the Terbitkan AC, including the `revision` check and `edit_conflict`.

Covered adequately (spot checks): FR-1/2 (1.3, 1.8, 1.12), FR-3 (1.7, 3.1), FR-9/10 (1.10), FR-11–15 (3.1–3.5), FR-17–19 (2.1–2.3), FR-21 (5.3, 5.4, 6.1, 1.12), FR-26 (4.1), FR-27/28 (4.4–4.9), FR-29 (4.6), FR-30/31 (5.1–5.4), FR-34 (4.3).

## 2. Architecture implementation: FAIL

Starter template: PASS. No third-party starter; Story 1.1 is the Astro 7.4.12 + `@astrojs/cloudflare` 14.4.8 scaffold with the Structural Seed tree, and bindings are added by the story that first uses them.

Table creation timing:

| Table / column | Created in | First needed by | Verdict |
| --- | --- | --- | --- |
| article, article_translation, artefact, artefact_translation, media_asset, media_ref, media_ref_translation, site_state | 1.4 | 1.4 seed, 1.5 snapshot | OK |
| subscriber | 2.1 | 2.1 | OK |
| contribution, contribution_photo | 3.2 | 3.2 | OK |
| **activity_log** | **4.3** | **2.1 (Subscriber create), 3.3 (Contribution received) under AD-4** | **Late** |
| rebuilds | 4.7 | 4.7 | OK |
| contribution_review, contribution.rejected_at | 5.3 | 5.3 | OK |
| artefact.source_contribution_id | 5.4 | 5.4 | OK |

AD violations:

2.1 **AD-4, activity log missing for public writes (2.1, 3.3 vs 4.3).** AD-4 requires every create to write an `activity_log` row in the same D1 batch. Subscribers (2.1) and received Contributions (3.3) are written for two epics without it; 4.3 retrofits.
   Fix: create `activity_log` and `services/activity` in Story 2.1 (its first writer) and have 3.3 write the `received` row; 4.3 keeps only the `/admin/aktivitas` page.

2.2 **AD-6, Catalogue Record block stores more than an Artefact ID (4.5).** 4.5 makes the block "a bordered inline form with inventory number, title, year, Category, provenance and contributor credit, or embeds an existing Artefact by ID". AD-6 and `blocks.ts` (1.4) allow the `catalogueRecord` block to store only an Artefact ID, and the snapshot resolves it from the published pool. UX-DR61 conflicts with AD-6.
   Fix: 4.5 block = Artefact picker storing the ID only; "create inline" either creates a draft Artefact through `services/artefacts` and stores its ID, or is dropped. Record the UX-DR61 deviation.

2.3 **AD-7, GET that changes state (5.2 reveal email, 6.2 CSV export).** Both write an activity row; neither AC fixes the method, and the natural implementations (link or download) are GET. AD-7: GET never changes state.
   Fix: specify `POST /api/admin/...` (JSON, same-origin) for the reveal and for the export (client builds the download from the response blob).

2.4 **AD-15 vs FR-22 copied-asset deletion (6.3).** See 1.1; as written 6.3 cannot satisfy AD-15 ("deleting a referenced asset is refused").

No violations found for: routes calling Drizzle (1.5 states routes → services → data), public pages querying D1 (1.6), mutations outside `/api/admin` (only `/api/subscribe`, `/api/contribute/*`), AD-9 guard order (2.1 + 2.2, 3.2), AD-13 protocol (3.2, 3.3, 4.6), AD-3 rebuild callers (4.7 test, 5.4).

Note (not a failure): 1.4 `scripts/seed.ts` writes D1 directly while AD-4 says services own every write; acceptable for local Placeholder fixtures, but say so in 1.4 dev notes.

## 3. Story quality: FAIL

Every story has a `Covers:` line, Given/When/Then ACs and technical detail. Failures:

Forward dependencies (story uses something first created in a later story):

| Story | Depends on later | What |
| --- | --- | --- |
| 1.7, 1.8, 1.10 | 4.6 | `MEDIA` bucket binding and `GET /media/*`; 1.8 requires `srcset` from stored width variants, `render.ts` limits `src` to `/media/` |
| 2.1, 3.3 | 4.3 | `activity_log` table and `services/activity` (AD-4) |
| 4.5 | 4.9 | admin Artefact lookup endpoint/service to pick an Artefact for the `catalogueRecord` block |
| 4.6 | 4.8 | "publish is refused" when alt text is missing; publish does not exist until 4.8 |
| 6.3 | none (never built) | Contribution lookup by email |

Fixes:
- 1.7/1.8/1.10 → 4.6: move the `MEDIA` binding, `GET /media/*` (AD-8 headers, key regex) and seed upload of placeholder variants into Story 1.4 or 1.8; 4.6 then only adds the editor upload path. Alternative: Epic 1 renders only Placeholder slots and the `srcset` AC moves to 4.6.
- 2.1/3.3 → 4.3: as in 2.1 above.
- 4.5 → 4.9: add a read-only `GET /api/admin/artefacts?q=` (via `services/artefacts`) to 4.5, or reorder 4.9 before 4.5.
- 4.6 → 4.8: move the alt-text publish gate AC into 4.8 (it already names "required alt text") and 4.9.
- 6.3: see 1.2.

Too large for one dev agent:
- **4.6** (MEDIA bucket, `/media/*` route, crop dialog with full keyboard model, variant re-encode and tint, media start/finish with staging copy, hero field, Slash image item, deletion refusal, exiftool check). Split into 4.6a "Media pipeline: bucket, `/media/*`, `api/admin/media/start|finish`, `services/media`" and 4.6b "Crop tool island and editor image integration".
- **4.5** (BlockNote + Mantine theme, Slash menu combobox, block options, Catalogue Record block, language mark, screen-reader testing). Borderline; split Slash menu/block options from Catalogue Record and language mark if the dev agent context is tight.
- 1.1 is large but cohesive scaffolding; acceptable.

Minor wording: 1.6 lists "privacy, contribute" among prerendered pages before 1.12 and 3.1 exist; rephrase as "every public page, current and future".

## 4. Epic structure: PASS (with notes)

- Each epic delivers reader, contributor or Editor value. Epic 1 contains technical stories (1.1, 1.4, 1.5, 1.6) inside a user-value epic; they set up only what Epic 1 uses (apart from the MEDIA gap above).
- File churn: `wrangler.jsonc`, `schema.ts`, `middleware.ts`, `tokens.css` and the home page change across epics. This is by design (bindings, tables and allowlist entries are added by the first story that needs them; home sections are added by their own stories), so no consolidation is recommended.

## 5. Dependency validation: FAIL

Epic independence:
- **Epic 3 needs Epic 6 to stay usable.** 3.2 reserves photo bytes in the global `RateLimiter`; abandoned or fully failed uploads (3.3 leaves them `uploading`) release bytes only through `purgeStaleUploads()` in 6.1. Until Epic 6 ships, reservations accumulate toward the 5 GB cap and `CONTRIBUTIONS` objects orphan.
  Fix: move `contributions.purgeStaleUploads()`, the orphan sweep and the Cron Trigger into Epic 3 (new Story 3.6); 6.1 then adds `purgeRejected()` and `media.*` steps to the existing job.
- **Epics 2 and 3 need Epic 4 for AD-4 activity rows.** Fixed by 2.1 above.
- Epic 2 standalone: yes. Epic 4 uses Epics 1–3 outputs only. Epic 5 uses Epic 4 (crop tool, session notice) only. Epic 6 uses earlier epics only.

Within-epic story order: forward pairs listed in check 3 (1.7/1.8/1.10→4.6 crosses epics; 4.5→4.9; 4.6→4.8). Pre-declared, acceptable hand-offs: 1.1→1.6 (snapshot and leak steps), 2.1→2.2 (limit inserted later), 4.2→5.1 (pending count, empty state until then), 4.5→4.6 (image item hidden until then), 5.3→5.4 (Jadikan artefak added later).

---

## Re-validation (2026-11-18, after fixes)

Target: `epics.md` after the fix pass (status draft, steps [1, 2, 3]). 39 stories: Epic 1: 13, Epic 2: 3, Epic 3: 6, Epic 4: 10, Epic 5: 4, Epic 6: 3.

### Fixes applied

| Open item | Fix in `epics.md` |
| --- | --- |
| 1.1 / 2.4 copied photos never deleted | 6.3: the deletion call unpublishes each derived Artefact and `media.detach()` removes its image `media_ref` rows in the same batch; deletion is refused while a copied asset is used by an Article; new AC asserts objects gone and `/media/<key>` 404 after the next `media.collect()` |
| 1.2 no lookup by email | 6.2: `POST /api/admin/lookup` (email in JSON body, exact match on the 3.2 lookup index and the subscriber unique index) returns Subscriber and Contribution Reference Numbers with masked emails; activity row without email; 6.3 starts from it |
| 1.3 Perbarui unspecified | 4.8: Perbarui Given/When/Then mirroring Terbitkan (copy, `content_version`, activity row, rebuild, `revision` / `edit_conflict`); 4.9 follows it |
| 2.1 activity_log late | 2.1 creates `activity_log` and `services/activity` and writes the Subscriber row; 3.3 writes `contribution_received`; 3.6 writes purge rows; former 4.3 is now 4.10, view only |
| 2.2 Catalogue Record block | 4.4: picker stores the Artefact ID only; read-only `GET /api/admin/artefacts?q=` created in the same story; UX-DR61 inline form dropped and recorded as a deviation |
| 2.3 GET that changes state | 5.2 reveal is `POST .../reveal-email`; 6.2 export is `POST /api/admin/subscribers/export` (download built from the blob); both write activity rows; GET returns 405 |
| Check 3: 1.7/1.8/1.10 to 4.6 | 1.4 adds the `MEDIA` binding, `GET /media/*` with AD-8 headers and key regex, and seeded Placeholder image variants with `media_asset` / `media_ref` rows |
| Check 3: 4.6 to 4.8 alt-text gate | Gate removed from the image story; explicit AC in 4.8 (Terbitkan and Perbarui) and 4.9 |
| Check 3: oversized 4.6 | Split into 4.5 media upload pipeline and 4.6 crop tool island; Epic 4 renumbered (4.4 to 4.3, 4.5 to 4.4, activity view to 4.10); cross references updated (5.3 to 4.3, 4.9 to 4.3 and 4.6, 5.4 still 4.6) |
| Check 5: Epic 3 needs Epic 6 | New 3.6 creates the `0 19 * * *` cron with stale-upload purge, orphan sweep and capacity release; 6.1 extends the same step list |
| Minor | 1.6 page list reworded; 1.4 dev note on the seed writing D1 and R2 directly |

Additional issues found during this re-validation and fixed in the same pass:
- 4.7 measured NFR28 by publishing, which only exists in 4.8; the measurement now triggers `rebuilds.request()` from a test script.
- 4.5 creates `media_asset` records with status `uploading`, but 1.4 had no status column; 4.5 now adds it by additive migration (default `ready`).
- 4.2 nav showed sections not yet built; it now states that unbuilt sections open the shared empty state.
- 1.10 now updates the 1.4 seed tints with `clampTint()` instead of 1.4 depending on 1.10.

### Results

| Check | Result | Notes |
| --- | --- | --- |
| 1. FR coverage | PASS | FR-1 to FR-34 (FR-16 retired) mapped; FR-22/FR-32 deletion and lookup and FR-33 Perbarui now have explicit ACs |
| 2. Architecture implementation | PASS | Table timing below; AD-4, AD-6, AD-7, AD-10, AD-15 items resolved |
| 3. Story quality | PASS (with note) | No forward dependency; 4.4 (block editor with picker) is the largest story and stays borderline but cohesive |
| 4. Epic structure | PASS | Unchanged from the first run |
| 5. Dependency validation | PASS (with note) | Every epic works on earlier epics only |

Table creation timing after the fixes:

| Table / column | Created in | First needed by | Verdict |
| --- | --- | --- | --- |
| article, article_translation, artefact, artefact_translation, media_asset, media_ref, media_ref_translation, site_state | 1.4 | 1.4 seed and `/media/*` | OK |
| subscriber, activity_log | 2.1 | 2.1 | OK |
| contribution, contribution_photo | 3.2 | 3.2 | OK |
| media_asset.status, created_at | 4.5 | 4.5 | OK |
| rebuilds | 4.7 | 4.7 | OK |
| contribution_review, contribution.rejected_at | 5.3 | 5.3 | OK |
| artefact.source_contribution_id | 5.4 | 5.4 | OK |

Forward-dependency scan (every `Story X.Y` and `Epic N` reference compared with the referencing story, plus a manual read of what each story uses): no story needs a later story to work. Remaining forward mentions are declared hand-offs where the earlier story is complete on its own and a later story extends it: 1.1 to 1.2 (token values), 1.1 to 1.6 (snapshot and leak steps), 2.1 to 2.2 (limit inserted), 2.2 to Epic 3 (`hit` reused), 4.2 to Epic 5 (pending filter, empty state until then), 5.3 to 5.4 (Jadikan artefak added). 3.6 to 6.1 is the same pattern (6.1 adds steps to the existing list).

Notes (not failures):
- Epic 4 media: abandoned `staging/` uploads and unreferenced assets are cleaned only once 6.1 adds `media.purgeStaleUploads()` and `media.collect()`; until then they use storage but no cap or privacy rule depends on them.
- UX-DR61 deviation (no inline creation in the Catalogue Record block) needs UX sign-off.

### Coverage script

Every FR, NFR, AR and UX-DR id defined in the Requirements Inventory (205 ids) appears in at least one `Covers:` line, except NFR31 to NFR35 (launch checklist); FR-16 is retired and not in the inventory list. No `Covers:` line names an unknown id. Result: PASS.
