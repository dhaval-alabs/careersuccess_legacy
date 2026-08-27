/**
 * lib/identifier-log.ts — append-only identifier observation log
 *
 * Writes one immutable row per identifier we observe for a lead, into the SAME
 * Firestore project the relay already uses (analytixlabs-ads), so the relay can
 * read it back at day 5 with no cross-project setup.
 *
 * ── Why append-only ──────────────────────────────────────────────────────
 * The relay's prospect ledger holds ONE GCLID per lead and overwrites it. So a
 * lead that arrives with no click id and gains one on a later visit looks, at
 * day 5, identical to one that always had it. That is why we cannot currently
 * compute an account-wide GCLID attach rate — "never had a click id" and "had
 * one by push time" are indistinguishable.
 *
 * Rows here are never updated, only added. That turns the attach rate into a
 * query instead of a guess, and it lets the day-5 push pick the GCLID whose
 * click is INSIDE Google's window rather than simply the most recent one —
 * which is new delivery, not just cleaner accounting.
 *
 * ── Why the click timestamp matters ──────────────────────────────────────
 * Google rejects an upload when the CLICK is older than the conversion action's
 * click-through window (90 days, already our maximum). The relay pre-checks
 * using the lead's created_at as a proxy, but the click precedes lead creation
 * by an unknown margin — so leads pass our check and are rejected by Google.
 * Measured 13 Aug 2026: every day-5 failure that night returned "its click
 * occurred before this conversion's click-through window".
 *
 * captureIdentity.ts recovers the real click time from the linker cookie.
 * This module is what makes it readable again five days later.
 *
 * ── PREREQUISITE, NOT YET SATISFIED ─────────────────────────────────────
 * The existing service account (GOOGLE_SERVICE_ACCOUNT_EMAIL) authenticates for
 * scope `spreadsheets` only. This module needs `datastore`, AND the account
 * needs IAM on the Firestore project. Until both are in place every call here
 * fails and is swallowed — by design, see the fire-and-forget note below.
 *
 * To enable:
 *   1. Grant roles/datastore.user to GOOGLE_SERVICE_ACCOUNT_EMAIL on the
 *      project named by FIRESTORE_PROJECT_ID.
 *   2. Set FIRESTORE_PROJECT_ID in the environment (default below matches the
 *      relay's CONFIG.FIRESTORE_PROJECT_ID — they MUST match or the relay reads
 *      an empty collection).
 *
 * ── Fire-and-forget, deliberately ────────────────────────────────────────
 * Every function here swallows its own errors. An observation write must NEVER
 * fail a lead capture: losing analytics is recoverable, losing a lead is not.
 * Same principle as the relay's FIRESTORE_FAIL handling, where the conversion
 * still uploads when the ledger write fails.
 */

import crypto from 'crypto';

const FIRESTORE_PROJECT_ID = process.env.FIRESTORE_PROJECT_ID || 'analytixlabs-ads';
const CUSTOMER_ID = process.env.SCALEX_CUSTOMER_ID || '4064995850';

export type IdentifierType =
  | 'gclid'
  | 'fbclid'
  | 'email_sha256'
  | 'phone_sha256'
  | 'prospect_id';

export type ObservationSource =
  | 'browser'
  | 'gcl_aw_cookie'
  | 'url_param'
  | 'lsq_refetch'
  | 'relay_webhook';

export interface Observation {
  sclxId: string;
  identifierType: IdentifierType;
  /** Hashed for PII, raw for click ids. Never a plaintext email or phone. */
  identifierValue: string;
  source: ObservationSource;
  /** Unix SECONDS. Only meaningful on gclid rows from a linker cookie. */
  clickTimestamp?: number | null;
  pagePath?: string;
  hsaCam?: string;
  hsaGrp?: string;
}

/* ── auth ─────────────────────────────────────────────────────────────── */

let dsTokenCache: { token: string; expiresAt: number } | null = null;

async function getFirestoreToken(): Promise<string | null> {
  if (dsTokenCache && Date.now() < dsTokenCache.expiresAt) return dsTokenCache.token;

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!clientEmail || !privateKey) return null;

  try {
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: clientEmail,
      // Distinct from the sheets scope, hence a separate token cache — a
      // spreadsheets token cannot write Firestore and reusing it would fail
      // in a way that looks like a permissions bug rather than a scope bug.
      scope: 'https://www.googleapis.com/auth/datastore',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
    const b64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signatureInput = `${b64Header}.${b64Payload}`;

    let formattedKey = privateKey.replace(/\\n/g, '\n');
    if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
      formattedKey = formattedKey.slice(1, -1);
    }

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    sign.end();
    const signature = sign.sign(formattedKey, 'base64url');

    const resp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:
        'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' +
        `${signatureInput}.${signature}`,
    });

    const data = await resp.json();
    if (!resp.ok || !data.access_token) {
      console.error('[identifier-log] token failed — is roles/datastore.user granted?', data);
      return null;
    }

    dsTokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 300) * 1000,
    };
    return dsTokenCache.token;
  } catch (err) {
    console.error('[identifier-log] token exception:', err);
    return null;
  }
}

/* ── Firestore REST encoding ──────────────────────────────────────────── */
// Firestore's REST API wants typed field wrappers. Integers must be STRINGS
// (int64), which is easy to get wrong and fails silently as a type mismatch.

function fsValue(v: unknown): Record<string, unknown> {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') {
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  }
  return { stringValue: String(v) };
}

function fsFields(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(obj)) {
    if (obj[k] !== undefined) out[k] = fsValue(obj[k]);
  }
  return out;
}

/* ── document id ──────────────────────────────────────────────────────── */
// ULID rather than an auto-id: lexicographically sortable by creation time, so
// observations read back in order without a secondary index. Mirrors the
// sclx_id format in utils/captureIdentity.ts.

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

function ulid(): string {
  let time = '';
  let t = Date.now();
  for (let i = 9; i >= 0; i--) {
    time = CROCKFORD[t % 32] + time;
    t = Math.floor(t / 32);
  }
  const bytes = crypto.randomBytes(16);
  let rand = '';
  for (let i = 0; i < 16; i++) rand += CROCKFORD[bytes[i] % 32];
  return time + rand;
}

/* ── write ────────────────────────────────────────────────────────────── */

function observationsPath(sclxId: string): string {
  return (
    `clients/${CUSTOMER_ID}/identifiers/${encodeURIComponent(sclxId)}` +
    `/observations/${ulid()}`
  );
}

/**
 * Append one observation. Resolves true on success, false on any failure.
 * NEVER throws — callers must not have to guard this.
 */
export async function writeObservation(obs: Observation): Promise<boolean> {
  if (!obs.sclxId || !obs.identifierValue) return false;

  const token = await getFirestoreToken();
  if (!token) return false;

  const doc = {
    sclx_id: obs.sclxId,
    observed_at: new Date().toISOString(),
    source: obs.source,
    identifier_type: obs.identifierType,
    identifier_value: obs.identifierValue,
    click_timestamp: obs.clickTimestamp ?? null,
    // ISO alongside the epoch value: the epoch is what comparisons use, the
    // ISO is what a human reads in the console. Cheap, and it prevents the
    // "is this seconds or milliseconds" question being asked later.
    click_timestamp_iso: obs.clickTimestamp
      ? new Date(obs.clickTimestamp * 1000).toISOString()
      : null,
    page_path: obs.pagePath ?? null,
    hsa_cam: obs.hsaCam ?? null,
    hsa_grp: obs.hsaGrp ?? null,
    source_class: 'search',
    written_by: 'landing_page',
  };

  try {
    const url =
      `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}` +
      `/databases/(default)/documents/${observationsPath(obs.sclxId)}`;

    const resp = await fetch(url, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: fsFields(doc) }),
    });

    if (!resp.ok) {
      console.error('[identifier-log] write failed', resp.status, await resp.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('[identifier-log] write exception:', err);
    return false;
  }
}

/**
 * Convenience: record everything a submission tells us, in one call.
 *
 * Only writes rows for identifiers actually PRESENT — an absent GCLID must not
 * produce an empty-valued row, or the attach rate this log exists to measure
 * becomes uncountable.
 *
 * Deliberately NOT awaited by callers. Returns a promise so a caller can await
 * in a test, but in the request path it should be fired and dropped.
 */
export async function recordSubmissionIdentifiers(input: {
  sclxId: string;
  gclid?: string;
  clickTimestamp?: number | null;
  clickIdSource?: string;
  hashedEmail?: string;
  hashedPhone?: string;
  prospectId?: string;
  pagePath?: string;
  hsaCam?: string;
  hsaGrp?: string;
}): Promise<void> {
  const { sclxId } = input;
  if (!sclxId) return;

  const common = {
    sclxId,
    pagePath: input.pagePath,
    hsaCam: input.hsaCam,
    hsaGrp: input.hsaGrp,
  };

  const writes: Promise<boolean>[] = [];

  if (input.gclid) {
    writes.push(
      writeObservation({
        ...common,
        identifierType: 'gclid',
        identifierValue: input.gclid,
        // Only a linker cookie carries a timestamp; a URL parameter does not.
        source: input.clickIdSource === 'url_param' ? 'url_param' : 'gcl_aw_cookie',
        clickTimestamp: input.clickTimestamp ?? null,
      })
    );
  }
  if (input.hashedEmail) {
    writes.push(
      writeObservation({
        ...common,
        identifierType: 'email_sha256',
        identifierValue: input.hashedEmail,
        source: 'browser',
      })
    );
  }
  if (input.hashedPhone) {
    writes.push(
      writeObservation({
        ...common,
        identifierType: 'phone_sha256',
        identifierValue: input.hashedPhone,
        source: 'browser',
      })
    );
  }
  if (input.prospectId) {
    writes.push(
      writeObservation({
        ...common,
        identifierType: 'prospect_id',
        identifierValue: input.prospectId,
        source: 'browser',
      })
    );
  }

  try {
    await Promise.all(writes);
  } catch {
    /* fire-and-forget — never surface to the caller */
  }
}
