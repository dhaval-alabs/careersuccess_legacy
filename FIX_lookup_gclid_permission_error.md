# Fix: `lookup_gclid` — PERMISSION_DENIED Error
**Repo:** `dhaval-alabs/careersuccess_legacy`
**File to edit:** `app/api/[transport]/route.ts`
**Priority:** High — MCP diagnostic tool is broken

---

## Problem

The `lookup_gclid` MCP tool is returning a 403 PERMISSION_DENIED error on every call:

```
"User doesn't have permission to access customer.
Note: If you're accessing a client customer, the manager's customer id
must be set in the 'login-customer-id' header."
```

This happens because the Google Ads API requires that when accessing a **client account** (`4064995850`) through a **manager/MCC account** (`8910137241`), the MCC ID must be passed as the `login-customer-id` header. The `lookup_gclid` tool is missing this header.

---

## Fix

In `app/api/[transport]/route.ts`, find the `lookup_gclid` tool implementation.

Locate where the Google Ads API client / customer object is instantiated inside the `lookup_gclid` handler. It will look something like this:

```js
// CURRENT (broken) — missing login_customer_id
const customer = client.Customer({
  customer_id: '4064995850',
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
```

Add `login_customer_id` pointing to the MCC account ID:

```js
// FIXED — add login_customer_id
const customer = client.Customer({
  customer_id: '4064995850',
  login_customer_id: '8910137241',   // ← ADD THIS LINE
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
```

> **Note:** The other tools in the same file (`get_campaign_stats`, `get_conversion_stats`, etc.) already have this working correctly. Copy the exact pattern used there if the syntax differs from the example above.

---

## Account IDs for reference

| Field | Value |
|---|---|
| Client account (Customer ID) | `4064995850` |
| Manager account (MCC ID) | `8910137241` |

---

## Verification

After deploying, run the following test via the Alabs LP Vercel MCP tool (or ask Dhaval to trigger it from Claude):

```
lookup_gclid:
  gclid: "CjwKCAjw7vzOBhBxEiwAc7WNrxCLn1nDkN3dWKCv_TfbJCVq0w8JjBHUtP0bmtMm0UbPny1uvcr5CBoCQaUQAvD_BwE"
  days: 5
```

Expected result: either a `found` status with click date and campaign details, or a `not_found` status — either is correct. A 403 error means the fix was not applied correctly.

---

## No other changes required

No other files need to be touched. Cloudflare Worker, conversion tracking, and all other MCP tools are unaffected.
