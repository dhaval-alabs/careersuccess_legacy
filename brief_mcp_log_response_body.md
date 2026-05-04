# Brief: MCP Final Debug — Log the Actual Response Body

**Project:** `careersuccess-legacy`  
**Estimated effort:** 5 min  
**Context:** The `safeHandler` try/catch is not firing because `mcp-handler` isn't throwing — it's returning a Response with HTML content directly. We need to intercept and log that response body before it reaches Claude.

---

## Single change to `app/api/[transport]/route.ts`

Replace the entire `safeHandler` function with this:

```typescript
async function safeHandler(req: Request) {
  console.log('[MCP] Received:', req.method)
  try {
    const response = await handler(req)
    
    // Clone so we can read the body for logging without consuming it
    const cloned = response.clone()
    const bodyText = await cloned.text()
    
    console.log('[MCP] Response status:', response.status)
    console.log('[MCP] Response body (first 300 chars):', bodyText.substring(0, 300))
    
    // If body starts with HTML, return a proper JSON error instead
    if (bodyText.trimStart().startsWith('<')) {
      console.error('[MCP] HTML response detected — returning JSON error instead')
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          error: { code: -32603, message: 'Internal error: handler returned HTML', detail: bodyText.substring(0, 500) },
          id: null
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    return response
  } catch (error) {
    console.error('[MCP] Handler threw:', error)
    return new Response(
      JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: String(error) }, id: null }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export { safeHandler as GET, safeHandler as POST, handler as DELETE }
```

---

## What this does

1. Logs `[MCP] Received: POST` — confirms `safeHandler` is being called
2. Logs `[MCP] Response status: 200` and the first 300 chars of the body — shows exactly what `mcp-handler` is returning
3. If the body is HTML, returns a **readable JSON error** to Claude instead — so Claude will show us `detail: "<!DOCTYPE HTML..."` with the actual HTML content, telling us which page/error is being rendered
4. The `console.log` calls will appear in Vercel runtime logs Message column

---

## After deploying

Ping us. One tool call will either:
- Show `[MCP] Response body: <!DOCTYPE...` in Vercel logs → we see which HTML page
- Show the error message in Claude directly → we read it and fix the root cause

Either way, next step will be the **actual fix**, not another debug step.

---

## Note on `handler as DELETE`
The `DELETE` export uses `handler` directly (not `safeHandler`) to avoid consuming the stream twice on DELETE requests. GET and POST go through `safeHandler`.
