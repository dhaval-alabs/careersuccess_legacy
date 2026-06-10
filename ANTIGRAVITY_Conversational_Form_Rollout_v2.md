# Antigravity Implementation Brief v2 — Conversational Lead Form (PPC Landing Pages)

**Project:** careersuccess-legacy (`dhaval-alabs/careersuccess_legacy`)
**Prepared:** May 2026 — **supersedes v1**
**Author:** Dhaval (AnalytixLabs)
**Status:** Conversation script APPROVED by management (Sumeet). Cleared to build. Pilot ships today.

---

## 0. What Changed Since v1

The management-approved script differs from the v1 draft. This brief reflects the **final approved version**. Key deltas:

- **5 questions → 4** (the "experience with data tools" question was removed to lift completion).
- **Q1 and Q2 now include freshers / first-jobbers** (new answer options).
- **Q3 timeline tightened** to: this month / next month or two / still figuring it out.
- **Q4 (callback time) is now shift-bounded** and includes a "pick a specific time" input restricted to Mon–Sat, 10 AM–6 PM.
- **We build our OWN `qualify.ts`** — do NOT reuse the masterclass scoring lib. New rubric, aligned to the new timeline bands (Section 9a).
- **Ack prompt hardened** — the on-page assistant must not make claims about fees, placement, curriculum, or guarantees (Section 9b). This is a written commitment to management.
- **Three subject variants**, not two (Section 5) — the pilot page is "Data Science Specialization".

---

## 1. Objective

Replace the flat form → OTP flow on the PPC landing pages with a short on-page **conversational assistant** (4 questions) that runs before OTP. It adds AI lead scoring (hot/warm/cold/junk) and a preferred-callback-time capture, both flowing into LeadSquared so sales can prioritise calls by intent and availability. This targets RNR directly.

**This is a UX + qualification layer only. It wraps around the existing conversion/attribution wiring, which does not change.**

---

## 2. Architecture Decision — NO Supabase

The masterclass source runs on Supabase. **careersuccess does not use a database and will not start.** Hard requirement.

| Masterclass (Supabase) | careersuccess (build this) |
|---|---|
| Insert row → `registrationId` | No DB, no registrationId |
| `scoreAndSave()` → Supabase | **Not used.** Score → LSQ + Sheet only |
| `saveConversation()` → Supabase | Conversation → Sheet column + LSQ `mx_Notes` (text) |
| Qualify keyed on `registrationId` | Qualify keyed on **phone + email** (LSQ lookup) |
| Admin portal | N/A |

The LSQ-tagging path (`RetrieveLeadByPhoneNumber` → `Lead.Update`) needs only phone/email and ports cleanly. **Do not install `@supabase/supabase-js`. No Supabase env vars.**

---

## 3. DO NOT TOUCH — Conversion & Attribution

Protected. The chat is additive UI; it must not alter:

- `fireConversion()` and `CONVERSION_MAP` in `app/api/track-conversion/route.ts`
- `ctaSource` state and all `dsai_*` / `lp_*` / `da_*` conversion keys
- `mx_Lead_Source_CTA` (master source) and `mx_notes` (granular `form_source`)
- Hybrid conversion: **gtag on the 4 thank-you pages stays PRIMARY**; `/api/track-conversion` stays `DISABLE_GADS_UPLOAD=true`
- The existing careersuccess **OTP send/verify routes** (Meta Cloud API direct, Phone ID `105143282358005`, template `form_otp`, HMAC, `crypto.randomInt`). **Keep these — do NOT swap in the masterclass OTP routes.**
- `canonical` + `robots` meta on every page — unchanged. PPC LPs stay `noindex`.
- `window.location.href` for the thank-you redirect (preserves referer for the Cloudflare Worker).
- The Cloudflare Worker — no changes.
- `app/globals.css` — append-only.

> If a value relates to *which CTA fired*, *attribution*, or *the conversion signal*, it's off-limits. The chat collects *intent*, not *attribution*.

---

## 4. The New Flow

```
Form fields (existing) → [initial submit]
        │  existing LSQ capture (Unverified) + Sheet append (lead durability;
        │  score + callback-time columns blank at this point)
        ▼
On-page conversational assistant  (4 questions; Gemini ack between them)
        │  Q4 captures preferredCallbackTime as a discrete value
        ▼
[chat complete] → existing OTP send (Meta Cloud API, template form_otp)
        ▼
OTP entry + verify (existing careersuccess verify route)
        │
        ├─ on verify success: ONE LSQ Lead.Update by phone →
        │     mx_OTP_Status = Verified
        │     mx_Lead_Score = <Hot|Warm|Cold|Junk>
        │     mx_Preferred_Callback_Time = <window or specific slot>
        ├─ /api/qualify (keepalive, fire-and-forget) → score + write conversation/Sheet
        └─ window.location.href → thank-you page (conversion fires as today)
```

Score and callback time are not known at initial submit (they come from the chat), so they're written in the **verify-success Lead.Update** by phone lookup — the same mechanism the existing OTP-verify flow already uses to flip `mx_OTP_Status`.

---

## 5. Per-Page Conversation Config (Option A — fixed questions, variable subject)

Identical question structure on every page; only the `{course}` token in Q2 changes. **Three subject variants:**

```ts
// lib/qualification-config.ts
export interface LpQualificationConfig {
  subject: string;          // injected into Q2
  questions: string[];      // 4 questions
  options: (string[])[];    // quick-reply options per question
}

export const QUALIFICATION_CONFIG: Record<string, LpQualificationConfig> = {
  // Pilot page — /data-science-specialization-course-lg
  'data-science-specialization': { subject: 'Data Science', /* questions+options: Section 11 */ },

  // DSAI city pages — /data-science-ai-course-{delhi,noida,gurgaon,bangalore}
  'data-science-ai':             { subject: 'Data Science & AI', /* … */ },

  // DA+AI city pages — /data-analytics-ai-course-{delhi,noida,gurgaon,bangalore}
  'data-analytics-ai':           { subject: 'Data Analytics & AI', /* … */ },
};
```

The page passes its config key → form → `QualificationChat`. `{course}` is interpolated into Q2 only.

> **Pilot page subject = "Data Science"** (the specialization program), per the `data-science-specialization` slug. Do not label the pilot page "Data Analytics & AI".

---

## 6. Components

### 6a. `QualificationChat` (port + adapt from masterclass)

- Keep the chat-bubble UI, quick-reply pills, free-text fallback, typing indicator, auto-scroll.
- **`onComplete` (pre-OTP) mode only** — hands the conversation array to the parent; parent fires OTP. Do not use thank-you-page mode.
- **careersuccess colours**: navy `#09263F`, teal `#29E8A4`. Re-map the masterclass teal `#1DE5B5`. **No green text on light backgrounds.**
- `QUESTIONS` / `QUESTION_OPTIONS` become props, sourced from the per-page config.
- **4 questions.** The component must handle a 4-item set cleanly (the masterclass had 5 — verify `questionIndex` bounds).
- **Q4 callback time** must surface its selected value as a discrete variable `preferredCallbackTime`, not only as a transcript line — the parent needs it as a structured field for LSQ + Sheet.
- **The "Let me pick a specific time" option** (Q4) opens a bounded input: Mon–Sat, **10 AM–6 PM only**. Reject/disable any slot outside the advisor roster. Store the chosen slot as the `preferredCallbackTime` string. This is a NEW input type not present in the masterclass — build it.

### 6b. Form wrapper (adapt existing careersuccess form)

- Insert the chat step between submit and OTP. States: `form → chatStep → otpStep → success`.
- On initial submit: existing validation → existing LSQ capture + Sheet append (Unverified) → enter `chatStep`. Keep `utils/trackBehaviour.ts` and all `fireConversion`/`ctaSource` plumbing untouched.
- Carry conversation in `chatConversationRef`; callback time in `preferredCallbackTimeRef`.
- On chat complete → existing OTP send.
- On OTP verify success → existing thank-you redirect (unchanged) + `/api/qualify` (keepalive) + the combined LSQ `Lead.Update` (Section 8).
- Keep anti-double-fire guards (`submittingInitialRef`, `submittingOtpRef`).
- **Do NOT port** the masterclass duplicate-block logic (it 409s on any existing row and hard-blocks unverified returnees). careersuccess has no DB dupe check — leave it that way.

---

## 7. Google Sheet Changes

Career Success G Sheet → **NextJS tab**. Add columns to the right (do not reorder existing — capture append is positional):

| New Column | Contents | When |
|---|---|---|
| Lead Score | Hot / Warm / Cold / Junk | after scoring |
| Preferred Callback Time | window or specific slot | after chat |
| Qualification Notes | one-line Gemini `reason` (optional) | after scoring |

**Write mechanism (recommended, deterministic):** at initial submit, generate a client-side `leadRowId` (UUID), write it into a hidden Sheet column in the initial append, then at verify success locate that row by `leadRowId` and `values.update` the three cells. No duplicates, no race. (Simpler fallback: defer the entire Sheet append to verify success — but then chat/OTP-abandoners won't appear in the Sheet; they remain in LSQ as Unverified, so not lost. LSQ is the system of record either way.)

---

## 8. LeadSquared — New Custom Fields

CRM-admin task (Dhaval, not Antigravity): create

| Field | Type | Values |
|---|---|---|
| `mx_Lead_Score` | Text | Hot / Warm / Cold / Junk |
| `mx_Preferred_Callback_Time` | Text | window or specific slot |

Write all three attributes in **one** `Lead.Update` at verify success (by phone lookup), avoiding three round-trips:

```
[
  { Attribute: 'mx_OTP_Status', Value: 'Verified' },
  { Attribute: 'mx_Lead_Score', Value: <Hot|Warm|Cold|Junk> },
  { Attribute: 'mx_Preferred_Callback_Time', Value: <window or slot> }
]
```

---

## 9. Routes & Scoring Lib

### 9a. `lib/qualify.ts` — NEW, careersuccess-owned (do NOT reuse masterclass)

Write a fresh `scoreConversation()`. Reuse the masterclass's robust **parsing** (regex fast-path + JSON slow-path, 55s timeout, Gemini `gemini-2.5-flash`, temp 0). But use **our own rubric**, aligned to the approved Q3 timeline bands:

```
TIERS (careersuccess — aligned to approved script):
- hot:  clear goal, wants to start THIS MONTH, high intent
- warm: clear goal but a month or two out, or comparing options / moderate fit
- cold: still exploring, no firm timeline, early research
- junk: bot, gibberish, fake details, or zero / irrelevant intent
```

Return `{ score, reason }`. **No `scoreAndSave` / Supabase.** Scoring results are persisted by the qualify route (Section 9c) to LSQ + Sheet.

> Note on "junk": the Gemini scorer only sees the *conversation*, so it can't know OTP outcome. "Failed verification" leads are tagged separately via the existing `mx_OTP_Status = Fallback` — do NOT ask Gemini to infer verification status.

### 9b. `app/api/chat/ack/route.ts` — port + HARDEN guardrail

Port the "Aria" acknowledgment endpoint (non-blocking, 8s timeout, ≤60 tokens, the "no Great/Awesome/Perfect" rules). **Add an explicit claim-safety guardrail to the prompt** — this is the written commitment to management:

> Add to the ack system prompt: *"You may only acknowledge what the prospect said. NEVER state or imply any fact about fees, pricing, placement rates, guarantees, curriculum, batch dates, or outcomes. Make no promises. If the prospect asks such a question, do not answer it — produce a neutral acknowledgement only."*

### 9c. `app/api/qualify/route.ts` — port + adapt (no Supabase)

- `scoreConversation()` → `updateLsqLeadScore(phone, email, score)` (LSQ tag by phone/email lookup — keep this path).
- Write score + `reason` + conversation text to the Google Sheet (Section 7) and LSQ `mx_Notes`.
- **Remove** the `scoreAndSave({ registrationId })` call (Supabase).
- **Remove** the Meta CAPI / Stape block — careersuccess uses hybrid **gtag**, has no Stape sGTM container. Do not introduce Stape.
- Fire-and-forget, keepalive.

---

## 10. Environment Variables (new, careersuccess Vercel project)

| Var | Value |
|---|---|
| `GEMINI_API_KEY` | (provided by Dhaval) |
| `GEMINI_MODEL` | `gemini-2.5-flash` |
| `LSQ_LEAD_SCORE_FIELD` | `mx_Lead_Score` (optional override) |

No new npm packages — native `fetch` + existing `lucide-react`.

---

## 11. Approved Conversation Script (build EXACTLY this)

`{course}` = `Data Science` (pilot/specialization) · `Data Science & AI` (DSAI pages) · `Data Analytics & AI` (DA pages).

**Opening:** "Hi {first name} 👋  Just 4 quick taps so the right learning advisor can call you at a good time. Takes about 30 seconds."

**Q1 — "Quick one — are you working, studying, or just starting out?"**
Options: `Working professional` · `Fresher / recent graduate` · `Student` · `Between jobs right now`

**Q2 — "What's drawing you toward {course} right now?"**
Options: `Start my career in data / AI` · `Switch into a data / AI role` · `Upskill or get promoted` · `Just exploring for now`

**Q3 — "When are you hoping to get started?"**
Options: `This month` · `In the next month or two` · `Still figuring it out`

**Q4 — "Last one — when works best for a learning advisor to call you?"**
Options: `As soon as possible` · `Later today (before 6 PM)` · `Tomorrow morning (10 AM–1 PM)` · `Tomorrow afternoon (1–6 PM)` · `Let me pick a specific time`
→ `Let me pick a specific time` opens a bounded input: **Mon–Sat, 10 AM–6 PM only.** The chosen slot becomes `preferredCallbackTime`.

**Closing:** "Perfect — sending your verification code to WhatsApp now. Talk soon!"

(No emojis inside questions; only in opening/closing framing.)

---

## 12. Rollout — Pilot Ships Today

- **Phase 1 (today):** Live on **`/data-science-specialization-course-lg`** only (subject = "Data Science"). Highest-traffic, best-understood page. Monitor over ~1 week: chat completion rate, OTP completion vs prior week, score distribution sanity, callback-time landing correctly in LSQ + Sheet, and — critically — **lead volume does not drop**.
- **Phase 2 (after validation):** Roll out to the other 8 LPs (4 DSAI + 4 DA city pages) via the per-page config.

---

## 13. QA Checklist (pilot sign-off)

- [ ] Chat appears between submit and OTP; existing OTP flow unchanged
- [ ] `fireConversion` / `ctaSource` / `mx_Lead_Source_CTA` / `form_source` untouched and firing
- [ ] Thank-you redirect uses `window.location.href`; conversion fires as before
- [ ] Initial LSQ capture (Unverified) + Sheet append still fire at first submit
- [ ] On verify: single `Lead.Update` sets OTP status + score + callback time
- [ ] `mx_Lead_Score` + `mx_Preferred_Callback_Time` populate in LSQ
- [ ] New Sheet columns populate (Score, Callback Time, Notes)
- [ ] **4 questions** exactly as Section 11; `{course}` = "Data Science" on pilot
- [ ] Q4 "pick a specific time" input bounded to Mon–Sat 10 AM–6 PM; out-of-range rejected
- [ ] Scoring rubric matches Section 9a (this month = hot, etc.) — NOT the masterclass 1–3/3–6/6+ bands
- [ ] Ack endpoint carries the claim-safety guardrail (no fees/placement/curriculum/guarantee claims)
- [ ] Gemini ack non-blocking — chat completes if ack times out
- [ ] No Supabase imports / env vars anywhere
- [ ] Masterclass-only bits excluded: no `Source: PPC-SM`, no Zoom, no webinar session code, no Stape CAPI, no duplicate-block 409
- [ ] careersuccess teal `#29E8A4` / navy `#09263F`; no green text on light bg
- [ ] Pilot lead volume within normal range vs prior week
- [ ] `noindex` + `canonical` unchanged on pilot page

---

*AnalytixLabs · careersuccess-legacy · Conversational Form Rollout v2 · For Antigravity · May 2026*
