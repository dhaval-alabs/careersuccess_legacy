# Thank-You Page Routing Fix

**Project:** AnalytixLabs LP (careersuccess-legacy.vercel.app)  
**Prepared for:** Antigravity  
**Date:** March 2026  
**Priority:** High — affects all lead form submissions on Next.js landing page

---

## Problem

After form submission on the Next.js landing page, the thank-you page was either:
- Showing WordPress 404
- Throwing `ERR_TOO_MANY_REDIRECTS`

**Root cause:** `router.push()` is a client-side navigation and does not send a `referer` header. The Cloudflare Worker needs the referer to decide whether to route to Vercel or WordPress. Without it, routing broke.

**Fix:** Replace `router.push` with `window.location.href` — this forces a full browser navigation which always sends the referer header correctly.

---

## Files to Update

### 1. `LeadCaptureForm.tsx`

**One line change only.**

**Find:**
```typescript
router.push(`${thankYouPath}?${params.toString()}`);
```

**Replace with:**
```typescript
window.location.href = `${thankYouPath}?${params.toString()}`;
```

> After this change, the `useRouter` import and `const router = useRouter()` may show as unused. Remove them if nothing else in the file uses them:

Remove this line at the top:
```typescript
import { useRouter } from 'next/navigation';
```

Remove this line inside the component:
```typescript
const router = useRouter();
```

---

### 2. `app/data-science-specialization-course-lg/page.tsx`

**Revert `thankYouPath` values back to original** (without `/lp/` prefix).

There are 4 instances. Update each one:

**Find and replace all occurrences of:**
```tsx
thankYouPath="/lp/thankyou-check-your-eligibility"
```
**With:**
```tsx
thankYouPath="/thankyou-check-your-eligibility"
```

---

```tsx
thankYouPath="/lp/thankyou-download-brochure"
```
**With:**
```tsx
thankYouPath="/thankyou-download-brochure"
```

---

```tsx
thankYouPath="/lp/thankyou-signup"
```
**With:**
```tsx
thankYouPath="/thankyou-signup"
```

> Run this to verify all 4 are correctly reverted after changes:
```bash
grep -n "thankYouPath" app/data-science-specialization-course-lg/page.tsx
```

Expected output:
```
314:   thankYouPath="/thankyou-download-brochure"
592:   thankYouPath="/thankyou-check-your-eligibility"
602:   thankYouPath="/thankyou-download-brochure"
612:   thankYouPath="/thankyou-signup"
```

---

## Commit and Push

```bash
git add app/data-science-specialization-course-lg/page.tsx
git add app/components/forms/LeadCaptureForm.tsx
git commit -m "fix: use window.location.href for thank-you redirect to preserve referer header"
git push
```

---

## How It Works After This Fix

| User on | Submits form | Thank-you page served by |
|---|---|---|
| `/lp/data-science-...` (Next.js) | `window.location.href = '/thankyou-*'` → Worker sees referer has `/lp/` → redirects to `/lp/thankyou-*` → Vercel | Vercel ✅ |
| WordPress landing page | WordPress redirects to `/thankyou-*` → Worker sees no `/lp/` in referer → passes to WordPress | WordPress ✅ |

---

## Checklist

- [ ] `router.push` replaced with `window.location.href` in `LeadCaptureForm.tsx`
- [ ] `useRouter` import removed from `LeadCaptureForm.tsx` (if unused)
- [ ] `const router = useRouter()` removed from `LeadCaptureForm.tsx` (if unused)
- [ ] All 4 `thankYouPath` values reverted to `/thankyou-*` (without `/lp/` prefix) in `page.tsx`
- [ ] Changes committed to correct file path (`app/data-science-specialization-course-lg/page.tsx`)
- [ ] Pushed to GitHub and Vercel deployment confirmed
- [ ] Tested: Next.js form submit → Vercel thank-you page loads ✅
- [ ] Tested: WordPress form submit → WordPress thank-you page loads ✅
