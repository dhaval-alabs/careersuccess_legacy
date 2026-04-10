# MCP Route Fix — Zod Type Conflict

**Owner:** Antigravity
**Date:** March 2026
**Error:** `Type error: Type 'ZodDefault<ZodNumber>' is missing properties`

---

## Root Cause

`@vercel/mcp-adapter` v0.3.2 bundles its own internal version of Zod. Importing `zod` separately causes a type mismatch between the two Zod instances. The fix is to remove the separate `zod` import and use the `z` object exported directly from `@vercel/mcp-adapter`.

---

## Fix — Update `app/api/mcp/route.ts`

**Two changes only:**

### Change 1 — Replace the import at the top

**Find:**
```typescript
import { createMcpHandler } from '@vercel/mcp-adapter'
import { z } from 'zod'
```

**Replace with:**
```typescript
import { createMcpHandler, z } from '@vercel/mcp-adapter'
```

### Change 2 — Confirm these two lines are present after the import

```typescript
export const maxDuration = 60
export const dynamic = 'force-dynamic'
```

Everything else in the file stays exactly the same.

---

## Final top of file should look like this

```typescript
import { createMcpHandler, z } from '@vercel/mcp-adapter'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const CUSTOMER_ID = '4064995850'
const MCC_ID = '8910137241'
```

---

## Commit and Push

```bash
git add app/api/mcp/route.ts
git commit -m "fix: import z from mcp-adapter to resolve Zod type conflict"
git push
```

---

## Verify After Deployment

Watch the Vercel build log — it should now compile without TypeScript errors.

Once deployed, run:

```bash
curl https://careersuccess-legacy.vercel.app/api/mcp
```

Share the response with Dhaval.

---

## Checklist

- [ ] `import { createMcpHandler, z } from '@vercel/mcp-adapter'` — single import line
- [ ] Separate `import { z } from 'zod'` line removed
- [ ] `export const maxDuration = 60` present
- [ ] `export const dynamic = 'force-dynamic'` present
- [ ] Build completes without TypeScript errors in Vercel log
- [ ] Curl returns non-404 response
- [ ] Response shared with Dhaval
