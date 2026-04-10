# Fix: `lookup_gclid` — Incompatible Metrics in Google Ads Query

**Project:** AnalytixLabs LP Vercel MCP  
**File affected:** MCP server route/handler for `lookup_gclid`  
**Error code:** `PROHIBITED_METRIC_IN_SELECT_OR_WHERE_CLAUSE`  
**Priority:** High — tool returns error for all gclid lookups

---

## Problem

The `lookup_gclid` tool queries the Google Ads API using the `click_view` resource but includes conversion metrics (`all_conversions`, `conversions`) in the SELECT clause. The Google Ads API **does not allow** conversion metrics to be fetched alongside `click_view` — they are resource-incompatible.

**Raw error from Google Ads API:**
```
Cannot select or filter on the following metrics:
  'all_conversions' (could not support requested resources: 'CLICK_VIEW')
  'conversions'     (could not support requested resources: 'CLICK_VIEW')
since metric is incompatible with the resource in the FROM clause or other selected segmenting resources.
```

---

## Fix

### Option A — Recommended: Split into two queries

Run two separate GAQL queries and merge results in code:

**Query 1 — Click lookup (click_view)**
```sql
SELECT
  click_view.gclid,
  click_view.ad_group_ad,
  click_view.keyword,
  click_view.keyword_info,
  click_view.page_number,
  segments.date,
  segments.ad_network_type,
  campaign.id,
  campaign.name,
  ad_group.id,
  ad_group.name
FROM click_view
WHERE
  click_view.gclid = '<GCLID>'
  AND segments.date DURING LAST_90_DAYS
```

**Query 2 — Conversion lookup (separate resource)**

Conversions can be fetched separately using the `campaign` or `ad_group` resource if needed, filtered by date. However, attributing a specific conversion to a specific gclid at the API level is not directly supported — conversion data is aggregated. If conversion attribution is required, consider:

- Using the **Google Ads Conversion Import** log/store (KV or database) populated at the time of conversion, and cross-referencing by gclid there — this is already how the server-side tracking pipeline works.
- Querying `FROM conversion_action` for aggregate stats if only summary data is needed.

> **Simplest fix:** Remove conversion metrics from the `click_view` query entirely. Since the MCP server already records conversions via the server-side tracking endpoint, the KV store is the source of truth for whether a conversion was fired for a given gclid.

---

### Option B — Quick fix: Remove conversion columns

If conversion data is not needed in the gclid lookup response, simply remove `metrics.all_conversions` and `metrics.conversions` from the SELECT clause in the `click_view` GAQL query.

**Before:**
```sql
SELECT
  click_view.gclid,
  ...
  metrics.conversions,
  metrics.all_conversions,
  ...
FROM click_view
WHERE click_view.gclid = '<GCLID>'
```

**After:**
```sql
SELECT
  click_view.gclid,
  click_view.ad_group_ad,
  click_view.keyword,
  segments.date,
  segments.ad_network_type,
  campaign.id,
  campaign.name,
  ad_group.id,
  ad_group.name
FROM click_view
WHERE
  click_view.gclid = '<GCLID>'
  AND segments.date DURING LAST_90_DAYS
```

---

## Suggested response shape (after fix)

```json
{
  "status": "found",
  "gclid": "Cj0KCQjw...",
  "click": {
    "date": "2026-04-03",
    "campaign": { "id": "...", "name": "..." },
    "ad_group": { "id": "...", "name": "..." },
    "keyword": "...",
    "network": "SEARCH"
  },
  "conversion": {
    "recorded_in_kv": true,
    "conversion_name": "...",
    "conversion_time": "..."
  }
}
```

The `conversion` block should be sourced from the KV store lookup (already available in the MCP server), not from the Google Ads API metrics query.

---

## Testing

After the fix, re-run the following lookup to confirm it resolves cleanly:

```
gclid: Cj0KCQjwp7jOBhDGARIsABe7C4eH--UNSvnuwDmCyh92mjUm24dz91eR8JJ8aFsnveZyzWRm7Ft27B4aAj43EALw_wcB
```

Expected: `status: found` or `status: not_found` (if outside lookback window) — **not** a 400 error.
