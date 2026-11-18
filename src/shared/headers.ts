// Headers added to on-demand responses (AD-17). Static assets get the same from public/_headers.
export function securityHeaders(launched: boolean): Record<string, string> {
  const h: Record<string, string> = {
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "frame-ancestors 'none'; object-src 'none'; base-uri 'none'",
  };
  if (!launched) h['X-Robots-Tag'] = 'noindex';
  return h;
}
