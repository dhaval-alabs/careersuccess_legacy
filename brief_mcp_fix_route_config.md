# Brief: Fix MCP Server — Clean up route.ts config for mcp-handler

**Project:** `careersuccess-legacy`  
**Priority:** High  
**Estimated effort:** 10 min — code changes only in `route.ts`

---

## What's happening

`mcp-handler` is installed and building correctly. But POST tool calls crash silently and return HTML with HTTP 200. The cause is two leftover config lines from the old `@vercel/mcp-adapter` pattern that conflict with `mcp-handler` in Next.js 16:

1. `export const dynamic = 'force-dynamic'` — this Next.js 16 route segment config is interfering with `mcp-handler`'s response streaming. Remove it entirely.
2. `export const maxDuration = 60` — in `mcp-handler`, this must be passed **inside** the `createMcpHandler` options object, not as a route export.

---

## Changes required — `app/api/[transport]/route.ts` only

**Remove these two lines:**
```typescript
export const maxDuration = 60      // ← DELETE this line
export const dynamic = 'force-dynamic'   // ← DELETE this line
```

**Add `maxDuration` and `verboseLogs` inside the `createMcpHandler` options:**

Find the `createMcpHandler(...)` call. The third argument (options object) currently looks like:
```typescript
{
  basePath: '/api',
}
```

Change it to:
```typescript
{
  basePath: '/api',
  maxDuration: 60,
  verboseLogs: true,
}
```

---

## Final shape of the top of the file

```typescript
import { createMcpHandler } from 'mcp-handler'
import { z } from 'zod'

// ← NO export const maxDuration here
// ← NO export const dynamic here

const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID || '4064995850'
const MCC_ID = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || process.env.GOOGLE_ADS_MCC_ID || '8910137241'
```

## Final shape of the createMcpHandler call

```typescript
const handler = createMcpHandler(
  (server) => {
    // ... all tool definitions unchanged ...
  },
  {},
  {
    basePath: '/api',
    maxDuration: 60,
    verboseLogs: true,
  }
)

export { handler as GET, handler as POST, handler as DELETE }
```

---

## What NOT to change

- Do **not** touch any tool definitions or their logic
- Do **not** change the import line
- Do **not** change any env vars
- Do **not** touch any landing page files

---

## After deploying

Ping us after it's live — we'll test `get_conversion_stats` immediately and check the Vercel runtime logs for verbose output to confirm the tools are executing correctly.

---

## Files changed

| File | Change |
|------|--------|
| `app/api/[transport]/route.ts` | Remove 2 route exports; move `maxDuration` inside options; add `verboseLogs: true` |
