# Brief: Fix MCP Server — Migrate to `mcp-handler`

**Project:** `careersuccess-legacy` (Vercel: `prj_tZaHLeItevnoI4WdD572GlVdoUGs`)  
**Priority:** High — MCP tools completely broken  
**Estimated effort:** ~30 min  
**Context:** Option A (upgrading `@vercel/mcp-adapter` to 0.3.2) failed at build with `Module not found: Can't resolve '@vercel/mcp-adapter'`. The package has been officially deprecated and replaced by `mcp-handler`. The current live code is reverted back to 0.3.1 and broken at runtime.

---

## Root Cause (confirmed from build logs)

`@vercel/mcp-adapter` is deprecated. Vercel replaced it with a new package called `mcp-handler`. The import in `route.ts` still references the old package name. This is a simple migration — the API is almost identical.

---

## Changes Required

### Step 1 — Update `package.json` dependencies

**Remove:**
```
"@vercel/mcp-adapter": "0.3.1"
```

**Add:**
```json
"mcp-handler": "latest",
"@modelcontextprotocol/sdk": "1.26.0"
```

The `zod` dependency is already in the project — no change needed there.

---

### Step 2 — Update `app/api/[transport]/route.ts`

This is the only file that needs a code change. The change is minimal — one import line changes, and one export line adds `DELETE`.

**Current file (roughly):**
```typescript
import { createMcpHandler } from '@vercel/mcp-adapter'
import { z } from 'zod'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const handler = createMcpHandler(
  (server) => {
    // ... all 6 tool definitions stay exactly as-is ...
  },
  {},
  {
    basePath: '/api',
  }
)

export { handler as GET, handler as POST }
```

**Updated file — only 2 things change:**

1. Line 1: change the import source from `'@vercel/mcp-adapter'` → `'mcp-handler'`
2. Last line: add `handler as DELETE` to the exports

```typescript
import { createMcpHandler } from 'mcp-handler'   // ← CHANGED (was '@vercel/mcp-adapter')
import { z } from 'zod'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

const handler = createMcpHandler(
  (server) => {
    // ✅ ALL TOOL DEFINITIONS STAY EXACTLY AS-IS — do not touch them
  },
  {},
  {
    basePath: '/api',
  }
)

export { handler as GET, handler as POST, handler as DELETE }  // ← CHANGED (added DELETE)
```

**Do not touch anything else in the file.** All 6 tool definitions (`get_campaign_stats`, `get_keyword_stats`, `get_search_terms`, `get_conversion_stats`, `get_budget_pacing`, `lookup_gclid`) and their implementations remain completely unchanged.

---

### Step 3 — Run `npm install` and push

```bash
npm install
```

Commit message: `fix(mcp): migrate from @vercel/mcp-adapter to mcp-handler`

Push to `main` → Vercel auto-deploys.

---

## Verification

After the deploy goes live, the build logs should show the new package installing cleanly (no `removed X packages` warning). The MCP tools will be tested from Claude — if `get_conversion_stats` returns real data, the fix is confirmed.

---

## What NOT to Change

- Do **not** modify any tool definitions or their logic inside `route.ts`
- Do **not** change `basePath`, `maxDuration`, or `dynamic` exports
- Do **not** touch any env vars
- Do **not** touch any landing page files
- Do **not** change Node.js version in Vercel (leave at whatever it currently is)

---

## Files Changed Summary

| File | Change |
|------|--------|
| `package.json` | Remove `@vercel/mcp-adapter`, add `mcp-handler` + `@modelcontextprotocol/sdk@1.26.0` |
| `package-lock.json` | Auto-updated by `npm install` |
| `app/api/[transport]/route.ts` | Line 1: import source; Last line: add `DELETE` export |
