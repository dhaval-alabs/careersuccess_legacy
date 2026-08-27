# LP fix — LSQ attribute name, and one thing deliberately NOT fixed

**Repo:** `dhaval-alabs/careersuccess_legacy`
**Severity:** live CRM write failure. Silently losing OTP verification status.
**Scope:** ONE line, ONE file. See §3 for what is excluded and why.

---

## 1. The defect

`app/api/otp/verify/route.ts:96`

```ts
payload.push({ Attribute: 'mx_Preferred_Callback_Time', Value: preferredCallbackTime });
```

**`mx_Preferred_Callback_Time` does not exist in LeadSquared.** Verified against the live schema — 149 lead fields, no such attribute.

**LSQ rejects the ENTIRE update when any attribute is unknown.** The payload is:

```ts
const payload = [{ Attribute: 'mx_OTP_Status', Value: 'Verified' }];
if (preferredCallbackTime) payload.push({ Attribute: 'mx_Preferred_Callback_Time', ... });
```

So whenever a lead supplies a callback time, the update fails with `MXUnknownAttributeException` and **`mx_OTP_Status: 'Verified'` never writes either.**

Consequences, per affected lead:
- stays **Unverified** in the CRM despite passing OTP
- callback preference lost entirely
- LP returns 200; the user sees success; only the Vercel log knows

`Verified Lead | Eligibility` is a conversion action we report on, so this has also been suppressing a counted signal.

**Confirmed live 27 Aug:** `[Verify] LSQ Update Failed: {"Status":"Error","ExceptionType":"MXUnknownAttributeException…`

**And it has never worked.** 200 leads sampled across 25–27 Aug: `mx_Preferred_Date_Time` is `null` on every single one. Not a regression — it has failed since it shipped.

---

## 2. The fix

```ts
payload.push({ Attribute: 'mx_Preferred_Date_Time', Value: preferredCallbackTime });
```

That is the whole change. One line, one file, one call site — the other four routes that handle `preferredCallbackTime` do not send it to LSQ, so nothing else needs touching.

### Why `mx_Preferred_Date_Time` and not the other candidate

Two similarly-named fields exist. The wrong one would have failed twice over:

| | `mx_Preferred_Date_Time` ✅ | `mx_Preferred_Date_And_Time` ❌ |
|---|---|---|
| DataType | **Text**, 255 | **Date**, 50 |
| RenderType | Textbox | Datetime |
| `LockAfterCreate` | **0** | **1** — cannot be updated after creation |

The value we send is free text — the LP builds `` `${selectedDate} at ${selectedTime}` ``, e.g. `2026-08-28 at 14:30`. That is not a parseable Datetime, so the `Date` field would reject it on format. And `LockAfterCreate: 1` means an *update* to it is refused regardless — and `otp/verify` is always an update on an existing lead.

**Do not "improve" this to the more plausible-sounding name.** It was checked against the schema; the plausible one is wrong on both type and lock.

---

## 3. NOT in this patch — the status field

There is a second, related gap. **Do not attempt it in this change.**

The chat's qualification answer — *"Working professional / Fresher / Student / Between jobs"* — is written into `mx_Extra_Notes` as a `Status: …` text line rather than to a field of its own, per the comment at line 220: *"Consolidating all fields that failed the 412 schema check into this field."*

That makes it unfilterable and unreportable, and `mx_Extra_Notes` is 255 chars with fifteen lines plus a landing-page URL packed into it — the `Submission URL:` line is already observed truncating.

**Why it is excluded:** the plausible destination fields are all `Select` type, not Text:

```
mx_Lead_Profile                    Select · 100
mx_Work_Experience                 Select · 100
mx_What_is_your_experience_level   Select · 100
```

A `Select` only accepts its predefined dropdown options. Sending `"Working professional"` to one whose option list has not been read would fail with **the same class of error this patch is fixing** — and would again take the whole payload down with it.

**Prerequisite before anyone attempts it:** read the dropdown option values for the chosen field (LSQ API: dropdown values for a lead field) and confirm the LP's four answers map exactly, or add the missing options. Then, and only then, move `Status:` out of the notes blob.

Guessing at a field name is what caused §1. Not repeating it in the same commit.

---

## 4. Verification

1. Submit a lead through the **Hero conversational form** and **choose a preferred callback time** — that is the only path that triggers it.
2. Complete OTP verification.
3. **Vercel log:** no `[Verify] LSQ Update Failed`.
4. **LSQ, on that lead:**
   - `mx_OTP_Status` = `Verified` ← this is the important one, it was silently failing
   - `mx_Preferred_Date_Time` = the chosen slot, e.g. `2026-08-28 at 14:30`
5. Submit a second lead **without** choosing a callback time. `mx_OTP_Status` should still be `Verified` — that path was never broken and must not regress.

Step 5 matters: the bug only fires when the optional attribute is present, so a fix that broke the common path would look like success on step 4 alone.
