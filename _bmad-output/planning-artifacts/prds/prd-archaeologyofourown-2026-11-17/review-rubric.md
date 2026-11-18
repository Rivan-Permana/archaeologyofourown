# PRD Quality Review — Archaeology of Our Own (v1)

- **PRD:** `_bmad-output/planning-artifacts/prds/prd-archaeologyofourown-2026-11-17/prd.md` (+ `addendum.md`)
- **Rubric:** `.claude/skills/bmad-prd/assets/prd-validation-checklist.md`
- **Stakes:** public launch for a client
- **Run at:** 2026-11-17

## Overall verdict

A tight, honest PRD: the thesis ("people read, subscribe, and trust the publication enough to send in their own artefacts", §1) is clear, the four UJs drive real FRs, the Contribution flow is unusually well specified (photo rules, privacy, abuse, retention) and the Non-Goals do real work. What is at risk for a *public client launch* is the operational edge of the product rather than its features: there is no defined way for Articles and Artefacts to get onto the site, it is undecided whether the site launches with Placeholder content, two of the five Success Metrics cannot be measured with the stated tooling, and the v1 manual publishing path for approved Contributions bypasses the EXIF stripping that §6.2 itself calls mandatory. None of these is a rewrite; all should be settled before the PRD is used as a build green light.

## Decision-readiness — adequate

Decisions are stated as decisions: Indonesian default at `/` (§4.1), no accounts (§5), "No automatic publication of Contributions, ever" (§5), collection-only Newsletter (§3, §5), v2 CMS deferral with a real `[NOTE FOR PM]` (§6.2), and the addendum's rejected-alternatives table names what was given up (third-party newsletter service, auto-publish, Next.js). Open Questions (§11) are genuinely open.

The gap is launch readiness. §6.1 puts "Placeholder content" in scope and FR-25 labels it, while §11 Q1–Q2 leave real copy, Articles, Artefacts and image rights open, and §7 measures metrics "over the first 3 months after public launch". The PRD never says whether public launch is gated on real content, or whether a site full of "PLACEHOLDER" markers is what the client's audience sees. Ownership of the client's assets (Cloudflare account, GitHub repo under the developer's account per addendum A, the domain "after the user buys it" — the developer or the client?) is likewise not decided.

### Findings
- **high** Launch gate on real content is undecided (§6.1, FR-25, §7, §11 Q1–Q2) — In-scope Placeholder content plus open real-content questions leave it unclear what the public sees at launch; SM-1/SM-2 measured from launch on placeholder Articles would be meaningless. *Fix:* add a launch criterion (e.g. "public launch requires ≥ N real Articles across ≥ 2 Editorial Series, ≥ M real Artefacts, final manifesto line; Placeholder content allowed only on a non-public preview") and say when the SM clock starts.
- **medium** Ownership and handover of accounts not stated (§6.2 "after the user buys it", addendum A Repo/Hosting) — For a client launch, who owns the Cloudflare account, D1/R2 data (personal data of Subscribers and Contributors), repo and domain is a decision with legal weight (data controller in the privacy note, FR-20). *Fix:* add a constraint naming the account owner and data controller, or an Open Question if unresolved.

## Substance over theater — strong

No persona theater: four UJ protagonists, each tied to a distinct FR cluster and honestly tagged illustrative. NFRs (§8) carry product-specific bounds (WCAG 2.2 AA, LCP ≤ 2.5 s, "readable before scripts load"), not boilerplate. The Vision (§1) is specific to this publication (soil-layer metaphor, three artefact domains). The reference study (addendum C) is evidence, explicitly "neither is copied". Only weak spot: "on a mid-range phone over 4G" (§8) is an undefined device class; SM-5 partially compensates.

### Findings
- **low** "Mid-range phone over 4G" is not a measurable bound (§8 Performance) — *Fix:* tie it to Lighthouse mobile throttling (as SM-5 already does) or a named device/network profile.

## Strategic coherence — adequate

The thesis maps cleanly to features and metrics: read → FR-3/4/6/7 → SM-1; subscribe → FR-17 → SM-2; trust → FR-11–16 → SM-3, with counter-metrics SM-C1/SM-C2 that guard against the obvious perversions. MVP kind is an experience/validation MVP and the scope matches.

The thesis is undermined by measurement: SM-1 ("share of visitors who open at least one Article") and SM-4 ("submissions succeeded ÷ forms started") are stated to be measured "with the hosting provider's built-in analytics and storage counts" (§7). Cloudflare Web Analytics is cookieless and reports page views and visits, not per-visitor funnels; "forms started" is an event no FR emits. With "no third-party trackers" (§9), these metrics have no data source. Also the "trust" leg (SM-3) has no feedback loop to the Contributor: once submitted, nothing in v1 tells Bu Ratna her artefact was approved, though JTBD §2.1 "Social (contributor)" is about being recognised.

### Findings
- **high** SM-1 and SM-4 are unmeasurable with the stated tooling (§7, §9) — Cookieless edge analytics cannot compute "share of visitors who open ≥ 1 Article" or "forms started". *Fix:* redefine SM-1 as an aggregate proxy (Article page views ÷ home page visits, or visits with an Article path) and either add a privacy-preserving event FR (e.g. count first form interaction server-side or via a first-party beacon without identifiers) for SM-4 or drop SM-4's denominator.
- **medium** No outcome communication to Contributors (§2.1 Social JTBD, UJ-2, FR-16) — The "trust" thesis depends on contributors seeing their object recognised, but v1 has no notification of decision and §6.2 defers even Editor notification. *Fix:* state in FR-16 or §6.2 whether the Editor emails the Contributor on approval/rejection manually (and in which language), or mark it explicitly `[NON-GOAL for MVP]`.

## Done-ness clarity — thin

Most FRs have testable consequences, several excellent (FR-3 viewports, FR-10 4.5:1 with fallback, FR-12 content sniffing, FR-14 "no … reachable from any public URL", FR-21 90-day deletion). The thin areas are exactly where downstream stories will stall:

- **Artefact of the Day** has no selection rule. The name implies a daily rotation, but the site is a static Astro build (addendum A); nothing says how "the Day's" Artefact is chosen (date-based at build, client-side by date, editor-pinned) or which pool FR-9 draws from.
- **FR-1 vs FR-2 contradict:** FR-1 says "Every page has an Indonesian and an English URL", the Glossary says an Article may exist "in one language version or both", and FR-2 handles the missing-translation case. Which is it, and what do FR-4 (Latest Articles on `/en/`), FR-5, FR-7 and `hreflang` (FR-1) show for a single-language Article?
- **FR-16 "records who changed it and when"** is a system behaviour claim for a process that happens by hand in the hosting console; nothing enforces it.
- **FR-13 / no-JS:** FR-9 states no-JS behaviour, but the Contribution form does not, although per-photo progress and "attached photos are preserved" on failure (FR-13) both require JavaScript.
- FR-18, FR-19, FR-20, FR-22, FR-23, FR-25 have no consequences block. FR-19 and FR-23 are trivially inferable; FR-20 and FR-22 (deletion procedure, how a requester's identity is verified) are not.

### Findings
- **high** Artefact of the Day has no selection or rotation rule (§4.4, FR-9, Glossary "Artefact of the Day") — Static output makes "of the Day" an architectural decision the PRD leaves implicit. *Fix:* add an FR: "The featured Artefact changes once per day (Asia/Jakarta) by a deterministic rule over all published Artefacts; 'Show another' draws from the same pool; with one Artefact the button is hidden."
- **medium** FR-1 contradicts single-language Articles (FR-1, FR-2, Glossary "Article", FR-4, FR-7) — *Fix:* reword FR-1 to "every page that exists in a language…", and specify whether listings on each language home show only Articles available in that language.
- **medium** FR-16 audit consequence is unenforceable in a manual console workflow (FR-16, addendum A `reviewed_by`, `reviewed_at`) — *Fix:* make it a procedure requirement ("the documented procedure sets `reviewed_by` and `reviewed_at` in the same statement") or move to v2, and drop the `[ASSUMPTION]` once decided.
- **medium** Contribution form behaviour without JavaScript is unspecified (FR-11, FR-13, §8 Performance) — *Fix:* state whether the form requires JS (with a clear no-JS message) or degrades to a plain multipart POST, and what "preserved" means in each case.
- **low** FR-20 and FR-22 lack consequences, incl. requester verification (FR-20, FR-22) — Anyone could ask to delete someone else's Contribution or Subscriber record. *Fix:* add "deletion requests are honoured only from the stored email address" and a response-time bound.
- **low** FR-8 covers Article metadata only — Home and Privacy pages have no title/description/OG requirement. *Fix:* extend FR-8 or add a sentence to FR-1.

## Scope honesty — adequate

Non-Goals (§5) and Out of Scope (§6.2) are explicit and useful; the `[NOTE FOR PM]` on the v2 dashboard sits at a real tension. Open-items density (5 assumptions, 5 open questions, 1 note) is reasonable for the stakes, but two silent gaps matter:

1. **Article/Artefact publishing workflow is absent.** The Glossary says the Editor "publishes content", addendum A says content lives in Astro content collections (files in a repo), and UJ-4 says approved Contributions "are turned into Artefacts or Articles by hand". No FR, UJ or procedure says who adds an Article, how (git commit and rebuild by the developer?), or how translations and images are prepared. For a client publication this is the core recurring operation of v1.
2. **EXIF contradiction.** §6.2 says removing location metadata is "required before any Contribution photo is published; v2 publishing step", but UJ-4 publishes approved Contributions by hand in v1. Either v1 never publishes Contribution photos (then say so), or the manual v1 path must strip EXIF.

Also: the consent text (FR-11) grants permission "to publish it with credit", but a bilingual publication will translate, edit and crop the story and photos; the licence scope does not cover that. And the constraint "store only the fields listed in FR-11 and FR-17" (§9) conflicts with FR-15's per-network-address rate limit, which needs some stored or counted IP state, and FR-14's own extra fields (consent timestamp, Reference Number, language).

### Findings
- **high** No v1 publishing workflow for Articles and Artefacts (Glossary "Editor", §4.3, §6.2, addendum A, UJ-4) — Without it, the client cannot operate the publication after launch and downstream stories have nothing to implement. *Fix:* add a short feature (or UJ-5 for the Editor) stating the v1 path, e.g. "Editor sends text and images; developer adds a content-collection entry per language and redeploys", with turnaround expectations; mark self-service as v2.
- **high** v1 manual publishing of approved Contributions skips mandatory EXIF removal (§6.2 EXIF bullet, UJ-4, §9 Privacy) — *Fix:* add to the v1 manual procedure "strip location metadata before any Contribution photo is used in an Article or Artefact", or state that no Contribution is published until v2.
- **medium** Consent licence too narrow for a bilingual edited publication (FR-11 consent consequence) — *Fix:* consent text should cover editing, cropping, translation into Indonesian/English, and say whether the Contributor can withdraw before publication.
- **medium** Data-minimisation constraint conflicts with rate limiting and FR-14 fields (§9 Privacy, FR-14, FR-15, FR-19, addendum A "per-IP rate limits") — *Fix:* amend §9 to list system fields and state how network addresses are used for rate limiting (e.g. not persisted, or hashed with short TTL) and mention this in the privacy note (FR-20).
- **low** Newsletter has no address verification (FR-17, §5) — Anyone can subscribe another person's email; when sending starts (v2) the list's consent is unverified. *Fix:* mark double opt-in as an explicit v2 requirement before the first send.
- **low** Rate limit shared by subscriptions may block shared networks (FR-15, FR-19) — Five per hour per address is tight for campus or office NAT, the UJ-1 audience. *Fix:* give subscriptions their own (higher) threshold, keep it under `[ASSUMPTION]`.

## Downstream usability — adequate

This is a chain-top PRD (§0 names UX, architecture, epics/stories as consumers). Glossary is present and mostly respected; FR, UJ and SM IDs are contiguous and unique; each UJ has a named protagonist with context inline; FRs cross-reference UJs. Weak points are vocabulary drift into the addendum (`submissions`, `status`, `photo_keys` vs Contribution, Review Status) and undefined terms used in requirements ("medium motion", "storage console" vs "hosting provider's console", Reference Number format). These are mechanical (see below) but the addendum is what architecture will extract from.

### Findings
- **low** Reference Number format unspecified (Glossary "Reference Number", FR-13, FR-14) — Downstream needs to know whether it is human-readable, unguessable and in which language it is shown. *Fix:* add "short, non-sequential, human-readable code (e.g. AOO-7K3Q)".

## Shape fit — strong

A consumer-facing publication with meaningful UX gets UJs with named protagonists, and an operator journey (UJ-4) for the Editor; it is not over-formalized. The addendum correctly carries technology so the PRD stays product-level. The one shape gap is the missing Editor content-publishing journey (covered under Scope honesty).

## Mechanical notes

- §0 says inferred items "are indexed in §11"; the Assumptions Index is §12 (§11 is Open Questions).
- Assumptions Index entry "§2.3 UJ-4, FR-16 — interim Editor is Rivan": the inline `[ASSUMPTION]` in FR-16 is about recording who/when, not the Editor's identity; the Editor assumption appears only in UJ-4. Otherwise all inline `[ASSUMPTION]` tags (§2.3, UJ-4, FR-15, FR-16, §9) roundtrip to the index.
- Glossary drift: "storage console" (UJ-4) vs "hosting provider's console" (FR-16 Notes); "Series" short form (FR-5) for Editorial Series; "medium motion" (§6.1) undefined; addendum uses `submissions`/`status` for Contribution/Review Status.
- Category values are English lower-case (*visual culture, process, memory*); UJ-2 shows the Indonesian UI choosing "*memory*". State the displayed labels per language.
- FR-15 threshold is the only numeric `[ASSUMPTION]`; FR-19 inherits it implicitly.
- Header anchor "Artefact" (§10 IA) vs section name "Artefact of the Day".
- `docs/DESIGN.md` references (tint ≥ 4.5:1, strata motion, Placeholder marker, 68ch column, reduced motion) are consistent with FR-6, FR-10, FR-24, FR-25.
