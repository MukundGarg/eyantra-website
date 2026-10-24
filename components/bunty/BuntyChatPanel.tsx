"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import Iconify from "@/components/Iconify";
import { sendBuntyMessage, type BuntyChatMessage } from "@/utils/buntyApi";

export type BuntyChatState = "idle" | "thinking" | "answered";

type BuntyChatPanelProps = {
  chatState: BuntyChatState;
  onChatStateChange: (state: BuntyChatState) => void;
};

function getTimestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BuntyChatPanel({
  chatState,
  onChatStateChange,
}: BuntyChatPanelProps) {
  const [messages, setMessages] = useState<BuntyChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const isSendingRef = useRef(false);
  const answeredTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isThinking = chatState === "thinking";

  useEffect(() => {
    const messagesElement = messagesRef.current;
    if (messagesElement) messagesElement.scrollTop = messagesElement.scrollHeight;
  }, [messages, chatState]);

  useEffect(
    () => () => {
      if (answeredTimerRef.current) clearTimeout(answeredTimerRef.current);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    },
    [],
  );

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = inputValue.trim();
    if (!text || isSendingRef.current) return;

    if (answeredTimerRef.current) {
      clearTimeout(answeredTimerRef.current);
      answeredTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    isSendingRef.current = true;
    setInputValue("");
    setError("");
    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text,
        timestamp: getTimestamp(),
      },
    ]);
    onChatStateChange("thinking");

    let isSuccess = false;
    try {
      const response = await sendBuntyMessage({
        message: text,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;

      const reply = response.reply?.trim();
      if (!response.success || !reply) {
        throw new Error(response.error || "Bunty could not reply to that message.");
      }

      setMessages((current) => [
        ...current,
        {
          id: `bunty-${Date.now()}`,
          sender: "bunty",
          text: reply,
          timestamp: getTimestamp(),
        },
      ]);
      isSuccess = true;
    } catch (requestError) {
      if (controller.signal.aborted) return;
      setError(
        requestError instanceof Error
          ? requestError.message
          : "I couldn’t connect just now. Please try sending that again.",
      );
    } finally {
      if (!controller.signal.aborted) {
        isSendingRef.current = false;
        if (isSuccess) {
          onChatStateChange("answered");
          answeredTimerRef.current = setTimeout(() => {
            onChatStateChange("idle");
            answeredTimerRef.current = null;
          }, 450);
        } else {
          // Failure: immediately return to idle so thinking cloud disappears and error is shown
          onChatStateChange("idle");
        }
      }
    }
  };

  return (
    <section className="bunty-chat" aria-label="Chat with Bunty">
      <div
        ref={messagesRef}
        className="bunty-messages"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((message) => {
          const isUser = message.sender === "user";
          return (
            <div
              key={message.id}
              className={`bunty-message-row ${isUser ? "is-user" : "is-bunty"}`}
            >
              <div className={`bunty-message ${isUser ? "is-user" : "is-bunty"}`}>
                <p>{message.text}</p>
                {message.timestamp && (
                  <time className="bunty-message-time">{message.timestamp}</time>
                )}
              </div>
            </div>
          );
        })}
        {isThinking && (
          <div className="bunty-message-row is-bunty" aria-label="Bunty is thinking">
            <div className="bunty-message is-bunty bunty-typing" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
        {error && (
          <p className="bunty-error" role="alert">
            {error}
          </p>
        )}
      </div>

      <form className="bunty-composer" onSubmit={handleSend}>
        <label className="sr-only" htmlFor="bunty-message">
          Message Bunty
        </label>
        <Iconify
          icon="lucide:sparkles"
          className="bunty-composer-sparkle"
          aria-hidden="true"
        />
        <input
          id="bunty-message"
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Ask Bunty anything..."
          autoComplete="off"
          disabled={isThinking}
          maxLength={4000}
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={isThinking || !inputValue.trim()}
        >
          <Iconify icon="lucide:arrow-up" className="w-5 h-5" />
        </button>
      </form>
    </section>
  );
}
