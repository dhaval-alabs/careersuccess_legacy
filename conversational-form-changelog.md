# Detailed Changelog: Conversational Form UI Rollout & Integrations

This document provides a highly detailed walkthrough of the changes implemented across the landing pages, components, and backend API routes. The primary objective was to replace the static Hero capture forms and "Check Eligibility" modals with a premium, responsive, conversational chat-style interface, optimize its layout and flow, and integrate it with the LeadSquared CRM and Google Sheets.

---

## 1. Flow Restructuring (Order of Steps)

The sequence of the conversational form was restructured to gather user requirements, name/email/city, callback details, and then prompt for the WhatsApp phone number and verify it immediately via OTP.

The finalized step-by-step sequence is:
1. **Step 0 (Status)**: Bot asks if the visitor is working, studying, or starting out. User answers using interactive quick pills.
2. **Step 1 (Interest)**: Bot asks what draws them to the course. User selects via quick pills.
3. **Step 2 (Timeline)**: Bot asks when they plan to start. User selects via quick pills.
4. **Step 3 (Name)**: Bot asks for their full name. User inputs text.
5. **Step 4 (Email)**: Bot asks for their email address. User inputs text (with active regex email validation).
6. **Step 5 (City)**: Bot asks for their city. User selects via a searchable dropdown (renders upwards to avoid bottom clipping).
7. **Step 6 (Callback Time)**: Bot asks when works best for a learning advisor to call. User selects via quick-select pills or picks a custom Date/Time.
8. **Step 7 (WhatsApp Number)**: Bot asks for their WhatsApp phone number. User enters their 10-digit number.
   * *API Actions on Submit*: Triggers `/api/submit-lead` (to register the unverified lead in CRM & Sheets) and `/api/otp/send` (with `skipSheets: true` to avoid duplicate rows) to send the OTP.
9. **Step 8 (OTP Verification)**: Bot explains: *"To send you the customized plan, we need to first verify your details."* and renders the 4-digit code field inline.
   * *API Actions on Verify*: Verifies the code via `/api/otp/verify` (flips lead status to `Verified`) and calls `/api/qualify` (submits qualification history/score to Sheets and CRM).

---

## 2. UI Aesthetics, Typography & Sizing Upgrades

The overall chat container has been scaled up to feel premium, readable, and balanced:
* **Increased Card Height**: Elevated the card height from `h-[580px]` to `h-[620px]` to prevent text/bubble clipping and offer a spacious layout.
* **Premium Typography Scaling**:
  * **Card Header**: Title scaled from `text-lg` to `text-xl` (bold); subtitle scaled from `text-xs` to `text-sm`.
  * **Chat Bubbles**: Both user and bot response bubbles scaled up from `text-sm` to `text-base` with increased padding (`px-4 py-3`).
  * **Pills & Select Buttons**: Interactive option buttons scaled from `text-sm` to `text-base` with heavier semi-bold weights (`font-semibold`) and improved padding (`px-4 py-2`).
  * **Input & Select Fields**: Text and email inputs, country-code selectors, and telephone inputs scaled to `text-base` (with paddings adjusted to `py-2.5` / `py-3` for vertical balance).
  * **Submit Buttons**: Scaled to `text-base font-semibold` with `px-5 py-2.5` dimensions.
  * **Compliance Consent Text**: Increased from `text-[10px]` to `text-xs` for better legibility.
* **Natural Typing Cadence**:
  * Increased the delay for bot replies to `1800ms` (previously `1000ms`) to mimic real-time human messaging.

---

## 3. Dropdown Positioning & Layering Fixes

To fix the city dropdown clipping issues (where the city selector would overlay or be blocked by the privacy consent box):
* **Upward Dropdown Mode**: Added an `openUpward` prop to [SearchableCitySelect.tsx](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/components/SearchableCitySelect.tsx). When set to `true`, the dropdown pops upward (`bottom-full mb-2`) utilizing the open chat screen space.
* **Z-Index Elevation**: Set the wrapper input controls panel container to `z-30` inside [HeroLeadCaptureForm.tsx](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/components/HeroLeadCaptureForm.tsx). This keeps dropdowns positioned on top of the consent bar (`z-10`), eliminating any interaction conflicts.

---

## 4. CRM Integration Fixes (`mx_conv_form`)

A critical issue where the conversational chat logs were not appearing in the CRM under advanced search has been resolved:
* **CRM Attribute Mapping**: Updated the qualification API route [app/api/qualify/route.ts](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/app/api/qualify/route.ts).
* **Conversation Payload**: Added the custom attribute `mx_conv_form` directly into the LeadSquared `Lead.Update` payload, mapping the formatted question-and-answer string (`convText`):
  ```typescript
  const payload = [
    { Attribute: scoreField, Value: score },
    { Attribute: notesField, Value: `Score Reason: ${reason}\n\nConversation:\n${convText}` },
    { Attribute: 'mx_conv_form', Value: convText } // <-- New Mapping Added
  ];
  ```

---

## 5. Target Landing Pages Impacted

The conversational form was rolled out to replace the static Hero capture forms and the "Check Eligibility" modal triggers on all **9 landing pages**:
1. [Gurgaon - Data Science & AI](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/app/data-science-ai-course-gurgaon/page.tsx)
2. [Delhi - Data Science & AI](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/app/data-science-ai-course-delhi/page.tsx)
3. [Noida - Data Science & AI](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/app/data-science-ai-course-noida/page.tsx)
4. [Bangalore - Data Science & AI](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/app/data-science-ai-course-bangalore/page.tsx)
5. [Gurgaon - Data Analyst & AI](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/app/data-analyst-ai-course-gurgaon/page.tsx)
6. [Delhi - Data Analyst & AI](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/app/data-analyst-ai-course-delhi/page.tsx)
7. [Noida - Data Analyst & AI](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/app/data-analyst-ai-course-noida/page.tsx)
8. [Bangalore - Data Analyst & AI](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/app/data-analyst-ai-course-bangalore/page.tsx)
9. [Specialization Course LG](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/app/data-science-specialization-course-lg/page.tsx)

*Note: All secondary CTA modals (e.g., Brochure Downloads and Demo Signups) continue to utilize the standard static `LeadCaptureForm` as requested.*
