// Deny-by-default path policy (AD-7). Pure so it can be unit tested without the Workers runtime.
export type GateDecision = 'public' | 'protected' | 'deny';

const PUBLIC_EXACT = new Set(['/api/subscribe']);
const PUBLIC_PREFIX = ['/api/contribute/', '/media/'];
const PROTECTED_PREFIX = ['/admin', '/api/admin/', '/api/build/'];

export function classify(pathname: string): GateDecision {
  if (PUBLIC_EXACT.has(pathname) || PUBLIC_PREFIX.some((p) => pathname.startsWith(p))) return 'public';
  if (PROTECTED_PREFIX.some((p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : p + '/'))) {
    return 'protected';
  }
  return 'deny';
}

export interface AuthEnv {
  ACCESS_AUD?: string;
  ACCESS_TEAM_DOMAIN?: string;
  EDITOR_EMAILS?: string;
}

// Story 4.1 adds Access JWT verification. Until then protected paths always fail closed (NFR14).
export function authConfigured(env: AuthEnv): boolean {
  return Boolean(env.ACCESS_AUD && env.ACCESS_TEAM_DOMAIN && env.EDITOR_EMAILS);
}
