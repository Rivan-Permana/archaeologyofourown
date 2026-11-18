import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findLaunchBlockers, renderHeaders } from '../scripts/launch-gate.ts';

const clean = { articles: [{ id: 'a', isPlaceholder: false }], artefacts: [], media: [{ id: 'm', isPlaceholder: false }], pendingCopy: [], siteUrl: 'https://example.workers.dev' };

test('a clean build has no blockers', () => assert.deepEqual(findLaunchBlockers(clean), []));

test('each Placeholder record and pending copy string is named', () => {
  const out = findLaunchBlockers({
    ...clean,
    articles: [{ id: 'a1', isPlaceholder: true }],
    artefacts: [{ id: 'f1', isPlaceholder: true }],
    media: [{ id: 'm1', isPlaceholder: true }],
    pendingCopy: ['privacy', 'masthead.manifesto'],
  });
  assert.deepEqual(out, [
    'article a1 is a Placeholder', 'artefact f1 is a Placeholder', 'media m1 is a Placeholder',
    'copy "privacy" is pending client approval', 'copy "masthead.manifesto" is pending client approval',
  ]);
});

test('a missing or local site URL blocks the launch', () => {
  assert.equal(findLaunchBlockers({ ...clean, siteUrl: undefined }).length, 1);
  assert.equal(findLaunchBlockers({ ...clean, siteUrl: 'http://localhost:4321' }).length, 1);
});

test('headers: noindex is dropped only when launched', () => {
  const tpl = '/*\n  X-Content-Type-Options: nosniff\n  X-Robots-Tag: noindex\n';
  assert.ok(renderHeaders(tpl, false).includes('X-Robots-Tag: noindex'));
  const live = renderHeaders(tpl, true);
  assert.ok(!live.includes('X-Robots-Tag') && live.includes('nosniff'));
});
