# Fix: `lookup_gclid` Handler — Two API Query Bugs

**Project:** AnalytixLabs LP Vercel MCP  
**File:** `app/api/mcp/route.ts` (or wherever the `lookup_gclid` tool handler is defined)  
**Priority:** High — tool is currently broken for all inputs  

---

## Bug 1 — Invalid Date Range Syntax (`DURING LAST_X_DAYS`)

### What's happening
The query uses a `DURING` clause with a named literal (e.g. `LAST_90_DAYS` or `LAST_30_DAYS`). The `click_view` resource in Google Ads API **does not support named date literals** with the `DURING` operator. It requires an explicit date range.

### Error returned
```
INVALID_VALUE_WITH_DURING_OPERATOR:
Invalid date literal supplied for DURING operator: LAST_90_DAYS
```

### Fix
Replace the `DURING` clause with an explicit `BETWEEN` range on `segments.date`, computed server-side from the `days` parameter.

**Before (broken):**
```sql
WHERE segments.date DURING LAST_90_DAYS
```

**After (fixed):**
```typescript
const today = new Date();
const start = new Date();
start.setDate(today.getDate() - days); // `days` = the tool's input param (default 90)

const fmt = (d: Date) => d.toISOString().split('T')[0]; // → 'YYYY-MM-DD'

const query = `
  SELECT ...
  FROM click_view
  WHERE segments.date BETWEEN '${fmt(start)}' AND '${fmt(today)}'
    AND click_view.gclid = '${gclid}'
`;
```

---

## Bug 2 — Unrecognized Field (`click_view.ad_network_type`)

### What's happening
The SELECT clause references `click_view.ad_network_type`, which **does not exist** in the `click_view` resource schema for Google Ads API v23.

### Error returned
```
UNRECOGNIZED_FIELD: Unrecognized field in the query: 'click_view.ad_network_type'
```

### Fix
Remove `click_view.ad_network_type` from the SELECT clause entirely.

If ad network type is needed, use the correct field from the `segments` resource instead:

```sql
SELECT
  click_view.gclid,
  click_view.keyword_info.text,
  click_view.keyword_info.match_type,
  segments.date,
  segments.ad_network_type,   -- ✅ correct location for this field
  metrics.clicks
FROM click_view
WHERE ...
```

Reference: [click_view resource fields](https://developers.google.com/google-ads/api/fields/v17/click_view)

---

## Summary of Changes

| # | Location | Change |
|---|----------|--------|
| 1 | `lookup_gclid` query builder | Replace `DURING LAST_X_DAYS` with `BETWEEN 'YYYY-MM-DD' AND 'YYYY-MM-DD'` using server-computed dates |
| 2 | `lookup_gclid` SELECT clause | Remove `click_view.ad_network_type`; use `segments.ad_network_type` if needed |

---

## Testing

After the fix, test with this gclid:

```
Cj0KCQjwp7jOBhDGARIsABe7C4eH--UNSvnuwDmCyh92mjUm24dz91eR8JJ8aFsnveZyzWRm7Ft27B4aAj43EALw_wcB
```

Expected outcome: returns either a found click record or a clean `not_found` status — no API errors.
