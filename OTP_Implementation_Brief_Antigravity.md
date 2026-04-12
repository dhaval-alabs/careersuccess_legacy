# WhatsApp OTP Verification — Implementation Brief
## AnalytixLabs CareerSuccess LP
**Prepared for:** Antigravity  
**Date:** April 2026  
**Commit message (when done):** `feat: add whatsapp otp verification to hero lead capture form`

---

## 1. Overview

Add WhatsApp OTP verification to the **Hero lead capture form only** on all 5 PPC landing pages. All modal forms (Eligibility, Brochure, Demo) are **not touched**.

OTP is delivered via the existing Xbot (Webspecia) WhatsApp integration. Our Next.js server owns all OTP generation, signing, verification, LSQ updates, and Sheets updates. Xbot is a one-way delivery pipe only.

**If Xbot delivery fails for any reason, the form falls back silently to a standard non-OTP lead submission.** The user is never blocked.

---

## 2. Files to Create (New)

| File | Purpose |
|---|---|
| `components/HeroLeadCaptureForm.tsx` | OTP-enabled hero form — replaces `LeadCaptureForm` in hero section only |
| `app/api/otp/send/route.ts` | Generates OTP, creates LSQ lead, calls Xbot, returns HMAC token |
| `app/api/otp/verify/route.ts` | Validates HMAC, updates LSQ + Sheets to Verified |

---

## 3. Files to Modify

| File | Change |
|---|---|
| `app/data-science-specialization-course-lg/page.tsx` | Replace hero `LeadCaptureForm` with `HeroLeadCaptureForm` |
| `app/data-science-ai-course-delhi/page.tsx` | Same |
| `app/data-science-ai-course-noida/page.tsx` | Same |
| `app/data-science-ai-course-gurgaon/page.tsx` | Same |
| `app/data-science-ai-course-bangalore/page.tsx` | Same |

---

## 4. Files NOT to Touch

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

## 5. New Environment Variable

Add to Vercel dashboard — all environments (Production, Preview, Development):

```
OTP_HMAC_SECRET=<generate with: openssl rand -hex 32>
```

This is the signing key for HMAC tokens. Keep it secret. Never commit to git.

---

## 6. Google Sheets — Status Column

**Sheet name:** `Career Success G Sheet`  
**Worksheet/tab:** `NextJS`  
**This is the only sheet Next.js writes to. Do not write to `OTP Form Leads` or `Form_leads` — those are managed exclusively by Xbot.**

The NextJS tab already has data in columns A–P from the existing lead action integration.

- **Column Q header** = `OTP_Status`
- Append `Unverified` in column Q when lead is created at Send OTP time
- Append `Fallback` in column Q when Xbot delivery fails (non-OTP submission)
- Update column Q from `Unverified` → `Verified` when OTP is successfully verified
- For all other existing leads (non-OTP modal forms), column Q is left blank

---

## 7. API Route: `/api/otp/send`

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

// Generate 4-digit OTP server-side
const otp = String(crypto.randomInt(1000, 9999));

// Create signed HMAC token — OTP never leaves the server
const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
const payload = `${mobile}:${otp}:${expiry}`;
const hmac = crypto
  .createHmac('sha256', process.env.OTP_HMAC_SECRET!)
  .update(payload)
  .digest('hex');
const token = Buffer.from(JSON.stringify({ expiry, hmac })).toString('base64');
```

> The OTP is never stored anywhere on the server and never sent to the client. The HMAC token encodes only the expiry timestamp and the signature. Verification works by recomputing the HMAC with the user-entered OTP and comparing signatures.

**Step 2 — Call Xbot Send OTP webhook**

```
POST https://chat-xbot.webspecia.in/api/iwh/08c86dc50ec3914c2fdf14a39ab3acb8
Content-Type: application/x-www-form-urlencoded

Name={name}
mobile={mobile}               // 10 digits only — no country code
email={email}
city={city}
countryCode={countryCode}     // e.g. +91
mobilecc={countryCode}{mobile} // e.g. +919876543210
otp={otp}
status=not varified           // intentional typo — matches Xbot flow exactly
```

Set a timeout of **8 seconds** on this fetch call.

**Step 3 — Branch on Xbot response**

```typescript
const xbotSuccess = xbotResponse.ok; // true if HTTP 200

const otpStatus = xbotSuccess ? 'Unverified' : 'Fallback';
```

**Step 4 — Create lead in LSQ**

Use the same LSQ API call as the existing `createLeadAction`. Add one extra field:

```json
{ "Attribute": "mx_OTP_Status", "Value": "<otpStatus>" }
```

Where `otpStatus` is either `"Unverified"` (Xbot succeeded) or `"Fallback"` (Xbot failed).

All other fields (UTMs, behaviour, form_source, typeFilter, name, email, city, mobile, etc.) are sent exactly as the existing lead action sends them.

**Step 5 — Write to Google Sheets**

Append a row to the **`NextJS` tab** of **`Career Success G Sheet`** using the same Sheets logic as the existing lead action. Set column Q (`OTP_Status`) to `otpStatus` (`Unverified` or `Fallback`).

> Do not write to `OTP Form Leads` or `Form_leads` — those are Xbot's sheets.

**Step 6 — Return response to client**

```typescript
// If Xbot succeeded:
return { success: true, token: token }

// If Xbot failed (fallback):
return { success: true, fallback: true }

// If LSQ or Sheets failed:
return { success: false, error: 'Something went wrong. Please try again.' }
```

> Note: Xbot failure is NOT a `success: false`. The lead was created. The fallback flag tells the client to skip OTP and proceed directly to thank-you.

---

## 8. API Route: `/api/otp/verify`

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

// b. Extract ProspectID from response

// c. Update lead
POST https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Update
  ?accessKey={LSQ_ACCESS_KEY}
  &secretKey={LSQ_SECRET_KEY}
  &leadId={ProspectID}

Body (JSON):
[{ "Attribute": "mx_OTP_Status", "Value": "Verified" }]
```

**Step 3 — Update Google Sheets column Q**

In the **`NextJS` tab** of **`Career Success G Sheet`**, find the row where the Phone column matches `{countryCode}{mobile}` (e.g. `+919876543210`). Update column Q (`OTP_Status`) from `Unverified` to `Verified`.

Use the same Sheets API credentials as the existing lead action.

**Step 4 — Return response**

```typescript
return { success: true }

// On LSQ or Sheets failure — still return success (lead is verified, don't block user)
// Log the error server-side for manual follow-up
return { success: true }

// Only return false for HMAC failures (invalid/expired OTP)
```

---

## 9. Component: `HeroLeadCaptureForm.tsx`

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
// Form field values (controlled inputs)
const [name, setName]               = useState('');
const [email, setEmail]             = useState('');
const [city, setCity]               = useState('');
const [countryCode, setCountryCode] = useState('+91');
const [mobile, setMobile]           = useState('');

// OTP flow state
type OtpState = 'idle' | 'sending' | 'otp_sent' | 'verifying' | 'error';
const [otpState, setOtpState]       = useState<OtpState>('idle');
const [otpValue, setOtpValue]       = useState('');
const [token, setToken]             = useState('');
const [errorMsg, setErrorMsg]       = useState('');

// Resend countdown
const [resendTimer, setResendTimer] = useState(0); // seconds remaining

// General form error
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
    // LSQ/Sheets failure — show error, stay on form
    setOtpState('idle');
    setFormError(data.error || 'Something went wrong. Please try again.');
    return;
  }

  if (data.fallback) {
    // Xbot delivery failed — proceed as normal non-OTP submission
    // Lead already created in LSQ and Sheets with status "Fallback"
    onSuccess?.(email);
    const params = new URLSearchParams({ email, name, phone: mobile });
    window.location.href = `${thankYouPath ?? '/thankyou-check-your-eligibility'}?${params.toString()}`;
    return;
  }

  // Xbot succeeded — show OTP input
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

  // Verified — fire conversion and redirect
  onSuccess?.(email);
  const params = new URLSearchParams({ email, name, phone: mobile });
  window.location.href = `${thankYouPath ?? '/thankyou-check-your-eligibility'}?${params.toString()}`;
}
```

### handleResend

```typescript
async function handleResend() {
  setOtpValue('');
  setErrorMsg('');
  setOtpState('idle');
  setToken('');
  // handleSendOtp will be called again by user clicking Send OTP
  // OR call it directly:
  await handleSendOtp();
}
```

### Mobile field UI — inline Send OTP button

The mobile field row contains the phone input and an inline button on the right. When `otpState === 'otp_sent'` or `otpState === 'verifying'` or `otpState === 'error'`, the phone input is replaced with the OTP input. The button label and state change accordingly.

```tsx
{/* Mobile field — normal state */}
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
        pattern="[0-9]{10}"
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
                    px-3 py-1.5 rounded-lg text-xs font-bold
                    transition-all duration-200
                    ${mobile.length === 10 && otpState !== 'sending'
                      ? 'bg-[#29E8A4] text-[#09263F] hover:bg-[#1DE5B5] cursor-pointer'
                      : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                    }`}
      >
        {otpState === 'sending' ? (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
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
      OTP sent to your WhatsApp (+{countryCode.replace('+','')} {mobile})
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
                    px-3 py-1.5 rounded-lg text-xs font-bold
                    transition-all duration-200
                    ${otpValue.length === 4 && otpState !== 'verifying'
                      ? 'bg-[#29E8A4] text-[#09263F] hover:bg-[#1DE5B5] cursor-pointer'
                      : 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                    }`}
      >
        {otpState === 'verifying' ? (
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Verifying
          </span>
        ) : 'Verify'}
      </button>
    </div>

    {/* Error message */}
    {errorMsg && (
      <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
    )}

    {/* Resend */}
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

### Submit button

The main form submit button is **not shown** when `otpState` is `otp_sent`, `verifying`, or `error`. The Verify button inside the OTP field is the final action.

When `otpState` is `idle` or `sending`, the main button renders as in `LeadCaptureForm.tsx` but with `type="button"` pointing to `handleSendOtp`, not a form submit. The main form `onSubmit` is not used — all submission is handled by `handleSendOtp` and `handleVerify`.

---

## 10. Updating page.tsx Files (All 5 Pages)

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
  // ...other props
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
  // ...all other props unchanged
/>
```

**Do not change any other `LeadCaptureForm` instances in the same file (modal forms).**

---

## 11. Conversion Tracking — No Change Required

`fireConversion()` is called inside `onSuccess()` in page.tsx. Since `HeroLeadCaptureForm` calls `onSuccess(email)` at the same point (after verified / after fallback), conversion tracking fires correctly without any change to page.tsx conversion logic.

---

## 12. LSQ Field Reference

`mx_OTP_Status` already exists in LeadSquared. No new field creation required.

| Stage | mx_OTP_Status value | Sheets col Q — NextJS tab |
|---|---|---|
| Send OTP — Xbot succeeded | `Unverified` | `Unverified` |
| Send OTP — Xbot failed (fallback) | `Fallback` | `Fallback` |
| OTP verified successfully | `Verified` | `Verified` |
| Modal form submissions (unchanged) | *(not set)* | *(blank)* |

> **Google Sheets target:** `Career Success G Sheet` → `NextJS` tab → Column Q = `OTP_Status`. Never write to `OTP Form Leads` — that is Xbot's sheet.

---

## 13. Xbot Webhook Reference

| Webhook | URL | Called from |
|---|---|---|
| Send OTP | `https://chat-xbot.webspecia.in/api/iwh/08c86dc50ec3914c2fdf14a39ab3acb8` | `/api/otp/send` |
| Verify OTP | `https://chat-xbot.webspecia.in/api/iwh/576287dc9891eea483e4df2508f2eaad` | **Not called from Next.js** |

The Verify webhook is not called because it inserts a new Sheets row (duplicate) and would conflict with our own Sheets update. Next.js handles all LSQ and Sheets operations at verify time directly.

---

## 14. QA Checklist

| # | Test | Expected result |
|---|---|---|
| 1 | Enter 9 digits in mobile field | Send OTP button stays gray / disabled |
| 2 | Enter 10 digits in mobile field | Send OTP button turns teal / active |
| 3 | Click Send OTP with valid number | Spinner shows, OTP arrives on WhatsApp, 4-digit input appears |
| 4 | Enter correct 4-digit OTP, click Verify | Redirect to thank-you page |
| 5 | Enter incorrect OTP | Error message shown, OTP field clears, Verify reactivates |
| 6 | Wait 10+ minutes then try to verify | Server returns OTP expired error |
| 7 | Simulate Xbot webhook failure (return 500) | Form submits silently as Fallback, redirects to thank-you page |
| 8 | Check LSQ after Send OTP (normal) | Lead exists with mx_OTP_Status = Unverified |
| 9 | Check LSQ after successful Verify | mx_OTP_Status = Verified on same lead |
| 10 | Check LSQ after Fallback | Lead exists with mx_OTP_Status = Fallback |
| 11 | Check Sheets col Q after Send OTP | Unverified |
| 12 | Check Sheets col Q after Verify | Verified |
| 13 | Check Sheets col Q after Fallback | Fallback |
| 14 | Submit via Eligibility modal (no OTP) | Works as before, col Q blank |
| 15 | Resend before 30s countdown | Resend link not shown — countdown timer displayed |
| 16 | Resend after 30s | New OTP sent, new token issued, old token invalid |
| 17 | Check fireConversion fires | Fires after verify success OR fallback — not at Send OTP stage |
| 18 | Check WhatsApp delivery | Message contains correct 4-digit OTP |

---

## 15. Security Notes

- OTP is generated server-side using `crypto.randomInt()`. Never generated client-side.
- The OTP never appears in the HMAC token, API response, or client state.
- `crypto.timingSafeEqual()` is used for HMAC comparison to prevent timing attacks.
- Token expires in 10 minutes. User must request a new OTP after expiry.
- All Xbot webhook calls are server-side. The webhook URL is never exposed to the client.
- `OTP_HMAC_SECRET` must never be committed to git. Rotate immediately if exposed.

---

*AnalytixLabs · CareerSuccess LP · OTP Implementation Brief · April 2026*
