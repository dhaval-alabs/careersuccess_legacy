# MCP Server Route Fix — Next.js 16 Compatibility

**Owner:** Antigravity
**Date:** March 2026
**Issue:** `/api/mcp` returns 404 despite file existing at correct path

---

## Root Cause

`@vercel/mcp-adapter` v0.3.2 requires two additional exports in the route file to work correctly with Next.js 16:
1. `maxDuration` — tells Vercel to allow longer function execution (MCP needs this)
2. `dynamic` — forces dynamic rendering, required for SSE/streaming responses

Without these, Next.js 16 does not register the route handler correctly.

---

## Fix — Update `app/api/mcp/route.ts`

Add these two lines at the very top of the file, directly after the imports:

**Find the top of the file:**
```typescript
import { createMcpHandler } from '@vercel/mcp-adapter'
import { z } from 'zod'

const CUSTOMER_ID = '4064995850'
```

**Replace with:**
```typescript
import { createMcpHandler } from '@vercel/mcp-adapter'
import { z } from 'zod'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const CUSTOMER_ID = '4064995850'
```

Everything else in the file stays exactly the same.

---

## Commit and Push

```bash
git add app/api/mcp/route.ts
git commit -m "fix: add maxDuration and dynamic exports for MCP route Next.js 16 compatibility"
git push
```

---

## Verify After Deployment

Once Vercel deploys, run:

```bash
curl https://careersuccess-legacy.vercel.app/api/mcp
```

Expected response — any of these confirms the route is live:
- A JSON response
- An SSE stream response
- Any non-404 response

Share the response with Dhaval.

---

## Checklist

- [ ] `export const maxDuration = 60` added after imports in `app/api/mcp/route.ts`
- [ ] `export const dynamic = 'force-dynamic'` added after imports in `app/api/mcp/route.ts`
- [ ] Committed and pushed to GitHub
- [ ] Vercel deployment confirmed
- [ ] Curl returns non-404 response
- [ ] Response shared with Dhaval
