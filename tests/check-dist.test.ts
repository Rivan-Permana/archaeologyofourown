import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scanDist } from '../scripts/check-dist.ts';

function dist(files: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), 'dist-'));
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(join(dir, name, '..'), { recursive: true });
    writeFileSync(join(dir, name), text);
  }
  return dir;
}

test('a clean build passes', () => {
  assert.deepEqual(scanDist(dist({ 'index.html': '<p>halo</p>', 'a/b.js': 'x@y' })), []);
});
test('an email fails and names the file', () => {
  assert.deepEqual(scanDist(dist({ 'en/index.html': '<p>nama@contoh.id</p>' })), ['en/index.html: email address']);
});
test('a Reference Number fails, a lookalike does not', () => {
  assert.deepEqual(scanDist(dist({ 'x.json': '{"r":"AOO-7K3F9Q"}' })), ['x.json: Reference Number']);
  assert.deepEqual(scanDist(dist({ 'x.json': '{"r":"AOO-7K3F9U","s":"INV-1"}' })), []); // U is not a Crockford character
});
test('an admin path fails', () => {
  assert.ok(scanDist(dist({ 'admin/index.html': '' })).length > 0);
  assert.equal(scanDist(dist({ 'admin.html': '' })).length, 1);
  assert.deepEqual(scanDist(dist({ 'administrasi.html': '' })), []);
});
