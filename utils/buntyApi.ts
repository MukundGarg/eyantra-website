export interface BuntyChatMessage {
  id: string;
  sender: "user" | "bunty";
  text: string;
  timestamp: string;
}

export interface SendMessageOptions {
  message: string;
  signal?: AbortSignal;
}

export interface BuntyApiResponse {
  success: boolean;
  reply?: string;
  error?: string;
}

export async function sendBuntyMessage(
  options: SendMessageOptions,
): Promise<BuntyApiResponse> {
  let response: Response;
  try {
    response = await fetch("/api/bunty/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: options.message }),
      signal: options.signal,
    });
  } catch {
    return {
      success: false,
      error: "I couldn’t connect just now. Please try sending that again.",
    };
  }

  const data: unknown = await response.json().catch(() => null);
  if (
    !response.ok ||
    !data ||
    typeof data !== "object" ||
    !("success" in data) ||
    data.success !== true ||
    !("reply" in data) ||
    typeof data.reply !== "string"
  ) {
    const error =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : "Bunty is unavailable right now. Please try again shortly.";
    return { success: false, error };
  }

  return { success: true, reply: data.reply };
}
