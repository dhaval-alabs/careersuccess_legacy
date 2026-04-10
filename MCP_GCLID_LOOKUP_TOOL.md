# MCP Server: Add `lookup_gclid` Tool

**File to edit:** `app/api/[transport]/route.ts`  
**Repo:** `dhaval-alabs/careersuccess_legacy`  
**Deploy target:** Vercel → `careersuccess-legacy` project

---

## What This Does

Adds a new `lookup_gclid` tool to the Google Ads MCP server. Given a `gclid` value, it queries the Google Ads `click_view` resource to confirm whether the click was registered and whether any conversion was attributed to it — answering the question: *"Did this click result in a conversion being passed back to Google Ads?"*

---

## Change: Add Tool 6 to `route.ts`

Inside the `createMcpHandler` callback, **after** the closing `})` of Tool 5 (`get_budget_pacing`) and **before** the final closing `}` of the callback, add the following block:

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
        let results: any[] = []
        let error: string | null = null

        try {
          results = await gadsQuery(`
            SELECT
              click_view.gclid,
              click_view.ad_network_type,
              campaign.name,
              ad_group.name,
              segments.date,
              metrics.all_conversions,
              metrics.conversions
            FROM click_view
            WHERE click_view.gclid = '${gclid}'
              AND segments.date DURING LAST_${days}_DAYS
          `)
        } catch (e: any) {
          error = e.message
        }

        if (error) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ status: 'error', gclid, error }, null, 2),
            }],
          }
        }

        if (!results || results.length === 0) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                status: 'not_found',
                gclid,
                message: `No click found for this gclid in the last ${days} days. It may be older than the lookback window, or the gclid may be invalid.`,
              }, null, 2),
            }],
          }
        }

        const row = results[0]
        const conversions = row.metrics?.conversions ?? 0
        const allConversions = row.metrics?.allConversions ?? 0

        const summary = {
          status: 'found',
          gclid,
          click_date: row.segments?.date,
          campaign: row.campaign?.name,
          ad_group: row.adGroup?.name,
          ad_network_type: row.clickView?.adNetworkType,
          conversions_attributed: conversions,
          all_conversions_attributed: allConversions,
          conversion_passed_back: conversions > 0 || allConversions > 0,
          note: conversions > 0
            ? '✅ Conversion was attributed to this click.'
            : allConversions > 0
            ? '⚠️ Counted in all_conversions (e.g. view-through or cross-device) but not primary conversions.'
            : '❌ No conversion has been attributed to this click yet. It may still be within the conversion window.',
        }

        return {
          content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }],
        }
      }
    )
```

---

## Where Exactly to Place It

The final structure of the `createMcpHandler` callback should look like this:

```
createMcpHandler(
  (server) => {
    // Tool 1: get_campaign_stats    ← existing
    // Tool 2: get_keyword_stats     ← existing
    // Tool 3: get_search_terms      ← existing
    // Tool 4: get_conversion_stats  ← existing
    // Tool 5: get_budget_pacing     ← existing
    // Tool 6: lookup_gclid          ← ADD HERE
  },
  ...
)
```

---

## No Other Changes Required

- No new dependencies needed (`z` from Zod is already imported)
- `gadsQuery` helper is already defined and reused
- `CUSTOMER_ID` and `MCC_ID` constants are already set
- No `.env` changes needed

---

## Testing After Deployment

Once deployed, test from Claude.ai by asking:

> "Look up gclid `Cj0KCQjwp7jOBhDGARIsABe7C4eH--UNSvnuwDmCyh92mjUm24dz91eR8JJ8aFsnveZyzWRm7Ft27B4aAj43EALw_wcB`"

Expected response should include `click_date`, `campaign`, `conversion_passed_back: true/false`, and a plain-English `note`.

---

## Possible API Notes

- `click_view` data is only available for **search and shopping clicks** — Display clicks may not appear.
- The default lookback is 90 days. If the click is older, pass `days: 180` or higher.
- `all_conversions` includes view-through and cross-device conversions; `conversions` is the primary bidding conversion count.
