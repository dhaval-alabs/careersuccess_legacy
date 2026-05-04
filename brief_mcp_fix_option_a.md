# Brief: Fix MCP Server — Option A (Upgrade Adapter + Pin Node)

**Project:** `careersuccess-legacy` (Vercel: `prj_tZaHLeItevnoI4WdD572GlVdoUGs`)  
**Priority:** High — MCP tools returning `<!DOCTYPE HTML>` instead of JSON on every tool call  
**Estimated effort:** ~30 min  

---

## Root Cause

The MCP server broke due to two compounding issues:

1. **Node.js upgraded to 24.x** — `@vercel/mcp-adapter` v0.3.1 was not tested on Node 24 and produces HTML error responses instead of JSON on POST tool calls.
2. **`@vercel/mcp-adapter` is outdated** — current version is 0.3.1; latest is 0.3.2 with compatibility fixes.

The MCP SSE handshake (GET `/api/mcp`) works fine. Only POST tool calls fail. No changes to env vars or route code are needed — just the adapter version and Node runtime.

---

## Changes Required

### Step 1 — Pin Node.js to 20.x in Vercel Dashboard

> This is a dashboard change, not a code change. Do this first.

1. Go to [Vercel Dashboard](https://vercel.com) → **careersuccess-legacy** project
2. Navigate to **Settings → General**
3. Scroll to **Node.js Version**
4. Change from `24.x` → `20.x`
5. Click **Save**

Do **not** redeploy yet — do Step 2 first.

---

### Step 2 — Upgrade `@vercel/mcp-adapter` in `package.json`

In `package.json`, find the dependency:

```json
"@vercel/mcp-adapter": "0.3.1"
```

Change it to:

```json
"@vercel/mcp-adapter": "0.3.2"
```

**No other code changes needed.** The 0.3.2 API is identical to 0.3.1 — same imports, same `createMcpHandler` call, same `basePath` argument. `route.ts` does not need to be touched.

---

### Step 3 — Redeploy

After both changes above:

1. Run `npm install` locally to update `package-lock.json`
2. Commit with message: `fix(mcp): upgrade @vercel/mcp-adapter to 0.3.2 and pin Node to 20.x`
3. Push to `main` → Vercel auto-deploys

---

## How to Verify It's Working

After the deploy goes live, test by calling any MCP tool from Claude. The quickest test is asking Claude to run `get_campaign_stats` — if it returns real data instead of an HTML error, the fix is confirmed.

You can also verify the Node version is applied by checking the build logs for:
```
Detected Next.js version: 16.x.x
```
and confirming there is no Node 24 reference in the runtime.

---

## If Step 2 Doesn't Fix It (Fallback)

If upgrading to 0.3.2 still doesn't resolve the issue, the next step is migrating to the **successor package `mcp-handler`** (Vercel's renamed/updated MCP adapter). That migration requires code changes to `app/api/[transport]/route.ts` and will be covered in a separate brief. Do not proceed to that until Option A is confirmed not working.

---

## What NOT to Change

- Do **not** modify `app/api/[transport]/route.ts`
- Do **not** change any env vars
- Do **not** change `next.config.js`
- Do **not** upgrade Next.js (it is already on 16.1.6 — leave it)
- Do **not** touch any landing page files

---

## Files Changed Summary

| File | Change |
|------|--------|
| `package.json` | `@vercel/mcp-adapter` 0.3.1 → 0.3.2 |
| `package-lock.json` | Auto-updated by `npm install` |
| Vercel Dashboard | Node.js version: 24.x → 20.x |
