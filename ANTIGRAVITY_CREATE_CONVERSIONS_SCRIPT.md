# Create 12 Google Ads Conversion Actions via Script

**Owner:** Antigravity
**Date:** March 2026
**Dependency:** Requires `.env.local` with Google Ads credentials already set in the project

---

## Context

Google Ads UI does not allow creating `UPLOAD_CLICKS` type conversion actions (required for server-side Conversions API). This script creates all 12 conversion actions correctly via the API in one shot.

---

## Step 1 — Create the Script File

Create a new file called `create-conversion-actions.js` in the **project root** (same level as `package.json`):

```javascript
const fetch = require('node-fetch')
require('dotenv').config({ path: '.env.local' })

const CUSTOMER_ID = '4064995850'
const MCC_ID = '8910137241'

const CONVERSION_ACTIONS = [
  'Form Submission | CTA - BLR | Submit_Lead_Primary',
  'Form Submission | CTA - BLR | Book_Demo',
  'Form Submission | CTA - BLR | Download_Brochure',
  'Form Submission | CTA - BLR | Hero_CheckEligibility',
  'Form Submission | CTA - BLR | Hero_DownloadBrochure',
  'Form Submission | CTA - BLR | Placement_CheckEligibility',
  'Form Submission | CTA - BLR | Curriculum_DownloadBrochure',
  'Form Submission | CTA - BLR | Certificate_CheckEligibility',
  'Form Submission | CTA - BLR | Pricing_SignupDemo',
  'Form Submission | CTA - BLR | Enrol_CheckEligibility',
  'Form Submission | CTA - BLR | Bottom_CheckEligibility',
  'Form Submission | CTA - BLR | Sticky_CheckEligibility',
]

async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.GOOGLE_ADS_CLIENT_ID,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  })
  const data = await res.json()
  if (!data.access_token) {
    throw new Error(`OAuth failed: ${JSON.stringify(data)}`)
  }
  return data.access_token
}

async function createConversionAction(name, accessToken) {
  const res = await fetch(
    `https://googleads.googleapis.com/v23/customers/${CUSTOMER_ID}/conversionActions:mutate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
        'login-customer-id': MCC_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operations: [{
          create: {
            name,
            type: 'UPLOAD_CLICKS',
            category: 'LEAD',
            status: 'ENABLED',
            count_type: 'ONE_PER_CLICK',
            click_through_lookback_window_days: 30,
            value_settings: {
              default_value: 0,
              always_use_default_value: true,
            },
          }
        }]
      })
    }
  )
  const data = await res.json()
  return data
}

async function main() {
  console.log('Getting access token...')
  const token = await getAccessToken()

  console.log('\nCreating conversion actions...\n')
  const results = []

  for (const name of CONVERSION_ACTIONS) {
    const result = await createConversionAction(name, token)
    if (result.results?.[0]?.resourceName) {
      const resourceName = result.results[0].resourceName
      const ctId = resourceName.split('/').pop()
      console.log(`✅ ${name}`)
      console.log(`   ctId: ${ctId}\n`)
      results.push({ name, ctId })
    } else {
      console.log(`❌ Failed: ${name}`)
      console.log(`   Error: ${JSON.stringify(result)}\n`)
    }
  }

  console.log('\n=== SUMMARY TABLE ===\n')
  console.log('| # | Name | ctId |')
  console.log('|---|---|---|')
  results.forEach((r, i) => {
    console.log(`| ${i + 1} | ${r.name} | ${r.ctId} |`)
  })
}

main().catch(console.error)
```

---

## Step 2 — Install Dependencies

```bash
npm install node-fetch dotenv
```

---

## Step 3 — Run the Script

```bash
node create-conversion-actions.js
```

---

## Step 4 — Expected Output

The script will print a summary table like this:

```
Getting access token...

Creating conversion actions...

✅ Form Submission | CTA - BLR | Submit_Lead_Primary
   ctId: 7XXXXXXXXX

✅ Form Submission | CTA - BLR | Book_Demo
   ctId: 7XXXXXXXXX

... (all 12)

=== SUMMARY TABLE ===

| # | Name | ctId |
|---|---|---|
| 1 | Form Submission | CTA - BLR | Submit_Lead_Primary | 7XXXXXXXXX |
| 2 | Form Submission | CTA - BLR | Book_Demo | 7XXXXXXXXX |
...
```

**Copy the full summary table and share it with Dhaval.**

---

## Step 5 — Update `app/api/track-conversion/route.ts`

Once you have the ctId values, update the `CONVERSION_MAP` with all 12 entries:

```typescript
const CONVERSION_MAP: Record<string, string> = {
  // Core actions
  lp_blr_submit_lead_primary:           'CTID_1',
  lp_blr_book_demo:                     'CTID_2',
  lp_blr_download_brochure:             'CTID_3',

  // Per-CTA BLR actions
  lp_hero_check_eligibility:            'CTID_4',
  lp_hero_download_brochure:            'CTID_5',
  lp_placement_check_eligibility:       'CTID_6',
  lp_curriculum_download_brochure:      'CTID_7',
  lp_certificate_check_eligibility:     'CTID_8',
  lp_pricing_signup_demo:               'CTID_9',
  lp_enrol_check_eligibility:           'CTID_10',
  lp_bottom_check_eligibility:          'CTID_11',
  lp_sticky_check_eligibility:          'CTID_12',
}
```

Replace `CTID_1` through `CTID_12` with the actual ctId values from the script output.

---

## Step 6 — Apply All Remaining Code Changes

After updating `route.ts`, apply all the frontend changes from `ANTIGRAVITY_CODE_TASK_LIST.md` (steps 2 through 5).

---

## Step 7 — Commit and Push

```bash
# Clean up — don't commit the script or node-fetch
rm create-conversion-actions.js

git add app/api/track-conversion/route.ts
git add app/data-science-specialization-course-lg/page.tsx
git add app/components/HowToEnrol.tsx
git add app/components/BottomCTA.tsx
git commit -m "feat: create 12 UPLOAD_CLICKS conversion actions and wire per-CTA tracking"
git push
```

---

## Step 8 — Verify

Run this curl after deployment to confirm the first action works:

```bash
curl -X POST https://lp-vercel.analytixlabs.co.in/api/track-conversion \
  -H "Content-Type: application/json" \
  -d '{"ctaName":"lp_blr_submit_lead_primary","gclid":"CjwKCAjwvqjOBhAGEiwAngeQndqXCtl4HUBtot7vJfIJp6pIl9ygZmZe-GSQwOlWdP4bafKTGnHjMRoCl4cQAvD_BwE"}'
```

**Expected success response (no partialFailureError):**
```json
{
  "success": true,
  "result": {
    "results": [
      { "conversionAction": "customers/4064995850/conversionActions/XXXXXXXXXX" }
    ]
  }
}
```

Share the curl response with Dhaval to confirm end to end.

---

## Checklist

- [ ] `create-conversion-actions.js` created in project root
- [ ] `node-fetch` and `dotenv` installed
- [ ] Script run successfully — all 12 show ✅
- [ ] Summary table shared with Dhaval
- [ ] `CONVERSION_MAP` updated in `route.ts` with all 12 ctId values
- [ ] All frontend changes from `ANTIGRAVITY_CODE_TASK_LIST.md` applied
- [ ] `create-conversion-actions.js` deleted before committing
- [ ] All 5 files committed to correct paths and pushed
- [ ] Curl test returns success with no `partialFailureError`
- [ ] Curl response shared with Dhaval
