import { createMcpHandler } from '@vercel/mcp-adapter'
import { z } from 'zod'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const CUSTOMER_ID = '4064995850'
const MCC_ID = '8910137241'

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
      grant_type:    'refresh_token',
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error(`OAuth failed: ${JSON.stringify(data)}`)
  return data.access_token
}

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

  return data.results || []
}

const handler = createMcpHandler(
  (server) => {

    // ─── Tool 1: Campaign Stats ─────────────────────────────────────────────
    server.tool(
      'get_campaign_stats',
      'Get performance stats for all enabled campaigns. Returns clicks, conversions, cost and CPA.',
      {
        days: z.number().default(30).describe('Lookback window in days'),
        campaign_filter: z.string().optional().describe('Filter by campaign name substring'),
      },
      async ({ days, campaign_filter }) => {
        const results = await gadsQuery(`
          SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            metrics.clicks,
            metrics.conversions,
            metrics.cost_micros,
            metrics.cost_per_conversion,
            metrics.impressions,
            metrics.ctr
          FROM campaign
          WHERE campaign.status = 'ENABLED'
            AND segments.date DURING LAST_${days}_DAYS
          ORDER BY metrics.conversions DESC
        `)

        let filtered = results
        if (campaign_filter) {
          filtered = results.filter(r =>
            r.campaign?.name?.toLowerCase().includes(campaign_filter.toLowerCase())
          )
        }

        const summary = filtered.map(r => ({
          id: r.campaign?.id,
          campaign: r.campaign?.name,
          impressions: r.metrics?.impressions,
          clicks: r.metrics?.clicks,
          ctr: `${((r.metrics?.ctr || 0) * 100).toFixed(2)}%`,
          conversions: r.metrics?.conversions,
          spend_inr: ((r.metrics?.costMicros || 0) / 1_000_000).toFixed(2),
          cpa_inr: ((r.metrics?.costPerConversion || 0) / 1_000_000).toFixed(2),
        }))

        return {
          content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }]
        }
      }
    )

    // ─── Tool 2: Keyword Performance ───────────────────────────────────────
    server.tool(
      'get_keyword_stats',
      'Get keyword performance. Useful for finding high CPA or underperforming keywords.',
      {
        days: z.number().default(30).describe('Lookback window in days'),
        max_cpa_inr: z.number().optional().describe('Filter keywords above this CPA in INR'),
        campaign_filter: z.string().optional().describe('Filter by campaign name substring'),
        limit: z.number().default(50).describe('Max number of keywords to return'),
      },
      async ({ days, max_cpa_inr, campaign_filter, limit }) => {
        let whereClause = `
          WHERE campaign.status = 'ENABLED'
            AND ad_group_criterion.status = 'ENABLED'
            AND segments.date DURING LAST_${days}_DAYS
            AND metrics.impressions > 0
        `
        if (campaign_filter) {
          whereClause += ` AND campaign.name LIKE '%${campaign_filter}%'`
        }
        if (max_cpa_inr) {
          whereClause += ` AND metrics.cost_per_conversion > ${max_cpa_inr * 1_000_000}`
        }

        const results = await gadsQuery(`
          SELECT
            campaign.name,
            ad_group.name,
            ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type,
            metrics.clicks,
            metrics.conversions,
            metrics.cost_micros,
            metrics.cost_per_conversion,
            metrics.impressions
          FROM keyword_view
          ${whereClause}
          ORDER BY metrics.cost_per_conversion DESC
          LIMIT ${limit}
        `)

        const summary = results.map(r => ({
          keyword: r.adGroupCriterion?.keyword?.text,
          match_type: r.adGroupCriterion?.keyword?.matchType,
          campaign: r.campaign?.name,
          ad_group: r.adGroup?.name,
          impressions: r.metrics?.impressions,
          clicks: r.metrics?.clicks,
          conversions: r.metrics?.conversions,
          spend_inr: ((r.metrics?.costMicros || 0) / 1_000_000).toFixed(2),
          cpa_inr: ((r.metrics?.costPerConversion || 0) / 1_000_000).toFixed(2),
        }))

        return {
          content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }]
        }
      }
    )

    // ─── Tool 3: Search Terms Report ───────────────────────────────────────
    server.tool(
      'get_search_terms',
      'Get actual search queries that triggered your ads. Great for finding new keyword opportunities or negative keywords.',
      {
        days: z.number().default(30).describe('Lookback window in days'),
        min_impressions: z.number().default(5).describe('Minimum impressions to include'),
        campaign_filter: z.string().optional().describe('Filter by campaign name substring'),
        limit: z.number().default(100).describe('Max number of search terms to return'),
      },
      async ({ days, min_impressions, campaign_filter, limit }) => {
        let whereClause = `
          WHERE segments.date DURING LAST_${days}_DAYS
            AND metrics.impressions >= ${min_impressions}
        `
        if (campaign_filter) {
          whereClause += ` AND campaign.name LIKE '%${campaign_filter}%'`
        }

        const results = await gadsQuery(`
          SELECT
            search_term_view.search_term,
            campaign.name,
            ad_group.name,
            metrics.impressions,
            metrics.clicks,
            metrics.conversions,
            metrics.cost_micros
          FROM search_term_view
          ${whereClause}
          ORDER BY metrics.conversions DESC, metrics.clicks DESC
          LIMIT ${limit}
        `)

        const summary = results.map(r => ({
          search_term: r.searchTermView?.searchTerm,
          campaign: r.campaign?.name,
          ad_group: r.adGroup?.name,
          impressions: r.metrics?.impressions,
          clicks: r.metrics?.clicks,
          conversions: r.metrics?.conversions,
          spend_inr: ((r.metrics?.costMicros || 0) / 1_000_000).toFixed(2),
        }))

        return {
          content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }]
        }
      }
    )

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

    // ─── Tool 5: Budget Pacing ──────────────────────────────────────────────
    server.tool(
      'get_budget_pacing',
      'Check how campaigns are pacing against their daily budgets. Flags over/under-spending.',
      {},
      async () => {
        const results = await gadsQuery(`
          SELECT
            campaign.name,
            campaign.status,
            campaign_budget.amount_micros,
            metrics.cost_micros,
            metrics.clicks,
            metrics.conversions
          FROM campaign
          WHERE campaign.status = 'ENABLED'
            AND segments.date DURING LAST_7_DAYS
          ORDER BY metrics.cost_micros DESC
        `)

        const summary = results.map(r => {
          const dailyBudget = (r.campaignBudget?.amountMicros || 0) / 1_000_000
          const spend7d = (r.metrics?.costMicros || 0) / 1_000_000
          const avgDailySpend = spend7d / 7
          const pacing = dailyBudget > 0 ? ((avgDailySpend / dailyBudget) * 100).toFixed(1) : 'N/A'
          const pacingNum = parseFloat(pacing)
          const status = pacingNum > 110 ? '🔴 OVER' : pacingNum < 70 ? '🟡 UNDER' : '🟢 ON TRACK'

          return {
            campaign: r.campaign?.name,
            daily_budget_inr: dailyBudget.toFixed(2),
            avg_daily_spend_inr: avgDailySpend.toFixed(2),
            pacing_pct: `${pacing}%`,
            status,
            conversions_7d: r.metrics?.conversions,
          }
        })

        return {
          content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }]
        }
      }
    )

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

  },
  {},
  {
    basePath: '/api',
    maxDuration: 60,
    verboseLogs: true,
  }
)

export async function GET(req: Request) {
  // Return SSE headers to satisfy Claude.ai's transport discovery GET
  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

export { handler as POST }
