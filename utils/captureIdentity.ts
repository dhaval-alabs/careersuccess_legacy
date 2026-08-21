/**
 * captureIdentity.ts — first-touch identity capture
 *
 * Two jobs, both of which must happen on the FIRST page view and cannot be
 * recovered later:
 *
 *   1. Mint a stable first-party identifier (sclx_id) for the visitor.
 *   2. Extract the CLICK TIMESTAMP that Google writes alongside the GCLID.
 *
 * ── Why the click timestamp matters ──────────────────────────────────────
 * Google rejects an offline conversion upload when the CLICK is older than the
 * conversion action's click-through window (90 days, already our maximum).
 * The relay currently pre-checks using the lead's created_at as a proxy for
 * click age — but the click precedes lead creation by an unknown margin, so
 * leads pass our check and are then rejected by Google. Measured 13 Aug 2026:
 * every day-5 failure that night returned "its click occurred before this
 * conversion's click-through window".
 *
 * The real click time is already in the browser. Google's linker cookie is:
 *
 *     GCL.{timestamp}.{gclid}
 *
 * captureUtm.ts has always parsed this cookie, taken parts.slice(2) for the
 * GCLID, and discarded parts[1] — the timestamp. This module keeps it.
 *
 * ── Why three cookie names ───────────────────────────────────────────────
 * Which cookie holds the linker value depends on how the Google tag is
 * deployed. With client-side GTM it is `_gcl_aw`. With a server-side container
 * — which this property runs (ALabs_sGTM) — the Conversion Linker may instead
 * write `FPGCLAW` or `GCL_AW_P` as a first-party cookie.
 *
 * Rather than assume, this reads all three in priority order. That makes the
 * module correct under either deployment and removes the need to confirm which
 * one is in use before shipping. WHICH cookie actually fired is reported in
 * `clickIdSource`, so the answer becomes observable in the data instead of a
 * question we have to ask.
 *
 * NOTE: this is a deliberate design response to an open question — the relay
 * log has never shown gclidSource:'gcl_aw', which is consistent with the
 * cookie fallback reading a name this property does not write. If that is the
 * case, `clickIdSource` will show it within a day of shipping.
 *
 * ── Storage ──────────────────────────────────────────────────────────────
 * localStorage, NOT sessionStorage. captureUtm.ts uses sessionStorage, which
 * is destroyed when the tab closes — so a visitor who lands on Monday and
 * submits on Thursday is a new identity, and first-touch context is lost.
 * Since sclx_id exists precisely to survive that gap, it must outlive the tab.
 *
 * Every storage access is wrapped: Safari private mode throws on write, and an
 * identity capture must never break a page render or a form submission.
 */

const SCLX_ID_KEY = 'sclx_id';
const CLICK_CTX_KEY = 'sclx_click_ctx';

/** Priority order. First cookie present wins. */
const LINKER_COOKIES = ['_gcl_aw', 'FPGCLAW', 'GCL_AW_P'] as const;

export type ClickIdSource = (typeof LINKER_COOKIES)[number] | 'url_param' | 'none';

export interface ClickContext {
  /** The GCLID itself, or '' when none is resolvable. */
  gclid: string;
  /** Unix SECONDS at which the linker cookie was written ≈ click time. Null when unknown. */
  clickTimestamp: number | null;
  /** Which surface the click id came from. Makes the cookie-name question observable. */
  clickIdSource: ClickIdSource;
}

export interface CapturedIdentity extends ClickContext {
  sclxId: string;
  /** ISO8601. When THIS browser first minted the id, not when the lead was created. */
  firstTouchAt: string;
  /** Path only — no query string, which can carry PII on some entry points. */
  firstTouchPath: string;
}

/* ── storage helpers — never throw ────────────────────────────────────── */

function safeGet(key: string): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(key) || window.sessionStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function safeSet(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Safari private mode and hardened privacy settings throw on write.
    // sessionStorage is a worse identifier but better than none for this visit.
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      /* give up silently — capture must never break the page */
    }
  }
}

function readCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : '';
}

/* ── ULID ─────────────────────────────────────────────────────────────────
 * Chosen over UUIDv4 because it is lexicographically sortable by creation
 * time. The identifier log is append-only and queried by first-touch date, so
 * a sortable key makes range scans work without a secondary index.
 * Written inline rather than adding a dependency for ~30 lines.
 */

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // no I, L, O, U

function encodeTime(now: number, len: number): string {
  let out = '';
  let t = now;
  for (let i = len - 1; i >= 0; i--) {
    out = CROCKFORD[t % 32] + out;
    t = Math.floor(t / 32);
  }
  return out;
}

function encodeRandom(len: number): string {
  let out = '';
  const bytes = new Uint8Array(len);
  const c: Crypto | undefined =
    typeof globalThis !== 'undefined' ? (globalThis.crypto as Crypto | undefined) : undefined;

  if (c && typeof c.getRandomValues === 'function') {
    c.getRandomValues(bytes);
  } else {
    for (let i = 0; i < len; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  for (let i = 0; i < len; i++) out += CROCKFORD[bytes[i] % 32];
  return out;
}

function ulid(): string {
  return encodeTime(Date.now(), 10) + encodeRandom(16);
}

/* ── click context ────────────────────────────────────────────────────── */

/**
 * Parse a Google linker cookie: GCL.{timestamp}.{gclid}
 *
 * The GCLID itself may contain dots, so everything after the second segment is
 * rejoined rather than taking parts[2] alone — the same rule captureUtm.ts
 * already applies.
 */
function parseLinkerCookie(raw: string): { gclid: string; clickTimestamp: number | null } {
  if (!raw) return { gclid: '', clickTimestamp: null };

  const parts = raw.split('.');
  if (parts.length < 3 || parts[0] !== 'GCL') return { gclid: '', clickTimestamp: null };

  const gclid = parts.slice(2).join('.');
  const ts = parseInt(parts[1], 10);

  // Sanity-bound the timestamp rather than trusting the format blindly.
  // Unix SECONDS: 1_500_000_000 ≈ Jul 2017. Upper bound is now + 1 day to
  // tolerate clock skew. Anything outside is not a timestamp we should use to
  // decide whether a conversion is inside Google's click window.
  const nowSec = Math.floor(Date.now() / 1000);
  const plausible = Number.isFinite(ts) && ts > 1_500_000_000 && ts < nowSec + 86_400;

  return { gclid, clickTimestamp: plausible ? ts : null };
}

/**
 * Resolve the click id and its timestamp.
 *
 * Cookie first, because only the cookie carries a timestamp. The URL parameter
 * is the fallback: it gives a GCLID but no click time, which is still better
 * than nothing — the relay's existing created_at proxy then applies to that
 * lead, exactly as it does today.
 */
export function readClickContext(): ClickContext {
  for (const name of LINKER_COOKIES) {
    const parsed = parseLinkerCookie(readCookie(name));
    if (parsed.gclid) {
      return { ...parsed, clickIdSource: name };
    }
  }

  if (typeof window !== 'undefined') {
    const fromUrl = new URLSearchParams(window.location.search).get('gclid') || '';
    if (fromUrl) {
      return { gclid: fromUrl, clickTimestamp: null, clickIdSource: 'url_param' };
    }
  }

  return { gclid: '', clickTimestamp: null, clickIdSource: 'none' };
}

/* ── public entry point ───────────────────────────────────────────────── */

/**
 * Mint (or recover) the sclx_id and capture click context.
 *
 * Idempotent: safe to call on every page view. The id is minted once and the
 * first-touch context frozen with it; later calls return the stored values and
 * refresh only the live click context, so a returning visitor who arrives on a
 * new ad click has that click observable without losing their original id.
 */
export function captureIdentity(): CapturedIdentity {
  let sclxId = safeGet(SCLX_ID_KEY);
  let firstTouchAt = '';
  let firstTouchPath = '';

  const storedCtx = safeGet(CLICK_CTX_KEY);
  if (storedCtx) {
    try {
      const parsed = JSON.parse(storedCtx) as Partial<CapturedIdentity>;
      firstTouchAt = parsed.firstTouchAt || '';
      firstTouchPath = parsed.firstTouchPath || '';
    } catch {
      /* corrupt entry — re-mint below */
    }
  }

  const isFirstTouch = !sclxId;

  if (isFirstTouch) {
    sclxId = 'sclx_' + ulid();
    firstTouchAt = new Date().toISOString();
    firstTouchPath = typeof window !== 'undefined' ? window.location.pathname : '';

    safeSet(SCLX_ID_KEY, sclxId);
    safeSet(CLICK_CTX_KEY, JSON.stringify({ firstTouchAt, firstTouchPath }));
  }

  // Always read live — a returning visitor may arrive on a NEW ad click, and
  // that click's timestamp is what a later push needs to evaluate against
  // Google's window. The append-only identifier log keeps both.
  const click = readClickContext();

  return {
    sclxId,
    firstTouchAt,
    firstTouchPath,
    ...click,
  };
}

/** Read-only accessor for callers that must not mint (e.g. server-rendered paths). */
export function peekSclxId(): string {
  return safeGet(SCLX_ID_KEY);
}
