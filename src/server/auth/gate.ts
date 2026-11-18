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
