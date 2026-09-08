# 🛡️ AnalytixLabs LP Deployment & Zero-Downtime Verification Protocol

This checklist and verification procedure must be executed for **every deployment** to guarantee 0% downtime on live landing pages, lead capture forms, OTP verification, and conversion tracking.

---

## 📋 Standard Operating Procedure (SOP)

### Phase 1: Pre-Deployment Validation (Local)
1. **Type & Build Validation**:
   ```bash
   npm run build
   ```
   - Must complete with zero TypeScript or route compilation errors.
2. **Commit & Push**:
   ```bash
   git add <modified_files>
   git commit -m "feat/fix(...): <clear description>"
   git push origin main
   ```

---

### Phase 2: Post-Deployment Automated Health Check
Run the automated multi-point synthetic health check against the live deployment:
```bash
npm run verify
```
This script automatically executes 22+ live endpoint assertions:
- [x] **Live Landing Pages**: Checks HTTP 200 on all 14 core city & thank-you pages (`/data-science-ai-course-*`, `/data-analyst-ai-course-*`, `/delhi-otp`, `/thankyou-*`).
- [x] **CORS Preflight (OPTIONS)**: Verifies `Access-Control-Allow-Origin: https://careersuccess.analytixlabs.co.in` across:
  - `/api/otp/send`
  - `/api/otp/verify`
  - `/api/submit-lead`
  - `/api/track-conversion`
  - `/api/qualify`
- [x] **OTP Handshake**:
  - Validates that `/api/otp/send` issues a valid cryptographically signed HMAC token.
  - Validates that `/api/otp/verify` cleanly processes the token and validates code without 500s or timeouts.
- [x] **Conversion Tracking**:
  - Asserts that `/api/track-conversion` accepts payloads and communicates with Google Ads.

---

### Phase 3: Manual OTP & Form Verification Test (Diagnostics)
1. Navigate to: `https://careersuccess.analytixlabs.co.in/lp/otp-test-internal` (or `https://lp-vercel.analytixlabs.co.in/otp-test-internal`).
2. Toggle **ENABLE DIAGNOSTIC (DEBUG) MODE** to ON.
3. Submit a test mobile number and verify receipt of the 4-digit WhatsApp OTP.
4. Enter the 4-digit code and verify that the form successfully redirects to the thank-you page with `?verified=true`.
5. Check that the Lead record status in LeadSquared and Google Sheet transitions to `Verified`.

---

### Summary Command Matrix
| Action | Command | Expected Result |
|---|---|---|
| Build Test | `npm run build` | Exit Code 0, all static/dynamic routes generated |
| Live Verification | `npm run verify` | 22/22 tests PASSED |
| Internal OTP Diagnostics | Open `/otp-test-internal` | Instant visual debugging of WhatsApp delivery & verify |
