# FINAL Fix: `lookup_gclid` Tool — Complete Replacement

**Project:** AnalytixLabs LP Vercel MCP  
**File:** `app/api/[transport]/route.ts`  
**Repo:** `dhaval-alabs/careersuccess_legacy`  
**Priority:** Critical — tool has never worked; this is the consolidated fix  
**Supersedes:** All previous `lookup_gclid` fix instructions

---

## Background

The original `lookup_gclid` tool (Tool 6) was shipped with **four compounding bugs**. Three previous instruction files each fixed one or two bugs but never all at once, so the tool kept failing with the next error in the chain. This document replaces all prior instructions with a single, tested-correct handler.

### All four bugs and their fixes

| # | Bug | Error from Google Ads API | Fix |
|---|-----|--------------------------|-----|
| 1 | `metrics.conversions` and `metrics.all_conversions` in SELECT | `PROHIBITED_METRIC_IN_SELECT_OR_WHERE_CLAUSE` | Remove — these metrics are incompatible with `click_view` |
| 2 | `DURING LAST_90_DAYS` date syntax | `INVALID_VALUE_WITH_DURING_OPERATOR` | Replace with explicit `segments.date = 'YYYY-MM-DD'` |
| 3 | `click_view.ad_network_type` in SELECT | `UNRECOGNIZED_FIELD` | Replace with `segments.ad_network_type` |
| 4 | Date range spans multiple days | `EXPECTED_FILTER_ON_A_SINGLE_DAY` | `click_view` requires filtering to **exactly one day** — must loop day-by-day |

---

## Complete Replacement Code

**Delete the entire existing `lookup_gclid` tool block** (everything from `// ─── Tool 6` through its closing `)`), and replace it with the following:

```typescript
    // ─── Tool 6: GCLID Lookup ───────────────────────────────────────────────
    server.tool(
      'lookup_gclid',
      'Look up a specific gclid to check if the click was registered and if a conversion was passed back to Google Ads.',
      {
        gclid: z.string().describe('The gclid value to look up'),
        days: z.number().default(90).describe('Lookback window in days (default 90)'),
      },
      async ({ gclid, days }) => {
        // ── Helper: format Date as 'YYYY-MM-DD' ──
        const fmt = (d: Date) => d.toISOString().split('T')[0]

        // ── Build list of dates to search (newest first) ──
        const today = new Date()
        const dates: string[] = []
        for (let i = 0; i < days; i++) {
          const d = new Date(today)
          d.setDate(today.getDate() - i)
          dates.push(fmt(d))
        }

        // ── Query click_view one day at a time ──
        // Google Ads API requires click_view queries to filter on exactly one day.
        // We search newest-first so recent clicks are found quickly.
        let foundRow: any = null
        let lastError: string | null = null

        for (const date of dates) {
          try {
            const results = await gadsQuery(`
              SELECT
                click_view.gclid,
                click_view.keyword_info.text,
                click_view.keyword_info.match_type,
                segments.date,
                segments.ad_network_type,
                campaign.id,
                campaign.name,
                ad_group.id,
                ad_group.name,
                metrics.clicks
              FROM click_view
              WHERE click_view.gclid = '${gclid}'
                AND segments.date = '${date}'
            `)

            if (results && results.length > 0) {
              foundRow = results[0]
              break // Found it — stop searching
            }
          } catch (e: any) {
            // Store error but keep trying other days
            lastError = e.message
            // If it's a non-date-related error (e.g. auth), stop immediately
            if (
              !e.message?.includes('EXPECTED_FILTER') &&
              !e.message?.includes('date')
            ) {
              break
            }
          }
        }

        // ── No result found after searching all days ──
        if (!foundRow) {
          if (lastError) {
            return {
              content: [{
                type: 'text' as const,
                text: JSON.stringify({
                  status: 'error',
                  gclid,
                  error: lastError,
                }, null, 2),
              }],
            }
          }

          return {
            content: [{
              type: 'text' as const,
              text: JSON.stringify({
                status: 'not_found',
                gclid,
                message: `No click found for this gclid in the last ${days} days. It may be older than the lookback window, or the gclid may be invalid.`,
              }, null, 2),
            }],
          }
        }

        // ── Found — build response ──
        const summary = {
          status: 'found',
          gclid,
          click_date: foundRow.segments?.date,
          campaign: {
            id: foundRow.campaign?.id,
            name: foundRow.campaign?.name,
          },
          ad_group: {
            id: foundRow.adGroup?.id,
            name: foundRow.adGroup?.name,
          },
          keyword: foundRow.clickView?.keywordInfo?.text ?? null,
          match_type: foundRow.clickView?.keywordInfo?.matchType ?? null,
          ad_network_type: foundRow.segments?.adNetworkType ?? null,
          clicks: foundRow.metrics?.clicks ?? 0,
        }

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify(summary, null, 2),
          }],
        }
      }
    )
```

---

## Key Design Decisions

### Why loop day-by-day?

The Google Ads `click_view` resource **requires** `segments.date` to be filtered to exactly one calendar day. There is no way around this — `BETWEEN`, `DURING`, and multi-day ranges all fail with `EXPECTED_FILTER_ON_A_SINGLE_DAY`. Looping newest-first means recent clicks (the most common lookup) resolve on the first or second iteration.

### Why no conversion metrics?

`metrics.conversions` and `metrics.all_conversions` are **incompatible** with the `click_view` resource. The Google Ads API does not support joining them. Conversion attribution for a specific gclid should be checked via the KV store that the server-side conversion tracking endpoint already populates at conversion time.

### Why `segments.ad_network_type` instead of `click_view.ad_network_type`?

`click_view.ad_network_type` does not exist in the API schema. The network type field lives under `segments`.

---

## Performance Note

In the worst case (gclid not found), this loops through all 90 days = 90 API calls. This is acceptable for an interactive lookup tool. If performance becomes a concern:

1. **Add an optional `click_date` parameter** — if the user knows the approximate click date, search only that day (instant).
2. **Reduce default lookback** — `days: 30` covers most use cases.
3. **Batch by week** — not possible with `click_view`, but could parallelize with `Promise.all` on chunks of dates (be mindful of API rate limits).

---

## Testing

After deployment, test from Claude with the MCP connected:

```
Look up gclid Cj0KCQjwp7jOBhDGARIsABe7C4eH--UNSvnuwDmCyh92mjUm24dz91eR8JJ8aFsnveZyzWRm7Ft27B4aAj43EALw_wcB
```

**Expected outcomes:**
- If click is within the lookback window → `status: "found"` with campaign, ad group, keyword, date
- If click is older than lookback → `status: "not_found"` with explanatory message
- **No more 400 errors**

---

## Files Changed

| File | Change |
|------|--------|
| `app/api/[transport]/route.ts` | Replace entire Tool 6 (`lookup_gclid`) block with the code above |

No new dependencies, no env changes, no other files affected.
