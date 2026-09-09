// utils/captureUtm.ts

import { peekSclxId } from './captureIdentity';

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

export const isValidGclid = (value: any): boolean => {
  if (!value) return false;
  const v = String(value).trim();
  const placeholders = ['-', 'n/a', 'null', 'none', 'na', 'undefined'];
  if (placeholders.includes(v.toLowerCase())) return false;
  return v.length > 20 && /^[A-Za-z0-9_-]+$/.test(v);
};

// ── WhatsApp: route via the Alabs Connect bridge ─────────────────────────────
//
// This function previously built a wa.me link directly and attached attribution
// TWO ways, NEITHER of which worked:
//
//   1. `[ref:${gclid}]` — a visible tag. The parser's regex caps the captured
//      group at 16 chars and a GCLID is ~90, so it could never match.
//   2. An invisible zero-width payload hardcoded into every base message.
//      Decoded, it reads "0" — a placeholder, not a real source code. And
//      because the decoder reads the FIRST marker it finds, this one shadowed
//      anything appended later.
//
// Net effect: 479 WhatsApp leads in 30 days, 0 of them reaching Google Ads.
//
// The bridge already has a mechanism that works. It mints a per-visitor session
// code, stores sclx_id + gclid against it, and embeds that code invisibly in the
// greeting it composes itself. On the inbound message it resolves the session
// and writes mx_GCLID + mx_sclx_id onto the LSQ lead — at which point the
// existing relay grades it exactly like a form lead. No relay change, no new
// conversion action, no Google Ads config.
//
// So this function's whole job is now: hand the bridge the two identifiers.
// It composes no message and encodes nothing.
const WA_BRIDGE_ORIGIN = 'https://waba.analytixlabs.co.in';

// Tracked Links in Alabs Connect (admin → Tracked Links, PPC-Whatsapp number).
// Per-page rather than one shared code, so the CRM Source records WHICH landing
// page the chat came from, not merely that it was PPC. Keyed on the first path
// segment, which is the Next.js route folder name.
const WA_SRC_BY_PATH: Record<string, string> = {
  'data-science-ai-course-bangalore':      'sv5cd5n',
  'data-science-ai-course-delhi':          'kta6jxj',
  'data-science-ai-course-gurgaon':        'yjokjm7',
  'data-science-ai-course-noida':          'hhx280g',
  'data-science-specialization-course-lg': 'mp8k8u5',
  'analytixlabs-courses-lg':               'mc0psgv',
  'analytixlabs-placement':                'f4sfbwz',
  'data-analyst-ai-course-bangalore':      'wgze78n',
  'data-analyst-ai-course-delhi':          '1lmryzl',
  'data-analyst-ai-course-gurgaon':        'quvzijs',
  'data-analyst-ai-course-noida':          '2eb9fok',
  // analytixlabs-contact-us and delhi-otp have no tracked link yet. They fall
  // through to the no-src branch below: the chat still opens and the lead is
  // still created, just without campaign attribution. Add the codes here once
  // the sources exist — no other change needed.
};

function currentSrc(): string {
  if (typeof window === 'undefined') return '';
  // Pages live under /lp/<page>/ — an earlier cut read the FIRST segment, which
  // is always "lp", so nothing ever matched and every link fell through to the
  // plain wa.me fallback. Match against any segment instead of a fixed index,
  // so this survives a future path change too.
  const segs = window.location.pathname.split('/').filter(Boolean);
  for (const seg of segs) {
    if (WA_SRC_BY_PATH[seg]) return WA_SRC_BY_PATH[seg];
  }
  return '';
}

export const buildWhatsAppLink = (phoneNumber: string, baseMessage: string = ''): string => {
  const gclid  = isValidGclid(getStoredUtm().gclid) ? String(getStoredUtm().gclid).trim() : '';
  const sclxId = peekSclxId();          // read-only — must not mint on a click
  const src    = currentSrc();

  // The bridge needs something to attribute. With neither identifier there is
  // nothing to carry, so skip the extra hop.
  if (src && (sclxId || gclid)) {
    const q = new URLSearchParams({ src });
    if (sclxId) q.set('sclx', sclxId);
    if (gclid)  q.set('gclid', gclid);
    return `${WA_BRIDGE_ORIGIN}/chat?${q.toString()}`;
  }

  // Fallback: direct wa.me, as before — but WITHOUT the two broken refs. The
  // zero-width strip matters because the hardcoded payload lives inside the
  // baseMessage strings passed in from each page.
  const clean = (baseMessage || '').replace(/[\u200B\u200C\u200D\uFEFF]/g, '').trim();
  return clean
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(clean)}`
    : `https://wa.me/${phoneNumber}`;
};


