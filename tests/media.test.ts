import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testEnv } from './helpers/db.ts';
import { mediaAsset } from '../src/server/db/schema.ts';
import { getPublicMedia } from '../src/server/services/media.ts';

let env: Awaited<ReturnType<typeof testEnv>>;
const id = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
before(async () => {
  env = await testEnv();
  await env.db.insert(mediaAsset).values({ id, mime: 'image/webp', width: 640, height: 427, status: 'ready' });
  await env.bucket.put(`${id}-w640.webp`, 'bytes');
  await env.bucket.put(`staging/${id}.webp`, 'secret');
});
after(() => env.dispose());

test('serves a valid variant key with the stored content type', async () => {
  const f = await getPublicMedia(env.db, env.bucket, `${id}-w640.webp`);
  assert.equal(f?.contentType, 'image/webp');
  assert.equal(f?.filename, `${id}-w640.webp`);
});

test('rejects staging, traversal, unknown and non-image keys', async () => {
  for (const key of [`staging/${id}.webp`, `../${id}-w640.webp`, `${id}.webp`, 'nope.webp', `${id}-w640.svg`, '']) {
    assert.equal(await getPublicMedia(env.db, env.bucket, key), null, key);
  }
});
