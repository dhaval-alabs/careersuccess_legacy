# Implementation Plan — Hybrid Conversion Tracking Migration

High-priority migration to a hybrid tracking model: switching Google Ads tracking to client-side (gtag) while retaining server-side tracking for CRM attribution only.

## User Review Required

> [!IMPORTANT]
> **Environment Variable Requirement**: Before deploying these changes, you must add `DISABLE_GADS_UPLOAD=true` to your Vercel environment variables. This prevents duplicate conversion counts by stopping the server-side Google Ads API uploads while re-enabling the client-side gtag events.

> [!NOTE]
> **CRM Continuity**: This change does NOT affect CRM attribution. Form submissions will still hit the `/api/track-conversion` endpoint, providing the full source and metadata needed for your CRM records.

## Proposed Changes

### [Conversion Tracking System]

#### [MODIFY] [ThankYouPage.tsx](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/components/ThankYouPage.tsx)
- Re-import `useEffect` from React.
- Restore the `conversionId` prop to the component signature.
- Implement the \`useEffect\` hook to fire the \`gtag('event', 'conversion', ...)\` call with enhanced conversion data (email and first name).
- Add a safety check for \`conversionId\` and \`window.gtag\` to prevent runtime errors.

#### [MODIFY] [route.ts](file:///Users/apple/Documents/gemini/antigravity/scratch/Antigravity%20Skills/alabs-lp/app/api/track-conversion/route.ts)
- Insert a check for the \`DISABLE_GADS_UPLOAD\` environment variable at the start of the \`POST\` handler (after validation but before the Google Ads API call).
- If enabled, the API will log the conversion attempt and return a early success response without calling the Google Ads \`uploadClickConversions\` endpoint.

## Open Questions

- Should we also include the \`phone_number\` in the client-side enhanced conversion data? The provided migration doc snippet for re-enabling gtag only shows \`email\` and \`first_name\`, whereas the original commented-out code had \`phone_number\` as well.

## Verification Plan

### Manual Verification
1. **Console Check**: After deployment, I will guide you to check the \`dataLayer\` in the browser console on a successful submission to verify the \`conversion\` event is registered.
2. **Network Check**: Verify requests to \`googleads.g.doubleclick.net\` in the browser's Network tab.
3. **Log Verification**: Check Vercel logs for the message: \`[track-conversion] Google Ads upload disabled (DISABLE_GADS_UPLOAD=true). Skipping API call.\`
