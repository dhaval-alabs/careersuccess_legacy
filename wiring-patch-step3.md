# Capture layer — wiring patch (step 3 of 5)

**Repo:** `dhaval-alabs/careersuccess_legacy`
**Scope:** call the identifier log from both API routes, fire-and-forget.
**Additive only.** No existing field, column, row or behaviour changes.

---

## Prerequisites

**In the repo already:**
```
utils/captureIdentity.ts    255 lines · sha ae2852bdc2f5
lib/identifier-log.ts       331 lines · sha 5436cc071fa1   ← add if not yet pushed
```

**Not yet satisfied — the patch is safe to ship without it:**

> Grant `roles/datastore.user` to `GOOGLE_SERVICE_ACCOUNT_EMAIL` on the Firestore project `analytixlabs-ads`, and set `FIRESTORE_PROJECT_ID` in Vercel env (the default in code already matches).

Until that lands, every write fails and is swallowed. **That is deliberate**, not a fallback bug: an observation write must never fail a lead capture. Losing analytics is recoverable; losing a lead is not. Same principle as the relay's `FIRESTORE_FAIL` handling, where the conversion still uploads when the ledger write fails.

So this can be deployed today and starts working the moment the grant is made — no redeploy needed.

---

## Change 1 — `app/api/submit-lead/route.ts`

**Import**, alongside the existing imports:

```ts
import { recordSubmissionIdentifiers } from '@/lib/identifier-log';
```

**Hook point: immediately after the existing Sheets call at ~line 329.** That call already uses the fire-and-forget shape, so the new one sits directly beside it and reads consistently:

```ts
    await pushToGoogleSheets(body, cleanPhone, friendlyNotes).catch(console.error);

    // ── NEW: append-only identifier log ──────────────────────────────────
    // Deliberately NOT awaited and never allowed to throw. This is analytics;
    // it must not be able to fail a lead capture. `prospectId` is in scope here
    // from the LSQ create/update above, which is the point of placing it after
    // that block rather than earlier — the observation carries the CRM id.
    recordSubmissionIdentifiers({
      sclxId:         body.sclx_id,
      gclid:          body.gclid,
      clickTimestamp: body.click_timestamp,
      clickIdSource:  body.click_id_source,
      prospectId:     prospectId ?? undefined,
      pagePath:       pagePathOf(body.landing_page_url),
      hsaCam:         urlParam(body.landing_page_url, 'hsa_cam'),
      hsaGrp:         urlParam(body.landing_page_url, 'hsa_grp'),
    }).catch(() => { /* already logged internally */ });
```

**Two small helpers**, near the top of the file with the other module-level functions:

```ts
/** Path only — the query string can carry PII on some entry points. */
function pagePathOf(url?: string): string | undefined {
  if (!url) return undefined;
  try { return new URL(url).pathname; } catch { return undefined; }
}

/**
 * Read a single query parameter from the captured landing URL.
 * hsa_cam / hsa_grp resolve to the exact Google Ads campaign and ad group, and
 * are correct on all six enabled campaigns — unlike utm_campaign, which is
 * EMPTY on Brand and Bangalore because both reference an undefined
 * {_utmcampaign} custom parameter. Keying on hsa_* rather than utm_campaign is
 * load-bearing, not a preference.
 */
function urlParam(url: string | undefined, key: string): string | undefined {
  if (!url) return undefined;
  try { return new URL(url).searchParams.get(key) ?? undefined; } catch { return undefined; }
}
```

---

## Change 2 — `app/api/otp/send/route.ts`

**Identical treatment.** Same import, same two helpers, same call placed immediately after that route's `pushToGoogleSheets`.

If `prospectId` is not in scope in this route, pass `prospectId: undefined` rather than inventing one — a missing field is honest, a wrong one is not.

**Both routes must match.** Divergence between these two write paths is the defect we avoided on 11 August and again on 21 August.

---

## Deliberately NOT in this patch

**PII hashing.** `recordSubmissionIdentifiers` accepts `hashedEmail` and `hashedPhone`, and they are left unset.

The relay hashes phone as SHA-256 of an **E.164-normalised** string (`normalizeToE164` → `+91XXXXXXXXXX`), and email as SHA-256 of lowercase-trimmed. If the landing page hashed with even slightly different normalisation, the two hashes would never match and nothing would report an error — the observation log would simply hold values that join to nothing.

That is a silent-mismatch risk, so it gets its own step where the normalisation can be made byte-identical to the relay's and tested against a known pair. **Shipping less here is the right trade.**

---

## Verification after deploy

**Before the IAM grant** — submit a test lead. Expect it to succeed exactly as today, with a Firestore permission error in the Vercel function log. That error is the correct behaviour and proves the swallow works.

**After the grant** — submit with `?gclid=test123`, then check Firestore:

```
analytixlabs-ads → clients/4064995850/identifiers/{sclx_id}/observations/
```

Expect two documents: one `identifier_type: gclid` carrying `click_timestamp` and `click_timestamp_iso`, one `identifier_type: prospect_id`.

**Then submit without a gclid.** Expect **one** document — `prospect_id` only, no gclid row. That absence is the point: the log must distinguish "never had a click id" from "had one", because that distinction is the account-wide attach rate we currently cannot compute.

---

## Sequencing

```
1  cookie verification                    ✅ 20 Aug
2  client capture → sheet                 ✅ 21 Aug, live, verified on real leads
3  identifier log + wiring                ← this patch (IAM grant pending)
4  relay reads it at day 5                next — the piece that stops the rejections
5  account-wide attach rate               after 3, once data accumulates
```

Step 4 is where the value is realised. Everything before it is capture; step 4 is the first time a captured click timestamp changes an upload decision — and it is what lets the day-5 push select the GCLID whose click is **inside** Google's window rather than the most recent one. That is new delivery, not cleaner accounting.
