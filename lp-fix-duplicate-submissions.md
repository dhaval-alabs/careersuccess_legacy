# LP fix — duplicate lead submissions on OTP resend

**Repo:** `dhaval-alabs/careersuccess_legacy`
**File:** `components/HeroLeadCaptureForm.tsx`
**Severity:** live data-quality defect. One real lead produced **8 CRM records and 8 sheet rows** on 22 Aug.

---

## What happened

Lead `sakhan989763@gmail.com`, 22 Aug, same email, same GCLID, same `sclx_id` — **eight submissions**:

```
17:49:28   ← genuine
17:50:13   17:50:15   17:50:16   17:50:17
17:50:18.178   17:50:18.394   17:50:18.628      ← six inside 5 seconds
```

`time_on_page` climbs 74 → 124 across them, so she never left the page.

## Root cause

```ts
const handleResendOtp = async () => {
  setOtpValue(''); setErrorMsg(''); setToken('');
  await processLeadSubmissionAndSendOtp(mobile, preferredCallbackTime);
};
```

**`processLeadSubmissionAndSendOtp` fires BOTH `submit-lead` and `otp/send`.** So "Resend OTP" does not resend an OTP — it re-submits the whole lead: a new sheet row, a new LSQ create-or-update, and now a new identifier-log write.

And the Resend button carries **no `disabled` attribute**, unlike every other button in the form:

```tsx
<button type="button" onClick={handleResendOtp} className="text-[#239bf5] font-bold hover:underline">
```

The pattern fits exactly: one submission, a 45-second wait for an OTP that did not arrive, then repeated clicking.

## Why the existing guard does not catch it

`setIsSendingOtp(true)` sits *inside* `processLeadSubmissionAndSendOtp`, and the initial call is wrapped in `setTimeout(..., 1800)` — so there is a 1.8-second window with no guard at all. Worse, `isSendingOtp` is React state: reading it to guard is unreliable under stale closures and async batching. **A boolean state flag is the wrong primitive for an in-flight lock.**

---

## Fix

### 1. A synchronous in-flight ref

Alongside the other `useState` declarations:

```ts
// In-flight lock. A useRef, not useState, deliberately: refs update
// synchronously, so two clicks in the same tick cannot both read `false`.
// State updates are batched and closures capture stale values, which is why
// the existing isSendingOtp flag did not prevent 8 submissions on 22 Aug.
const submissionInFlightRef = useRef(false);
```

Add `useRef` to the React import if it is not already there.

### 2. Lock at the top of the shared function

```ts
  const processLeadSubmissionAndSendOtp = async (targetPhone: string, targetCallback: string) => {
    // Guard BOTH entry points — the initial submit and handleResendOtp — with
    // one lock, because both call this function and both were unguarded.
    if (submissionInFlightRef.current) {
      console.warn('[ConversationalForm] submission already in flight — ignoring duplicate');
      return;
    }
    submissionInFlightRef.current = true;

    setIsSendingOtp(true);
    setFormError('');
    setErrorMsg('');
```

**Release it in a `finally`** so an exception cannot leave the form permanently locked. Wrap the existing body from `const utms = getStoredUtm();` to the end of the function:

```ts
    try {
      // ... entire existing body, unchanged ...
    } finally {
      submissionInFlightRef.current = false;
    }
  };
```

If there are early `return`s inside the body, `finally` still runs — that is the reason for using it rather than clearing the ref at the end.

### 3. Separate resend from re-submission — the real fix

The lock stops the burst, but "Resend OTP" re-submitting the lead is wrong independently of how fast it is clicked. A user who waits 60 seconds and clicks resend once still gets a second CRM record.

```ts
  const handleResendOtp = async () => {
    setOtpValue(''); setErrorMsg(''); setToken('');
    // Resend must NOT re-submit the lead. The lead was already created on the
    // first pass; sending it again produces a duplicate CRM record and a
    // duplicate sheet row. Only the OTP is re-requested.
    await sendOtpOnly(mobile);
  };
```

And a function that calls **only** the OTP endpoint:

```ts
  // OTP-only resend. Mirrors step 2 of processLeadSubmissionAndSendOtp with
  // skipSheets: true — the sheet row and CRM record already exist.
  const sendOtpOnly = async (targetPhone: string) => {
    if (submissionInFlightRef.current) return;
    submissionInFlightRef.current = true;
    setIsSendingOtp(true);
    try {
      const utms = getStoredUtm();
      const identity = captureIdentity();
      const res = await fetch('https://lp-vercel.analytixlabs.co.in/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, city, status, countryCode,
          mobile: targetPhone,
          form_source: sourceName,
          typeFilter: typeFilter || 'PPC_HeroForm_Conversational',
          course,
          ...utms,
          submission_timestamp: new Date().toISOString(),
          landing_page_url: typeof window !== 'undefined' ? window.location.href : '',
          sclx_id: identity.sclxId,
          click_timestamp: identity.clickTimestamp,
          click_id_source: identity.clickIdSource,
          skipSheets: true,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || 'Could not resend the code. Please try again.');
      }
    } catch (err) {
      console.error('[ConversationalForm] resend error:', err);
      setErrorMsg('Could not resend the code. Please try again.');
    } finally {
      setIsSendingOtp(false);
      submissionInFlightRef.current = false;
    }
  };
```

**`skipSheets: true` is essential** — without it the OTP route appends its own sheet row and the duplicate returns by a different path.

### 4. Disable the Resend button while in flight

Line ~730, currently the only button in the form with no `disabled`:

```tsx
<button
  type="button"
  onClick={handleResendOtp}
  disabled={isSendingOtp}
  className="text-[#239bf5] font-bold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
>
```

The ref is the real protection; this is so the user can see why nothing happens.

---

## Check the other two forms

`components/forms/LeadCaptureForm.tsx` and `LeadCaptureForm-ContactUs.tsx` both call `otp/send`. **Check whether either has a resend path with the same shape.** If a resend there calls a function that also submits the lead, apply the same fix — do not assume it differs.

This is a class of defect, not one instance. The pattern has already cost a fortnight elsewhere in this project: a correct fix applied to the file being looked at and not to its siblings.

---

## Verification

1. Submit a lead, then click **Resend OTP** three times rapidly.
2. **Sheet:** exactly **one** new row. Previously eight.
3. **LSQ:** exactly one lead, not one plus updates.
4. **Firestore:** exactly one set of observations under that `sclx_id`.
5. The OTP should still actually arrive on resend — that is the function the fix must not break.
6. Console should show `submission already in flight` on the rapid clicks.

---

## Why this matters beyond tidiness

**CPL is measured from this sheet.** A lead count that includes duplicates overstates volume and understates cost per lead — and CPL is the client-facing number about to be standardised, with three figures (₹417, ₹468, ₹741) already in circulation on three different bases.

A 3× instance of this was seen on 21 Aug and treated as noise. At 8× it is not noise, and it has been inflating the denominator for an unknown period.

**One thing this fix does not do:** it does not deduplicate the existing rows. Any historic count from this sheet still carries whatever duplication is already in it. Worth a separate dedupe pass on email+GCLID before CPL is quoted.
