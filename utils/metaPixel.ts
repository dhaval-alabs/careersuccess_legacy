/**
 * utils/metaPixel.ts
 *
 * Implements Step 2 (and helper utilities) of AnalytixLabs-Pixel-Handover.md:
 * - Manual Advanced Matching user storage
 * - Exact normalization rules according to Meta specifications (raw/unhashed)
 * - Safe client-side execution (SSR safe, Safari private mode safe)
 */

export interface MetaUserIdentity {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export const META_PIXEL_ID = '1266998543986581';

/**
 * Stores normalized visitor identity in localStorage ('al_am') and re-initializes fbq.
 * Call this at every point the site learns who someone is — form submit, OTP verification, etc.
 */
export function alStoreIdentity(user: MetaUserIdentity): void {
  if (typeof window === 'undefined') return;

  try {
    const rawDigits = String(user.phone || '').replace(/\D/g, '');
    const am: Record<string, string> = {};

    // em: Email -> Trim, lowercase. No other changes.
    if (user.email) {
      am.em = String(user.email).trim().toLowerCase();
    }

    // ph: Phone -> Digits only, country code included, no '+', no spaces or dashes.
    // Indian numbers arrive as 10 digits -> '91' + digits
    if (rawDigits) {
      am.ph = rawDigits.length === 10 ? '91' + rawDigits : rawDigits;
    }

    // Resolve first and last name (from separate properties or split full name)
    let fn = user.firstName ? String(user.firstName).trim().toLowerCase() : '';
    let ln = user.lastName ? String(user.lastName).trim().toLowerCase() : '';

    if (!fn && user.name) {
      const parts = String(user.name).trim().split(/\s+/);
      if (parts.length > 0 && parts[0]) {
        fn = parts[0].toLowerCase();
      }
      if (parts.length > 1) {
        ln = parts.slice(1).join(' ').toLowerCase();
      }
    }

    // fn / ln: Trim, lowercase. Strip titles and punctuation.
    if (fn) {
      am.fn = fn.replace(/[^\w\s]/gi, '').trim();
    }
    if (ln) {
      am.ln = ln.replace(/[^\w\s]/gi, '').trim();
    }

    // ct: Town/city -> Trim, lowercase, remove all spaces (e.g. New Delhi -> newdelhi)
    if (user.city) {
      am.ct = String(user.city).trim().toLowerCase().replace(/\s+/g, '');
    }

    // st: State -> Lowercase two-letter code where available (optional)
    if (user.state) {
      am.st = String(user.state).trim().toLowerCase();
    }

    // zp: Postcode -> Digits only (optional)
    if (user.zip) {
      am.zp = String(user.zip).replace(/\D/g, '');
    }

    // country: ISO-3166 alpha-2 -> 'in'
    am.country = (user.country ? String(user.country).trim().toLowerCase() : '') || 'in';

    // Persist to localStorage safely
    try {
      window.localStorage.setItem('al_am', JSON.stringify(am));
    } catch {
      try {
        window.sessionStorage.setItem('al_am', JSON.stringify(am));
      } catch {
        // Safe fail
      }
    }

    // Re-init so events later in THIS pageview are matched too, rather than waiting for next load
    const w = window as any;
    if (typeof w.fbq === 'function') {
      w.fbq('init', META_PIXEL_ID, am);
    }
  } catch (e) {
    // Identity capture must never break the page
  }
}
