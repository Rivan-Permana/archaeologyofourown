# Review: reality check of ARCHITECTURE-SPINE.md (2026-11-18)

Lens: was every committed decision checked against the web, the npm registry, or the current starter, rather than asserted from memory?

**Verdict: needs revision before build.** The versions are all correct. Two platform decisions are wrong as written (AD-9 rate-limit periods, AD-10 cron timezone). One decision is not viable on the Workers Free plan (AD-8/AD-9 uploads). Four other decisions rest on unverified mechanics (AD-2 snapshot, AD-3 status polling, AD-6 render location, adapter defaults).

## Verified (no change needed)

- **npm versions match the Stack table exactly** (`npm view`, Node 24.22.3, 2026-11-18): astro 7.4.12, @astrojs/cloudflare 14.4.8 (peer `astro ^7.4.0`, `wrangler ^4.125.0`), wrangler 4.164.0, react 19.3.1, @blocknote/* 0.57.0 (MPL-2.0; peer react ^18 || ^19; mantine peer `@mantine/core ^8.3.11 || ^9.0.2`), drizzle-orm 0.45.4 (`latest`), gsap 3.15.1, jose 6.2.17, Fontsource 5.3.0 (OFL-1.1). astro 7.4.12 depends on `zod ^4.6.7` and requires Node >=22.23.4, so Node 24.22 and "Zod 4.x via astro/zod" both hold.
- **`astro/zod`** re-exports Zod v4, and the `astro:content` `z` export is deprecated. Source: https://docs.astro.build/en/reference/modules/astro-zod/
- **Bindings are read through `import { env } from 'cloudflare:workers'`.** `Astro.locals.runtime` was removed in adapter v13. Per-page `prerender` mixing is supported. Source: https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- **`assets.run_worker_first`** accepts an array with globs (`/api/*`) and `!` exceptions, up to 100 entries, so AD-1 is valid. Source: https://developers.cloudflare.com/workers/wrangler/configuration/
- **The Access JWT pattern matches the official Worker example:** jose `createRemoteJWKSet(<team>/cdn-cgi/access/certs)` plus `jwtVerify` with issuer and audience (AD-7). Source: https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/
- **Turnstile siteverify:** `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` with `secret` and `response`. Tokens are single-use and valid for 300 s. An optional `idempotency_key` allows safe retries, so consider using it. Source: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- **BlockNote server-util supports custom schemas.** `ServerBlockNoteEditor.create({ schema })` exposes `blocksToFullHTML` and `blocksToHTMLLossy`, and it needs a DOM (JSDOM factory; `jsdom ^29` is a dependency). Source: https://github.com/TypeCellOS/BlockNote/blob/main/docs/content/docs/features/server-processing.mdx (blocknotejs.org failed TLS from here)
- **The Workers request body limit is 100 MB** (set by the zone plan), so 5 × 10 MB fits. Source: https://developers.cloudflare.com/workers/platform/limits/
- **The Builds API exists**, so the AD-3 `[ASSUMPTION]` is confirmed: `GET /accounts/{id}/builds/builds/{build_uuid}` and `GET /accounts/{id}/builds/workers/{script}/builds`. Sources: https://developers.cloudflare.com/api/resources/workers_builds/subresources/builds/methods/get , https://developers.cloudflare.com/workers/ci-cd/builds/api-reference

## Findings

### HIGH-1: AD-9 rate limits of "5/hour" and "20/hour" cannot be configured
The Rate Limiting binding's `period` "must be either `10` or `60`" seconds. Counts are also per Cloudflare location and eventually consistent, and the docs advise against keying on IP. Hour-long quotas need a different mechanism. Options:
- a per-minute binding (for example 2/60 s) as a burst guard, plus an hourly counter in D1 keyed by a salted IP hash, if that fits the privacy rule;
- a Durable Object.

Source: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

### HIGH-2: AD-8 and AD-9 contribution uploads do not fit the Workers Free plan
Free-plan limits are 10 ms CPU per HTTP request and 128 MB memory per isolate. Buffering a 50 MB multipart body (`formData()`), sniffing magic bytes and scanning for EXIF/XMP GPS will exceed 10 ms and risks hitting the memory limit. The spine never names a plan. Two fixes:
- commit to Workers Paid (default CPU limit 30 s);
- or stream each file straight to R2 (one request per photo, or presigned R2 uploads) and check only the header bytes.

Source: https://developers.cloudflare.com/workers/platform/limits/

### MEDIUM-1: AD-10 says "daily 02:00 Asia/Jakarta", but Cron Triggers run on UTC
The docs state: "Cron Triggers execute on UTC time." The cron expression must be `0 19 * * *` (19:00 UTC = 02:00 WIB). Free accounts get 5 Cron Triggers per account. Sources: https://developers.cloudflare.com/workers/configuration/cron-triggers/ , https://developers.cloudflare.com/workers/platform/limits/

### MEDIUM-2: AD-3 duplicates platform behaviour and is missing a runtime secret
- A Deploy Hook POST returns `build_uuid`. If a build is still `queued`/`initializing`, a repeat POST returns the same build with `already_exists: true`. That is native coalescing, which makes the self-built 30 s window largely redundant.
- Hooks are limited to 10 builds/min per Worker.
- Polling the Builds API from the Worker needs a **runtime** API token with Workers Builds read access. The Config row lists `CLOUDFLARE_API_TOKEN` only as a build setting, and the docs state "Build variables will not be accessible at runtime."
- Store `build_uuid` on the `rebuilds` row.

Sources: https://developers.cloudflare.com/workers/ci-cd/builds/deploy-hooks/ , https://developers.cloudflare.com/workers/ci-cd/builds/configuration/

### MEDIUM-3: AD-2 snapshot path to remote D1 is unverified
- The default Workers Builds token has no D1 permission (it lists only Account Settings, Workers Scripts, KV and R2), so the memlog assumption is confirmed and a custom token is required.
- The bigger gap: services take the Drizzle client built from the **D1 binding** (`drizzle-orm/d1`, `drizzle(env.DB)`). A Node prebuild script has no binding. The documented remote-binding routes are Wrangler, the Vite plugin, vitest, and `startRemoteProxySession` (needs an account ID and token). None was confirmed for D1 from a plain script.
- The spine must pick and prove one route: a remote proxy session, the D1 REST API, or a Worker endpoint behind an Access service token.

Sources: https://developers.cloudflare.com/workers/ci-cd/builds/configuration/ , https://developers.cloudflare.com/workers/development-testing/ , https://orm.drizzle.team/docs/connect-cloudflare-d1

### MEDIUM-4: AD-6 does not say where `@blocknote/server-util` runs
The adapter prerenders pages **in workerd by default**. `prerenderEnvironment: 'node'` switches this, and on-demand pages always run in workerd. server-util needs JSDOM plus a window-attached document, which is unlikely to work in workerd. AD-6 should state either:
- HTML is produced in `scripts/snapshot.ts` (Node) and stored in the snapshot JSON;
- or `prerenderEnvironment: 'node'` is set.

Source: https://docs.astro.build/en/guides/integrations-guide/cloudflare/

### MEDIUM-5: Adapter defaults the spine did not account for
- `imageService` now defaults to `'cloudflare-binding'`, which needs an Images binding. The spine defers that binding, so set `imageService` explicitly (for example `'compile'` or passthrough).
- The adapter also configures a `SESSION` KV namespace that Wrangler can auto-provision. Decide whether to disable it, or add it to AD-1's neutral-name rule.

Source: https://docs.astro.build/en/guides/integrations-guide/cloudflare/

### LOW-1: drizzle-kit missing from the Stack table, and Drizzle 1.0 is near
- AD-4 generates migrations, which needs drizzle-kit (latest 0.31.11).
- npm `drizzle-orm@rc` is 1.0.0-rc.5, and the current Drizzle D1 docs install `drizzle-kit@rc`, so the docs may not match 0.45.4. Pin both packages deliberately and record the 1.0 migration risk.

Sources: `npm view drizzle-orm dist-tags`, https://orm.drizzle.team/docs/connect-cloudflare-d1

### LOW-2: "Backups: D1 Time Travel covers point-in-time restore" needs its window
The restore window is 7 days on Free and 30 days on Paid. Time Travel is always on, and requires the D1 `production` storage backend. Source: https://developers.cloudflare.com/d1/reference/time-travel/

### LOW-3: R2 served through the Worker (AD-8) is not documented as a free path
It is a standard pattern but was not checked against current docs here. On the Free plan, `/media/*` hits count toward Worker requests. Add cache headers or Cache API use deliberately.

## Not checked
- Workers Builds Node version selection and build-minute limits.
- The `ratelimits` wrangler block syntax: the config page was truncated and only the binding page was read.
- Preview-environment binding isolation (it remains an `[ASSUMPTION]`).
