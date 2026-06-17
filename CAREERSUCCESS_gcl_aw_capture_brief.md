# Implementation Brief — `_gcl_aw` GCLID Fallback + WhatsApp/Call Link Improvement

**Project:** careersuccess_legacy (AnalytixLabs landing pages)
**Author:** ScaleX / Dhaval
**Date:** June 10, 2026
**Risk level:** Low — Part A is additive/fallback-only; Part B is a deep-link enhancement gated behind a receiving-end dependency.

This brief has two independent parts. **Part A** (GCLID cookie fallback for form leads) is ready to implement now. **Part B** (WhatsApp/call link improvement) is a proposal with one hard external dependency that must be confirmed before it delivers value — read its caveats carefully.

---

## Confirmed file scope (verified against the repo)

- `files/LeadCaptureForm.tsx` — reads `gclid` from `sessionStorage.getItem('current_utms')` (JSON, `.gclid`).
- `app/api/submit-lead/route.ts` — sends GCLID to LSQ as the field **`mx_GCLID`** (line ~218).

> `blog-assets/` is NOT part of this project — ignore it entirely. It was reference only.
> The CRM/LSQ field name is **`mx_GCLID`** (capital). Do not introduce any other field name.

---

# PART A — Capture `_gcl_aw` cookie as a GCLID fallback (form leads)

## Objective

When a visitor submits a lead form, source the GCLID from the **`_gcl_aw` cookie** as a fallback when the in-session `gclid` (from `current_utms`) is absent. This raises GCLID attachment on form leads and reduces the share reaching Google Ads as EC-only (~39% currently).

**Precedence:** (1) existing `current_utms.gclid` wins; (2) `_gcl_aw` cookie only if (1) is empty.

## What it fixes / does not fix

- **Fixes:** form leads that landed via a Google ad but lost the `?gclid=` URL param (navigation, returning session within the ~90-day cookie window). Directly reduces EC-only on form submissions.
- **Does NOT fix:** the call/WhatsApp coverage gap — those leads never submit the form. (Part B addresses the WhatsApp side; calls remain a Phase-2 problem.)

## Background

Google's gtag writes a first-party cookie `_gcl_aw` on ad click, format `GCL.{timestamp}.{gclid}`. The `?gclid=` URL param exists only on the first landing hit; the cookie persists ~90 days across navigation. The codebase today reads the gclid from the URL only (into `current_utms`). This adds the cookie as a durable fallback. The same parsing logic is already deployed server-side in the ScaleX relay (v10.9), so client and server decode `_gcl_aw` identically.

## Core utility (exact, drop-in, SSR-safe)

```typescript
/**
 * Reads the Google Ads _gcl_aw cookie and extracts the GCLID.
 * Cookie format: GCL.{timestamp}.{gclid}
 * Returns '' if absent or malformed. Never throws.
 */
export const readGclidFromGclAwCookie = (): string => {
  if (typeof document === 'undefined') return ''; // SSR guard
  try {
    const row = document.cookie.split('; ').find((c) => c.startsWith('_gcl_aw='));
    if (!row) return '';
    const raw = decodeURIComponent(row.split('=').slice(1).join('='));
    if (!raw) return '';
    const parts = raw.split('.');
    if (parts.length < 3) return '';        // need GCL.{ts}.{gclid}
    return parts.slice(2).join('.');         // gclid may contain dots — keep them
  } catch {
    return '';
  }
};
```

## Integration in `files/LeadCaptureForm.tsx`

Today (around lines 49–56):

```typescript
let gclid: string | undefined;
try {
  const raw = sessionStorage.getItem('current_utms');
  if (raw) {
    const parsed = JSON.parse(raw);
    gclid = parsed.gclid;
  }
} catch { /* ignore */ }
```

Add the fallback immediately after that block, before `gclid` is placed into the payload:

```typescript
// _gcl_aw cookie fallback — only when no in-session gclid was captured.
// Never overwrites a present value.
if (!gclid) {
  const cookieGclid = readGclidFromGclAwCookie();
  if (cookieGclid) gclid = cookieGclid;
}
```

Import `readGclidFromGclAwCookie` from wherever you place the helper (e.g. a `utils/gclid.ts`), or inline it in the component file.

**Do not change** `app/api/submit-lead/route.ts` — it already maps `body.gclid → mx_GCLID`. The fallback flows through the existing `gclid` variable, so the route is unaffected.

## Non-breaking requirements (Part A)

1. Fallback only — a present `current_utms.gclid` always wins, never overwritten.
2. Never write empty — guard every assignment with a truthiness check.
3. SSR-safe — all `document`/`window`/`sessionStorage` access guarded; runs client-side only.
4. Field name unchanged — GCLID still reaches LSQ as `mx_GCLID`.
5. No behaviour change when the URL gclid is present (the common case is byte-for-byte identical).
6. No new dependencies.

## Test plan (Part A)

1. **URL gclid present (regression):** `current_utms` has a gclid → payload carries it (cookie ignored).
2. **URL gclid absent, cookie present:** clear `current_utms`; set `_gcl_aw=GCL.1716000000.TEST_456` → payload carries `TEST_456`.
3. **Both absent:** no crash, `mx_GCLID` empty, lead still submits (EC-only).
4. **Malformed cookie:** `_gcl_aw=garbage` → reader returns `''`, form submits cleanly.

**Downstream check (ScaleX side):** relay log rows that were `SUCCESS_EC_ONLY` should begin logging `SUCCESS` (GCLID attached) for the subset the cookie recovered; direct-path GCLID rate should rise above ~60.6%.

---

# PART B — WhatsApp & Call button link improvement

## The problem these links create today

Both buttons are plain anchors that fire a gtag conversion (CS-Calls / CS-WhatsApp, which go directly to Google Ads and ARE attributed to the ad click), then send the user off-site:

```tsx
<a href="tel:9555525908"
   onClick={() => window.gtag?.('event','conversion',{ send_to:'AW-783236209/3q4MCJXktaobEPH4vPUC' })}>…</a>

<a href="https://api.whatsapp.com/send?phone=919555525908" target="_blank" rel="noreferrer"
   onClick={() => window.gtag?.('event','conversion',{ send_to:'AW-783236209/p4XvCI3TtaobEPH4vPUC' })}>…</a>
```

Neither link carries the visitor's GCLID. When the person then calls/messages and a lead is created in LSQ, it has **no GCLID** (confirmed from the CRM export: PPC-INC Call / PPC-whatsapp leads almost all have a blank gclid column; phone number is always present). Google Ads gets the click signal but never the qualify/enrol outcome.

> **Do NOT change the gtag conversion `onClick` calls.** They are working and are the only Google Ads signal for this channel today. Part B only augments the `href`.

## B1 — WhatsApp link: embed the GCLID in the pre-filled message (ACTIONABLE, with a dependency)

`api.whatsapp.com/send` supports a `text=` parameter that pre-fills the user's first message. Embed the effective GCLID (URL or `_gcl_aw` cookie) into it, so the GCLID arrives inside the WhatsApp conversation.

Build the href dynamically:

```typescript
// Reuse readGclidFromGclAwCookie() from Part A.
const getEffectiveGclid = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    const raw = sessionStorage.getItem('current_utms');
    if (raw) {
      const g = JSON.parse(raw).gclid;
      if (g) return g;
    }
  } catch { /* ignore */ }
  return readGclidFromGclAwCookie();
};

const buildWhatsAppHref = (phone: string, course: string): string => {
  const gclid = getEffectiveGclid();
  // Human-readable message + a machine-parseable ref token on its own line.
  // The [ref:...] token is what the inbound handler parses; keep the format stable.
  const lines = [
    `Hi, I'm interested in the ${course} program.`,
    gclid ? `\n\n[ref:${gclid}]` : '',
  ];
  const text = encodeURIComponent(lines.join(''));
  return `https://api.whatsapp.com/send?phone=${phone}&text=${text}`;
};
```

Then in each page, replace the static WhatsApp `href` with `buildWhatsAppHref('919555525908', '<course for this page>')`, computed client-side (e.g. via `useState`/`useEffect` so it picks up the gclid after hydration). Keep the existing `onClick` gtag call and `target="_blank" rel="noreferrer"` unchanged.

### ⚠️ Hard dependency — this only pays off if the receiving end extracts the token

Embedding `[ref:{gclid}]` in the first message does nothing on its own. **Something must read the inbound WhatsApp message, extract the `[ref:...]` token, and write it to the LSQ lead's `mx_GCLID` field.** The CRM export shows every WhatsApp lead already flows through an **xBot** integration (`chat-xbot.webspecia.in/inbox/...`), so there is a programmatic inbound handler that could do this. Confirm with the xBot/WhatsApp owner that:

1. The inbound handler can capture the raw first message text.
2. It can regex `\[ref:([^\]]+)\]` out of it.
3. It can write that value to LSQ `mx_GCLID` on lead creation/update.

If that extraction cannot be added, B1 is not worth implementing — the gclid will sit unread in chat history. **Treat B1 as: ship the LP link change only once the xBot extraction is confirmed.** They are a matched pair.

### Robustness notes for B1
- Users can edit the pre-filled text before sending. Keep the human sentence first and the `[ref:...]` token last so it's least likely to be deleted.
- A raw GCLID is long; that's fine for an automated parser. Do not truncate — Google needs the full GCLID to match an offline conversion later.
- If editing-loss proves high in practice, the robust upgrade is: store the gclid server-side keyed by a short session id, put only the short id in the text, and have the handler resolve id→gclid. That needs a small backend store — defer unless B1's raw-token version proves lossy.

## B2 — Call (`tel:`) link: NOT improvable by a link change

A `tel:` link cannot carry a web parameter into a phone call — the phone network does not transport it. There is **no client-side link change** that bridges call → GCLID. Do not attempt to add params to `tel:` hrefs.

The only real options (all Phase 2+, out of scope for this repo):
- **Dynamic Number Insertion (DNI):** show a session-unique tracking number per visitor, map the inbound number back to the originating GCLID/session. Requires a call-tracking provider.
- Ask the caller for context on the call (manual, lossy).

**Near-term reality for calls:** the CS-Calls gtag click pixel already fires and is attributed — keep it. Recovery of the *outcome* for call leads comes via EC-only matching once the lead reaches the relay (phone is always present in the CRM export), not via any link change. Document this and move on; do not spend effort here.

## Non-breaking requirements (Part B)
1. Do not modify the gtag `onClick` conversion calls on either button.
2. Keep `target="_blank" rel="noreferrer"` on the WhatsApp anchor.
3. Compute the dynamic href client-side; SSR-safe (guard `window`/`document`).
4. If `getEffectiveGclid()` returns `''`, the WhatsApp link must fall back to the current plain `api.whatsapp.com/send?phone=...` with no `text=` param (or a text param with no `[ref:...]`). Never emit `[ref:]` empty.
5. `tel:` links unchanged.

## Test plan (Part B1)
1. **GCLID present:** open a LP with `?gclid=TEST123`, tap WhatsApp → pre-filled message ends with `[ref:TEST123]`.
2. **GCLID via cookie only:** clear `current_utms`, set `_gcl_aw` cookie, tap WhatsApp → token carries the cookie gclid.
3. **No GCLID:** neither present → link opens with a clean message, no `[ref:]` fragment, no crash.
4. **End-to-end (with xBot owner):** send the pre-filled message, confirm the inbound handler extracts `[ref:...]` and writes `mx_GCLID` on the LSQ lead.

---

## Summary

| Part | Change | Status | Dependency |
|---|---|---|---|
| A | `_gcl_aw` cookie fallback in `LeadCaptureForm.tsx` | Ready now | None |
| B1 | GCLID in WhatsApp `text=` pre-fill | Ship with xBot extraction | xBot inbound handler must parse `[ref:...]` → `mx_GCLID` |
| B2 | Call link | No change possible | DNI (Phase 2+) — documented, not actioned |

**Field name everywhere:** `mx_GCLID`. **Do not touch** the gtag conversion calls or `app/api/submit-lead/route.ts` payload mapping.

---

*ScaleX AnalytixLabs · June 10, 2026 · scaletrix.ai*
