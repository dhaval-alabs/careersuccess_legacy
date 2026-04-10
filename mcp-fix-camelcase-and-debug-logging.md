# Fix: Google Ads MCP Server — camelCase Field Names + Debug Logging

**File to edit:** `app/api/[transport]/route.ts`  
**Repo:** `dhaval-alabs/careersuccess_legacy`  
**Priority:** High — all cost/CPA/spend fields are returning `0.00` in production

---

## Root Cause

The Google Ads REST API returns field names in **camelCase** in its JSON responses, but the current code accesses them in **snake_case**. Single-word fields (`impressions`, `clicks`, `conversions`) work fine. All multi-word fields silently return `undefined`, which coerces to `0`.

---

## Change 1 — Add a debug log in `gadsQuery()` to inspect the raw API response

This should be added **temporarily** to verify the field names coming back from the API after this fix is deployed. It can be removed in a follow-up commit once confirmed working.

**Find this block** (around line 34):

```ts
async function gadsQuery(query: string): Promise<any[]> {
  const token = await getAccessToken()
  const res = await fetch(
    `https://googleads.googleapis.com/v23/customers/${CUSTOMER_ID}/googleAds:search`,
    { ... }
  )
  const data = await res.json()
  if (data.error) throw new Error(JSON.stringify(data.error))
  return data.results || []
}
```

**Replace with:**

```ts
async function gadsQuery(query: string): Promise<any[]> {
  const token = await getAccessToken()
  const res = await fetch(
    `https://googleads.googleapis.com/v23/customers/${CUSTOMER_ID}/googleAds:search`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
        'login-customer-id': MCC_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    }
  )
  const data = await res.json()
  if (data.error) throw new Error(JSON.stringify(data.error))

  // DEBUG: log first result to verify field name casing from API
  if (data.results?.length > 0) {
    console.log('[gadsQuery] sample result keys:', JSON.stringify(data.results[0], null, 2))
  }

  return data.results || []
}
```

---

## Change 2 — Fix all snake_case field accesses to camelCase

Make the following find-and-replace changes in the response `.map()` blocks across all 5 tools.

### Tool 1: `get_campaign_stats`

| Find | Replace |
|------|---------|
| `r.metrics?.cost_micros` | `r.metrics?.costMicros` |
| `r.metrics?.cost_per_conversion` | `r.metrics?.costPerConversion` |

### Tool 2: `get_keyword_stats`

| Find | Replace |
|------|---------|
| `r.ad_group_criterion?.keyword?.text` | `r.adGroupCriterion?.keyword?.text` |
| `r.ad_group_criterion?.keyword?.match_type` | `r.adGroupCriterion?.keyword?.matchType` |
| `r.ad_group?.name` | `r.adGroup?.name` |
| `r.metrics?.cost_micros` | `r.metrics?.costMicros` |
| `r.metrics?.cost_per_conversion` | `r.metrics?.costPerConversion` |

### Tool 3: `get_search_terms`

| Find | Replace |
|------|---------|
| `r.search_term_view?.search_term` | `r.searchTermView?.searchTerm` |
| `r.ad_group?.name` | `r.adGroup?.name` |
| `r.metrics?.cost_micros` | `r.metrics?.costMicros` |

### Tool 4: `get_conversion_stats`

| Find | Replace |
|------|---------|
| `r.conversion_action?.name` | `r.conversionAction?.name` |
| `r.metrics?.all_conversions` | `r.metrics?.allConversions` |
| `r.metrics?.cost_per_conversion` | `r.metrics?.costPerConversion` |

### Tool 5: `get_budget_pacing`

| Find | Replace |
|------|---------|
| `r.campaign_budget?.amount_micros` | `r.campaignBudget?.amountMicros` |
| `r.metrics?.cost_micros` | `r.metrics?.costMicros` |

---

## Verification Steps

1. Deploy to production (`main` branch → Vercel auto-deploy)
2. Check Vercel Runtime Logs for `[gadsQuery] sample result keys:` entries to confirm the actual field names returned
3. Ask Claude: *"which of my campaigns has the lowest CPA this month?"* — spend and CPA should now show real INR values
4. Once confirmed working, remove the `console.log` debug line from `gadsQuery()` and redeploy

---

## Notes

- No environment variable changes needed
- No dependency changes needed
- TypeScript types are all `any` so no type errors will surface from this change
- The GAQL query strings themselves are **not changed** — snake_case is correct in the query language, only the response parsing is affected
