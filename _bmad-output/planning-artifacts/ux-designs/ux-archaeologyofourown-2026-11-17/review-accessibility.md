---
title: Accessibility review (WCAG 2.2 AA), UX spines and key mockups
date: 2026-11-17
scope: DESIGN.md, EXPERIENCE.md, mockups/dashboard-review.html, mockups/public-home.html, mockups/public-kirim.html, .memlog.md
method: Source reading only (no browser). Contrast computed with antislop-human/contrast-check.py (WCAG 2.x formula).
verdict: Pass with fixes. No critical blockers; 6 high findings must be resolved in the spines before implementation.
---

# Accessibility review

**Verdict: pass with fixes.** The spines already carry a strong floor (focus rings, error summary, live regions, fieldset/legend, reduced motion, 3:1 admin control borders, accent-on-rail ban). The gaps are in rules that are underspecified for custom widgets, in the tint rule, and in selected-state contrast in the Dashboard.

Counts: critical 0 · high 6 · medium 11 · low 8.

## Contrast verified

All ratios recomputed; the spine tables are correct where they state a value.

| Pair | Ratio | Result |
|---|---|---|
| ink / paper, ink-dark / paper-dark | 14.98 / 14.81 | pass |
| ink-muted-dark on surface-dark `#A79E91 / #201D1A` | 6.34 | pass |
| accent-dark on surface-dark `#E07A5C / #201D1A` | 5.68 | pass |
| on-accent-dark on accent-dark hovered (8% darker, `#CE7055`) | 5.31 | pass |
| accent hover `#A64028` on paper | 5.42 | pass |
| **accent on surface `#B4462B / #EAE3D7`** | **4.28** | **fails 1.4.3 for normal text** (see M-1) |
| accent on mock tint `#D5DEDA` | 3.97 | non-text only (focus ring passes 3:1); fails as text |
| muted on mock tint `#5E574F / #D5DEDA` | 5.18 | pass for this tint only |
| **muted on a tint that just meets ink 4.5:1 (`#828282`)** | **1.85** | **fails** (see H-1) |
| admin-muted on rail-hover `#5F5B55 / #EBE8E2` | 5.51 | pass |
| admin-accent on decision bar `#F6F5F1` | 5.00 | pass |
| admin-control on decision bar | 3.64 | pass 1.4.11 |
| **admin active item: sheet on rail / sheet on room** | **1.27 / 1.16** | **fails 1.4.11 as sole state cue** (see H-5) |
| admin-line hairline on sheet / on rail | 1.42 / 1.12 | decorative only, cannot carry state |
| upload progress fill accent on track line `#CFC6B8` | 3.23 | pass (track vs paper 1.48 is decorative) |
| line-dark on paper-dark | 1.51 | decorative only; never use for a control or progress track in dark |

## High

### H-1. Tint rule only protects ink; muted text, accent and focus fail on legal tints
- **WCAG:** 1.4.3, 1.4.11
- **Where:** DESIGN.md Colors (`tint` row, Do's and Don'ts), EXPERIENCE.md Accessibility Floor, Artefact of the Day.
- **Problem:** The clamp keeps only ink ≥ 4.5:1. The section also carries muted text (date meta, figcaption, "Artefak berganti setiap hari…", Catalogue Record labels), the Category tag border, the secondary button border and the accent focus ring. A tint that just meets ink 4.5:1 (e.g. `#828282`) gives muted 1.85:1 and accent 1.42:1. The rule also says nothing about dark mode, where ink is light and the tint must be dark: on `#4A4A4A`, ink-dark passes (7.15) but muted-dark is 3.35 and the accent-dark ring 3.00.
- **Fix:** Rewrite the rule per theme: derive the tint, then clamp its lightness until **every** foreground in the section passes (muted text ≥ 4.5:1, ink ≥ 4.5:1, accent/focus ring and ink borders ≥ 3:1); in dark mode clamp towards dark. Fall back to `{colors.surface}` / `surface-dark` if the clamp cannot reach it. Keep the Placeholder marker and any accent text on a paper chip as now. Add a build-time or runtime check with these thresholds.

### H-2. Hidden header can take keyboard focus while invisible
- **WCAG:** 2.4.7, 2.4.11, 2.4.3
- **Where:** EXPERIENCE.md Component Patterns › Header; public-home.html (header absent in the Masthead state).
- **Problem:** "Hidden while the Masthead is in view" does not say how. If it is hidden with transform/opacity, its links stay in the tab order and receive invisible focus; if it is removed, nothing says what happens when focus reaches it.
- **Fix:** While hidden, mark the header `inert` (or `visibility:hidden`) so it leaves the tab order; the Masthead already holds the language switch and both actions. Alternatively reveal the header on `:focus-within`. State the choice in the spine.

### H-3. "Pilih foto" focus is invisible
- **WCAG:** 2.4.7
- **Where:** public-kirim.html file drop zone: `<label class="btn btn-s" for="…-file">` plus `<input class="vh" type="file">`.
- **Problem:** Keyboard focus lands on the visually hidden 1px input; the focus ring is drawn on that clipped element, so the user sees no focus on the main upload control.
- **Fix:** Draw the ring on the label when the input is focused (`.drop label:has(+ input:focus-visible)` outline), or use a real `<button>` that calls `input.click()`. Add to DESIGN.md › File drop zone: "focus ring on the visible Pilih foto control".

### H-4. Drag-only actions in the crop tool and block reorder lack a single-pointer alternative
- **WCAG:** 2.5.7 (and 2.1.1)
- **Where:** EXPERIENCE.md Image crop tool, Block editor, Interaction Primitives › Drag and drop ("each has a button **or keyboard** equivalent").
- **Problem:** 2.5.7 requires a single-pointer (click/tap) alternative; a keyboard equivalent does not satisfy it. The crop frame and handles are drag or arrow-key only; block reorder is "drag handle or keyboard shortcuts [ASSUMPTION]".
- **Fix:** Change the primitive to "a visible button alternative". Crop: add nudge/resize buttons or aspect presets (Bebas, 1:1, 4:5, 3:2) plus "Perkecil/Perbesar", with numeric crop size announced. Blocks: block menu with "Pindah ke atas", "Pindah ke bawah", "Hapus blok". Keep the keyboard shortcuts as well.

### H-5. Dashboard selected states rely on 1.1 to 1.3:1 tone differences
- **WCAG:** 1.4.11 (also 1.4.1)
- **Where:** DESIGN.md `admin-queue-item-active`, `admin-nav-item-active`, `admin-language-tabs`; dashboard-review.html `.rail li a[aria-current]`, `nav a[aria-current]`, `.tabs a[aria-selected]`.
- **Problem:** Active queue item = sheet on rail (1.27) plus `admin-line` inset (1.12); no other cue. Active nav and active language tab add only weight 500 on a 1.16 to 1.27 tone. Editors cannot reliably see which Contribution or language they are on.
- **Fix:** Add a cue that meets 3:1: e.g. a 2px or 3px `{colors.admin-text}` (or accent on sheet) bar at the left of the active queue/nav item, and a 2px `{colors.admin-text}` underline or `admin-control` border on the active language tab. Keep `aria-current` / `aria-selected`.

### H-6. Block editor and Slash menu have no assistive-technology model
- **WCAG:** 4.1.2, 2.1.1, 1.3.1, 4.1.3
- **Where:** EXPERIENCE.md Block editor, Slash menu, Catalogue Record block (editor).
- **Problem:** The spine gives keys but no roles, names or announcements. A Notion-style contenteditable is the riskiest widget in the product: block type, focus between blocks, the menu's active option and inserted-block confirmation are all invisible to screen readers unless specified. The `/` menu is also the only way to insert blocks, so it is undiscoverable without typing.
- **Fix:** Specify: editor region `role="textbox" aria-multiline="true"` with a label per field (title, standfirst, body, with `lang` per tab); semantic output (`h2`, `blockquote`, `figure`); Slash menu as combobox + listbox with `aria-activedescendant`, a polite result count, and "Blok {jenis} ditambahkan" on insert; a visible "Tambah blok" button that opens the same menu; Catalogue Record and image blocks as labelled form groups (alt text field required per language). Choose a library with a documented accessible editing model (e.g. ProseMirror/Tiptap) and test with VoiceOver and NVDA.

## Medium

| ID | WCAG | Location | Problem | Fix |
|---|---|---|---|---|
| M-1 | 1.4.3 | DESIGN.md Colors (public); kirim `.th.bad .pv` "HEIC" label; any accent text on surface (Artefact of the Day fallback, drag-over zone) | Accent on `{colors.surface}` is 4.28:1, below 4.5 for normal text. | Add the rule "accent text only on paper, never on surface" (mirror of the admin rail rule), and set the HEIC label in ink with the accent icon. |
| M-2 | 2.4.11 | EXPERIENCE.md Accessibility Floor | Only anchor targets are offset; tabbing to fields and links under the sticky header (plus 2px progress bar) can still be covered. | Specify `scroll-padding-top` equal to header + progress bar height on `html`, which also governs focus scrolling. |
| M-3 | 2.4.3 | Contribution submit, Newsletter submit, Artefact swap, admin save buttons | "Submitting disables the button" with native `disabled` drops focus to `body`. | Use `aria-disabled="true"` and ignore clicks during the request; keep focus on the button. |
| M-4 | 2.4.7 | kirim `.err .chk input{outline:2px solid accent}` | Error state on the consent checkbox uses the same outline as the focus ring; focus becomes indistinguishable. | Show the error by message and icon (already there) and a thicker border, not an outline; keep outline for focus only. |
| M-5 | 4.1.2, 2.1.1 | Language tabs (ID \| EN); mockup uses `<a role="tab">` with no tabpanel | Tab semantics without the tab keyboard model and panels. | Either full ARIA tabs (roving tabindex, arrow keys, `aria-controls` tabpanel) or two buttons with `aria-pressed`. Say which in the spine. |
| M-6 | 1.3.1, 4.1.2 | Image crop tool | Handles and frame have no names, roles or value announcement. | Each handle a focusable element with a name ("Sudut kiri atas"), frame announces "Potongan {w} × {h} piksel" politely after moves; rotate announces the angle. |
| M-7 | 2.2.1 | Dashboard, Cloudflare Access session | The Access session is a time limit not set by the user; on expiry autosave and the review note fail. "Text stays" is only true while the tab is open. | Persist drafts and the unsent review note locally until saved; on 401 show "Sesi berakhir. Masuk lagi, tulisan Anda tetap di sini." and resume; or warn before expiry. |
| M-8 | 4.1.3, 2.2.1 | Decision bar "Kiriman ditolak… Batalkan", auto-advance | The undo button is described inside a polite status, and the sheet advances right after; it is unclear where Batalkan lives and whether it times out. | Keep the status text in `role="status"` and put Batalkan as a normal button that persists (on the rejected item and in Aktivitas, until deletion date), not in a toast that disappears. |
| M-9 | 4.1.3 | Autosave status | Announcing "Menyimpan…" and "Tersimpan · HH.MM" on every 2-second pause interrupts screen-reader users while typing. | Do not put routine save states in a live region; announce only failures ("Belum tersimpan") and make the time readable on demand (status text near the footer). |
| M-10 | 3.3.1, 1.1.1, general | Turnstile on Contribute and Newsletter | No rule for Turnstile language, failure message or an alternative route. A failed or blocked challenge stops the contribution with no path. | Set Turnstile `language` to the page language, use managed mode, show a text error "Verifikasi gagal. Coba lagi, atau kirim lewat email {alamat}." and offer that email route on the no-JS notice too. |
| M-11 | 4.1.3, 1.3.1 | Newsletter mockup `<p class="vh" role="status">` | The spec promises an inline status; the mockup's status is screen-reader only, so sighted users get no confirmation. | Make the status visible text inside the live region. |

## Low

| ID | WCAG | Location | Problem | Fix |
|---|---|---|---|---|
| L-1 | 2.2.2 | Rebuild status "building" indicator | Loops for about 2 minutes beside other content. | Keep it small and static under reduced motion (already specified); prefer a non-looping cue or stop after 5 s with text alone. |
| L-2 | 2.4.4, 2.4.6 | Language switch "ID" / "EN" | Accessible names are bare codes. | Add visually hidden "Bahasa Indonesia" / "English" (keep `lang` and `hreflang`). |
| L-3 | 3.1.2 | Block editor, public Article | No way to mark an inline passage in another language (Dutch label, Javanese quote, English quote in an ID Article). | Add an inline "Bahasa" mark in the editor that renders `lang` on the span. |
| L-4 | 3.1.2 | Mockups: "Placeholder" marker on `lang="id"` pages | English word on an Indonesian page. | Use "Contoh" on ID pages or mark `lang="en"`. |
| L-5 | 1.1.1 | Masked email "r•••@contoh.id" | Bullets are read as "bullet bullet bullet". | Wrap the masked string with an accessible label "email disamarkan, domain contoh.id". |
| L-6 | 2.4.4 | Article card "whole card is one link" | Link name becomes the full card text (series, title, excerpt, date). | Link the title and stretch its hit area over the card with a pseudo-element; or `aria-labelledby` the title. |
| L-7 | 1.3.1 | public-home.html strata bands | Visible band labels ("Lapisan 1 · sebelum dibuat") inside an `aria-hidden` container, and they contradict the memlog decision of no band labels. | Remove the labels as decided. |
| L-8 | 2.5.8 | Quiet "Tampilkan" in the byline, ToC links | Quiet buttons have no stated minimum size. | State min 24 × 24 px hit area for quiet buttons and ToC links. |

## Checked and fine

Skip link first and targeting the content heading; error summary with links, focus move and `aria-describedby`/`aria-invalid` on fields; required/optional convention stated; radio fieldsets with legends; per-file error by name and rule, remove buttons named with the file; upload status in `role="status"` with `progressbar`; mobile menu as modal dialog with focus trap and return; dialogs, lightbox and crop tool trap and restore focus; reduced motion covers scrub, fade-up, swap, tint and admin transitions; motion inside Article text banned; reading progress bar decorative with ToC as the structure; `lang`/`hreflang` per page and `lang` per Dashboard tab; Tolak without reason moves focus to the note with an error; admin control borders ≥ 3:1 on all four surfaces; accent text banned on the admin rail; targets 48px for buttons, 44px for language and footer links, 40px series radios, 32px language tabs.

Not checked: rendered behaviour in a browser, real Turnstile widget, real image tints, screen-reader output.
