// Cloudflare Access JWT verification (AD-7). Fails closed on any missing header, config or claim.
import { createRemoteJWKSet, errors, jwtVerify, type JWTVerifyGetKey } from 'jose';

export interface AccessEnv { ACCESS_AUD?: string; ACCESS_TEAM_DOMAIN?: string; EDITOR_EMAILS?: string; BUILD_SERVICE_TOKEN_ID?: string }
export type Identity = { kind: 'editor'; email: string } | { kind: 'service'; id: string };
export type AccessResult = { ok: true; identity: Identity } | { ok: false; code: 'unauthorized' | 'session_expired' };

const jwks = new Map<string, JWTVerifyGetKey>();
const remoteKeys = (team: string) => {
  let k = jwks.get(team);
  if (!k) jwks.set(team, (k = createRemoteJWKSet(new URL(`https://${team}/cdn-cgi/access/certs`))));
  return k;
};
const deny = (code: 'unauthorized' | 'session_expired' = 'unauthorized'): AccessResult => ({ ok: false, code });

/**
 * `scope` 'service' is for /api/build/*: only the build service token passes: no email and `common_name` equal to BUILD_SERVICE_TOKEN_ID.
 * `scope` 'editor' needs an email listed in EDITOR_EMAILS. `getKey` is injectable for tests.
 */
export async function verifyAccess(request: Request, env: AccessEnv, scope: 'editor' | 'service', getKey?: JWTVerifyGetKey): Promise<AccessResult> {
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  const team = env.ACCESS_TEAM_DOMAIN?.trim();
  const aud = env.ACCESS_AUD?.split(',').map((a) => a.trim()).filter(Boolean);
  if (!token || !team || !aud?.length) return deny();
  if (scope === 'editor' && !env.EDITOR_EMAILS?.trim()) return deny();
  try {
    const { payload } = await jwtVerify(token, getKey ?? remoteKeys(team), { issuer: `https://${team}`, audience: aud, algorithms: ['RS256'] });
    if (scope === 'service') {
      // ASSUMPTION: Access service-token JWTs carry `common_name` and no `email`; confirm at setup.
      const buildId = env.BUILD_SERVICE_TOKEN_ID?.trim();
      return buildId && payload.common_name === buildId && payload.email === undefined
        ? { ok: true, identity: { kind: 'service', id: payload.common_name } }
        : deny();
    }
    const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
    const allowed = env.EDITOR_EMAILS!.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
    return email && allowed.includes(email) ? { ok: true, identity: { kind: 'editor', email } } : deny();
  } catch (e) {
    return deny(e instanceof errors.JWTExpired ? 'session_expired' : 'unauthorized');
  }
}
