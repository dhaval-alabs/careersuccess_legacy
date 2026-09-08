# LP changes — `mx_sclx_id` to LSQ + three identifier-log fixes

**Repo:** `dhaval-alabs/careersuccess_legacy`
**Date:** 1 Sep 2026
**Files:** `app/api/submit-lead/route.ts`, `app/api/otp/send/route.ts`

Four changes. Item 1 is the new work. Items 2–4 are defects found while verifying the identifier log; all three are one-to-three lines each and independent of item 1.

Please do them as one PR but as four separate commits, so each can be reverted alone.

---

## Why this matters (one paragraph)

The relay pushes offline conversions to Google Ads five days after a lead is created. Google rejects a GCLID whose click is outside the conversion window, and we currently have no idea when the click actually happened — we only know when the form was submitted. The real click time is already sitting in the browser inside the `_gcl_aw` cookie (`GCL.{timestamp}.{gclid}`), and as of the capture layer we now log it to Firestore.

What's missing is the join. The relay knows a lead's LSQ `prospectId`; the Firestore observation log is keyed by `sclx_id`. Nothing connects them. Item 1 supplies that link.

---

## 1. Pass `sclx_id` to LSQ as `mx_sclx_id`

**Status: unblocked.** The custom lead field was approved and is live. Verified against LSQ metadata on 1 Sep:

```
SchemaName            mx_sclx_id      <-- use exactly this
DisplayName           sclx_id
DataType              Text
RenderTypeTextValue   Textbox
MaxLength             256
IsMandatory           false
LockAfterCreate       0
```

Note the single `mx_` prefix. Several existing fields in this account have a doubled prefix (`mx_mx_UTM_Campaign`, `mx_mx_UTM_Source`, etc.) because their display names were themselves entered as `mx_...`. This one does not. **Use `mx_sclx_id`, not `mx_mx_sclx_id`.**

### What to change

In `submit-lead/route.ts`, add one entry to the `payload` array where the other attributes are built:

```ts
{ Attribute: 'mx_sclx_id', Value: sclxId ?? '' },
```

Use the same `sclx_id` value that is already passed to `recordSubmissionIdentifiers` further down the file — do not re-read the cookie or re-derive it, or the two can diverge.

**This single addition covers both LSQ paths.** The create branch posts `payload` directly to `Lead.Capture`; the update branch builds `updatePayload = payload.filter(...)`, which only strips `EmailAddress` and `Phone`. So the attribute flows through both without a second edit. Please confirm that when testing rather than assuming.

Make the same addition in `otp/send/route.ts`, which has its own `Lead.Capture` and `Lead.Update` calls.

### Constraints

- The field is **Text**, so any string is safe. Do not send it as a Select value.
- `LockAfterCreate` is 0, so the update path can write it on repeat submitters. Repeat submitters must get it too, or existing leads stay blank forever.
- If `sclxId` is somehow absent, send an empty string rather than omitting the attribute or sending `null`.

### Do not send `"-"`

LSQ returns the literal string `"-"` for unset custom fields on read. The relay already has to special-case that for `mx_gclid`. Please don't write `"-"`, `"null"`, `"n/a"`, or `"undefined"` as a value — empty string only.

---

## 2. Read the lead id back from `Lead.Capture`

**This is a real defect and it affects the majority of leads.**

`prospectId` is initialised to `null` at `submit-lead/route.ts:262` and is only ever assigned from a *lookup of an existing lead* (lines 272, 283, 286 — from `RetrieveLeadByPhoneNumber` / `Leads.GetByEmailaddress`). The create branch calls `Lead.Capture` and never reads the response body.

Result: for a **first-time submitter**, `prospectId` stays `null`, so the `prospectId: prospectId ?? undefined` argument at line ~361 is undefined, and `recordSubmissionIdentifiers` skips the `prospect_id` observation entirely (it is written only `if (input.prospectId)`).

Verified in Firestore on two leads with opposite outcomes:

| `sclx_id` | Observations | Interpretation |
|---|---|---|
| `sclx_01M1CDZYHK1J6T6CWA6G9P0HED` | 1 — `gclid` only | first-time submitter, `prospectId` was null |
| `sclx_01M1EMGGR3762ZH7WZ14A7WVQY` | 2 — `gclid` + `prospect_id` | matched an existing lead, `prospectId` was set |

### What to change

Parse the `Lead.Capture` response and assign `prospectId` before the `recordSubmissionIdentifiers` call:

```ts
// Lead.Capture returns { "Status": "Success", "Message": { "Id": "<prospect-id>" } }
const captureJson = await response.clone().json().catch(() => null);
const capturedId = captureJson?.Message?.Id;
if (!prospectId && typeof capturedId === 'string' && capturedId.length > 0) {
  prospectId = capturedId;
}
```

Use `response.clone()` — the body is read again further down for error handling, and a `Response` body can only be consumed once.

### One thing to get right

On the **`Lead.Capture`** endpoint, `Message.Id` is the lead/prospect id. That is the endpoint used here (`submit-lead/route.ts:8`, `otp/send/route.ts:7`), so `Message.Id` is correct.

Be aware that on LSQ's *create-lead-and-activity* endpoints the convention differs — there `Message.Id` is the **activity** id and `Message.RelatedId` is the lead id. If either route is ever switched to one of those endpoints, this code must change with it. Writing activity UUIDs into the observation log would look completely correct and be silently wrong.

Please log the captured id once at info level on first implementation so we can eyeball a few against LSQ before trusting it.

Same change needed in `otp/send/route.ts`, which has the same create branch.

---

## 3. `await` the identifier-log write

`recordSubmissionIdentifiers(...)` is called without `await` in both files, and the response is returned about two lines later.

On Vercel the serverless function is frozen once the response is sent, so pending promises are dropped. Whether an observation lands is a race between the Firestore round trip (OAuth token fetch on a cold start, then up to four `PATCH` calls) and the response being sent.

**Measured impact: 3 of 88 post-fix `sclx_id`s have no Firestore document — 96.6% landing rate.** So the loss is real but small. Worth fixing; not an emergency.

### What to change

```ts
await recordSubmissionIdentifiers({ ... }).catch(() => { /* already logged internally */ });
```

The existing `.catch()` guarantees this cannot throw, so adding `await` does **not** reintroduce any risk of failing a lead capture. The stated intent — "must not be able to fail a lead capture" — is satisfied by the catch, not by the missing await.

Note the same file already does exactly this for the sheet write, with the comment *"Await to ensure it completes on Vercel."* The correct pattern is three lines above the incorrect one.

Cost is one added round trip on the response path — the same cost already accepted for `pushToGoogleSheets`.

**If the added latency is a concern**, the alternative is `waitUntil` from `@vercel/functions`, which lets the work continue after the response is sent. That is the better long-term shape. Your call — it is a new dependency, and for a ~200ms write recovering 3% I would just take the `await`. Please say which you chose.

---

## 4. Stop double-writing observations

Every submission writes its observations **twice**.

`HeroLeadCaptureForm` calls `submit-lead` and then `otp/send` with `skipSheets: true`. That flag correctly suppresses `pushToGoogleSheets` in `otp/send` — the log line says *"Skipping Google Sheets push since lead was already submitted"* — but the `recordSubmissionIdentifiers` call sits **outside** that guard, so it runs both times.

Verified on `sclx_01M1E9JNM7PE820H5YJ803GMW3`, four observation documents:

```
01M1E9JRG0XKKVEPHQPGTT25MX   10:52:31.104 UTC
01M1E9JRG28S0696DZSQQ1FZBZ   10:52:31.106 UTC
01M1E9JWBZBQB8T3T16J9WEY49   10:52:35.071 UTC
01M1E9JWC0ZNSPBG8M3TPYXTBT   10:52:35.072 UTC
```

Two pairs, 2 ms apart within each pair, **3.97 s between pairs** — two separate calls, each writing `gclid` + `prospect_id`.

### What to change

Move the `recordSubmissionIdentifiers` call in `otp/send/route.ts` inside the same condition that guards the sheet push, or extend the `skipSheets` check to cover it.

Your call on which. If `skipSheets` is going to gate more than sheets, it is probably worth renaming to something like `skipLeadSideEffects` — but that is a wider rename and I would not block this PR on it.

**Not urgent.** The log is append-only by design and the relay will read all `gclid` observations for an `sclx_id` and pick the in-window one, so duplicates collapse harmlessly on read. Real costs are ~2× Firestore write volume and any future "observations per lead" count being inflated.

---

## Testing

Please confirm all five, ideally with real submissions rather than only local:

1. **New lead** → LSQ lead has `mx_sclx_id` populated, and it matches the `sclx_id` in the PPC sheet column Y for the same submission.
2. **Repeat submitter** (same email as an existing lead) → `mx_sclx_id` is populated on the *updated* lead too. This is the one most likely to be missed.
3. **New lead** → Firestore now has **two** observations, `gclid` and `prospect_id`, and the `prospect_id` value matches the lead's actual ProspectID in LSQ. This is the item 2 fix.
4. **Any lead** → exactly **two** observations per submission, not four. This is the item 4 fix.
5. **Regression check** — the PPC sheet still gets exactly one row per submission, and OTP send/verify/resend still behave normally. Items 3 and 4 touch code adjacent to both.

Firestore path for checking:
```
clients/4064995850/identifiers/{sclx_id}/observations
```
Project `analytixlabs-ads`. **The database is named `default`, not `(default)`** — this has bitten us twice and silently 404s.

---

## Out of scope, noted for later

`recordSubmissionIdentifiers` accepts `hashedEmail` and `hashedPhone` and writes `email_sha256` / `phone_sha256` observations, but **neither call site passes them**, so two of the five observation types are dead code. Not needed for the current work. It will matter when we do Enhanced Conversions matching properly. No action now.

---

## Questions back to me

- Anything in item 1 that does not flow through the `updatePayload` filter as expected.
- Whether you took `await` or `waitUntil` for item 3.
- Whether `Message.Id` from `Lead.Capture` matches the real ProspectID on the leads you test — please verify on two or three before we rely on it.
