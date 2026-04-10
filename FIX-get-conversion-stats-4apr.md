# Bug Fix: `get_conversion_stats` MCP Tool — GAQL Query Error

**Repo:** `dhaval-alabs/careersuccess_legacy`  
**File:** `app/api/[transport]/route.ts`  
**Reported by:** Dhaval  
**Priority:** High — tool is completely broken, returns HTTP 400 on every call

---

## Problem

The `get_conversion_stats` tool throws the following Google Ads API error on every invocation:

```
PROHIBITED_SEGMENT_WITH_METRIC_IN_SELECT_OR_WHERE_CLAUSE

Cannot select the following segments because at least one unsupported metric is
found in SELECT or WHERE clause:
  'segments.conversion_action' (unsupported metrics: 'cost_micros')
  'segments.conversion_action_name' (unsupported metrics: 'cost_micros')
```

**Root cause:** The GAQL query inside this tool is selecting `metrics.cost_micros` in the same query as `segments.conversion_action_name`. This is a hard constraint in the Google Ads API — cost metrics cannot be combined with conversion action segments in the same query.

---

## Fix

In `app/api/[transport]/route.ts`, locate the GAQL query inside the `get_conversion_stats` tool handler and **remove `metrics.cost_micros`** (and any other cost/spend metrics) from the SELECT clause.

### ✅ Correct query (use this)

```sql
SELECT
  segments.conversion_action_name,
  metrics.conversions,
  metrics.all_conversions,
  segments.date
FROM campaign
WHERE segments.date DURING LAST_N_DAYS:7
  AND metrics.conversions > 0
ORDER BY metrics.conversions DESC
```

> Replace `LAST_N_DAYS:7` with the appropriate dynamic days parameter already used in the codebase (e.g. `DURING LAST_7_DAYS` or a parameterised date range).

### ❌ What to remove

Any of the following in the `get_conversion_stats` query must be removed:

- `metrics.cost_micros`
- `metrics.cost_per_conversion`
- `metrics.average_cpc`

These cost metrics are fine in `get_campaign_stats` (which does not segment by conversion action) — do **not** remove them from that tool.

---

## Verification

After deploying, test with:

```bash
curl -X POST https://careersuccess-legacy.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "get_conversion_stats",
    "parameters": { "days": 7 }
  }'
```

Expected: a JSON response listing conversion action names with their conversion counts — no `400` error.

---

## Context

- `get_conversion_stats` is used to answer "which CTA section converted the most?" — it does not need cost data; that is already available via `get_campaign_stats`.
- This is the only tool affected. The other 4 MCP tools (`get_campaign_stats`, `get_keyword_stats`, `get_search_terms`, `get_budget_pacing`) are working correctly.
- API version in use: **Google Ads API v23**

---

## Contact

Questions → Dhaval (`dhaval@analytixlabs.co.in`)
