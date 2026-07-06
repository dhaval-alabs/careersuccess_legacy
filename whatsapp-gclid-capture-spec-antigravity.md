# WhatsApp GCLID Capture — Landing Page Implementation Spec

**For:** Antigravity (WhatsApp bot + web build team)
**From:** Dhaval / ScaleX
**Scope:** careersuccess landing pages ONLY (see §0 — do not touch the main site)
**Status:** ready to build

---

## 0. Scope — read this first

**Apply this change ONLY to:** the careersuccess landing page variants that receive Google Ads (PPC) traffic — DS&AI, DA&AI, and Specialization pages across Bangalore, Delhi, Gurgaon, Noida (`careersuccess.analytixlabs.co.in/lp/...`).

**Do NOT apply this to:** the main AnalytixLabs website (`www.analytixlabs.co.in` / blog). The main site does not currently receive direct PPC traffic with a Google click ID (gclid) in session, so this change would have no effect there and is explicitly out of scope for this task. It may be extended there later as a separate, deliberately-scoped task — not as part of this one.

**Why this matters:** please do not "helpfully" apply this site-wide. Scope creep here risks touching WhatsApp buttons/flows on pages this task was never meant to change.

---

## 1. Goal

Today, ~⅓ of PPC-driven WhatsApp leads carry no Google click ID (gclid) into the CRM, making them invisible to Google Ads' Smart Bidding — even though they convert at the same rate as web-form leads. This is a pure attribution/visibility gap, not a lead-quality problem.

**Fix:** when a visitor arrives at the LP via a Google Ads click (gclid present in session) and then clicks the WhatsApp CTA, embed the gclid into the prefilled WhatsApp message text. The WhatsApp bot (separate workstream, already speced) extracts it from the first inbound message and writes it to LSQ's `mx_GCLID` field — the same join key the relay reads for offline conversion tracking.

This task is the **capture** half only. The **extraction** half (bot-side regex + LSQ write) is a separate, already-specified workstream. Both halves are required for the fix to produce value, but they can ship independently — this half is safe to ship even if the bot isn't ready yet (see §6).

---

## 2. What NOT to break — explicit guardrails

This is a surgical change to how the `wa.me` link's `href`/target URL is *constructed*. It must not change:

- **The WhatsApp number** the button points to.
- **The button's visual appearance, position, animation, or any existing click tracking/analytics events** already firing on click.
- **The base greeting text** visitors see prefilled in WhatsApp — only *append* to it, never replace or reorder existing message content.
- **Behavior for non-PPC visitors** (organic, direct, social) — for these visitors there is no gclid in session, and the message must look **exactly as it does today**, with no tag, no trailing space, no artifact of the logic below.
- **Page load performance** — the gclid lookup is a synchronous read from `sessionStorage`/cookie already available on the page; do not add any network call, async fetch, or delay to the WhatsApp button's responsiveness.
- **Any other WhatsApp touchpoint's independent behavior** unless it also needs this fix (see §3 — check for *all* WhatsApp entry points on a page, not just the primary CTA).

If a page has multiple WhatsApp entry points (e.g. a floating chat icon AND an inline "Chat with us" button), **apply this to every one of them** — a visitor could click any of them, and all must carry the gclid consistently.

---

## 3. Where the gclid comes from (already exists — do not rebuild)

The LP already captures gclid on page arrival via the same mechanism feeding the web form:

- **Primary:** `sessionStorage` — the `current_utms` capture already running on the LP (confirm exact key name in the existing LP codebase before wiring — likely `current_utms_gclid` or nested inside a `current_utms` object; **use whatever key the existing form-capture code reads from**, so this stays perfectly consistent with the web-form path).
- **Fallback:** `_gcl_aw` cookie, per the existing LP capture logic.

**Do not build a new capture mechanism.** This task only reads the value that's already being captured and reuses it for the WhatsApp link. If you can't find the existing capture code, ask before building a parallel one — a second, slightly different capture path is itself a bug risk.

---

## 4. Implementation

### 4.1 Build the `wa.me` link dynamically

Replace the static `href` (or static string used in an `onClick` handler) with a function that constructs the link at the moment it's needed (on click, or on page load if the button is rendered dynamically):

```javascript
function buildWhatsAppLink(phoneNumber, baseMessage) {
  const gclid = getStoredGclid(); // see §4.3 — reuse existing LP capture, don't rebuild

  const refTag = isValidGclid(gclid) ? ` [ref:${gclid}]` : '';
  const message = baseMessage + refTag;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
```

`baseMessage` must be **exactly the current prefilled text**, unchanged — pull it from the existing button implementation rather than retyping it, to avoid accidental wording drift.

### 4.2 Critical rule — omit the tag entirely when there's no valid gclid

Do **not** send `[ref:]` empty, and do not send `[ref:undefined]` or `[ref:null]`. If there's no valid gclid, `refTag` must be an empty string, and the message must be indistinguishable from today's message for that visitor.

### 4.3 Validate the gclid before embedding it

This step exists because we just found and fixed a related bug on the CRM side (LSQ was passing through the literal placeholder string `"-"` as if it were a real gclid, causing decode failures in Google Ads). Apply the same discipline here so we never introduce the same class of bug on the capture side:

```javascript
function isValidGclid(value) {
  if (!value) return false;
  const v = String(value).trim();
  const placeholders = ['-', 'n/a', 'null', 'none', 'na', 'undefined'];
  if (placeholders.includes(v.toLowerCase())) return false;
  return v.length > 20 && /^[A-Za-z0-9_-]+$/.test(v);
}
```

`getStoredGclid()` should return whatever raw value is in session/cookie (which might legitimately be empty, or might be a placeholder from an upstream quirk) — let `isValidGclid` be the single gate that decides whether it's trustworthy enough to embed. Don't duplicate this validation logic elsewhere; call this one function everywhere the check is needed.

### 4.4 Wire it to every WhatsApp CTA on the page

Find every element on the page whose current `href` starts with `https://wa.me/` or `https://api.whatsapp.com/send`, and every `onClick` handler that constructs such a URL. Replace each with a call to `buildWhatsAppLink(...)`, preserving that element's existing phone number and base message text exactly.

---

## 5. Testing checklist (required before shipping to any page)

Run all of these on a staging/test version of one LP variant first, before rolling out across all variants:

1. **PPC-arrival test:** Click through from a live (or test) Google Ads ad so a real gclid lands in session → open the LP → click each WhatsApp CTA on the page → confirm the WhatsApp app opens with the prefilled message containing ` [ref:Cj0...]` / `[ref:Cjw...]` / `[ref:EAI...]` with the **real, correctly URL-encoded** gclid value, appended after the existing base text.
2. **Organic-arrival test:** Visit the LP directly (typed URL, no ad click, no gclid in session) → click each WhatsApp CTA → confirm the message is **character-for-character identical to the current production message** — no tag, no trailing space, no bracket.
3. **Placeholder-value test:** If possible, manually set a test value like `sessionStorage.setItem('current_utms_gclid', '-')` in devtools and click the CTA → confirm the tag is correctly omitted (this exercises §4.3's validation).
4. **Link integrity test:** Confirm the `wa.me` deep link still opens WhatsApp correctly on both mobile and desktop after the message text change — encoding a longer string with brackets must not break the link.
5. **Multi-CTA test:** If the page has more than one WhatsApp entry point, confirm all of them carry the gclid consistently (not just the primary button).
6. **Regression check:** Confirm nothing else on the page changed — visual appearance, other click-tracking/analytics events on the same button, page load time.

---

## 6. Rollout sequencing

1. Ship to **one** LP variant first (pick a lower-traffic one) and run the checklist above in production for a short soak period.
2. Once confirmed clean, roll out to the remaining careersuccess LP variants (DS&AI, DA&AI, Specialization × Bangalore/Delhi/Gurgaon/Noida).
3. **Do not extend to the main site** as part of this task (see §0). That is a separate future task, gated on the main site actually carrying PPC traffic with a gclid worth capturing.

This capture-side change is safe to ship independently of the WhatsApp bot's extraction-side work — if the bot isn't live yet, the `[ref:...]` tag will simply sit unused in the message text until it is, with no negative effect on the visitor's experience.

---

## 7. Done-when

- All in-scope LP variants' WhatsApp CTAs carry the gclid when one is present in session, and carry nothing extra when it isn't.
- All six checklist items in §5 pass on at least the first-rollout variant before wider rollout.
- No change to WhatsApp number, button appearance, existing tracking events, or main-site behavior.
- (Downstream, once bot extraction is live) a real test lead from a PPC click shows a populated `mx_GCLID` in LSQ.
