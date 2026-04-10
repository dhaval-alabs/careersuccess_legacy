# CRITICAL Fix: CORS Headers on `track-conversion` Endpoint

**Project:** AnalytixLabs LP Vercel MCP  
**File:** `app/api/track-conversion/route.ts`  
**Repo:** `dhaval-alabs/careersuccess_legacy`  
**Priority:** CRITICAL — This is why zero conversions are reaching Google Ads  
**Supersedes:** The previous `route.ts` update (email-only fix) — this file includes that fix plus CORS

---

## Problem

**No conversions from real users are reaching Google Ads.** Vercel runtime logs confirm zero POST requests to `/api/track-conversion` from any browser in the Apr 1–3 window — despite multiple confirmed form submissions from the `/lp/` landing page.

### Root Cause: Cross-Origin Request Blocked

The landing page is served from one domain, but `fireConversion()` POSTs to a different domain:

| Component | Domain |
|---|---|
| Page origin (via Cloudflare Worker) | `https://careersuccess.analytixlabs.co.in` |
| `fireConversion()` target | `https://lp-vercel.analytixlabs.co.in` |

These are **different origins**. The browser sends a CORS preflight (OPTIONS request) before allowing the POST. The current `route.ts` has no OPTIONS handler and returns no CORS headers, so the browser **silently blocks every conversion request**. The `try/catch` in `fireConversion()` swallows the error.

### Evidence

- **Vercel logs (Apr 1–3):** Zero `/api/track-conversion` requests. Only `/api/mcp` health checks and page loads.
- **CRM:** 4 leads captured (CRM uses a different submission path that handles CORS).
- **Google Ads dashboard:** 0 conversions on all 12 import actions except 1 on `Submit_Lead_Primary` — that 1 was from a `curl` test (curl ignores CORS).

---

## Fix

**Replace the entire file** `app/api/track-conversion/route.ts` with the version attached to this document (`route.ts`).

### What Changed (vs the previous version)

| # | Change | Lines affected |
|---|--------|---------------|
| 1 | Added `ALLOWED_ORIGIN` constant | New |
| 2 | Added `corsHeaders` object | New |
| 3 | Added `OPTIONS` handler for CORS preflight | New function |
| 4 | Added `headers: corsHeaders` to **every** `NextResponse.json()` call | All return statements |
| 5 | Made gclid optional (from previous fix) | Validation block |
| 6 | Send `gclid` only when present (from previous fix) | Conversion object builder |

### Key Details

**CORS headers added:**
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://careersuccess.analytixlabs.co.in',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

**New OPTIONS handler** (handles browser preflight):
```typescript
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}
```

**Every response includes CORS headers** — including error responses. This is critical because if an error response lacks CORS headers, the browser will mask the actual error and the frontend will see a generic CORS failure instead.

---

## Also Required: Frontend Fix (page.tsx)

The `fireConversion` function in `page.tsx` also needs updating (separate instruction file: `fix-fireConversion-email-only.md`). The guard `if (!gclid) return` should become `if (!gclid && !email) return` so email-only conversions can also be sent.

**Both fixes must be deployed together for conversions to work.**

---

## Testing

### Step 1: Verify CORS preflight works
```bash
curl -X OPTIONS https://lp-vercel.analytixlabs.co.in/api/track-conversion \
  -H "Origin: https://careersuccess.analytixlabs.co.in" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v 2>&1 | grep -i "access-control"
```

**Expected:** Response includes:
```
Access-Control-Allow-Origin: https://careersuccess.analytixlabs.co.in
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Step 2: Verify POST with CORS works
```bash
curl -X POST https://lp-vercel.analytixlabs.co.in/api/track-conversion \
  -H "Content-Type: application/json" \
  -H "Origin: https://careersuccess.analytixlabs.co.in" \
  -d '{"ctaName":"lp_hero_check_eligibility","email":"test-cors@example.com"}' \
  -v 2>&1 | grep -i "access-control"
```

**Expected:** Response includes `Access-Control-Allow-Origin` header.

### Step 3: Real browser test
1. Open `careersuccess.analytixlabs.co.in/lp/data-science-specialization-course-lg/` (from a Google Ad click if possible)
2. Open DevTools → Network tab
3. Submit a form
4. Look for a POST to `lp-vercel.analytixlabs.co.in/api/track-conversion`
5. Confirm it returns 200 (not a CORS error)

### Step 4: Verify in Vercel logs
After a real submission, check Vercel runtime logs. You should now see POST requests to `/api/track-conversion` appearing — these were completely absent before.

---

## Files Changed

| File | Change |
|------|--------|
| `app/api/track-conversion/route.ts` | Full replacement — adds CORS + email-only support |

No new dependencies, no env changes. Deploy to Vercel as normal.

---

## Why This Was Missed

- `curl` and server-side tests bypass CORS entirely — so manual tests appeared to work
- The `try/catch` in `fireConversion()` logged CORS errors to `console.error` only — invisible without DevTools open
- CRM submissions use a different endpoint/mechanism that handles CORS, so leads appeared in CRM normally
- The 1 "successful" conversion in the Google Ads dashboard was from a `curl` test, creating the illusion that the pipeline worked
