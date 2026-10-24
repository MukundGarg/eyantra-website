const BUNTY_API_URL = "https://bunty-api.vercel.app/api/chat";
const MAX_PROMPT_LENGTH = 4000;

function errorResponse(error: string, status: number) {
  return Response.json({ success: false, error }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Please send a valid message.", 400);
  }

  if (!body || typeof body !== "object" || !("prompt" in body)) {
    return errorResponse("Please enter a message for Bunty.", 400);
  }

  const prompt = body.prompt;
  if (typeof prompt !== "string" || !prompt.trim()) {
    return errorResponse("Please enter a message for Bunty.", 400);
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return errorResponse("That message is too long. Please shorten it and try again.", 400);
  }

  const apiKey = process.env.BUNTY_API_KEY;
  if (!apiKey) {
    return errorResponse("Bunty is not configured yet. Please try again later.", 503);
  }

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
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    return errorResponse("Bunty is unavailable right now. Please try again shortly.", 502);
  }

  let data: unknown;
  try {
    data = await upstream.json();
  } catch {
    return errorResponse("Bunty returned an unreadable response. Please try again.", 502);
  }

  if (!upstream.ok) {
    return errorResponse("Bunty is unavailable right now. Please try again shortly.", 502);
  }
  if (
    !data ||
    typeof data !== "object" ||
    !("success" in data) ||
    data.success !== true ||
    !("reply" in data) ||
    typeof data.reply !== "string" ||
    !data.reply.trim()
  ) {
    return errorResponse("Bunty could not reply to that message. Please try again.", 502);
  }

  return Response.json({ success: true, reply: data.reply.trim() });
}
