# Fix: MCP Server Not Loading in New Claude Sessions (GET 405 Error)

**File to edit:** `app/api/[transport]/route.ts`  
**Repo:** `dhaval-alabs/careersuccess_legacy`  
**Priority:** Critical — MCP tools fail to load in fresh Claude sessions

---

## Root Cause

Vercel runtime logs show every MCP session initialization attempt results in:

```
GET /api/mcp → 405 Method Not Allowed — "Received GET MCP request"
```

Claude.ai sends a `GET` request first during MCP session setup (SSE transport handshake), before switching to `POST` for tool calls. The `@vercel/mcp-adapter` is rejecting the GET with 405, causing Claude.ai to abort the connection before any tools are registered.

This is why tools load inconsistently — only when the POST handshake succeeds before the GET rejection causes Claude to give up.

---

## Fix

The `createMcpHandler` needs to be told to support **both** SSE (GET) and streamable HTTP (POST) transports. This is done by passing the correct transport option to the adapter config.

### Change in `app/api/[transport]/route.ts`

**Find** the handler config at the bottom of the file:

```ts
const handler = createMcpHandler(
  (server) => {
    // ... all tools ...
  },
  {},
  {
    basePath: '/api',
    maxDuration: 60,
    verboseLogs: true,
  }
)

export { handler as GET, handler as POST }
```

**Replace with:**

```ts
const handler = createMcpHandler(
  (server) => {
    // ... all tools (unchanged) ...
  },
  {},
  {
    basePath: '/api',
    maxDuration: 60,
    verboseLogs: true,
    // Explicitly support both transports so Claude.ai's GET handshake succeeds
    transportStrategy: 'sse-and-post',
  }
)

export { handler as GET, handler as POST }
```

> **Note:** If `transportStrategy` is not a recognised option in the version of `@vercel/mcp-adapter` currently installed, try upgrading the package first:
> ```bash
> npm install @vercel/mcp-adapter@latest
> ```
> Then check the adapter's changelog/README for the correct option name — it may be `transport`, `supportedTransports`, or similar depending on version.

---

## Alternative Fix (if above doesn't work)

If `@vercel/mcp-adapter` doesn't expose a transport strategy option, add an explicit GET handler that returns a proper SSE response to satisfy Claude.ai's handshake:

```ts
// Add this ABOVE the createMcpHandler call
export async function GET(req: Request) {
  // Return SSE headers to satisfy Claude.ai's transport discovery GET
  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

And change the export at the bottom to only export POST (since GET is now explicit):

```ts
export { handler as POST }
```

---

## Verification Steps

1. Deploy to production
2. Open a **brand new** Claude.ai chat (not a reload — a genuinely fresh conversation)
3. Ask: *"which campaign has the lowest CPA this month?"*
4. Claude should immediately call `get_campaign_stats` without saying "I don't have access to Google Ads"
5. Check Vercel runtime logs — you should now see `POST /api/mcp` with 200 status instead of `GET /api/mcp` with 405

---

## Notes

- The camelCase fix from `mcp-fix-camelcase-and-debug-logging.md` is already deployed and correct — do not revert those changes
- This fix is independent and additive — only the handler config / export changes
- Once tools load reliably in new sessions, remove the temporary `console.log` debug line from `gadsQuery()` as a follow-up cleanup commit
