# Brief: MCP Debug — Add Error Wrapper to Catch Silent Crash

**Project:** `careersuccess-legacy`  
**Priority:** High  
**Estimated effort:** 10 min  
**Context:** The MCP framework is now working correctly (GET /api/mcp returns valid JSON). But POST tool calls crash silently — no logs, no error output — just HTML returned. The crash is happening inside tool execution (likely `getAccessToken()` or the Google Ads API fetch) and the error is swallowed. This brief adds a wrapper to surface the real error.

---

## Changes required — `app/api/[transport]/route.ts` only

### Change 1: Wrap the handler to catch and log crashes

Find the current export at the bottom of the file:

```typescript
export { handler as GET, handler as POST, handler as DELETE }
```

Replace it with this:

```typescript
async function safeHandler(req: Request) {
  try {
    return await handler(req)
  } catch (error) {
    console.error('[MCP] Handler crashed:', error)
    return new Response(
      JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: String(error) }, id: null }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export { safeHandler as GET, safeHandler as POST, safeHandler as DELETE }
```

### Change 2: Add error logging inside `getAccessToken()`

Find the `getAccessToken()` function. Wrap the entire function body in try/catch:

```typescript
async function getAccessToken(): Promise<string> {
  try {
    // ... existing code stays exactly as-is ...
  } catch (error) {
    console.error('[MCP] getAccessToken failed:', error)
    throw error
  }
}
```

---

## What this does

- If the handler crashes, it now returns a JSON error instead of HTML
- `console.error` lines will appear in Vercel runtime logs
- We can finally see the actual error message

---

## After deploying

Ping us immediately — we'll call `get_conversion_stats` and check Vercel logs. The error message will tell us the exact fix needed (expired OAuth token, network issue, API format problem, etc.)

---

## What NOT to change

- Do not touch any tool definitions
- Do not change imports or other exports
- Do not touch landing page files
