/**
 * Bunty API Client Stub & Interface Contract
 *
 * This module isolates all communication with the Bunty Bot AI backend.
 *
 * FUTURE IMPLEMENTATION:
 * 1. Store the API endpoint in process.env.NEXT_PUBLIC_BUNTY_API_URL or a Next.js Route Handler (/api/bunty).
 * 2. Authenticate using either an environment API key or a user-provided API key from the frontend settings.
 * 3. Never commit raw keys to git.
 */

export interface BuntyChatMessage {
  id: string;
  sender: "user" | "bunty";
  text: string;
  timestamp: string;
}

export interface SendMessageOptions {
  message: string;
  apiKey?: string; // Optional user key override for future BYOK (bring-your-own-key)
  signal?: AbortSignal;
}

export interface BuntyApiResponse {
  success: boolean;
  reply?: string;
  error?: string;
}

/**
 * Stub function ready to be wired with the actual Bunty backend.
 * Currently returns a mock thoughtful response until the API key and endpoint are attached.
 */
export async function sendBuntyMessage(
  options: SendMessageOptions
): Promise<BuntyApiResponse> {
  const { message, apiKey, signal } = options;

  // Staged for future API key authentication logging/verification:
  if (apiKey) {
    // Custom key provided by user (client-side BYOK)
  }

  // Simulate network latency for natural UX preview
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (signal?.aborted) {
    throw new Error("Request was cancelled.");
  }

  // Placeholder for real fetch call:
  /*
  const response = await fetch('/api/bunty/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({ prompt: message }),
    signal
  });
  const data = await response.json();
  return data;
  */

  return {
    success: true,
    reply: message.trim().endsWith("?")
      ? "That’s a good question. I’m still learning the details, but I can help you explore e-Yantra’s projects, student teams, and events."
      : "Thanks for sharing that. I’m still learning the details, but I can help you explore e-Yantra’s projects, student teams, and events.",
  };
}
