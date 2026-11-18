import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SignJWT, exportJWK, generateKeyPair, createLocalJWKSet } from 'jose';
import { verifyAccess, type AccessEnv } from '../src/server/auth/access.ts';

const TEAM = 'team.example.cloudflareaccess.com';
const env: AccessEnv = { ACCESS_TEAM_DOMAIN: TEAM, ACCESS_AUD: 'aud-1,aud-2', EDITOR_EMAILS: 'Editor@contoh.id, lain@contoh.id', BUILD_SERVICE_TOKEN_ID: 'client-id' };
const { publicKey, privateKey } = await generateKeyPair('RS256');
const other = await generateKeyPair('RS256');
const jwk = { ...(await exportJWK(publicKey)), alg: 'RS256', use: 'sig' };
const getKey = createLocalJWKSet({ keys: [jwk] });

async function token(claims: Record<string, unknown>, o: { iss?: string; aud?: string; exp?: string | number; key?: CryptoKey } = {}) {
  return new SignJWT(claims).setProtectedHeader({ alg: 'RS256' }).setIssuer(o.iss ?? `https://${TEAM}`).setAudience(o.aud ?? 'aud-1')
    .setIssuedAt().setExpirationTime(o.exp ?? '5m').sign(o.key ?? privateKey);
}
const req = (t?: string) => new Request('https://x.test/api/admin/a', { headers: t ? { 'Cf-Access-Jwt-Assertion': t } : {} });
const run = (t: string | undefined, scope: 'editor' | 'service', e: AccessEnv = env) => verifyAccess(req(t), e, scope, getKey);

test('editor on the allowlist passes, case-insensitively', async () => {
  const r = await run(await token({ email: 'EDITOR@contoh.id' }), 'editor');
  assert.deepEqual(r, { ok: true, identity: { kind: 'editor', email: 'editor@contoh.id' } });
});

test('service token passes only the service scope', async () => {
  const t = await token({ common_name: 'client-id' });
  assert.deepEqual(await run(t, 'service'), { ok: true, identity: { kind: 'service', id: 'client-id' } });
  assert.equal((await run(t, 'editor')).ok, false);
});

test('a different service token is rejected, and an unset build id fails closed', async () => {
  const t = await token({ common_name: 'other-client' });
  assert.equal((await run(t, 'service')).ok, false);
  assert.equal((await run(await token({ common_name: 'client-id' }), 'service', { ...env, BUILD_SERVICE_TOKEN_ID: '' })).ok, false);
});

test('an editor JWT cannot reach the build scope', async () => {
  assert.equal((await run(await token({ email: 'editor@contoh.id', common_name: 'c' }), 'service')).ok, false);
  assert.equal((await run(await token({ email: 'editor@contoh.id' }), 'service')).ok, false);
});

test('rejects: missing header, other email, wrong issuer, wrong audience, foreign key, tampered, garbage', async () => {
  const bad = [
    undefined,
    await token({ email: 'stranger@contoh.id' }),
    await token({ email: 'editor@contoh.id' }, { iss: 'https://evil.example' }),
    await token({ email: 'editor@contoh.id' }, { aud: 'aud-3' }),
    await token({ email: 'editor@contoh.id' }, { key: other.privateKey }),
    (await token({ email: 'editor@contoh.id' })).slice(0, -3) + 'AAA',
    'not.a.jwt',
    'eyJhbGciOiJub25lIn0.eyJlbWFpbCI6ImVkaXRvckBjb250b2guaWQifQ.',
  ];
  for (const t of bad) assert.deepEqual(await run(t, 'editor'), { ok: false, code: 'unauthorized' });
});

test('second audience is accepted', async () => {
  assert.equal((await run(await token({ email: 'editor@contoh.id' }, { aud: 'aud-2' }), 'editor')).ok, true);
});

test('expired token returns session_expired', async () => {
  const t = await token({ email: 'editor@contoh.id' }, { exp: Math.floor(Date.now() / 1000) - 60 });
  assert.deepEqual(await run(t, 'editor'), { ok: false, code: 'session_expired' });
});

test('missing config fails closed', async () => {
  const t = await token({ email: 'editor@contoh.id', common_name: undefined });
  for (const e of [{}, { ...env, ACCESS_AUD: '' }, { ...env, ACCESS_TEAM_DOMAIN: '' }, { ...env, EDITOR_EMAILS: ' ' }]) {
    assert.equal((await run(t, 'editor', e)).ok, false);
  }
  assert.equal((await run(await token({ common_name: 'c' }), 'service', { ...env, ACCESS_AUD: undefined })).ok, false);
});
