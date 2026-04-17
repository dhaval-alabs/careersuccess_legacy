# Fix: `lookup_gclid` — GAQL Query Returns No Results
**Repo:** `dhaval-alabs/careersuccess_legacy`
**File to edit:** `app/api/[transport]/route.ts`
**Priority:** Medium — diagnostic tool not returning results despite valid GCLIDs

---

## Problem

The `lookup_gclid` tool consistently returns `not_found` for all GCLIDs tested, even
for clicks that are confirmed to have resulted in conversions in the Google Ads dashboard,
and even when the GCLIDs are well within the 90-day lookback window.

Google Ads clearly shows conversions recording (e.g. 2 on Apr 15, 3 on Apr 14) but the
tool cannot locate any individual GCLID via the `click_view` resource.

---

## Root Cause Investigation

There are three likely causes. Fix them in order.

---

### Fix 1 — Add debug logging to confirm what the API is actually returning

Before changing the query, add a `console.log` inside the day loop to print the raw
API response for each day searched. This will immediately tell us whether:
- The API is returning rows but the gclid filter isn't matching
- The API is returning zero rows entirely
- There is an auth or permission error being swallowed silently

```ts
// Inside the day-by-day loop, after receiving the API response:
const responseText = await res.text()
console.log(`[lookup_gclid] Date: ${date} | Status: ${res.status} | Response: ${responseText.slice(0, 500)}`)
const data = JSON.parse(responseText)
```

Deploy and trigger one lookup. Share the Vercel logs output with Dhaval so we can see
exactly what the API is returning.

---

### Fix 2 — Verify the GAQL query structure for `click_view` in API v23

The `click_view` resource has strict requirements in Google Ads API v23. The query must:

1. Use `FROM click_view` (not `FROM campaign` or any other resource)
2. Filter `segments.date` to a **single day** (already done — confirm this is correct)
3. Use `click_view.gclid` as the filter field (not `gclid` alone)

**Correct GAQL:**
```sql
SELECT
  click_view.gclid,
  click_view.area_of_interest.city,
  segments.date,
  campaign.name,
  ad_group.name
FROM click_view
WHERE click_view.gclid = 'GCLID_VALUE_HERE'
AND segments.date = 'YYYY-MM-DD'
```

**Common mistakes to check:**
- Using `WHERE gclid = '...'` instead of `WHERE click_view.gclid = '...'`
- Using `BETWEEN` or `DURING` for the date (not supported in click_view)
- Selecting fields from other resources that are incompatible with click_view

---

### Fix 3 — Add a fallback: search without gclid filter first

To confirm whether `click_view` is returning any data at all for a given date, add a
secondary check when the gclid-filtered query returns zero rows. Query `click_view`
for that date without the gclid filter (limit 5 rows) and log the results:

```ts
// If no results found with gclid filter, run a broader check:
const debugQuery = `
  SELECT click_view.gclid, segments.date, campaign.name
  FROM click_view
  WHERE segments.date = '${date}'
  LIMIT 5
`
const debugRes = await fetch(endpoint, {
  method: 'POST',
  headers: { ...headers },
  body: JSON.stringify({ query: debugQuery })
})
const debugData = await debugRes.json()
console.log(`[lookup_gclid] Debug check for ${date}: ${JSON.stringify(debugData).slice(0, 500)}`)
```

If this broader query also returns zero rows, the issue is with the `click_view`
resource access itself. If it returns rows but the gclid-filtered query does not,
the issue is with the gclid matching logic.

---

### Fix 4 — Handle gbraid-only clicks gracefully

**Important context:** When a URL contains both `gbraid` and `gclid` (iOS traffic),
Google attributes the click to `gbraid` internally. These clicks may not be indexed
in `click_view` by their `gclid` at all.

Update the tool response to distinguish between:
- `not_found` — no click record found (could be gbraid-attributed)
- `not_found_may_be_gbraid` — no click found but the conversion may be under gbraid

To implement this, after exhausting the day-by-day loop with no result, the tool
should return:

```ts
return {
  status: 'not_found',
  gclid,
  message: `No click found for this gclid in the last ${days} days.
    Note: If this click came from an iOS device, it may be attributed
    to gbraid instead of gclid and will not appear in click_view.
    Check the Google Ads dashboard directly for iOS conversion data.`
}
```

---

## Verification

After deploying the debug logging (Fix 1), trigger this lookup and share the Vercel
logs output:

```
lookup_gclid:
  gclid: "CjwKCAjw7vzOBhBxEiwAc7WNr4UWUAxOxthQcHhTUCXtoIQN6XaTKfX5rXuaB9IC9OzLr07dpCay3xoCLSoQAvD_BwE"
  days: 7
```

This is a non-iOS GCLID (no gbraid in the URL) from April 15 — it should be findable
in `click_view` if the query is correct. The Vercel log output will tell us exactly
where the query is failing.

---

## No other files need changes

Only `app/api/[transport]/route.ts` needs updating for this fix.
