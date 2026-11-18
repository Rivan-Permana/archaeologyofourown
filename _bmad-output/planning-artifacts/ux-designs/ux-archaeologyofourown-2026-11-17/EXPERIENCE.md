---
name: Archaeology of Our Own
status: final
created: 2026-11-17
updated: 2026-11-18
sources:
  - ../../prds/prd-archaeologyofourown-2026-11-17/prd.md
  - ../../prds/prd-archaeologyofourown-2026-11-17/addendum.md
  - ../../../../docs/DESIGN.md
  - mockups/dashboard-review.html
  - mockups/public-home.html
  - mockups/public-kirim.html
  - review-antislop.md
  - review-rubric.md
  - review-accessibility.md
---

# Archaeology of Our Own: Experience Spine

## Foundation

Web, two surfaces:

1. **Public site.** Bilingual (Indonesian default at `/`, English at `/en/`), static, reading-first. Readers, Contributors and Subscribers; no accounts.
2. **Editor Dashboard.** Private web application at `/admin` for 1 to 3 Editors (one role, full access), signed in through a Cloudflare Access one-time code. Interface in Indonesian; content authored in ID and EN. Light theme only in v1.

Built with **Astro** (static output, built-in i18n routing); no third-party UI kit. Components are hand-built against `DESIGN.md`, which is the visual identity reference for both scopes (`public` and `admin`). Motion on the public site uses GSAP and ScrollTrigger, loaded only where motion exists. This spine specifies behaviour; visual specs live in `DESIGN.md.Components`. Glossary terms from the PRD (§3) are used verbatim. Spines win on conflict with mockups.

## Information Architecture

### Public site

| Surface | ID route | EN route | Reached from | Purpose |
|---|---|---|---|---|
| Home | `/` | `/en/` | Direct, shared links | Masthead, Latest Articles, Artefact of the Day, Editorial Series, Contribute invitation, Newsletter, footer (in that order). Reference: [`mockups/public-home.html`](mockups/public-home.html) (Masthead and full page at 1440 and 375, thin header after the Masthead, Menu panel open) |
| Article | `/artikel/{slug}` | `/en/articles/{slug}` | Article card, Series block, Related Articles | Reading one Article |
| Contribute | `/kirim` | `/en/contribute` | Masthead secondary action, Contribute invitation, header/menu "Contribute" | Contribution form and success screen. Reference: [`mockups/public-kirim.html`](mockups/public-kirim.html) (error summary with a rejected HEIC, submitting with per-photo progress, success with Reference Number, at 1440 and 375) |
| Privacy | `/privasi` | `/en/privacy` | Footer, consent checkbox, Newsletter consent text, no-JS form notice | Privacy note |
| Not found | any unknown path | any unknown path | Old or mistyped links, Articles unpublished or deleted after sharing (FR-27) | Bilingual not-found page with routes home and to Latest Articles |

The public mockups show the light theme only; dark is specified in DESIGN.md tokens. Their internal links to `key-screen-home.html` and `key-screen-kirim.html` point to drafts in `.working/` and are not part of the reference.

`[NOTE FOR ARCHITECTURE]` The Contribute page (`/kirim`, `/en/contribute`) is a **new surface decided in UX**, beyond PRD §10's IA; the home page keeps only a short invitation and a "Kirim artefak" button. It needs routes, `hreflang` pairs and metadata (FR-8) like the other pages, and hosts the contribution form (`POST /api/contribute/start` and `/finish`).

Header anchors: Articles, Artefact of the Day, Contribute, Newsletter. On the Contribute, Article and Privacy pages the anchors point to home-page sections; "Contribute" points to the Contribute page. [ASSUMPTION: anchor targets on non-home pages resolve to `/#section`.]

Language switch: always reachable; keeps the reader on the equivalent page. On home it sits in the Masthead while the header is hidden, then in the thin sticky header; it is also in the mobile menu panel and the footer. Article without a translation leads to the other language's home with a notice (FR-2).

### Editor Dashboard

| Section (UI label) | Glossary object | Route | Purpose |
|---|---|---|---|
| **Kiriman** (landing) | Contributions | `/admin` → `/admin/kiriman`, item `/admin/kiriman/{Reference Number}` | Pending queue, oldest first; review one Contribution per sheet |
| Artikel | Articles | `/admin/artikel`, new `/admin/artikel/baru` | List, block editor, preview, publish |
| Artefak | Artefacts | `/admin/artefak` | List and Catalogue Record editor; Artefact of the Day pool |
| Pelanggan | Subscribers | `/admin/pelanggan` | Search, CSV export, delete on request |
| Aktivitas | Activity log | `/admin/aktivitas` | Who did what and when |

Item and "baru" routes come from the direction C mockup; others are [ASSUMPTION: same pattern]. Nav order follows the mockup (Artikel, Artefak, Kiriman, Pelanggan, Aktivitas); `/admin` lands on Kiriman filtered to *pending*. Sign-in is Cloudflare Access's own screen, not a Dashboard surface.

Composition reference: [`mockups/dashboard-review.html`](mockups/dashboard-review.html) (Kiriman review sheet with the catalogue-record strip, Artikel baru just after Terbitkan, empty queue). Where it still shows "Simpan draf", autosave in this spine wins.

## Voice and Tone

Microcopy. Brand voice lives in `DESIGN.md › Brand & Style`. Sentence case, short sentences, verbs for actions, errors that say what to do. No em dashes in any interface copy: a sentence that wanted one is rewritten as two sentences, or with a comma, colon or parentheses. Public copy in ID and EN; Dashboard copy in ID only. Copy marked † is from sources; the rest is [ASSUMPTION: draft wording, finalised through `better-writing` and `design:ux-copy`; manifesto, consent and privacy wording need client approval].

| Context | Indonesian | English |
|---|---|---|
| Primary CTA (Masthead) | Baca artikel † | Read articles † |
| Secondary CTA | Kirim artefak † | Contribute an artefact † |
| Newsletter | Ikuti kabar † | Get updates † |
| Artefact swap | Tampilkan lainnya † | Show another † |
| Share | Salin tautan · Tautan tersalin | Copy link · Link copied |
| Photo error | Foto harus JPG, PNG, atau WebP, maksimal 10 MB. † (prefixed with the file name) | Photos must be JPG, PNG or WebP, up to 10 MB. † |
| Required field | Isi judul artefak. | Enter the artefact title. |
| Submit failed | Kiriman belum terkirim. Isian dan foto Anda masih di sini, coba kirim lagi. | Your contribution wasn't sent. Your text and photos are still here, so you can try again. |
| Rate limited | Terlalu banyak kiriman dari jaringan ini. Coba lagi dalam satu jam. | Too many submissions from this network. Try again within an hour. |
| Site-wide cap reached (100 per day or 5 GB of photos) | Kiriman sedang ditutup sementara. Coba lagi besok. Isian Anda masih di sini. | Submissions are paused for now. Please try again tomorrow. Your entries are still here. |
| Photo preparation (per file, before upload) | Menyiapkan foto… · Mengunggah {n}% · Terunggah | Preparing photo… · Uploading {n}% · Uploaded |
| Privacy note and form helper, network address | Kami tidak menyimpan alamat jaringan Anda. Untuk membatasi kiriman berulang, kami menyimpan kode acak yang dibuat dari alamat itu paling lama 1 jam, lalu menghapusnya. | We don't store your network address. To limit repeated submissions, we keep a scrambled code made from it for up to 1 hour, then delete it. |
| Success (Reference Number) | Terima kasih. Nomor referensi Anda: **AOO-7K3F9Q**. Editor akan membacanya; belum ada yang diterbitkan. | Thank you. Your reference number: **AOO-7K3F9Q**. The Editor will review it; nothing is published yet. |
| Success follow-up | Editor mungkin menghubungi Anda lewat email. Untuk menarik kiriman sebelum terbit, balas dengan nomor referensi ini. | The Editor may contact you by email. To withdraw before publication, reply quoting this reference number. |
| Newsletter success (same for new and existing) | Terima kasih. Kami akan mengabari Anda saat ada artikel baru. | Thanks. You'll hear from us when a new article is out. |
| Missing translation | Artikel ini belum tersedia dalam bahasa Indonesia. | This article isn't available in English yet. |
| Series empty | Segera hadir | Coming soon |
| No-JS form | Formulir ini butuh JavaScript untuk verifikasi manusia. | This form needs JavaScript for human verification. |
| Verification failed (Turnstile) | Verifikasi gagal. Coba lagi. Isian Anda masih di sini. | Verification failed. Please try again. Your entries are still here. |
| Language switch (accessible names) | Bahasa Indonesia | English |
| Not found | Halaman ini tidak ada atau sudah tidak diterbitkan. Ke beranda · Artikel terbaru | This page doesn't exist or is no longer published. Go home · Latest articles |

Dashboard (ID only). Tone: guiding and calm, counts and ages instead of alarms.

| Context | Copy |
|---|---|
| Queue rail | "Menunggu dibaca" †, "7 kiriman, yang terlama di atas" |
| Catalogue-record strip | "No. referensi", "Diterima", "Urutan · 1 dari 7", "Kiriman tertua · menunggu 12 hari"; closing: "Tahun", "Kategori", "Izin muat", "Lokasi foto · sudah dihapus" |
| Masked email | "Tampilkan" |
| Decision note | "Catatan untuk editor lain" †; helper "Kontributor tidak melihat catatan ini. Catatan disimpan bersama keputusan pada kiriman ini, tidak di Aktivitas." |
| Decisions | "Jadikan artefak", "Setujui", "Tolak" † |
| Tolak without a reason | "Tulis alasan singkat sebelum menolak." |
| After Tolak | "Kiriman ditolak. Foto dan data dihapus pada {tanggal}." with "Batalkan" |
| Next item | "Berikutnya: {judul}" (title is the link) |
| Editor footer | "Pratinjau", "Terbitkan" †; "Perbarui" on published content |
| Autosave | "Menyimpan…", "Tersimpan · 14.32", failure "Belum tersimpan" with "Coba lagi"; on published content "Draf tersimpan. Tekan Perbarui untuk menayangkan." |
| Rebuild status | "Situs sedang dibangun ulang, sekitar 2 menit", "Sudah tayang", "Gagal dibangun. Situs lama tetap tayang." with "Coba lagi" |
| Language tab | "English · kosong" † |
| Crop tool | "Putar kiri", "Putar kanan", "Atur ulang", "Batal", "Terapkan"; presets "Bebas", "1:1", "4:5", "3:2"; "Perkecil", "Perbesar", "Geser kiri/kanan/atas/bawah"; announced "Potongan 1200 × 1500 piksel", "Diputar 90 derajat" |
| Block editor | "Tambah blok", "Opsi blok", "Pindah ke atas", "Pindah ke bawah", "Hapus blok"; announced "Blok {jenis} ditambahkan", "{n} pilihan" |
| Artikel list | Action "Tulis artikel" |
| Pelanggan search, no results | "Tidak ada pelanggan dengan email itu." |
| Aktivitas empty | "Belum ada aktivitas. Setiap keputusan dan terbitan akan tercatat di sini." |
| Session expired | "Sesi berakhir. Masuk lagi, tulisan Anda tetap di sini." with "Masuk lagi" |
| Phone note | "Buka di laptop atau tablet untuk menyunting." |
| Empty queue | Heading "Tidak ada kiriman yang menunggu"; body "Semua kiriman sudah diputuskan. Kiriman baru dari halaman Kirim artefak masuk ke daftar ini, yang terlama di atas."; action "Lihat yang disetujui" |
| Loading | "Memuat kiriman…" |
| Errors | Queue: "Daftar kiriman tidak bisa dimuat. Periksa koneksi, lalu muat ulang." with "Muat ulang". Sheet: "Kiriman ini tidak bisa dibuka. Periksa koneksi, lalu coba lagi." with "Coba lagi". Photo: "Foto 3 tidak bisa dimuat." with "Coba lagi". Decision: "Keputusan belum tersimpan. Catatan Anda masih di sini." with "Simpan lagi". Upload: "{nama file} gagal diunggah. Foto lain tetap ada." with "Coba lagi". |

## Component Patterns

Behavioural. Visual specs live in `DESIGN.md.Components`; names match.

### Public

| Component | Behavioural rules |
|---|---|
| Masthead | Home page only; first surface (FR-3, UJ-1 step 1). Holds the name, manifesto, "Baca artikel" (primary) and "Kirim artefak" (secondary), and the ID/EN switch, which lives here while the header is hidden (FR-2 "always reachable"). All of it fits in the first screen at 375×812 and 1440×900. "Baca artikel" scrolls to Latest Articles and moves focus to its heading; "Kirim artefak" opens the Contribute page. Strata bands carry no text labels and are `aria-hidden`. Signature motion: the five bands separate vertically as the reader scrolls (scrub, `{components.motion-strata}`); the Masthead content fades up once on load (`{components.motion-fade-up}`). Under reduced motion the bands stay closed and nothing fades. Gap distance and timing are set in the motion prototype (Open Questions). Reference: [`mockups/public-home.html`](mockups/public-home.html). |
| Header | Hidden while the Masthead is in view; once the Masthead is scrolled past it appears as a thin sticky bar. While hidden it is `inert`, so its links leave the tab order and cannot take invisible focus; the Masthead carries the language switch and both actions meanwhile. On non-home pages it is visible and sticky from the top. Current-section underline follows scroll on home. Skip link is the first focusable element. Language switch keeps the equivalent page (FR-2); its links have accessible names "Bahasa Indonesia" / "English" with `lang` and `hreflang`. |
| Mobile menu panel | Menu button opens a full-screen panel: Articles, Artefact of the Day, Contribute, Newsletter, ID/EN switch. Opening traps focus and moves it to the first item; `Esc`, the close button or choosing an item closes it and returns focus to the Menu button; page scroll is locked while open. |
| Button / Link | Buttons act, links navigate. Masthead primary action moves focus to Latest Articles (FR-3). A busy button (submit, swap) uses `aria-disabled="true"` and ignores clicks until the request returns; focus stays on it. Native `disabled` is not used on a button that has focus. |
| Article card / Featured article card | Whole card is clickable (FR-4): the title is the one link and its hit area stretches over the card, so the link name is the title alone; newest Article featured. Only Articles available in the current language appear. Hover underlines the title; nothing moves. |
| Series block | Links to the latest Article; with no Article shows "Segera hadir / Coming soon" with no link (FR-5). |
| Catalogue card / Catalogue Record block / Category tag | Static content; card is one link where it leads somewhere. Category label shown in the page language (*ingatan* / *memory*). |
| Artefact of the Day | Server renders today's Artefact (deterministic by Asia/Jakarta date). Fades up once on first view. Section background is the clamped `tint` (DESIGN.md › Colors › Tint clamp), computed for both themes. "Tampilkan lainnya" swaps to a random different Artefact without reload: crossfade `{components.motion-show-another.duration}`, tint transition `{components.motion-tint.duration}`; new Artefact announced politely to screen readers. Without JS the button is hidden. With one Artefact in the pool the button is hidden [ASSUMPTION]. |
| Article page | Text readable before scripts and images load; images load progressively. Related Articles: up to three from the same Editorial Series, never itself. |
| Reading progress bar | Tracks scroll through the Article body only; decorative (`aria-hidden`). Shown on Article pages only. |
| Table of contents | Shown only when the Article has three or more h2 headings; shorter Articles have none. Links jump to headings and move focus there; current heading highlighted while reading. On mobile it is a collapsed disclosure above the body. |
| Share control | Uses the native share sheet where available; otherwise copies the URL and confirms "Tautan tersalin / Link copied" via a polite live region. Reading time is shown in the byline. |
| Contribute invitation | Home section with short copy and a "Kirim artefak" button linking to the Contribute page. Static. |
| Text field / textarea | Validate on blur and on submit, not on every keystroke. Story shows a live character count to 5,000. Errors sit next to the field and are linked via `aria-describedby`. |
| File drop zone (contribution uploader) | Drag-drop or the "Pilih foto" button. "Pilih foto" is a real `<button>` that opens the file input, so focus and its ring land on the visible control. Accepts JPG, PNG, WebP up to 10 MB, 1 to 5 files. An invalid file is rejected by name with the rule and the valid ones stay (FR-12). The sixth file cannot be added and the zone says why. Each file shows thumbnail, name, size, remove button and its own progress; status changes announced via `aria-live`. Before upload the browser downscales each photo to at most 3000 px on the long edge and removes its metadata ("Menyiapkan foto…"); each file then uploads on its own straight to storage with its own progress and retry, so one failed file never resends the others. Server checks type by content. |
| Checkbox (consent) | Required; links to the privacy note in a new view without losing the form. Its error shows as message, icon and border, never as an outline, so focus stays distinguishable. |
| Contribution form | Groups: About you · About the artefact · Photos · Consent; Turnstile; submit. On submit with errors: error summary at top linking to each field, focus moves to the summary. Submitting sets the button busy (`aria-disabled`) and shows progress. Failure keeps all text and photos (FR-13, NFR reliability). Success replaces the form with the success screen and moves focus to its heading. Turnstile runs in managed mode with `language` set to the page language; a failed or expired challenge shows "Verifikasi gagal…" in the error summary, keeps every entry, and resets the widget for another try. |
| Newsletter form | Same confirmation for new and existing emails (FR-18); invalid email rejected before and after submit; status is visible text inside an `aria-live="polite"` region, so sighted and screen-reader users get the same confirmation. Turnstile as in the Contribution form. No pop-ups or interruptive prompts (SM-C2). |
| Placeholder marker / image | Always visible on Placeholder content until replaced (FR-25). Placeholder images are plain slots at the real ratio with alt text saying they are placeholders. The marker reads "Contoh" on ID pages and "Placeholder" on EN pages. |
| Footer | Static, on every public page. Links: Privacy note, Contribute, ID/EN switch (keeps the equivalent page). In the page language. |
| Not-found page | Served for any unknown path, including an Article unpublished or deleted after its link was shared. Bilingual (ID first, EN second, each with `lang`); links home and to Latest Articles in both languages. Header visible and sticky as on other non-home pages. |

### Editor Dashboard

| Component | Behavioural rules |
|---|---|
| Dashboard nav | Persistent left column; counts beside sections (pending Kiriman count). Active item marked `aria-current="page"` and by the 3px bar (visible cue ≥ 3:1). |
| Queue rail | Pending Contributions, oldest first; each item shows title, age, and Reference Number · Contributor · Category · photo count. Selecting an item opens it in the review sheet; the active item is marked `aria-current` and by the 3px bar. Filter by Review Status (*pending*, *approved*, *rejected*) with three links at the top of the rail; the current one carries `aria-current` and the underline [ASSUMPTION: filter control at the top of the rail]. |
| Catalogue-record strip (signature) | Read-only `dl`. Opening strip: Reference Number, date received, position in the queue ("1 dari 7"), and for the oldest pending item the waiting time. Closing strip after the story: year, Category, publication permission, and "Lokasi foto · sudah dihapus" confirming location data was stripped. Values come from the Contribution; nothing in the strip is editable. Review sheet only. |
| Review sheet | One Contribution at a time, opened by the catalogue-record strip. Photos open full size (lightbox) from hero or strip. Contributor email is masked by default; "Tampilkan" reveals the full address in place for manual contact, and the button then disappears. Rejected Contributions show their deletion date (FR-21). |
| Masked email | Masked by default; "Tampilkan" (accessible name "Tampilkan email kontributor") replaces it with the full address in place and then disappears, with focus moved to the address. The masked form is read as "email disamarkan, domain {domain}". |
| Photo lightbox | Opens from hero or strip; arrow keys and buttons move between photos; `Esc` closes and returns focus to the thumbnail. |
| Decision bar | Optional internal note (never sent to the Contributor; stored on the Contribution's review record and deleted with it, never in Aktivitas, which records only who decided what and when). **Setujui** sets *approved*. **Tolak** requires a short reason: with an empty note it does not proceed, shows "Tulis alasan singkat sebelum menolak." on the field and moves focus there; with a note it sets *rejected* at once, with no confirm dialog, because the decision can be changed later (FR-30). A polite `role="status"` line confirms the rejection and names the deletion date. "Batalkan" is a normal button, not part of a toast: it stays on the rejected item and in Aktivitas until the deletion date. **Jadikan artefak** approves (if pending) and opens a draft Artefact with the Catalogue Record pre-filled, Contributor credit from the chosen name, photos stripped of location data, email never copied (FR-31); the crop tool is available on each photo there. After a decision the sheet advances to "Berikutnya" automatically [ASSUMPTION]. Each change records Editor and time. |
| Image crop tool | Opens from a photo in "Jadikan artefak" and on Artefact image upload. Simple only: drag the frame or its corner handles to crop; every drag has a single-pointer button alternative (WCAG 2.5.7): aspect presets (Bebas, 1:1, 4:5, 3:2), "Perkecil" / "Perbesar", and four "Geser" buttons. "Putar kiri" and "Putar kanan" rotate 90°; "Atur ulang" restores the original; "Terapkan" saves, "Batal" or `Esc` discards. The frame and each handle are focusable with names ("Bingkai potongan", "Sudut kiri atas" and so on); arrow keys move the focused frame or handle in small steps. After a move or resize settles, a polite status reads "Potongan {w} × {h} piksel"; rotation reads the angle. The original photo is kept until the Artefact is published [ASSUMPTION]. |
| Rebuild status tag | Shown only on published content: after Terbitkan, unpublish, or an edit to a published Article or Artefact. Never on drafts. Cycles building → live / failed by polling; announced via `role="status"`. The building indicator animates for at most 5 seconds, then the text alone remains. Failed shows "Coba lagi" and states the previous site stays online (FR-33). |
| Autosave status | Saves the working draft only, a few seconds after typing stops; on published content the public site changes only when the Editor presses "Perbarui", and until then the footer reads "Draf tersimpan. Tekan Perbarui untuk menayangkan."; shows "Menyimpan…" then "Tersimpan · HH.MM" as plain text (not announced). Failure shows "Belum tersimpan" with "Coba lagi", announced once, and retries on the next pause. |
| Language tabs (ID \| EN) | One Article, two tabs, built as ARIA tabs: `tablist`, two `tab`s with `aria-selected` and `aria-controls`, each language's fields in a `tabpanel`; roving tabindex, Left/Right arrows move between tabs, Tab moves into the panel. Selected state shows by the underline as well as tone. EN may be empty; the tab label shows translation status (kosong / draf / terbit [ASSUMPTION: status vocabulary beyond "kosong"]). Publishing publishes each language version that has content; FR-1 listings show only available languages. |
| Editorial Series picker | Native radio group in a fieldset with legend "Seri editorial"; exactly one Editorial Series per Article, required before Terbitkan. Arrow keys move and select within the group. |
| Block editor | Notion-style: type `/` or press "Tambah blok" to open the Slash menu; Enter creates a paragraph. Reorder by dragging the "Opsi blok" handle, by its menu (Pindah ke atas, Pindah ke bawah, Hapus blok: the single-pointer alternative), or by keyboard shortcuts [ASSUMPTION: shortcut keys]; after a move, focus stays on the block and a polite status names its new position. Assistive-technology model: title, standfirst and body are each a labelled field (`role="textbox"`, body `aria-multiline="true"`, `lang` of the current tab); output is semantic (`h2`, `p`, `blockquote`, `figure` with `figcaption`); image and Catalogue Record blocks are labelled groups, with alt text required per language. An inline "Bahasa" mark sets `lang` on a selected passage (a Dutch label, a Javanese quote). Build on an editor library with a documented accessible editing model (e.g. BlockNote (AD-6)) and test with VoiceOver and NVDA. Supports headings, paragraphs, pull quotes, captioned images, Catalogue Record embeds. Drafts autosave a few seconds after typing stops [ASSUMPTION: about 2 seconds]; the footer shows "Menyimpan…" then "Tersimpan · HH.MM". Routine save states are not in a live region (no announcement while typing); only "Belum tersimpan" is announced. There is no "Simpan draf" button. Publishing stays manual (Terbitkan, or Perbarui on published content); autosave saves the working draft only and never changes the public site, so edits to published content go live only on an explicit Perbarui. If another Editor saved the same item first, the save is refused and the Editor reloads before continuing. Pratinjau opens the public reading layout. Slug unique per language; duplicates rejected with a message. Images: JPG/PNG/WebP ≤ 10 MB, alt text required in each published language (FR-28, FR-29); the crop tool opens on upload. |
| Slash menu | Opens at the caret on `/` or from "Tambah blok"; filters as the Editor types; arrow keys and Enter insert; `Esc` closes and leaves the `/` (or returns focus to "Tambah blok"). Combobox with a `listbox`; the active option via `aria-activedescendant`; a polite count ("{n} pilihan") as the filter changes; on insert, "Blok {jenis} ditambahkan" and focus moves into the new block. Items: heading, quote, image, Catalogue Record. |
| Catalogue Record block (editor) | Picker that searches published and draft Artefacts by title or inventory number and stores only the chosen Artefact's ID (architecture AD-6). The block previews that Artefact's record; on the public page it is omitted when the Artefact is not published. New Artefacts are created in the Artefak section, not inside the block. |
| Confirm dialog | Required for delete and unpublish only. Names the object and the consequence; destructive button last; `Esc` cancels; focus returns to the trigger. A published Article cannot be deleted until unpublished (FR-27). Tolak never opens a dialog. |
| Unsaved-changes guard | Leaving with changes not yet autosaved (nav click, back, tab close), or with an unsaved review note, asks to stay or discard. |
| Empty state | One sentence of what will appear here and one action. No illustration. |
| Loading and error states | Every data view (queue rail, lists, review sheet, photos) shows a loading state at its final size and an inline error with one recovery action. Saves (decision, autosave) and uploads keep the Editor's text and files on failure. |
| Lists (Artikel, Artefak, Pelanggan, Aktivitas) | Pelanggan: search, CSV export (email, language, sign-up date only), delete on request; a search with no match shows "Tidak ada pelanggan dengan email itu." Artikel/Artefak: show the Publication Status label; Artikel has the "Tulis artikel" action. Aktivitas: read-only, newest first [ASSUMPTION]; empty shows its Voice and Tone line. |
| Publication Status label | Read-only text ("Draf" / "Terbit") on list rows and in the editor header; changes only through Terbitkan or unpublish. |
| Phone note | On phone, opening an Article or Artefact editor shows the phone note instead of the editor; review and decisions stay available. |
| Admin buttons / Admin text field | As public rules (busy buttons use `aria-disabled` and keep focus); one primary action per sheet. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Cold load | Public pages | Static HTML; text renders before scripts and images. No skeletons. |
| Image loading | Article, cards | Progressive images; text readable immediately (UJ-1 edge case). |
| Artefact swap loading | Artefact of the Day | Fade; button disabled during swap. Fetch failure keeps the current Artefact [ASSUMPTION: silent retry once, then a short inline note]. |
| No JS | Artefact of the Day / Contribute | First Artefact, button hidden / notice that JS is needed, privacy link. |
| Empty series | Series block | "Segera hadir / Coming soon". |
| Missing translation | Language switch on Article | Lands on other-language home with notice. |
| Placeholder | Any public content | Placeholder marker visible. |
| Not found | Unknown path, unpublished or deleted Article | Bilingual not-found page with "Ke beranda / Go home" and "Artikel terbaru / Latest articles". |
| Verification failed | Contribution / Newsletter | Turnstile failure or expiry: message in the error summary (Contribution) or inline status (Newsletter), entries kept, widget reset. |
| Field error | Contribution / Newsletter form | Inline message and top summary (Contribution). |
| Upload in progress | File drop zone | Per file: "Menyiapkan foto…" while the browser downscales it, then its own upload progress, announced. |
| Failed upload / offline | Contribution form | Failed files marked with retry; whole-submit failure or lost connection keeps all text and photos and says what to do. [ASSUMPTION: offline detected on submit only; no background sync.] |
| Rate limited | Contribution / Newsletter | Rate-limit message from Voice and Tone. |
| Success | Contribution | Success screen with Reference Number, review note, withdrawal instructions. |
| Success | Newsletter | Same confirmation for new and existing email. |
| Queue loading | Kiriman rail | Rows at real height, "Memuat kiriman…". Sheet keeps the last Contribution until the next one arrives. |
| Queue error | Kiriman rail | "Daftar kiriman tidak bisa dimuat. Periksa koneksi, lalu muat ulang." with "Muat ulang". |
| Sheet loading | Review sheet | Catalogue-record strip, title line and photo slots at real size; focus waits for the heading. |
| Sheet error | Review sheet | "Kiriman ini tidak bisa dibuka. Periksa koneksi, lalu coba lagi." with "Coba lagi"; queue stays usable. |
| Photo error | Review sheet, lightbox | "Foto 3 tidak bisa dimuat." with "Coba lagi"; other photos stay. |
| Decision save failed | Decision bar | "Keputusan belum tersimpan. Catatan Anda masih di sini." with "Simpan lagi"; the sheet does not advance. |
| Autosave failed | Block editor | Footer shows "Belum tersimpan" with "Coba lagi"; text stays in the editor; retries on the next pause in typing. |
| Upload failed | Artefact image, editor image | "{nama file} gagal diunggah. Foto lain tetap ada." with "Coba lagi". |
| Pending queue empty | Kiriman | Empty state from Voice and Tone with "Lihat yang disetujui". |
| Rejected | Kiriman item | Shows deletion date (90 days); decision can be changed until then. |
| Draft / published | Article, Artefact | Publication Status label on list rows and editor header; Draft never on the public site. |
| Rebuild building / live / failed | Editor header, published content only | As Rebuild status tag; failed offers "Coba lagi". |
| Dashboard empty lists | Artikel, Artefak, Pelanggan, Aktivitas | Empty state with one action (e.g. "Tulis artikel") [ASSUMPTION]. Aktivitas empty uses its Voice and Tone line with no action. |
| No search results | Pelanggan | "Tidak ada pelanggan dengan email itu." in the list area; search field keeps its text. |
| Session expired | Any Dashboard save (Cloudflare Access session ended) | Drafts, the unsent review note and decision text are kept in local browser storage until the server confirms the save. A 401 shows "Sesi berakhir. Masuk lagi, tulisan Anda tetap di sini." with "Masuk lagi", which opens Cloudflare Access sign-in in a new tab; on return the Dashboard retries the save. Nothing typed is lost. |
| Phone, editing | Artikel, Artefak editors on phone | Phone note instead of the editor; review and decisions stay available. |
| Access denied | `/admin` | Handled by Cloudflare Access; non-allowlisted emails never reach a Dashboard page. |

## Interaction Primitives

- **Keyboard.** Every control operable by keyboard (WCAG 2.2 AA). `Esc` closes the mobile menu, dialogs, the crop tool and the Slash menu. `/` opens the Slash menu inside the block editor only. Arrow keys move through the queue rail [ASSUMPTION], the series radio group and the crop frame. Tab order follows reading order.
- **Focus.** Visible focus ring: `{components.focus-ring}` public, `{components.admin-focus-ring}` admin, on `:focus-visible`, always drawn on the visible control (never on a hidden input). Focus moves deliberately on: Masthead primary action → Latest Articles heading; error summary; success screen heading; dialog open/close; Tolak without reason → note field; queue advance → sheet heading; Slash menu insert → new block.
- **Hover and press (admin).** Background-colour change in 150ms; buttons scale to 0.98 while pressed. Values in `DESIGN.md › Components › Admin`.
- **Drag and drop.** File drop zone, block reordering and crop frame. Each has a visible single-pointer button alternative ("Pilih foto"; the "Opsi blok" menu; crop presets, "Perkecil"/"Perbesar" and "Geser" buttons) as well as a keyboard path (WCAG 2.5.7, 2.1.1).
- **Motion (public).** Signature: Masthead strata, five unlabelled bands separate vertically on scroll (scrub, `{components.motion-strata}`). Gap distance, easing and header-reveal timing are set in a motion prototype during implementation (GSAP with `emil-design-eng`; Open Questions). Scroll fade-up (`{components.motion-fade-up}`, once) only on the Masthead content and the Artefact of the Day; every other section is static. Show another: `{components.motion-show-another.duration}`; tint: `{components.motion-tint.duration}`. Header reveal after the Masthead [ASSUMPTION: short slide/fade, tuned with `emil-design-eng`]. No motion inside Article text.
- **Motion (admin).** Minimal: state changes (queue advance, status tag, dialog) only [ASSUMPTION: short fades ≤ 200ms, tuned with `emil-design-eng`]. The building indicator is the only looping motion.
- **Reduced motion.** `prefers-reduced-motion: reduce` → no scrub, no fade-up, instant swaps, no transitions, static building indicator; nothing moves on scroll (FR-24). Applies to both surfaces.
- **Touch.** Targets ≥ 48px for public and admin buttons; series radio options 40px; quiet buttons ("Tampilkan", "Opsi blok"), ToC links and crop handles at least 24×24px; all others at least 24px (WCAG 2.5.8).

## Accessibility Floor

Behavioural; visual contrast lives in `DESIGN.md › Colors`.

- WCAG 2.2 AA on both surfaces.
- Every control keyboard-operable with visible focus; focus never obscured by the sticky header (WCAG 2.4.11): `scroll-padding-top` on `html` equals header height plus the 2px progress bar, which governs both anchor jumps and focus scrolling.
- Hidden header is `inert`; nothing invisible takes focus.
- Busy buttons use `aria-disabled="true"` so focus is never dropped to `body`.
- Admin control borders meet 3:1 non-text contrast on sheet, footer, room and rail (WCAG 1.4.11).
- Labelled form fields; errors associated via `aria-describedby`; error summary links to fields. The series picker is a real fieldset with legend.
- Live status for uploads, submissions, Newsletter result, Artefact swap, copy-link, autosave failure, rejection, crop size, block insert and Rebuild status (`aria-live="polite"` / `role="status"`). Routine autosave ("Menyimpan…", "Tersimpan") is not announced.
- Selected states in the Dashboard (nav, queue, Review Status filter, language tabs) have a visible cue ≥ 3:1 besides tone, plus `aria-current` / `aria-selected`.
- Block editor and Slash menu follow the roles and announcements in Component Patterns.
- The masked email has an accessible label ("email disamarkan, domain {domain}") instead of read-out bullets.
- Cloudflare Access session expiry never loses typed text (State Patterns › Session expired).
- Mobile menu, dialogs and crop tool trap focus and restore it on close.
- The "Tampilkan" button has an accessible name that includes its object (e.g. "Tampilkan email kontributor").
- `lang` matches the page language; `hreflang` only for existing versions; Dashboard content fields carry `lang` per tab.
- Every image has alt text; Artefact images carry a credit. Alt text required per published language in the Dashboard.
- Artefact of the Day tint is clamped per theme so muted and ink text stay ≥ 4.5:1 and the focus ring and borders ≥ 3:1, else falls back (DESIGN.md › Colors › Tint clamp).
- Drag-and-drop always has a visible single-pointer button alternative (WCAG 2.5.7).
- Inline passages in another language carry `lang` (editor "Bahasa" mark).
- Reading progress bar is decorative; ToC (when shown) provides the navigable structure.

## Key Flows

### UJ-1. Dimas reads his first piece and stays for a second.

1. Dimas opens a shared link to `/` on his phone (Indonesian, no account). The header is hidden; the Masthead shows the name, manifesto, both actions and the ID/EN switch in one screen.
2. He taps "Baca artikel"; focus and scroll move to Latest Articles.
3. He taps the featured *Temuan* Article card. Text is readable at once; images fill in progressively on his slow connection.
4. The thin reading-progress bar tracks him; the Article has four section headings, so he opens the table of contents once to see the length.
5. At the end he sees Related Articles from *Temuan*.
6. **Climax:** he opens a second Article and finishes it without friction.

Failure: slow network → text first, images later; no layout shift blocks reading.

### UJ-2. Bu Ratna sends in her mother's old biscuit tin.

1. On the home page Bu Ratna taps "Kirim artefak" in the Contribute invitation and lands on `/kirim`.
2. She fills in name, email, title and story; picks Category *ingatan*.
3. She adds three phone photos; one is a 14 MB HEIC. The uploader names that file, states "JPG, PNG, atau WebP, maksimal 10 MB", and keeps the other two. She adds a third JPG.
4. She ticks consent (privacy note linked) and submits. Per-photo progress shows.
5. **Climax:** the success screen shows Reference Number `AOO-7K3F9Q`, says the Editor will review it and nothing is published yet, and how to withdraw.

Failure: submission fails or the connection drops → her text and photos stay; the message says to try again.

### UJ-3. Nadia subscribes in English.

1. Nadia switches to EN in the header; she stays on the equivalent page.
2. She reads an Article, then enters her email in the Newsletter block.
3. **Climax:** she sees the English confirmation.

Failure / edge: she subscribed last month → identical confirmation, no duplicate stored. Invalid email → inline message before submit.

### UJ-4. The Editor reviews a week of Contributions.

1. The Editor signs in through the one-time code; `/admin` opens on Kiriman with 7 *pending* items, oldest first, the oldest open on the sheet. Its catalogue-record strip reads "Kiriman tertua · menunggu 12 hari".
2. She opens Bu Ratna's tin, views photos full size, reads the story at reading size. The email is masked; she does not need it.
3. She writes a note and presses **Jadikan artefak**: the Contribution is approved and a draft Artefact opens with the Catalogue Record pre-filled, location data removed, email not copied. She crops the lid photo to remove a cluttered background and rotates the side photo upright, adds an inventory number and an English description, and publishes; the rebuild status tag runs.
4. Back in the queue she presses Tolak on a blurry duplicate without a note; the field asks for a short reason. She writes "Foto buram, duplikat kiriman lain" and presses Tolak again. The status names the 90-day deletion date and offers "Batalkan". No dialog.
5. For one Contribution she needs to ask a question; she presses "Tampilkan" to see the email and writes to the Contributor outside the Dashboard.
6. She works through the rest; the sheet advances to "Berikutnya" after each decision.
7. **Climax:** the queue shows "Tidak ada kiriman yang menunggu" and the new Artefact is in the Artefact of the Day pool.

Failure / edge: a photo shows another person's face or a house number → she crops it out in "Jadikan artefak", or rejects. A decision fails to save → "Keputusan belum tersimpan", note kept, sheet stays. On her phone she can review and decide, not edit Articles.

### UJ-5. The Editor publishes a new Article.

1. In Artikel she presses "Tulis artikel"; `/admin/artikel/baru` opens on the ID tab, EN tab marked "English · kosong".
2. She picks *Jejak Proses* in the series radios and writes with `/` → heading, quote, image (twice), cropping one image on upload. The footer shows "Tersimpan · 14.32" each time she pauses.
3. Pratinjau shows it in the public reading layout.
4. Next day she fills the EN tab and presses Terbitkan; the status tag appears for the first time and shows "Situs sedang dibangun ulang, sekitar 2 menit".
5. **Climax:** the tag turns to "Sudah tayang"; the Article is on the home page and in its Editorial Series in both languages within about two minutes.

Failure / edge: rebuild fails → "Gagal dibangun. Situs lama tetap tayang." with "Coba lagi". Typo after publishing → edit and press Perbarui (new rebuild). Unpublish → confirm dialog, removed on next rebuild. Autosave fails → "Belum tersimpan", text kept, retry. Leaving with changes not yet saved → unsaved-changes guard.

## Responsive & Platform

| Surface | Range | Behaviour |
|---|---|---|
| Public | 375 → 1440px | 4 columns and 16px gutter on mobile, 6 on tablet, 12 on desktop (max 1440). Masthead name, manifesto and both actions visible without scrolling at 375×812 and 1440×900 (FR-3). Header becomes Menu button and full-screen panel on mobile [ASSUMPTION: below the tablet breakpoint]. ToC (when shown): sidebar on desktop, disclosure on mobile. |
| Dashboard | Laptop, tablet | Laptop: nav, rail and sheet. Below 1100px columns stack (per v2). Tablet rail behaviour [ASSUMPTION]: rail stays above the sheet or becomes a toggle. |
| Dashboard | Phone | Review only: queue list → one Contribution full-width → decision bar. Article/Artefact editing and the crop tool not supported on phone; the editor screens show the phone note ("Buka di laptop atau tablet untuk menyunting."). |

Light/dark: public follows device theme (FR-23). Dashboard is light only in v1; admin dark mode is deferred to a later release.

## Inspiration & Anti-patterns

- **Artefak Kita (concept only):** editorial calm, named series, square corners, the "before, around and beyond making" theme. Not copied.
- **National Gallery Singapore (concept only):** bold scroll-driven masthead; "Artwork of the Day" with "Show another" and an image-derived section colour, which became our Artefact of the Day. Not copied.
- **Notion (concept):** `/` block insertion in the Article editor.
- **Rejected: Dashboard direction A "Arsip".** Public-site identity (paper, serif, catalogue labels, square corners) applied to the Dashboard.
- **Rejected: Dashboard direction B "Meja kerja".** Neutral dense tool, tables, grey; review felt like clearing an inbox.
- **Superseded: Dashboard direction C v1.** Right direction, but it carried template tells: gradient blobs for photos, sheet shadow, pill chips, decorative illustration and arrows, control borders below 3:1. Replaced by v2.
- **Rejected (anti-slop audit):** fade-up on every section, image scale on card hover, uppercase numbered section labels, em dashes in UI copy, pills for single choice, abstract placeholder textures.
- **Rejected (PRD):** highlights carousel, "three layers" section, interruptive sign-up pop-ups, auto-published Contributions.

## Implementation Craft

User requirement (memlog): each aspect is built and checked with its matching skill (`frontend-design`, `emil-design-eng`, `better-*`, `fixing-accessibility`, `design:ux-copy`), then passes the antislop core.

## Open Questions

1. Tablet behaviour of the Dashboard queue rail (stacked above the sheet, or a toggle).
2. Final public microcopy (manifesto, consent, privacy, success and error wording): client approval (PRD §11).
3. Rate-limit window, so "Coba lagi nanti" can name the real wait.
4. Masthead motion prototype, deferred to implementation (GSAP with `emil-design-eng`): strata band gap distance, easing and scroll range, and the header reveal timing. `{components.motion-strata}.bandGap` stays open until then; band count (five) and reduced-motion behaviour are fixed.
5. Alternative route when Turnstile fails or is blocked: which contact channel (and address) the Contribution and Newsletter error and the no-JS notice should offer. Until decided, the error offers retry only.
