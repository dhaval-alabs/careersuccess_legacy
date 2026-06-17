# AnalytixLabs — Data Collection & Pipeline Knowledge
## careersuccess-legacy · Full Reference: Form → CRM → Google Sheets → Google Ads
**Last updated:** June 2026 | Covers all sessions through May 2026

---

## 1. Architecture Overview

Every lead submitted on any PPC landing page flows through three parallel destinations simultaneously:

```
User submits form on landing page
            │
            ▼
  LeadCaptureForm.tsx (client)
            │
            ├──► POST /app/actions/leads (Server Action)
            │         │
            │         ├──► LeadSquared CRM (REST API, server-side)
            │         └──► Google Sheets (async duplication)
            │
            └──► POST /api/track-conversion (API Route, keepalive: true)
                      │
                      └──► Google Ads Conversions API (server-side, hashed email)
```

**OTP check** fires before form submit (WhatsApp OTP via Meta Cloud API). OTP status is captured in `mx_OTP_Status` and sent to both CRM and Sheets.

**gtag (client-side)** fires on 4 Thank You pages for Primary conversion actions (Verified Lead|Eligibility, Verified Lead|Brochure). This is the PRIMARY signal for Smart Bidding — it runs parallel to, not instead of, the server-side API.

---

## 2. What Data Is Collected

### 2.1 Explicit Form Fields (user-submitted)

| Field | Notes |
|---|---|
| Full Name | Split into FirstName / LastName for CRM |
| Email Address | Primary dedup key in LSQ |
| Mobile Number | 10-digit, combined with country code |
| Country Code | +91 / +1 / +44 / +61 |
| Current City | Dropdown — 15 cities |
| Privacy Policy Consent | Checkbox — required |
| OTP Code | Entered by user — compared server-side |

### 2.2 Implicit Behavioural Data (captured via JS, no user input)

| Field | How captured |
|---|---|
| CTA / Lead Source | Prop passed into form component per CTA button |
| UTM Source | Read from URL on page load → `sessionStorage` |
| UTM Medium | Same |
| UTM Campaign | Same |
| UTM Term | Same (keyword) |
| UTM Content | Same |
| GCLID | Read from URL on page load → `sessionStorage` |
| Time on Page (seconds) | `Date.now()` delta from page load to submit |
| Max Scroll Depth (%) | `window.scrollY` listener — highest % reached |
| Form Completion Time (seconds) | Delta from first field `onFocus` to submit |
| First Field Touched | Field name on first `onFocus` event |
| Device Type | Derived from `window.innerWidth` → Mobile / Tablet / Desktop |
| Viewport Width (px) | `window.innerWidth` at submit |
| Referrer URL | `document.referrer` at submit |
| Landing Page URL | `window.location.href` at submit (full URL + query string) |
| Submission Timestamp | `new Date().toISOString()` |
| OTP Status | Unverified / Verified / Fallback |

### 2.3 sessionStorage Key Naming Convention

All UTM params and GCLID are prefixed `alabs_` to prevent collisions with third-party scripts:

```
alabs_utm_source
alabs_utm_medium
alabs_utm_campaign
alabs_utm_term
alabs_utm_content
alabs_gclid
```

Captured on **first page load** via `utils/captureUtm.ts`. Uses `sessionStorage` (not `localStorage`) — clears at session end.

---

## 3. Destination 1 — LeadSquared CRM

### 3.1 Connection

- **Method:** Server-side REST API call from Next.js Server Action (`app/actions/leads.ts`)
- **Credentials:** Vercel environment variables only — never in client code

| Variable | Purpose |
|---|---|
| `LSQ_HOST` | e.g. `api.leadsquared.com` |
| `LSQ_ACCESS_KEY` | CRM access key |
| `LSQ_SECRET_KEY` | CRM secret key |

### 3.2 Standard & Field Mappings Sent

| LSQ Field | Source |
|---|---|
| `FirstName` | Parsed from Full Name (split on first space) |
| `LastName` | Remainder of Full Name |
| `EmailAddress` | Form input |
| `Phone` | Form input (10-digit only for +91; prefix + mobile for other countries) |
| `mx_City_name` | City dropdown (Note: maps to `mx_City_name` in CRM, not `mx_City`) |
| `mx_GCLID` | Google Click ID (sent as direct field) |
| `Source` | Maps to `typeFilter` (e.g. `PPC_CheckEligibility`) |

### 3.3 Technical Data Consolidation (`mx_Extra_Notes`)

> [!IMPORTANT]
> To prevent schema errors (412 errors), UTM parameters, behavioral tracking, and extra fields are consolidated and sent to LeadSquared in a single text field called **`mx_Extra_Notes`**, rather than as individual custom properties. 

The following properties are compiled into the `mx_Extra_Notes` text block:
- **Status:** `body.status` (e.g., Unverified / Verified / Fallback)
- **Source CTA:** `body.form_source` (granular CTA identifier)
- **Type Filter:** `body.typeFilter` (PPC intent category)
- **UTM Source:** `utm_source`
- **UTM Medium:** `utm_medium`
- **UTM Campaign:** `utm_campaign`
- **UTM Term:** `utm_term`
- **UTM Content:** `utm_content`
- **GCLID:** `gclid`
- **Device:** `device_type`
- **Viewport:** `viewport_width` (in px)
- **Time on Page:** `time_on_page_seconds` (in seconds)
- **Scroll Depth:** `max_scroll_pct` (percentage)
- **Form Completion:** `form_completion_seconds` (in seconds)
- **First Field:** `first_field_touched`
- **Referrer:** `referrer_url`
- **Submission URL:** `landing_page_url`
- **Timestamp:** `submission_timestamp`
- **Country Code:** `countryCode`

**Notes Field:** Maps to a friendly string describing the conversion source: `Alabs landing page submission: [Friendly Name of CTA]` (formatted via `formatLeadNotesFriendly`).

**mx_OTP_Status:** This is sent as a direct update via the verification route (`app/api/otp/verify/route.ts`) when the user successfully validates the OTP, updating the field value to `Verified`.

### 3.4 CRM Lead Source Architecture

**Two-field system:**

```
mx_Lead_Source_CTA  →  Master grouping (3 values only)
mx_notes            →  Granular source (unique per CTA + page + section)
```

**Master values:**

| mx_Lead_Source_CTA | Triggered by |
|---|---|
| `CheckEligibility` | Any eligibility form/CTA |
| `DownloadBrochure` | Any brochure form/CTA |
| `SignupDemo` | Any demo/signup form/CTA |
| `Masterclass` | Reserved — not currently active on PPC pages |

**Granular source naming convention (`mx_notes`):**

```
Format:  PPC_{CITY}_{conversion_key}
Example: PPC_DEL_dsai_del_hero_check_eligibility
         PPC_BLR_lp_hero_download_brochure
         PPC_BLR_Pricing_SignupDemo
```

### 3.5 typeFilter Groups (for CRM segmentation)

| typeFilter | Covers |
|---|---|
| `PPC_CheckEligibility` | All eligibility CTAs — high intent |
| `PPC_downloadBrochure` | All brochure CTAs — mid intent |
| `signUpForDemo` | All demo/signup CTAs — high intent |

---

## 4. Destination 2 — Google Sheets

### 4.1 Connection

Leads are **async-duplicated** to Google Sheets after the CRM submission. Failure to write to Sheets does not block the CRM write.

**Target sheet:** Career Success G Sheet → **NextJS tab**

### 4.2 Column Mapping

| Column | Field |
|---|---|
| A–P | Standard lead fields + UTMs + behavioural data (mirrors CRM fields) |
| Q | `mx_OTP_Status` (Unverified / Verified / Fallback) |

### 4.3 Row Matching

Row matching uses phone number for upsert logic — if a phone already exists in the sheet, the row is updated rather than a duplicate created. Known issue: 177 duplicate phones were found in the 49-day benchmark window (259 extra rows) — this is a pre-upsert legacy issue.

### 4.4 MCP Access

Google Sheets data is accessible via the `AL Google Sheets` MCP connector (`alabs-gsheets-mcp.vercel.app`) with 8 tools: `read_sheet`, `append_rows`, `update_row`, `update_cell`, `delete_rows`, `format_cells`, `get_sheet_metadata`, `create_sheet`.

---

## 5. Destination 3 — Google Ads Conversions API

### 5.1 Architecture: Hybrid Tracking (LIVE May 2026)

Two parallel conversion signals run simultaneously — they track **different actions** on **different pages**:

| Signal | Type | Where | What it tracks | Role in Smart Bidding |
|---|---|---|---|---|
| **gtag on Thank You pages** | Client-side | 4 thank-you pages | Verified Lead|Eligibility, Verified Lead|Brochure | **PRIMARY** |
| **Server-side `/api/track-conversion`** | Server-side | API route called on form submit | Form Sub|Eligibility, Form Sub|Brochure | **SECONDARY** |

> **Why hybrid?** The gtag Thank You page signal is used as PRIMARY because Smart Bidding performs better with direct page-load signals. The server-side API acts as a secondary/fallback and also feeds CRM attribution. `DISABLE_GADS_UPLOAD=true` env var controls whether the server-side route actually uploads to Google Ads (currently `true` for CRM-only mode on the server side, with gtag as primary).

### 5.2 Google Ads Account Details

| Field | Value |
|---|---|
| Account Customer ID | `4064995850` (406-499-5850) |
| MCC Account ID | `8910137241` (891-013-7241) |
| gtag Account | `AW-783236209` (used on thank-you pages) |
| API Version | v23 |

### 5.3 gtag — Primary Conversion Actions (Thank You Pages)

4 active Webpage conversion actions in Google Ads (`AW-783236209`):

| Conversion Action | Type | Page |
|---|---|---|
| Verified Lead\|Eligibility | Primary | `/thankyou-check-your-eligibility/` |
| Verified Lead\|Brochure | Primary | `/thankyou-download-brochure/` |
| Form Sub\|Eligibility | Secondary | `/thankyou-check-your-eligibility/` |
| Form Sub\|Brochure | Secondary | `/thankyou-download-brochure/` |

**Enhanced Conversions:** Each gtag fire includes `user_data` with email + phone + first name. `gtag` auto-hashes these before sending to Google. Enables cross-device attribution.

```ts
window.gtag('event', 'conversion', {
  send_to: conversionId,
  user_data: {
    email,           // from ?email= URL param on thank-you page
    phone_number,    // from ?phone= URL param, formatted +91XXXXXXXXXX
    address: { first_name: firstName },
  },
});
```

### 5.4 Server-Side API — `/api/track-conversion`

**Endpoint:**
```
POST https://lp-vercel.analytixlabs.co.in/api/track-conversion
```

**Request body:**
```json
{
  "ctaName": "dsai_del_hero_check_eligibility",
  "gclid": "EAIaIQobChMI...",
  "email": "user@example.com"
}
```

**What the route does:**
1. Looks up `ctaName` in `CONVERSION_MAP` to get the Google Ads conversion action ID
2. SHA-256 hashes the email server-side (raw email never sent to Google)
3. Calls Google Ads Conversions API v23 with GCLID + hashed email + conversion action
4. Returns success/error JSON

**Key implementation details:**
- `keepalive: true` on all `fireConversion` fetch calls — ensures request completes even if page redirects immediately after submit
- Guard: `fireConversion` no-ops silently if `ctaName` is empty
- OAuth access token cached in-memory with 55-minute TTL — no round-trip to Google OAuth on every call
- Full CORS headers on the endpoint — required because Cloudflare-routed domain (`careersuccess.analytixlabs.co.in`) makes cross-origin requests to Vercel

### 5.5 CONVERSION_MAP — All 60 Server-Side Actions

> [!IMPORTANT]
> The server-side API `/api/track-conversion` performs exact key lookups against `CONVERSION_MAP`. The key names are case-sensitive and must use the exact casing specified below.

#### Original BLR Page (12 actions — `lp_blr_*`)

| Section | Code Key (Exact Case-Sensitive) |
|---|---|
| Hero inline form (generic) | `lp_blr_submit_lead_primary` |
| Hero — Check Eligibility | `lp_Hero_CheckEligibility` |
| Hero — Download Brochure | `lp_Hero_DownloadBrochure` |
| Placement section | `lp_Placement_CheckEligibility` |
| Curriculum section | `lp_Curriculum_DownloadBrochure` |
| Certificate section | `lp_Certificate_CheckEligibility` |
| Pricing — Signup Demo | `lp_Pricing_SignupDemo` |
| Enrol section | `lp_Enrol_CheckEligibility` |
| Bottom CTA | `lp_Bottom_CheckEligibility` |
| Sticky bar | `lp_Sticky_CheckEligibility` |
| Book Demo modal | `lp_blr_book_demo` |
| Download Brochure modal | `lp_blr_download_brochure` |

#### DSAI City Pages (48 actions — 12 per city)

Each city uses the same 12 sections with its prefix (`dsai_del_`, `dsai_noi_`, `dsai_grg_`, `dsai_blr_`):

| Section | Delhi Key | Noida Key | Gurgaon Key | BLR2 Key |
|---|---|---|---|---|
| Hero submit (primary) | `dsai_del_submit_lead_primary` | `dsai_noi_submit_lead_primary` | `dsai_grg_submit_lead_primary` | `dsai_blr_submit_lead_primary` |
| Hero Check Eligibility | `dsai_del_Hero_CheckEligibility` | `dsai_noi_Hero_CheckEligibility` | `dsai_grg_Hero_CheckEligibility` | `dsai_blr_Hero_CheckEligibility` |
| Hero Download Brochure | `dsai_del_Hero_DownloadBrochure` | `dsai_noi_Hero_DownloadBrochure` | `dsai_grg_Hero_DownloadBrochure` | `dsai_blr_Hero_DownloadBrochure` |
| Placement | `dsai_del_Placement_CheckEligibility` | `dsai_noi_Placement_CheckEligibility` | `dsai_grg_Placement_CheckEligibility` | `dsai_blr_Placement_CheckEligibility` |
| Curriculum | `dsai_del_Curriculum_DownloadBrochure` | `dsai_noi_Curriculum_DownloadBrochure` | `dsai_grg_Curriculum_DownloadBrochure` | `dsai_blr_Curriculum_DownloadBrochure` |
| Certificate | `dsai_del_Certificate_CheckEligibility` | `dsai_noi_Certificate_CheckEligibility` | `dsai_grg_Certificate_CheckEligibility` | `dsai_blr_Certificate_CheckEligibility` |
| Pricing Demo | `dsai_del_Pricing_SignupDemo` | `dsai_noi_Pricing_SignupDemo` | `dsai_grg_Pricing_SignupDemo` | `dsai_blr_Pricing_SignupDemo` |
| Enrol | `dsai_del_Enrol_CheckEligibility` | `dsai_noi_Enrol_CheckEligibility` | `dsai_grg_Enrol_CheckEligibility` | `dsai_blr_Enrol_CheckEligibility` |
| Bottom CTA | `dsai_del_Bottom_CheckEligibility` | `dsai_noi_Bottom_CheckEligibility` | `dsai_grg_Bottom_CheckEligibility` | `dsai_blr_Bottom_CheckEligibility` |
| Sticky | `dsai_del_Sticky_CheckEligibility` | `dsai_noi_Sticky_CheckEligibility` | `dsai_grg_Sticky_CheckEligibility` | `dsai_blr_Sticky_CheckEligibility` |
| Book Demo | `dsai_del_book_demo` | `dsai_noi_book_demo` | `dsai_grg_book_demo` | `dsai_blr_book_demo` |
| Download Brochure | `dsai_del_download_brochure` | `dsai_noi_download_brochure` | `dsai_grg_download_brochure` | `dsai_blr_download_brochure` |

> **Note:** All 48 DSAI actions + 12 BLR actions were created as `UPLOAD_CLICKS` type. Task pending: **pause the 60 `UPLOAD_CLICKS` actions** — they are replaced by the hybrid gtag Thank You page setup as Primary. The server-side route currently has `DISABLE_GADS_UPLOAD=true`.

### 5.6 Click Tracking (non-conversion gtag events)

Two click events fire via `window.gtag('event', ...)` directly on the landing page (not Thank You pages):

| Element | Event Name | Notes |
|---|---|---|
| Hero phone number link | `CS-Calls` | |
| Sticky bar phone link | `CS-Calls` | |
| Sticky bar WhatsApp link | `CS-WhatsApp` | |

> ⚠️ **Smart Bidding issue:** `CS-Calls` + `CS-WhatsApp` account for **36.9% of all conversion signals** and inflate Smart Bidding. These are click events, not lead conversions. Pending fix: change Call Extension counting from Every → One.

---

## 6. OTP Flow

### 6.1 What It Does

WhatsApp OTP fires on Hero inline form + all modal forms before allowing submit. Delivery is via Meta Cloud API direct (no third-party Xbot).

### 6.2 Credentials

| Field | Value |
|---|---|
| Meta Phone ID | `105143282358005` |
| Template name | `form_otp` |
| Signing | HMAC |

### 6.3 Flow

```
User enters phone number
        ↓
OTP request sent via Meta Cloud API → WhatsApp message to user
        ↓
User enters 6-digit OTP
        ↓
HMAC verified server-side
        ↓
OTP status set: Verified / Unverified / Fallback (if delivery failed)
        ↓
Form submit proceeds regardless of OTP status
(OTP status is recorded, not a hard gate)
```

### 6.4 OTP Status in Data Pipeline

| Destination | Field | Values |
|---|---|---|
| LeadSquared CRM | `mx_OTP_Status` | `Unverified` / `Verified` / `Fallback` |
| Google Sheets | Column Q | Same |

---

## 7. Thank You Page Data Flow

### 7.1 URL Pattern

After successful form submit, user is redirected to:
```
/thankyou-{slug}/?email=user@example.com&name=John+Doe&phone=9199999999
```

Email, name, phone passed as URL params for personalised confirmation display AND for gtag Enhanced Conversions.

### 7.2 Four Thank You Pages

| CTA | Route | gtag Conversion ID (`AW-783236209/...`) |
|---|---|---|
| Check Your Eligibility | `/thankyou-check-your-eligibility/` | `wuuECKD9hv4aEPH4vPUC` |
| Download Brochure | `/thankyou-download-brochure/` | `389QCJfKlv4aEPH4vPUC` |
| Masterclass | `/thankyou-for-registration/` | `8w9vCIrelv4aEPH4vPUC` |
| Sign Up for Demo | `/thankyou-signup/` | `VXQtCOvzhf4aEPH4vPUC` |

---

## 8. Cloudflare Worker Routing

The Cloudflare Worker (`analytixlabs-lp-router`) routes traffic at `careersuccess.analytixlabs.co.in`:

| URL Pattern | Referer | Destination |
|---|---|---|
| `/lp/*` (except thankyou) | any | Vercel |
| `/lp/thankyou-*` | came from `/lp/` | Vercel |
| `/lp/thankyou-*` | came from WordPress | WordPress |
| `/thankyou-*` | came from `/lp/` | Redirect → `/lp/thankyou-*` → Vercel |
| `/_next/*` | any | Vercel |
| everything else | any | WordPress |

> **Pending migration:** Move `careersuccess.analytixlabs.co.in` to direct Vercel custom domain. Sequence: add domain in Vercel → get CNAME → update CF DNS → disable Worker route. Note: `fireConversion` in `route.ts` currently references `lp-vercel.analytixlabs.co.in/api/track-conversion` — verify post-migration.

---

## 9. Google Ads MCP Tools

Two MCP servers available for campaign analysis:

### 9.1 Standalone GAds MCP (`GAds_Vercel_MCP`)
**URL:** `alabs-mcp-server.vercel.app/api/mcp`

| Tool | Purpose |
|---|---|
| `get_campaign_stats` | Clicks, conversions, spend, CPA by campaign |
| `get_keyword_stats` | Keyword performance, filter by CPA |
| `get_search_terms` | Actual search queries (use `min_impressions: 3`, `limit: 100`, 30-day window) |
| `get_conversion_stats` | Conversions by action name — shows which CTA converted |
| `get_budget_pacing` | Daily budget vs actual spend |
| `lookup_gclid` | Look up a specific GCLID day-by-day |

### 9.2 LP-Embedded MCP (legacy)
**URL:** `careersuccess-legacy.vercel.app/api/mcp` — same 6 tools, prefer standalone.

> **Cold start warning:** After any new Vercel deploy, SSE connection resets. MCP tools return HTML instead of JSON in the same session. Always start a fresh conversation after a deploy.

---

## 10. Key Environment Variables (Vercel Dashboard)

| Variable | Purpose |
|---|---|
| `LSQ_HOST` | LeadSquared API host |
| `LSQ_ACCESS_KEY` | LeadSquared access key |
| `LSQ_SECRET_KEY` | LeadSquared secret key |
| `GADS_DEVELOPER_TOKEN` | Google Ads API developer token |
| `GADS_CLIENT_ID` | Google OAuth client ID |
| `GADS_CLIENT_SECRET` | Google OAuth client secret |
| `GADS_REFRESH_TOKEN` | Google OAuth refresh token |
| `GADS_CUSTOMER_ID` | `4064995850` |
| `DISABLE_GADS_UPLOAD` | `true` = server-side route skips Google Ads upload (CRM only) |
| `META_PHONE_ID` | `105143282358005` (OTP) |
| `META_ACCESS_TOKEN` | Meta Cloud API token |
| `META_OTP_SECRET` | HMAC signing secret for OTP |
| `NEXT_PUBLIC_BATCH_DATE` | Current batch date (managed via env to avoid deploys) |
| `NEXT_PUBLIC_BROCHURE_URL` | Brochure download URL (managed via env) |

---

## 11. Open Tasks (Data Pipeline)

| Task | Priority | Notes |
|---|---|---|
| Pause 60 `UPLOAD_CLICKS` actions (12 BLR + 48 DSAI) | High | Replaced by hybrid gtag setup — these inflate conversion counts |
| Change Call Extension counting Every → One | High | `CS-Calls` is 36.9% of signals — distorting Smart Bidding |
| Demote SignUp For Demo to Secondary conversion | Medium | Not a primary purchase-intent signal |
| Fix `lookup_gclid` conversion metrics display bug | Medium | Brief sent to Antigravity |
| CF Worker cleanup — remove WordPress dead-fallback logic | Low | WordPress fully shut down |
| Migrate careersuccess domain DNS to direct Vercel custom domain | Low | Sequence above; verify `fireConversion` URL post-migration |
| Thank-you page self-scheduler | High | Highest-leverage RNR reduction — not yet built |
| WhatsApp post-submission automation (within 60s) | High | Addresses 47.8% RNR |

---

*AnalytixLabs · careersuccess-legacy · Data Pipeline Knowledge · June 2026*
