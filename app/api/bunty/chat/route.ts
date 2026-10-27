import { headers } from "next/headers";

const BUNTY_API_URL = "https://bunty-api.vercel.app/api/chat";
const MAX_PROMPT_LENGTH = 4000;
const MAX_BODY_BYTES = 16 * 1024; // 16 KB

// Rate limiting configuration (15 requests per 60 seconds per IP/client)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 15;

// Response caching configuration: cache successful responses for 10 minutes (TTL)
const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_CACHE_SIZE = 500;

interface CacheRecord {
  reply: string;
  expiresAt: number;
}

const responseCache = new Map<string, CacheRecord>();

function normalizePrompt(prompt: string): string {
  return prompt
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

function getCachedReply(prompt: string): string | null {
  const key = normalizePrompt(prompt);
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    responseCache.delete(key);
    return null;
  }
  return entry.reply;
}

function setCachedReply(prompt: string, reply: string): void {
  const key = normalizePrompt(prompt);
  if (responseCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = responseCache.keys().next().value;
    if (oldestKey) responseCache.delete(oldestKey);
  }
  responseCache.set(key, {
    reply,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory sliding window fallback for single-instance or development.
// Note: In distributed multi-region serverless deployments (Vercel Edge/Serverless),
// this protects against single-instance bursts. For shared distributed rate limiting,
// configure Vercel Web Application Firewall (WAF) Rate Limiting rule on `/api/bunty/chat`
// or connect Upstash Redis with `@upstash/ratelimit`.
const rateLimitMap = new Map<string, RateLimitRecord>();

function checkRateLimit(clientIdentifier: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const existing = rateLimitMap.get(clientIdentifier);

  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(clientIdentifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    // Periodically clean up stale records to prevent memory growth
    if (rateLimitMap.size > 1000) {
      for (const [key, val] of rateLimitMap.entries()) {
        if (now > val.resetTime) {
          rateLimitMap.delete(key);
        }
      }
    }
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetTime - now) / 1000));
    return { allowed: false, retryAfter };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function errorResponse(error: string, status: number, headersInit?: HeadersInit) {
  return Response.json({ success: false, error }, { status, headers: headersInit });
}

export async function POST(request: Request) {
  // 1. Client IP / identifier extraction for rate limiting
  const reqHeaders = await headers();
  const forwardedFor = reqHeaders.get("x-forwarded-for");
  const realIp = reqHeaders.get("x-real-ip");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : (realIp || "anonymous-client");

  const { allowed, retryAfter } = checkRateLimit(clientIp);
  if (!allowed) {
    return errorResponse(
      `You're sending messages too fast. Please wait ${retryAfter} second${retryAfter === 1 ? "" : "s"} and try again.`,
      429,
      { "Retry-After": retryAfter.toString() }
    );
  }

  // 2. Bound incoming request size before reading body
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return errorResponse("Request payload is too large.", 413);
  }

  // 3. Read and validate request body
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return errorResponse("Request payload is too large.", 413);
    }
    body = JSON.parse(text);
  } catch {
    return errorResponse("Please send a valid message.", 400);
  }

  if (!body || typeof body !== "object" || !("prompt" in body)) {
    return errorResponse("Please enter a message for Bunty.", 400);
  }

  const prompt = (body as { prompt: unknown }).prompt;
  if (typeof prompt !== "string" || !prompt.trim()) {
    return errorResponse("Please enter a message for Bunty.", 400);
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return errorResponse("That message is too long. Please shorten it and try again.", 400);
  }

  // 4. Check cache for previously answered prompt
  const cached = getCachedReply(prompt);
  if (cached) {
    return Response.json({ success: true, reply: cached, cached: true });
  }

  // 5. Verify API key
  const apiKey = process.env.BUNTY_API_KEY;
  if (!apiKey) {
    return errorResponse("Bunty is not configured yet. Please try again later.", 503);
  }

  // 6. Upstream call with bounded timeout and safe error handling
  let upstream: Response;
  try {
    upstream = await fetch(BUNTY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ prompt: prompt.trim() }),
      cache: "no-store",
      signal: AbortSignal.timeout(45_000),
    });
  } catch {
    return errorResponse("Bunty is unavailable right now. Please try again shortly.", 502);
  }

  // Upstream status checks
  if (upstream.status === 429) {
    return errorResponse("Bunty is currently experiencing high demand. Please wait a moment and try again.", 429);
  }
  if (upstream.status === 401 || upstream.status === 403) {
    return errorResponse("Bunty authentication failed. Please contact administrator.", 503);
  }
  if (!upstream.ok) {
    return errorResponse("Bunty is unavailable right now. Please try again shortly.", 502);
  }

  let data: unknown;
  try {
    data = await upstream.json();
  } catch {
    return errorResponse("Bunty returned an unreadable response. Please try again.", 502);
  }

  if (
    !data ||
    typeof data !== "object" ||
    !("success" in data) ||
    data.success !== true ||
    !("reply" in data) ||
    typeof (data as { reply: unknown }).reply !== "string" ||
    !(data as { reply: string }).reply.trim()
  ) {
    return errorResponse("Bunty could not reply to that message. Please try again.", 502);
  }

  const finalReply = (data as { reply: string }).reply.trim();
  setCachedReply(prompt, finalReply);

  return Response.json({ success: true, reply: finalReply });
}

