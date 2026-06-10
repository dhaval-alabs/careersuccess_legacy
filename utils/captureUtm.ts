// utils/captureUtm.ts

/**
 * Reads the Google Ads _gcl_aw cookie and extracts the GCLID.
 * Cookie format: GCL.{timestamp}.{gclid}
 * Returns '' if absent or malformed. Never throws.
 */
export const readGclidFromGclAwCookie = (): string => {
  if (typeof document === 'undefined') return ''; // SSR guard
  try {
    const row = document.cookie.split('; ').find((c) => c.startsWith('_gcl_aw='));
    if (!row) return '';
    const raw = decodeURIComponent(row.split('=').slice(1).join('='));
    if (!raw) return '';
    const parts = raw.split('.');
    if (parts.length < 3) return '';        // need GCL.{ts}.{gclid}
    return parts.slice(2).join('.');         // gclid may contain dots — keep them
  } catch {
    return '';
  }
};

export const captureUtmParams = (): void => {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const keys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
  ];

  keys.forEach((key) => {
    const value = params.get(key);
    // Only write if present in URL — never overwrite with empty string
    if (value) sessionStorage.setItem(`alabs_${key}`, value);
  });
};

export const getStoredUtm = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];
  const utms = Object.fromEntries(
    keys.map((k) => [k, sessionStorage.getItem(`alabs_${k}`) || ''])
  );

  // _gcl_aw cookie fallback — only when no in-session gclid was captured
  if (!utms.gclid) {
    const cookieGclid = readGclidFromGclAwCookie();
    if (cookieGclid) {
      utms.gclid = cookieGclid;
    }
  }

  return utms;
};

