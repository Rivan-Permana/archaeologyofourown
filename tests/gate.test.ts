import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify } from '../src/server/auth/gate.ts';
import { securityHeaders } from '../src/shared/headers.ts';

test('public paths', () => {
  for (const p of ['/api/subscribe', '/api/contribute/start', '/media/a.webp']) assert.equal(classify(p), 'public');
});

test('protected paths', () => {
  for (const p of ['/admin', '/admin/kiriman', '/api/admin/x', '/api/build/snapshot']) assert.equal(classify(p), 'protected');
});

test('everything else is denied, including lookalikes', () => {
  for (const p of ['/api/other', '/administrator', '/api/subscribe/x', '/api/administer']) assert.equal(classify(p), 'deny');
});

test('headers: noindex only before launch', () => {
  assert.equal(securityHeaders(false)['X-Robots-Tag'], 'noindex');
  assert.equal(securityHeaders(true)['X-Robots-Tag'], undefined);
  assert.equal(securityHeaders(true)['X-Content-Type-Options'], 'nosniff');
});
