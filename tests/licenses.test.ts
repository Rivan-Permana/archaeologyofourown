import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findViolations } from '../scripts/check-licenses.ts';

test('accepts permissive and MPL packages', () => {
  assert.deepEqual(findViolations({ '': {}, 'node_modules/a': { license: 'MIT' }, 'node_modules/@blocknote/core': { license: 'MPL-2.0' } }), []);
});

test('rejects @blocknote/xl-*', () => {
  assert.equal(findViolations({ 'node_modules/@blocknote/xl-ai': { license: 'GPL-3.0' } }).length, 1);
});

test('rejects GPL and AGPL licences', () => {
  assert.equal(findViolations({ 'node_modules/x': { license: 'AGPL-3.0-only' }, 'node_modules/y': { license: 'GPL-2.0' } }).length, 2);
});
