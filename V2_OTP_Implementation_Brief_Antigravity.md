# WhatsApp OTP Verification — Implementation Brief
## AnalytixLabs CareerSuccess LP
**Prepared for:** Antigravity  
**Date:** April 2026  
**Commit message (when done):** `feat: add whatsapp otp verification to hero lead capture form`

---

## 1. Overview

Add WhatsApp OTP verification to the **Hero lead capture form only** on all 5 PPC landing pages. All modal forms (Eligibility, Brochure, Demo) are **not touched**.

OTP is sent directly via the **Meta WhatsApp Cloud API** using AnalytixLabs' own WABA credentials. No third-party relay (Xbot or otherwise) is involved in the OTP flow.

**If WhatsApp delivery fails for any reason, the form falls back silently to a standard non-OTP lead submission.** The user is never blocked.

---

## 2. How It Works — End to End

```
User fills form → enters 10-digit mobile → [Send OTP] activates
                                                ↓
                              Next.js generates 4-digit OTP server-side
                              Creates lead in LSQ (mx_OTP_Status: Unverified)
                              Writes row to Sheets col Q (Unverified)
                              Calls Meta Cloud API → WhatsApp message sent
                              Returns signed HMAC token to client
                                                ↓
                              Mobile field → 4-digit OTP input
                              User enters OTP → [Verify]
                                                ↓
                              Server validates HMAC (OTP never stored)
                                    ↓                    ↓
                               Valid OTP             Invalid OTP
                                  ↓                      ↓
                    LSQ → mx_OTP_Status: Verified    "Incorrect OTP"
                    Sheets col Q → Verified           Retry / Resend
                    onSuccess() → fireConversion()
                    Redirect → Thank You page
```

---

## 3. Files to Create (New)

| File | Purpose |
|---|---|
| `components/HeroLeadCaptureForm.tsx` | OTP-enabled hero form — replaces `LeadCaptureForm` in hero section only |
| `app/api/otp/send/route.ts` | Generates OTP, creates LSQ lead, writes Sheets, calls Meta API, returns HMAC token |
| `app/api/otp/verify/route.ts` | Validates HMAC, updates LSQ + Sheets to Verified |

---

## 4. Files to Modify

| File | Change |
|---|---|
| `app/data-science-specialization-course-lg/page.tsx` | Replace hero `LeadCaptureForm` with `HeroLeadCaptureForm` |
| `app/data-science-ai-course-delhi/page.tsx` | Same |
| `app/data-science-ai-course-noida/page.tsx` | Same |
| `app/data-science-ai-course-gurgaon/page.tsx` | Same |
| `app/data-science-ai-course-bangalore/page.tsx` | Same |

---

## 5. Files NOT to Touch

```
components/LeadCaptureForm.tsx          ← untouched
components/Modal.tsx                    ← untouched
components/FAQ.tsx                      ← untouched
app/api/track-conversion/route.ts       ← untouched
app/globals.css                         ← untouched
tailwind.config.ts                      ← untouched
app/layout.tsx                          ← untouched
```

**Modal form instances in page.tsx files are NOT changed.** Only the hero section `LeadCaptureForm` instance is replaced per page.

---

## 6. New Environment Variables

Add all three to Vercel dashboard — all environments (Production, Preview, Development):

```
OTP_HMAC_SECRET=<generate with: openssl rand -hex 32>
META_WA_ACCESS_TOKEN=EAAFn70zewwUBOwX00xIoEnrQ3rcQY73ZBsCBWGZAOn5dc5Nqs5HobQFOqU5v4aZC29H7xqtyBGJhoZCfBXw98rhNeDgnAcvJkJJYnBZAHjeAa7tRQX7MPwZCaLPprwZB4BiuWUIfWxjtSPulAmXaVb4J1l9AdPxZCIhR5ibUwrzHQKTfq6A0MDbCZCJiOTBkZAeucz
META_WA_PHONE_NUMBER_ID=105143282358005
```

> `META_WA_ACCESS_TOKEN` is a long-lived token. If WhatsApp delivery stops working in future, this token may have expired and needs refreshing in Meta Business Manager.

---

## 7. Google Sheets — Status Column

**Sheet name:** `Career Success G Sheet`  
**Worksheet/tab:** `NextJS`  
**This is the only sheet Next.js writes to. Do not write to `OTP Form Leads` — that sheet is not managed by Next.js.**

The NextJS tab already has data in columns A–P from the existing lead action integration.

- **Column Q header** = `OTP_Status`
- Append `Unverified` in column Q when lead is created at Send OTP time
- Append `Fallback` in column Q when Meta API delivery fails
- Update column Q from `Unverified` → `Verified` when OTP is successfully verified
- For all other existing leads (non-OTP modal forms), column Q is left blank

---

## 8. WhatsApp Template Reference

| Detail | Value |
|---|---|
| Template name | `form_otp` |
| Language | `en` |
| Body text | `Please use {{1}} as OTP at AnalytixLabs.` |
| Variable `{{1}}` | The 4-digit OTP generated server-side |
| Phone Number ID | `105143282358005` |
| API version | `v17.0` |

---

## 9. API Route: `/api/otp/send`

**File:** `app/api/otp/send/route.ts`

### Request
```
POST /api/otp/send
Content-Type: application/json
```

Body fields:
```typescript
{
  name:         string;   // full name
  email:        string;
  city:         string;   // from dropdown
  countryCode:  string;   // e.g. "+91"
  mobile:       string;   // 10 digits, no country code
  form_source:  string;   // e.g. "lp_blr_submit_lead_primary"
  typeFilter:   string;   // e.g. "PPC_CheckEligibility"
  // ...all UTM fields from getStoredUtm()
  // ...all behaviour fields from getBehaviourSnapshot()
}
```

### Server Logic — Step by Step

**Step 1 — Generate OTP and HMAC token (server-side only)**

```typescript
import crypto from 'crypto';

// Generate 4-digit OTP — server-side only, never sent to client
const otp = String(crypto.randomInt(1000, 9999));

// Sign it — expiry 10 minutes
const expiry = Date.now() + 10 * 60 * 1000;
const payload = `${mobile}:${otp}:${expiry}`;
const hmac = crypto
  .createHmac('sha256', process.env.OTP_HMAC_SECRET!)
  .update(payload)
  .digest('hex');
const token = Buffer.from(JSON.stringify({ expiry, hmac })).toString('base64');
```

> The OTP is never stored anywhere and never returned to the client. The HMAC token contains only the expiry timestamp and signature. Verification works by recomputing the HMAC server-side with the user-entered OTP.

**Step 2 — Call Meta WhatsApp Cloud API**

```typescript
const waResponse = await fetch(
  `https://graph.facebook.com/v17.0/${process.env.META_WA_PHONE_NUMBER_ID}/messages`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.META_WA_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: `${countryCode.replace('+', '')}${mobile}`, // e.g. "919876543210"
      type: 'template',
      template: {
        name: 'form_otp',
        language: { code: 'en' },
        components: [{
          type: 'body',
          parameters: [{ type: 'text', text: otp }],
        }],
      },
    }),
    signal: AbortSignal.timeout(8000), // 8 second timeout
  }
);

const waSuccess = waResponse.ok;
```

**Step 3 — Determine OTP status based on delivery result**

```typescript
const otpStatus = waSuccess ? 'Unverified' : 'Fallback';
```

**Step 4 — Create lead in LSQ**

Use the same LSQ API call as the existing `createLeadAction`. Add one extra field:

```json
{ "Attribute": "mx_OTP_Status", "Value": "<otpStatus>" }
```

All other fields (UTMs, behaviour, form_source, typeFilter, name, email, city, mobile, etc.) are sent exactly as the existing lead action sends them.

**Step 5 — Write to Google Sheets**

Append a row to the **`NextJS` tab** of **`Career Success G Sheet`** using the same Sheets logic as the existing lead action. Set column Q (`OTP_Status`) to `otpStatus` (`Unverified` or `Fallback`).

**Step 6 — Return response to client**

```typescript
// WhatsApp delivered — OTP flow continues
if (waSuccess) {
  return { success: true, token }
}

// WhatsApp failed — lead already created, proceed as Fallback
return { success: true, fallback: true }

// LSQ or Sheets hard failure — show error
return { success: false, error: 'Something went wrong. Please try again.' }
```

> Xbot is not called at any point in this route.

---

## 10. API Route: `/api/otp/verify`

**File:** `app/api/otp/verify/route.ts`

### Request
```
POST /api/otp/verify
Content-Type: application/json
```

Body fields:
```typescript
{
  token:        string;  // HMAC token from /api/otp/send response
  otp_entered:  string;  // 4-digit code entered by user
  mobile:       string;  // 10 digits, no country code
  countryCode:  string;  // e.g. "+91"
  name:         string;  // for logging only
  email:        string;  // for logging only
}
```

### Server Logic — Step by Step

**Step 1 — Validate HMAC token**

```typescript
import crypto from 'crypto';

const { expiry, hmac } = JSON.parse(Buffer.from(token, 'base64').toString());

// Check expiry
if (Date.now() > expiry) {
  return { success: false, error: 'OTP expired. Please request a new one.' };
}

// Recompute HMAC with the OTP the user entered
const payload = `${mobile}:${otp_entered}:${expiry}`;
const expected = crypto
  .createHmac('sha256', process.env.OTP_HMAC_SECRET!)
  .update(payload)
  .digest('hex');

// Timing-safe comparison — prevents timing attacks
const valid = crypto.timingSafeEqual(
  Buffer.from(hmac, 'hex'),
  Buffer.from(expected, 'hex')
);

if (!valid) {
  return { success: false, error: 'Incorrect OTP. Please try again.' };
}
```

**Step 2 — Update LSQ lead to Verified**

```
// a. Retrieve ProspectID by phone
GET https://api-in21.leadsquared.com/v2/LeadManagement.svc/RetrieveLeadByPhoneNumber
  ?accessKey={LSQ_ACCESS_KEY}
  &secretKey={LSQ_SECRET_KEY}
  &phone={countryCode}{mobile}    // e.g. +919876543210

// b. Update lead
POST https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Update
  ?accessKey={LSQ_ACCESS_KEY}
  &secretKey={LSQ_SECRET_KEY}
  &leadId={ProspectID}

Body (JSON):
[{ "Attribute": "mx_OTP_Status", "Value": "Verified" }]
```

**Step 3 — Update Google Sheets column Q**

In the **`NextJS` tab** of **`Career Success G Sheet`**, find the row where the Phone column matches `{countryCode}{mobile}` (e.g. `+919876543210`). Update column Q (`OTP_Status`) from `Unverified` to `Verified`.

**Step 4 — Return response**

```typescript
// Success
return { success: true }

// HMAC invalid or expired — only cases that return false
return { success: false, error: '...' }

// If LSQ or Sheets update fails — still return success, log error server-side
// Lead is verified — do not block the user over a background update failure
```

---

## 11. Component: `HeroLeadCaptureForm.tsx`

**File:** `components/HeroLeadCaptureForm.tsx`

### Props interface — identical to `LeadCaptureForm.tsx`

```typescript
interface HeroLeadCaptureFormProps {
  sourceName?:   string;
  buttonText?:   string;
  title?:        string;
  typeFilter?:   string;
  thankYouPath?: string;
  onSuccess?:    (email: string) => void;
}
```

### State variables needed

```typescript
const [name, setName]               = useState('');
const [email, setEmail]             = useState('');
const [city, setCity]               = useState('');
const [countryCode, setCountryCode] = useState('+91');
const [mobile, setMobile]           = useState('');

type OtpState = 'idle' | 'sending' | 'otp_sent' | 'verifying' | 'error';
const [otpState, setOtpState]       = useState<OtpState>('idle');
const [otpValue, setOtpValue]       = useState('');
const [token, setToken]             = useState('');
const [errorMsg, setErrorMsg]       = useState('');
const [resendTimer, setResendTimer] = useState(0);
const [formError, setFormError]     = useState('');
```

### OTP state machine

| State | Mobile field | Button text | Button active |
|---|---|---|---|
| `idle` — mobile < 10 digits | Phone input | Send OTP | No (gray) |
| `idle` — mobile = 10 digits | Phone input | Send OTP | Yes (teal) |
| `sending` | Phone input (readonly) | Sending... | No (spinner) |
| `otp_sent` — OTP < 4 digits | 4-digit OTP input | Verify | No (gray) |
| `otp_sent` — OTP = 4 digits | 4-digit OTP input | Verify | Yes (teal) |
| `verifying` | 4-digit OTP input (readonly) | Verifying... | No (spinner) |
| `error` | 4-digit OTP input | Verify | Yes (teal) |

### handleSendOtp

```typescript
async function handleSendOtp() {
  setOtpState('sending');
  setErrorMsg('');

  const utms = getStoredUtm();
  const behaviour = getBehaviourSnapshot();

  const res = await fetch('/api/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name, email, city, countryCode, mobile,
      form_source: sourceName,
      typeFilter,
      ...utms,
      ...behaviour,
    }),
  });

  const data = await res.json();

  if (!data.success) {
    // LSQ/Sheets hard failure
    setOtpState('idle');
    setFormError(data.error || 'Something went wrong. Please try again.');
    return;
  }

  if (data.fallback) {
    // Meta delivery failed — proceed as normal non-OTP submission
    // Lead already in LSQ + Sheets with OTP_Status: Fallback
    onSuccess?.(email);
    const params = new URLSearchParams({ email, name, phone: mobile });
    window.location.href =
      `${thankYouPath ?? '/thankyou-check-your-eligibility'}?${params.toString()}`;
    return;
  }

  // OTP sent successfully
  setToken(data.token);
  setOtpState('otp_sent');

  // Start 30-second resend countdown
  setResendTimer(30);
  const interval = setInterval(() => {
    setResendTimer(prev => {
      if (prev <= 1) { clearInterval(interval); return 0; }
      return prev - 1;
    });
  }, 1000);
}
```

### handleVerify

```typescript
async function handleVerify() {
  setOtpState('verifying');
  setErrorMsg('');

  const res = await fetch('/api/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      otp_entered: otpValue,
      mobile,
      countryCode,
      name,
      email,
    }),
  });

  const data = await res.json();

  if (!data.success) {
    setOtpState('error');
    setErrorMsg(data.error || 'Verification failed. Please try again.');
    setOtpValue('');
    return;
  }

  // Verified successfully
  onSuccess?.(email); // triggers fireConversion in page.tsx
  const params = new URLSearchParams({ email, name, phone: mobile });
  window.location.href =
    `${thankYouPath ?? '/thankyou-check-your-eligibility'}?${params.toString()}`;
}
```

### handleResend

```typescript
async function handleResend() {
  setOtpValue('');
  setErrorMsg('');
  setToken('');
  setOtpState('idle');
  await handleSendOtp();
}
```

### Mobile field UI — inline Send OTP / Verify button

```tsx
{/* Normal state — phone input with inline Send OTP button */}
{otpState === 'idle' || otpState === 'sending' ? (
  <div className="flex gap-2 items-stretch">
    <select
      value={countryCode}
      onChange={e => setCountryCode(e.target.value)}
      disabled={otpState === 'sending'}
      className="w-20 flex-shrink-0 px-2 py-3 rounded-xl border border-[#D6ECEB] bg-white
                 text-[#09263F] text-sm font-semibold
                 focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/40 focus:border-[#1DE5B5]
                 transition-all duration-200 cursor-pointer disabled:opacity-60"
    >
      {COUNTRY_CODES.map(c => (
        <option key={c.code} value={c.code}>{c.label}</option>
      ))}
    </select>
    <div className="relative flex-1">
      <input
        type="tel"
        value={mobile}
        onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
        disabled={otpState === 'sending'}
        placeholder="10-digit mobile number"
        maxLength={10}
        onFocus={() => recordFirstField('mobile')}
        className="w-full pl-4 pr-28 py-3 rounded-xl border border-[#D6ECEB] bg-white
                   text-[#09263F] text-sm placeholder-[#9BBAC0]
                   focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/40 focus:border-[#1DE5B5]
                   transition-all duration-200 disabled:opacity-60"
      />
      <button
        type="button"
        onClick={handleSendOtp}
        disabled={mobile.length !== 10 || otpState === 'sending'}
        className={`absolute right-2 top-1/2 -translate-y-1/2
                    px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                    ${mobile.length === 10 && otpState !== 'sending'
                      ? 'bg-[#29E8A4] text-[#09263F] hover:bg-[#1DE5B5] cursor-pointer'
                      : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                    }`}
      >
        {otpState === 'sending' ? (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Sending
          </span>
        ) : 'Send OTP'}
      </button>
    </div>
  </div>
) : null}

{/* OTP input state */}
{(otpState === 'otp_sent' || otpState === 'verifying' || otpState === 'error') ? (
  <div className="space-y-2">
    <p className="text-xs text-[#29E8A4] font-semibold">
      OTP sent to your WhatsApp ({countryCode} {mobile})
    </p>
    <div className="relative">
      <input
        type="tel"
        value={otpValue}
        onChange={e => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 4))}
        disabled={otpState === 'verifying'}
        placeholder="Enter 4-digit OTP"
        maxLength={4}
        autoFocus
        className="w-full pl-4 pr-28 py-3 rounded-xl border border-[#D6ECEB] bg-white
                   text-[#09263F] text-sm placeholder-[#9BBAC0] tracking-widest
                   focus:outline-none focus:ring-2 focus:ring-[#1DE5B5]/40 focus:border-[#1DE5B5]
                   transition-all duration-200 disabled:opacity-60"
      />
      <button
        type="button"
        onClick={handleVerify}
        disabled={otpValue.length !== 4 || otpState === 'verifying'}
        className={`absolute right-2 top-1/2 -translate-y-1/2
                    px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                    ${otpValue.length === 4 && otpState !== 'verifying'
                      ? 'bg-[#29E8A4] text-[#09263F] hover:bg-[#1DE5B5] cursor-pointer'
                      : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                    }`}
      >
        {otpState === 'verifying' ? (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Verifying
          </span>
        ) : 'Verify'}
      </button>
    </div>

    {errorMsg && (
      <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
    )}

    <p className="text-xs text-[#4A6275]">
      {resendTimer > 0
        ? `Resend OTP in ${resendTimer}s`
        : (
          <button
            type="button"
            onClick={handleResend}
            className="text-[#239bf5] font-medium hover:underline"
          >
            Resend OTP
          </button>
        )
      }
    </p>
  </div>
) : null}
```

### Submit button behaviour

The main form submit button is **not shown** when `otpState` is `otp_sent`, `verifying`, or `error`. The Verify button inside the OTP field is the final action. When `otpState` is `idle` or `sending`, the submit button is present but calls `handleSendOtp` (not a form submit).

---

## 12. Updating page.tsx Files (All 5 Pages)

In each hero section, replace:

```tsx
// BEFORE
import LeadCaptureForm from '@/components/LeadCaptureForm';
// ...
<LeadCaptureForm
  sourceName="lp_blr_submit_lead_primary"
  thankYouPath="/thankyou-check-your-eligibility"
  onSuccess={(email) => {
    fireConversion('lp_blr_submit_lead_primary', gclid);
  }}
/>
```

With:

```tsx
// AFTER
import HeroLeadCaptureForm from '@/components/HeroLeadCaptureForm';
// ...
<HeroLeadCaptureForm
  sourceName="lp_blr_submit_lead_primary"
  thankYouPath="/thankyou-check-your-eligibility"
  onSuccess={(email) => {
    fireConversion('lp_blr_submit_lead_primary', gclid);
  }}
/>
```

**Do not change any other `LeadCaptureForm` instances in the same file (modal forms).**

---

## 13. Conversion Tracking — No Change Required

`fireConversion()` is called inside `onSuccess()` in page.tsx. `HeroLeadCaptureForm` calls `onSuccess(email)` at the same point — after verified or after fallback. No changes to conversion tracking logic.

---

## 14. LSQ Field Reference

`mx_OTP_Status` already exists in LeadSquared. No new field creation required.

**Google Sheets target:** `Career Success G Sheet` → `NextJS` tab → Column Q = `OTP_Status`

| Stage | mx_OTP_Status value | Sheets col Q (NextJS tab) |
|---|---|---|
| Send OTP — WhatsApp delivered | `Unverified` | `Unverified` |
| Send OTP — WhatsApp failed (fallback) | `Fallback` | `Fallback` |
| OTP verified successfully | `Verified` | `Verified` |
| Modal form submissions (unchanged) | *(not set)* | *(blank)* |

> `OTP Form Leads` sheet is not touched by Next.js at any point.

---

## 15. QA Checklist

| # | Test | Expected result |
|---|---|---|
| 1 | Enter 9 digits in mobile field | Send OTP button stays gray / disabled |
| 2 | Enter 10 digits in mobile field | Send OTP button turns teal / active |
| 3 | Click Send OTP with valid number | Spinner, OTP arrives on WhatsApp, 4-digit input appears |
| 4 | Check WhatsApp message | "Please use 1234 as OTP at AnalytixLabs." |
| 5 | Enter correct 4-digit OTP → Verify | Redirect to thank-you page |
| 6 | Enter incorrect OTP | Error shown, OTP field clears, Verify stays active |
| 7 | Wait 10+ minutes then verify | Server returns OTP expired error |
| 8 | Simulate Meta API failure (block env var) | Form submits silently as Fallback, redirects to thank-you |
| 9 | Check LSQ after Send OTP (normal) | Lead with mx_OTP_Status = Unverified |
| 10 | Check LSQ after Verify | mx_OTP_Status = Verified on same lead |
| 11 | Check LSQ after Fallback | mx_OTP_Status = Fallback |
| 12 | Check Sheets col Q after Send OTP | Unverified |
| 13 | Check Sheets col Q after Verify | Verified |
| 14 | Check Sheets col Q after Fallback | Fallback |
| 15 | Submit via Eligibility modal | Works as before, col Q blank |
| 16 | Resend before 30s | Countdown timer shown, resend not clickable |
| 17 | Resend after 30s | New OTP sent, new token issued, old token invalid |
| 18 | Check fireConversion | Fires after verify OR fallback — not at Send OTP |

---

## 16. Security Notes

- OTP generated server-side with `crypto.randomInt()`. Never client-side.
- OTP never appears in API response, client state, or logs.
- `crypto.timingSafeEqual()` used for HMAC comparison — prevents timing attacks.
- Token expires in 10 minutes.
- `META_WA_ACCESS_TOKEN` and `OTP_HMAC_SECRET` must never be committed to git.
- Meta API call is entirely server-side — credentials never exposed to browser.

---

*AnalytixLabs · CareerSuccess LP · OTP Implementation Brief · April 2026*
