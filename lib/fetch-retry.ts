/**
 * lib/fetch-retry.ts
 *
 * Resilient fetch wrapper with automatic retries for transient network errors
 * (ECONNRESET, ETIMEDOUT, UND_ERR_SOCKET, TypeError: fetch failed) and transient
 * HTTP status codes (429, 500, 502, 503, 504).
 *
 * Essential for Vercel serverless function invocations talking to Google APIs
 * (Firestore REST, Google Sheets, OAuth token endpoint) and LeadSquared CRM.
 */

export interface FetchWithRetryOptions extends RequestInit {
  maxRetries?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
  retryOnStatusCodes?: number[];
  label?: string;
  context?: Record<string, unknown>;
}

const DEFAULT_RETRYABLE_STATUSES = [429, 500, 502, 503, 504];

export function isRetryableNetworkError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  const code = (error as { code?: string; cause?: { code?: string } })?.code ||
               (error as { cause?: { code?: string } })?.cause?.code;

  return (
    msg.includes('fetch failed') ||
    msg.includes('ECONNRESET') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('UND_ERR_SOCKET') ||
    msg.includes('socket disconnected') ||
    msg.includes('other side closed') ||
    msg.includes('network timeout') ||
    code === 'ECONNRESET' ||
    code === 'ETIMEDOUT' ||
    code === 'UND_ERR_SOCKET'
  );
}

/**
 * Executes a fetch request with exponential backoff retries on network failures or 5xx/429 responses.
 */
export async function fetchWithRetry(
  url: string | URL,
  options: FetchWithRetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 2,
    initialDelayMs = 300,
    backoffFactor = 2,
    retryOnStatusCodes = DEFAULT_RETRYABLE_STATUSES,
    label = 'fetch',
    context = {},
    ...fetchOptions
  } = options;

  let delay = initialDelayMs;
  let lastError: unknown = null;
  let lastResponse: Response | null = null;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const res = await fetch(url, fetchOptions);

      if (res.ok || !retryOnStatusCodes.includes(res.status) || attempt === maxRetries + 1) {
        if (attempt > 1 && res.ok) {
          console.log(`[fetchRetry] ${label} succeeded on attempt ${attempt}`);
        }
        return res;
      }

      lastResponse = res;
      console.warn(
        `[fetchRetry] ${label} returned HTTP ${res.status} on attempt ${attempt}/${maxRetries + 1}. Retrying in ${delay}ms...`,
        context
      );
    } catch (err) {
      lastError = err;
      const isRetryable = isRetryableNetworkError(err);

      if (!isRetryable || attempt === maxRetries + 1) {
        throw err;
      }

      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[fetchRetry] ${label} network failure on attempt ${attempt}/${maxRetries + 1} (${errMsg}). Retrying in ${delay}ms...`,
        context
      );
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
    delay *= backoffFactor;
  }

  if (lastResponse) return lastResponse;
  throw lastError || new Error(`[fetchRetry] ${label} failed after ${maxRetries + 1} attempts`);
}
