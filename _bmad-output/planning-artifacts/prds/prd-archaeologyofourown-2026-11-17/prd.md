---
title: Archaeology of Our Own
status: final
created: 2026-11-17
updated: 2026-11-18
---

# PRD: Archaeology of Our Own (v1)
*Working title confirmed by the domain choice; the publication name is "Archaeology of Our Own".*

## 0. Document Purpose

This PRD is for the client (editor), the developer (Rivan) and the downstream BMad workflows (UX, architecture, epics and stories). It consolidates the earlier draft in `docs/PRD.md`, the visual system in `docs/DESIGN.md`, five interview rounds and the client's direct answers of 2026-11-17. Vocabulary is anchored in the Glossary (§3); features are grouped with globally numbered FRs; inferred items carry `[ASSUMPTION]` and are indexed in §12. Technology choices, the reference study and rejected alternatives live in `addendum.md`.

## 1. Vision

Archaeology of Our Own is a bilingual (Indonesian/English) publication that digs into the artefacts we live with: Indonesian visual culture (posters, type, packaging, ephemera), the traces of creative process (sketches, drafts, abandoned work) and collective or personal memory (everyday objects, family photos, community stories). Like an archaeologist reading soil layers, it reads what sits before, around and beyond the act of making.

For readers, it is a calm, well-made place to read short and long pieces about these artefacts, organised into four recurring Editorial Series. For people who own such artefacts, it is an invitation to contribute their own object and story, which the editors review before anything is published.

v1 proves three things: people read, people subscribe, and people trust the publication enough to send in their own artefacts.

## 2. Target User

### 2.1 Jobs To Be Done

- **Functional (reader):** find and read thoughtful pieces about Indonesian visual culture, creative process and shared memory, in my language.
- **Emotional (reader):** feel that ordinary objects and my own history are worth looking at closely.
- **Functional (contributor):** send a photo and the story of an artefact I own, without needing an account, and know it arrived.
- **Social (contributor):** see my family's or community's object recognised, credited under the name I choose.
- **Functional (subscriber):** hear when something new is published, without following social media.
- **Functional (editor):** receive contributions with enough information and consent to decide whether to publish.
- **Functional (editor):** write, publish and update Articles and Artefacts myself from a web dashboard, without waiting for a developer.

### 2.2 Non-Users (v1)

- Researchers needing a searchable scholarly database with citations and full provenance records.
- Sellers or collectors looking to buy, sell or appraise artefacts.
- Writers wanting to self-publish articles directly (no author accounts in v1).

### 2.3 Key User Journeys

Protagonists are illustrative `[ASSUMPTION]`; the client has not supplied personas.

- **UJ-1. Dimas reads his first piece and stays for a second.**
  Dimas, a design student in Yogyakarta, lands on the home page from a link shared in a group chat (Indonesian, phone, no account). The Masthead tells him in one screen what the publication is. He taps "Baca artikel", picks the featured Article in *Temuan*, reads it in a single column, and at the end sees two Related Articles from the same Editorial Series and opens one. **Climax:** he finishes two Articles without friction. **Edge case:** on a slow connection images load progressively while text is readable immediately.

- **UJ-2. Bu Ratna sends in her mother's old biscuit tin.**
  Bu Ratna, 52, in Semarang, has kept her late mother's printed biscuit tin from the 1970s. From the home page she taps "Kirim artefak", fills in her name, email, the tin's title and the story, chooses the Category *ingatan* (memory), adds three phone photos, ticks the consent box and submits. Upload progress is shown per photo. **Climax:** a success screen shows a Reference Number and says the Editor will review it; nothing is published yet. **Edge case:** one photo is a 14 MB HEIC; the form names that file, says only JPG, PNG or WebP up to 10 MB are accepted, and keeps the other two.

- **UJ-3. Nadia subscribes in English.**
  Nadia, a Singapore-based designer, switches the site to English, reads an Article, and enters her email in the Newsletter block. **Climax:** she sees a confirmation message in English. **Edge case:** she already subscribed last month; she sees the same confirmation and no duplicate is stored.

- **UJ-4. The Editor reviews a week of Contributions.**
  The Editor signs in to the Editor Dashboard with a one-time code sent to her allowlisted email. The Contributions list shows 7 *pending* items, oldest first. She opens Bu Ratna's biscuit tin, views the photos full size, reads the story, approves it with a note, and converts it into an Artefact: the Catalogue Record is pre-filled from the Contribution, location data is removed from the photos, and she adds an inventory number and an English description. She rejects one blurry duplicate with a reason. **Climax:** the queue is empty and the new Artefact is in the Artefact of the Day pool. **Edge case:** a Contribution shows another person's face or a house number; she rejects it, or crops the photo before converting.

- **UJ-5. The Editor publishes a new Article.**
  The Editor creates an Article in the Dashboard, picks the *Jejak Proses* series, writes the Indonesian version with headings, a pull quote and two images, saves it as Draft, and previews it as readers will see it. She adds the English version the next day and presses Publish. **Climax:** within about two minutes the Article appears on the home page and in its Editorial Series in both languages. **Edge case:** she spots a typo after publishing, edits it and republishes; she can also unpublish an Article, which removes it from the site on the next rebuild.

## 3. Glossary

- **Article** — an editorial text with a title, standfirst, author, date, hero image and body, in one language version or both. Belongs to exactly one Editorial Series.
- **Editorial Series** — one of four recurring columns: *Temuan* (finds; visual culture), *Jejak Proses* (process traces), *Ingatan Bersama* (shared memory), *Stratigrafi* (essays reading across layers). Has many Articles.
- **Artefact** — an object presented by the publication with a Catalogue Record and at least one image.
- **Catalogue Record** — the structured description of an Artefact: inventory number, title, year or estimated year, category, provenance, contributor credit.
- **Category** — one of: *visual culture* (ID: *budaya visual*), *process* (ID: *proses*), *memory* (ID: *ingatan*). Applies to Artefacts and Contributions.
- **Artefact of the Day** — the single Artefact featured on the home page, swappable by the reader.
- **Contribution** — a reader's submission of an artefact: story, metadata, 1–5 photos, Contributor details and consent. Never public until reviewed and republished by the Editor.
- **Contributor** — the person who sends a Contribution; identified by name or pseudonym and email.
- **Reference Number** — the identifier returned to a Contributor after a successful Contribution.
- **Review Status** — a Contribution's state: *pending*, *approved* or *rejected*.
- **Editor** — a person allowed to use the Editor Dashboard; one role with full access, 1–3 people.
- **Editor Dashboard** — the private web application where Editors manage Articles, Artefacts, Contributions and Subscribers.
- **Publication Status** — an Article's or Artefact's state: *draft* (visible only in the Editor Dashboard) or *published* (on the public site).
- **Rebuild** — the automatic regeneration of the public site triggered by publishing, unpublishing or editing published content.
- **Subscriber** — a person who signed up to the Newsletter with an email and language.
- **Newsletter** — email updates about new Articles; v1 collects Subscribers only, sending is out of scope.
- **Placeholder** — content standing in for real content, always visibly labelled as such.
- **Masthead** — the opening section of the home page with the publication name, manifesto line and calls to action.

## 4. Features

### 4.1 Bilingual site

**Description:** Every page exists in Indonesian (default, at `/`) and English (at `/en/`). A language switch is always reachable and keeps the reader on the equivalent page. Realizes UJ-1, UJ-3.

#### FR-1: Language versions
Readers can view the home page, privacy note and every translated Article in Indonesian or English. An Article may exist in one language only.
**Consequences (testable):**
- The home page and privacy note have an Indonesian and an English URL; the `lang` attribute matches the language.
- A page declares `hreflang` alternates only for language versions that exist.
- Listings in each language (Latest Articles, Editorial Series, Related Articles) show only Articles available in that language.

#### FR-2: Language switch
Readers can switch language from any page and land on the equivalent page.
**Consequences (testable):**
- Switching on an Article page opens the same Article in the other language.
- If an Article has no translation, the switch leads to the other language's home page and says the Article is not yet available in that language.

### 4.2 Home page

**Description:** The home page introduces the publication and routes readers to reading, contributing and subscribing. Sections in order: Masthead, Latest Articles, Artefact of the Day, Editorial Series, Contribute, Newsletter, footer. Realizes UJ-1, UJ-2, UJ-3.

#### FR-3: Masthead
Readers see the publication name, a one-line manifesto and two actions: read articles (primary) and contribute an artefact (secondary).
**Consequences (testable):**
- At 375×812 and 1440×900 viewports the name, manifesto and both actions are visible without scrolling.
- The primary action moves focus to the Latest Articles section.

#### FR-4: Latest Articles
Readers see the six most recent Articles, the newest one featured larger, each showing Editorial Series, title, excerpt, date and reading time.
**Consequences (testable):**
- Cards are ordered by date, newest first.
- Each card is a single link to its Article.

#### FR-5: Editorial Series overview
Readers see the four Editorial Series with a one-line description and the latest Article of each.
**Consequences (testable):**
- An Editorial Series with no Article shows "coming soon" instead of a broken link.

### 4.3 Article page

**Description:** A reading-first page for a single Article. Realizes UJ-1.

#### FR-6: Article reading view
Readers can read an Article with Editorial Series label, title, standfirst, author, date, reading time, hero image with caption and credit, and a body supporting headings, paragraphs, pull quotes, captioned images and an embedded Catalogue Record.
**Consequences (testable):**
- Body text column is at most 68 characters wide.
- Every image has alt text and, where it shows an Artefact, a credit.

#### FR-7: Related Articles
Readers see up to three other Articles from the same Editorial Series at the end of an Article.
**Consequences (testable):**
- The current Article is never listed as related to itself.

#### FR-8: Metadata for sharing and search
Every public page exposes a title, description, Open Graph image and canonical URL; Articles also expose `Article` structured data.
**Consequences (testable):**
- Sharing an Article URL shows its title, description and hero image in common link previews.

### 4.4 Artefact of the Day

**Description:** The home page features one Artefact with its Catalogue Record. Readers can ask for another. The section takes on a tint derived from the Artefact's image. Realizes UJ-1.

#### FR-9: Daily selection and Show another
The featured Artefact changes every day at 00:00 Asia/Jakarta time, chosen deterministically from the full Artefact pool so every reader sees the same Artefact on the same day. Readers can replace it with a random different Artefact from the same pool without reloading the page.
**Consequences (testable):**
- Two readers loading the home page on the same Jakarta date see the same Artefact first.
- The next Artefact differs from the current one whenever more than one exists.
- Without JavaScript, the first Artefact is shown and the button is hidden.

#### FR-10: Image-derived tint
The section background takes a tint from the featured Artefact image's dominant colour while keeping text readable.
**Consequences (testable):**
- Text on the tinted background keeps a contrast ratio of at least 4.5:1; otherwise the default surface colour is used.

### 4.5 Contribute an artefact

**Description:** Anyone can send an artefact without an account. Contributions are stored privately with Review Status *pending* and are never published automatically. Realizes UJ-2, UJ-4.

#### FR-11: Contribution form
Contributors can submit: name or pseudonym (required), email (required), artefact title (required), story (required, up to 5,000 characters), year or estimated year (optional), provenance (optional), Category (required), 1–5 photos (required), consent (required).
**Consequences (testable):**
- Submitting without any required field shows an error next to that field and a summary at the top linking to each error.
- The consent statement says the Contributor owns or has rights to the material and allows the publication to publish, crop, edit and translate it with credit after review, and links to the privacy note. Final wording needs client approval (§11).

#### FR-12: Photo rules
Contributors can attach JPG, PNG or WebP photos up to 10 MB each, at most five.
**Consequences (testable):**
- A file of another type or larger than 10 MB is rejected by name with the rule stated; other valid files remain attached.
- File type is verified from file contents, not only from the extension.
- A sixth file cannot be added.

#### FR-13: Upload feedback
Contributors see per-photo previews and upload progress, and a success screen with a Reference Number: a short, non-sequential, human-readable code (e.g. `AOO-7K3F9Q`). The success screen says the Editor may contact them by email and that they can withdraw the Contribution before publication by replying with the Reference Number.
**Consequences (testable):**
- If the submission fails, entered text and attached photos are preserved and the error says what to do next.
- Without JavaScript the form explains that JavaScript is needed to submit (human verification requires it) and offers the privacy note link.

#### FR-14: Private storage and Review Status
The system stores each Contribution and its photos privately with Review Status *pending*.
**Consequences (testable):**
- No Contribution, photo or Contributor email is reachable from any public URL.
- Every stored Contribution has a Reference Number, a consent timestamp, the page language and a creation time.

#### FR-15: Abuse protection
The system rejects automated and excessive submissions.
**Consequences (testable):**
- A submission without a valid human-verification token is rejected.
- More than 5 Contributions from one network address within an hour are rejected with a "try again later" message.
- Network addresses are never stored with any record; only a keyed hash of the address is held, for up to 1 hour, for rate limiting.
- Site-wide caps apply on top of the per-network limit: at most 100 Contributions per day and 5 GB of stored Contribution photos in total; beyond either, the form says submissions are paused and to try again later.
- Photos are downscaled (longest edge at most 3000 px) and stripped of metadata in the browser before upload, and verified again on the server.

**Notes:** Contributions are reviewed in the Editor Dashboard (§4.9). FR-16 (interim console review) was retired when the Dashboard moved into v1; IDs are not reused.

### 4.6 Newsletter sign-up

**Description:** Readers can leave their email to hear about new Articles. Realizes UJ-3.

#### FR-17: Subscribe
Readers can subscribe with an email address; the system stores the email, language and time.
**Consequences (testable):**
- An invalid email is rejected with a message before and after submission.
- Subscribing twice with the same email stores one Subscriber.

#### FR-18: No enumeration
The system shows the same confirmation whether the email is new or already subscribed.

#### FR-19: Abuse protection
Subscriptions require the same human verification as Contributions, with their own higher rate limit of 20 per network address per hour so shared campus or office networks are not blocked. As in FR-15, network addresses are never stored with any record; only a keyed hash is held, for up to 1 hour, for rate limiting.

### 4.7 Privacy

**Description:** People know what is stored about them and can ask for deletion.

#### FR-20: Privacy note
Readers can read a privacy note in both languages describing what is stored for Subscribers and Contributors, why, for how long, and how to request deletion.

#### FR-21: Retention
The system deletes rejected Contributions and their photos 90 days after rejection; Subscribers and other Contributions are kept until deletion is requested.
**Consequences (testable):**
- A rejected Contribution older than 90 days no longer exists in storage, including its photos.
- A Contribution that has been converted into an Artefact cannot be rejected until that Artefact is deleted.
- Deleted data can persist in the database's point-in-time backups for up to 7 days.

#### FR-22: Deletion on request
The Editor can delete a Subscriber or a Contribution, including its photos, on request from the Editor Dashboard (FR-32). Deleting a Contribution also unpublishes any Artefact converted from it and deletes the photos copied into that Artefact.
**Consequences (testable):**
- Requests are honoured only when they come from the stored email address (or quote the Reference Number from that address); the privacy note states a response time of 30 days.

### 4.8 Look and motion

**Description:** The visual system in `docs/DESIGN.md` applies throughout. Realizes UJ-1.

#### FR-23: Theme follows device
The site shows a light or dark theme according to the reader's device setting.

#### FR-24: Motion with reduced-motion support
The Masthead has one scroll-linked "strata" animation and sections reveal on scroll; with reduced motion requested, these are disabled.
**Consequences (testable):**
- With `prefers-reduced-motion: reduce`, no element moves on scroll.

#### FR-25: Placeholder labelling
All Placeholder content is visibly labelled "Placeholder" until replaced.

### 4.9 Editor Dashboard

**Description:** A private, interactive web application where Editors create, read, update and delete everything the publication manages: Articles, Artefacts, Contributions and Subscribers. Publishing triggers a Rebuild so the public site stays static and fast. The Dashboard is bilingual-aware (content in ID and EN) and its own interface is in Indonesian. Realizes UJ-4, UJ-5.

#### FR-26: Sign-in
Editors sign in with a one-time code sent to an allowlisted email address; no passwords exist.
**Consequences (testable):**
- An email not on the allowlist cannot reach any Dashboard page or Dashboard data endpoint.
- Every Dashboard data request is checked for a valid Editor identity on the server, not only at the page level.

#### FR-27: Manage Articles
Editors can create, edit, preview, publish, unpublish and delete Articles, with separate ID and EN versions, Editorial Series, author, date, standfirst, hero image with caption and credit, and a rich body (headings, paragraphs, pull quotes, captioned images, Catalogue Record embeds).
**Consequences (testable):**
- A Draft is never visible on the public site.
- Preview shows the Article with the public reading layout before publishing.
- Deleting asks for confirmation and cannot remove a published Article without unpublishing it first.
- A slug is unique per language; a duplicate slug is rejected with a message.

#### FR-28: Manage Artefacts
Editors can create, edit, publish, unpublish and delete Artefacts with a Catalogue Record and 1–5 images, which form the Artefact of the Day pool.
**Consequences (testable):**
- Only published Artefacts enter the Artefact of the Day pool.
- Every image requires alt text in each language the Artefact is published in.

#### FR-29: Upload and manage images
Editors can upload images (JPG, PNG, WebP, up to 10 MB) for Articles and Artefacts; location metadata is removed on upload.
**Consequences (testable):**
- A downloaded published image contains no GPS metadata.

#### FR-30: Review Contributions
Editors can list Contributions filtered by Review Status (oldest first by default), open one to see all fields and full-size photos, approve or reject it with an internal note, and change a decision.
**Consequences (testable):**
- Each Review Status change records the Editor's email and the time.
- Rejected Contributions show the date they will be deleted under FR-21.

#### FR-31: Convert a Contribution into an Artefact
Editors can turn an approved Contribution into a draft Artefact; the Catalogue Record is pre-filled from the Contribution, the Contributor credit uses the chosen name or pseudonym, and location metadata is removed from the copied photos.
**Consequences (testable):**
- The Contributor's email is never copied into the Artefact.
- The Artefact links back to its source Contribution in the Dashboard only.

#### FR-32: Manage Subscribers and personal data
Editors can search Subscribers, export them as CSV, and delete a Subscriber or a Contribution (with its photos) on request.
**Consequences (testable):**
- After deletion, the person's email no longer exists in Subscribers or Contributions, and any Artefact converted from a deleted Contribution is unpublished with its copied photos deleted.
- The export includes email, language and sign-up date only.

#### FR-33: Publish and Rebuild status
Publishing, unpublishing or editing published content triggers a Rebuild; the Dashboard shows its status (queued, building, live, failed).
**Consequences (testable):**
- A change appears on the public site within 2 minutes of pressing Publish under normal conditions.
- A failed Rebuild is shown with a retry action, and the previously live site stays online.

#### FR-34: Activity log
The Dashboard keeps a log of who created, published, unpublished, deleted or reviewed what, and when.

**Feature-specific NFRs:**
- Usable on a laptop and on a tablet; phone support for reviewing Contributions.
- Destructive actions require confirmation; unsaved changes warn before leaving a page.

## 5. Non-Goals (Explicit)

- Not a marketplace: no buying, selling or valuing artefacts.
- Not a scholarly database: no search, faceted filters or citation export in v1.
- No reader or author accounts, comments or likes.
- No automatic publication of Contributions, ever.
- No newsletter sending or campaign tooling in v1 (collection only).

## 6. MVP Scope

### 6.1 In Scope

- Bilingual home page, Article page template, privacy note.
- Latest Articles, Editorial Series overview, Artefact of the Day.
- Contribution form with private storage and abuse protection.
- Newsletter sign-up.
- Editor Dashboard: sign-in, Articles, Artefacts, images, Contribution review and conversion, Subscribers and data deletion, Rebuild status, activity log.
- Light/dark theme, motion as in FR-24, Placeholder content.
- Hosting on Cloudflare Workers (Free plan) with static assets, on a neutral `workers.dev` account subdomain.

### 6.2 Out of Scope for MVP

- Email notifications (to the Editor on new Contributions, to Contributors on decisions) — v2. In v1 the Editor contacts Contributors manually when needed.
- Double opt-in (email confirmation) for Subscribers — required in v2 before the first newsletter is sent.
- Multiple roles (e.g. writer vs editor) — later.
- Sending newsletters — later.
- Article index page with filters — later.
- Custom domain archaeologyofourown.com — after the user buys it.
- Audio, video and PDF Contributions.

### 6.3 Public Launch Criteria

Placeholders are allowed on the provider subdomain during review. The site opens to the public only when all of these exist:
- 4 real Articles, one per Editorial Series, each in Indonesian and English.
- 6 real Artefacts with Catalogue Records and image rights cleared.
- The final manifesto line.
- A privacy note approved by the client.

The Success Metrics period starts on the public launch date.

## 7. Success Metrics

Measured over the first 3 months after public launch, with Cloudflare Web Analytics (cookieless) and storage counts.

**Primary**
- **SM-1**: Article reach — Article page views ÷ total visits, from cookieless analytics; target ≥ 0.4. Validates FR-3, FR-4, FR-6.
- **SM-2**: Subscribers — unique Subscribers stored; target ≥ 300. Validates FR-17.
- **SM-3**: Reviewable Contributions — Contributions with valid photos and consent that reach a review decision; target ≥ 20. Validates FR-11 to FR-15, FR-30.

**Secondary**
- **SM-4**: Quality bar — Lighthouse mobile ≥ 90 in all four categories on the home and Article pages. Validates §8.

**Counter-metrics (do not optimize)**
- **SM-C1**: Raw Contribution count — do not push volume at the cost of consent quality or review load. Counterbalances SM-3.
- **SM-C2**: Subscriber count from incentives or pop-ups — no interruptive sign-up prompts. Counterbalances SM-2.

## 8. Cross-Cutting NFRs

- **Accessibility:** WCAG 2.2 AA, including colour contrast, keyboard operation of every control, visible focus, labelled form fields with associated errors, live status for uploads and submissions.
- **Performance:** home and Article pages readable before scripts load; Largest Contentful Paint ≤ 2.5 s under Lighthouse's default mobile throttling; images served in modern formats at appropriate sizes.
- **Reliability:** a failed upload or submission never loses what the Contributor typed.
- **Security:** all input validated on the server; uploaded files checked by content; stored photos never publicly addressable; secrets kept out of the repository.
- **Localisation:** all interface text, errors and emails (future) exist in both languages.

## 9. Constraints and Guardrails

- **Privacy:** store only the fields listed in FR-11 and FR-17 plus system fields (Reference Number, Review Status, timestamps, language, reviewer email); network addresses are never stored with records, and only a keyed hash of the address is held, for up to 1 hour, for rate limiting; database point-in-time backups keep deleted data for up to 7 days; photos are downscaled and stripped of metadata in the browser before upload and verified on the server; site-wide caps of 100 Contributions per day and 5 GB of stored Contribution photos; no third-party trackers; Contributor emails never shown publicly; photos may carry location data, so they are private until processed.
- **Safety:** Contributions may contain other people's faces, addresses or copyrighted material; the Editor checks these before publishing (UJ-4).
- **Cost:** v1 runs on the Cloudflare Workers Free plan `[ASSUMPTION]`; storage stays small because of the photo limits.
- **Identity:** no project name, URL or storage name derived from the owner's personal email.

## 10. Aesthetic, Tone and Information Architecture

- **Aesthetic:** hybrid archive–museum; see `docs/DESIGN.md` (paper/ink palette, oxide-red accent, Fraunces + Inter, square corners, catalogue labels, one signature strata motion). References: Artefak Kita (editorial calm) and National Gallery Singapore (bold masthead, artwork-of-the-day idea); neither is copied.
- **Voice:** sentence case, short sentences, verbs for actions, errors that say what to do.
- **IA:** Home (`/`, `/en/`) · Article (`/artikel/{slug}`, `/en/articles/{slug}`) · Privacy (`/privasi`, `/en/privacy`). Header anchors: Articles, Artefact of the Day, Contribute, Newsletter. Editor Dashboard at `/admin` (private): Articles · Artefacts · Contributions · Subscribers · Activity.

## 11. Open Questions

1. Final manifesto line and section copy (Placeholder until provided by the client).
2. Real Articles, Artefacts and image rights.
3. Social accounts for the footer.
4. ~~Which emails are Editors~~ Decided: two Editors, the client's email and the owner's email. Addresses are kept only in the Cloudflare Access policy, never in this public repository.
5. Exact privacy-note and consent wording (client approval needed).
6. ~~Account ownership~~ Decided: hosting and GitHub run on the owner's (Rivan's) accounts; the client accesses the Editor Dashboard as an Editor. Long-term handover can be revisited later.

## 12. Assumptions Index

- §2.3 — UJ protagonists are illustrative.
- §9 — v1 fits in the Cloudflare Workers Free plan.
