# Fix: `get_conversion_stats` MCP Tool — Incompatible Metrics

**Project:** AnalytixLabs LP Vercel MCP  
**File:** `app/api/[transport]/route.ts`  
**Repo:** `dhaval-alabs/careersuccess_legacy`  
**Priority:** Medium — tool returns error for all queries  

---

## Problem

The `get_conversion_stats` tool (Tool 4) queries `FROM conversion_action` with conversion metrics in the SELECT clause. The Google Ads API does not allow `metrics.conversions`, `metrics.cost_per_conversion`, or `metrics.all_conversions` to be fetched from the `conversion_action` resource — they are incompatible.

**Error returned:**
```
Cannot select or filter on the following metrics:
  'conversions' (could not support requested resources: 'CONVERSION_ACTION')
  'cost_per_conversion' (could not support requested resources: 'CONVERSION_ACTION')
```

---

## Fix

Replace the entire Tool 4 block. Find this section (starts around the comment `// ─── Tool 4: Conversion Action Stats`) and replace everything from `server.tool(` through the closing `)` with the code below.

**The fix:** Query from `campaign` resource and use `segments.conversion_action_name` to break down conversions by action. This is the correct Google Ads API pattern for per-conversion-action reporting.

### Current code (broken):

```typescript
    // ─── Tool 4: Conversion Action Stats ───────────────────────────────────
    server.tool(
      'get_conversion_stats',
      'Get conversion breakdown by conversion action name. Shows which CTAs are converting.',
      {
        days: z.number().default(30).describe('Lookback window in days'),
      },
      async ({ days }) => {
        const results = await gadsQuery(`
          SELECT
            conversion_action.name,
            conversion_action.status,
            metrics.conversions,
            metrics.cost_per_conversion,
            metrics.all_conversions
          FROM conversion_action
          WHERE segments.date DURING LAST_${days}_DAYS
            AND conversion_action.status = 'ENABLED'
          ORDER BY metrics.conversions DESC
        `)

        const summary = results.map(r => ({
          conversion_action: r.conversionAction?.name,
          conversions: r.metrics?.conversions,
          all_conversions: r.metrics?.allConversions,
          cpa_inr: ((r.metrics?.costPerConversion || 0) / 1_000_000).toFixed(2),
        }))

        return {
          content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }]
        }
      }
    )
```

### Replacement code (fixed):

```typescript
    // ─── Tool 4: Conversion Action Stats ───────────────────────────────────
    server.tool(
      'get_conversion_stats',
      'Get conversion breakdown by conversion action name. Shows which CTAs are converting.',
      {
        days: z.number().default(30).describe('Lookback window in days'),
      },
      async ({ days }) => {
        const results = await gadsQuery(`
          SELECT
            segments.conversion_action_name,
            segments.conversion_action,
            metrics.conversions,
            metrics.all_conversions,
            metrics.cost_micros
          FROM campaign
          WHERE campaign.status = 'ENABLED'
            AND segments.date DURING LAST_${days}_DAYS
            AND metrics.conversions > 0
          ORDER BY metrics.conversions DESC
        `)

        // Aggregate by conversion action name (rows are per-campaign, we want totals)
        const actionMap = new Map<string, { conversions: number; allConversions: number; costMicros: number }>()

        for (const r of results) {
          const name = r.segments?.conversionActionName || 'Unknown'
          const existing = actionMap.get(name) || { conversions: 0, allConversions: 0, costMicros: 0 }
          existing.conversions += r.metrics?.conversions || 0
          existing.allConversions += r.metrics?.allConversions || 0
          existing.costMicros += r.metrics?.costMicros || 0
          actionMap.set(name, existing)
        }

        const summary = Array.from(actionMap.entries())
          .sort((a, b) => b[1].conversions - a[1].conversions)
          .map(([name, data]) => ({
            conversion_action: name,
            conversions: data.conversions,
            all_conversions: data.allConversions,
            spend_inr: (data.costMicros / 1_000_000).toFixed(2),
            cpa_inr: data.conversions > 0
              ? (data.costMicros / 1_000_000 / data.conversions).toFixed(2)
              : 'N/A',
          }))

        return {
          content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }]
        }
      }
    )
```

---

## What Changed

| # | Change | Why |
|---|--------|-----|
| 1 | Query resource: `conversion_action` → `campaign` | Metrics are compatible with `campaign`, not `conversion_action` |
| 2 | Added `segments.conversion_action_name` | This segments the campaign data by conversion action |
| 3 | Replaced `metrics.cost_per_conversion` with `metrics.cost_micros` | CPA is computed manually after aggregation (more reliable) |
| 4 | Added aggregation logic | Results come per-campaign-per-action; we sum across campaigns to get totals per action |
| 5 | Added `metrics.conversions > 0` filter | Avoids returning zero-conversion noise rows |

---

## Testing

After deployment, test from Claude with the MCP connected:

```
Which CTA sections are converting the most in the last 7 days?
```

**Expected:** Returns a list of conversion action names with conversion counts, sorted by volume — no API errors.

---

## File Changed

| File | Change |
|------|--------|
| `app/api/[transport]/route.ts` | Replace Tool 4 (`get_conversion_stats`) block with fixed version |

No new dependencies, no env changes, no other files affected.
