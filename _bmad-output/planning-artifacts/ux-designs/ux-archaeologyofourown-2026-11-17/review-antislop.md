# Anti-slop audit: DESIGN.md and EXPERIENCE.md

Date: 2026-11-17. Scope: `DESIGN.md`, `EXPERIENCE.md` in this folder, read against antislop (core), antislop-ui and antislop-copywriting. Audit only: neither spine was edited. Severity follows the antislop tiers: HIGH = Hard Gate rule, MEDIUM = Purpose-Gate rule or a factual error in copy, LOW = Quality Lock or polish.

Companion: `.working/direction-ruang-baca-v2.html` already applies the admin fixes marked "applied in v2" below, so the spines and the mockup now disagree on those points until the owner decides.

## HIGH

### H1. Em dashes in shipped microcopy (R-02)

- EXPERIENCE.md › Voice and Tone, Submit failed: "Isian dan foto Anda masih di sini — coba kirim lagi." / "Your text and photos are still here — try again."
- Newsletter success (EN): "Thanks — you'll hear about new articles."
- Dashboard empty queue: "Tidak ada kiriman yang menunggu — Semua sudah dibaca. …"
- DESIGN.md › Layout: section label example "`02 — SOROTAN ARSIP`".

Why: these strings go straight into the UI, and R-02 bans the em dash in any text the agent writes. The prose of both spines also uses em dashes throughout (headings, asides). That prose is documentation, so it is lower priority, but the copy table is product text.

Replace:
- "Kiriman belum terkirim. Isian dan foto Anda masih di sini, coba kirim lagi." / "Your contribution wasn't sent. Your text and photos are still here, so you can try again."
- "Thanks. You'll hear from us when a new article is out."
- Empty queue heading and body as two separate strings (see M6).
- Section label: "02 · Sorotan arsip" (see M2).

## MEDIUM

### M1. Admin sheet shadow is a generic float (R-12) (applied in v2)

- DESIGN.md front matter: `shadow: '0 1px 0 {colors.admin-line}, 0 8px 30px rgba(36,34,31,.06)'`, and › Elevation: "one soft elevation only — the sheet".

Why: the sheet never floats over anything. It sits in the room, and the room → rail → sheet tonal stack already separates it. A 30px ambient blur is the default "soft card" look. The only element that does float is the Slash menu (and dialogs).

Replace: `admin-sheet.border: 1px solid {colors.admin-line}`, no shadow. Keep one small shadow token (`0 8px 24px rgba(36,34,31,.08)`) for the Slash menu and Confirm dialog only, with that reason written in › Elevation.

### M2. Uppercase tracked meta labels without a written reason (R-06)

- DESIGN.md `meta: … letterSpacing: 0.08em` and Typography table: "Metadata (series label, inventory no., date, reading time) … Uppercase".
- Layout: "full-width rules carrying a meta label (e.g. `02 — SOROTAN ARSIP`)".
- Placeholder marker: "meta label 'PLACEHOLDER'".

Why: numbered, tracked, uppercase section labels are the most recognisable template eyebrow. The archive world can justify one uppercase line (a catalogue card's inventory number), but the spine applies it to every meta string and gives no reason.

Replace: sentence case meta at `letterSpacing: 0.01em` everywhere, with tabular figures. If the owner wants the catalogue feel, keep uppercase for the inventory number line inside the Catalogue Record block only, and write that reason in › Typography. Section label: "02 · Sorotan arsip", or drop the number if it encodes nothing. Placeholder marker: "Contoh" / "Placeholder" in sentence case.

### M3. Pills for a single-select control and a status (R-11, R-09) (applied in v2)

- DESIGN.md: `admin-series-chip … radius: '{rounded.full}'`, "four pills; selected = 2px text border".
- `rebuild-status-chip … radius: '{rounded.full}'`, "status icon (spinner ring while building)".

Why: Editorial Series is a required single choice (EXPERIENCE: "exactly one Editorial Series per Article"). A pill with a thicker border looks like a filter tag and does not read as a radio choice. The rebuild chip is pill + icon + short status, the capsule-badge shape. In a static render the spinner ring also looks like a broken icon.

Replace: series as a fieldset with a visible legend "Seri editorial" and radio options (`{rounded.admin-sm}`, control border, a visible radio dot, selected = text-colour border + weight 500). Rebuild status as a text tag at 6px radius on the sheet, wording per M5. Keep an animated indicator only while `building`, and stop it under `prefers-reduced-motion`.

### M4. Control border colour does not match the agreed value

- DESIGN.md › Colors (admin): "Control borders use `{colors.admin-muted}`", and `admin-button-secondary`, `admin-text-field` and `admin-series-chip` all point to `admin-muted` (#5F5B55).

Why: the direction now fixes control borders at #857F76 (3.85:1 on sheet, 3.63:1 on the decision bar footer, so it passes 1.4.11). #5F5B55 also passes, but at 6.56:1 it draws a heavy outline around every button and field. Reusing the text token for borders also ties two roles together.

Replace: add `admin-control: '#857F76'` and point the three components at it. Keep `admin-muted` for text only. Record the ratios in the table.

### M5. Rebuild chip copy is vague and contradicts its screen

- EXPERIENCE.md: "Sedang dibangun… ~2 menit †"; DESIGN.md example on the "Artikel baru" screen.

Why: the subject is missing (what is being built?), "~" is chat shorthand, and the ellipsis adds nothing. The chip is shown on a new, unpublished Article, but per EXPERIENCE it only appears after Terbitkan, so the mockup state cannot happen.

Replace: "Situs sedang dibangun ulang, sekitar 2 menit" → "Sudah tayang" / "Gagal dibangun. Situs lama tetap tayang." + "Coba lagi". Mock it on an Article that was just published, with the primary button reading "Perbarui".

### M6. Empty-queue copy says something untrue

- EXPERIENCE.md: "Tidak ada kiriman yang menunggu — Semua sudah dibaca. Kiriman baru akan muncul di tumpukan ini."

Why: the queue empties when every Contribution has been decided (approved or rejected), not when it has been read. "Tumpukan" also changes the noun: the rail is called "Menunggu dibaca", a list. The em dash is H1.

Replace: heading "Tidak ada kiriman yang menunggu", body "Semua kiriman sudah diputuskan. Kiriman baru dari halaman Kirim artefak masuk ke daftar ini, yang terlama di atas.", action "Lihat yang disetujui".

### M7. Template section reveal on every public section (R-19)

- DESIGN.md: `motion-section-reveal: duration 0.6s, easing power3.out, translateY 24px`; EXPERIENCE › Motion (public): "Section reveal … once".

Why: a fade-up on every section is the template animation the core names. The spine already has a real signature (Masthead strata), so a second, page-wide motion competes with it. 24px is also a long rise for content.

Replace: no reveal on sections. If one is kept, limit it to the Latest Articles grid on first view, with 8px rise, 300ms, the same easing as the rest, and a written purpose.

### M8. Decorative and abstract imagery (R-22)

- DESIGN.md › Admin Empty state: "simple line illustration (cup, `aria-hidden`)". (applied in v2)
- › Public Components: "Placeholder images are abstract textures."

Why: the cup has no connection to Contributions or archives. It decorates an empty state that the sentence already explains. "Abstract textures" as placeholders is how gradient blobs end up standing in for photos (v1 did exactly this on the review sheet).

Replace: empty state with heading, sentence and action, no illustration. Placeholder images become a plain `{colors.surface}` slot at the real aspect ratio, with the visible Placeholder marker and alt text that says it is a placeholder.

### M9. Missing loading and error states in the Dashboard (R-27)

- EXPERIENCE.md › State Patterns lists "Save failed" as an assumption, but has no loading or error state for the queue rail, the review sheet or the photo lightbox.

Why: the Dashboard reads remote data on every screen. R-27 requires empty, loading and error states for each data view.

Replace: queue loading "Memuat kiriman…" (rail rows at their real height); queue error "Daftar kiriman tidak bisa dimuat. Periksa koneksi, lalu muat ulang."; photo error "Foto 3 tidak bisa dimuat." + "Coba lagi"; decision save error "Keputusan belum tersimpan. Catatan Anda masih di sini." + "Simpan lagi".

## LOW

### L1. Off-grid and fractional values (Quality Lock, unslop spacing pass) (applied in v2)

- `admin-ui fontSize: 15.5px`, `admin-button-primary minHeight: 46px`, `admin-nav-width: 196px`; EXPERIENCE › Touch: "≥ 46px admin buttons".
- Why: the spine declares a 4px scale and then breaks it; 15.5px renders differently per browser.
- Replace: 15px, 48px, 200px.

### L2. Weight 600 as the default emphasis

- `admin-button-primary text: '600 …'`, nav active "weight 600", series selected "weight 600", aging note "accent 600".
- Why: 600 on buttons, nav, chips and the aging note together leaves no weight in reserve for emphasis.
- Replace: 500 for all four. Hierarchy comes from size and colour.

### L3. Admin titles in Inter while the public titles are Fraunces (R-06, Open Question 8)

- DESIGN.md: `admin-title` and `admin-editor-title` in Inter with negative tracking.
- Why: the Contribution title and the Article title are the words that get published. In Inter the editor never sees them as readers will. Negative tracking (-0.015em) is the generic "modern heading" setting.
- Replace: Fraunces (Georgia fallback), weight 400, tracking 0, for the Contribution title, the Article title and the standfirst only. Inter stays for everything that belongs to the tool. This settles Open Question 8: Inter, not the mockup's system humanist stack. (applied in v2)

### L4. Decorative arrow in the next-item link (R-08) (applied in v2)

- "Berikutnya: {judul} →".
- Replace: "Berikutnya: {judul}", with the title as the link.

### L5. Actorless helper text (copywriting: actorless passive)

- "Tidak dikirim ke kontributor. Tersimpan bersama keputusan di Aktivitas."
- Replace: "Kontributor tidak melihat catatan ini. Catatan disimpan bersama keputusan di Aktivitas." (applied in v2)

### L6. Negative parallelism in the brand line (copywriting)

- DESIGN.md › Brand & Style (admin): "make the weekly review feel calm rather than like clearing an inbox".
- Replace: "keep the weekly review to one Contribution at a time, oldest first".

### L7. Vague rate-limit message

- "Coba lagi nanti." / "Try again later."
- Replace with the real window once the limit is known: "Coba lagi dalam 10 menit." Until then keep it, but tag it [ASSUMPTION].

### L8. Hover scale on cards (unslop motion pass)

- Article card and Catalogue card: "image scale 1.02".
- Why: small, but it is the default card hover. The title underline already signals the link.
- Replace: title underline only, or an image brightness step. Neither moves the layout.

### L9. Pull quote: italic plus accent left rule

- "Pull quotes: Fraunces italic, accent rule left".
- Why: both the italic and the coloured left stripe are allowed for an editorial pull quote, but the spine gives no reason, and the stripe is one of the core's named tells.
- Replace: keep one of the two (a larger Fraunces roman size, or the rule) and write the reason.

## Mockup-only notes (v1, not in the spines)

- Gradient blobs (`linear-gradient(165deg,#BFA889,#8C755A)` and three siblings) stood in for Contribution photos. v2 uses plain labelled slots.
- macOS traffic-light dots and a fake domain in the window bar. v2 shows the path only.
- "dikirim Rabu, 5 November 2026": 5 November 2026 is a Thursday. v2 says "Kamis".
- `#BDB8AF` and `#A9A49B` control borders fail 1.4.11. v2 uses #857F76.
