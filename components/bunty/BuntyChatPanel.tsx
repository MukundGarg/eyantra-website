"use client";

import React, { useState, useRef, useEffect } from "react";
import Iconify from "@/components/Iconify";
import { BuntyChatMessage, sendBuntyMessage } from "@/utils/buntyApi";

const INITIAL_MESSAGES: BuntyChatMessage[] = [
  {
    id: "welcome-1",
    sender: "bunty",
    text: "Hello! I am Bunty, the e-Yantra robotics society guide. Feel free to explore how I work or test this chat shell. Full API key authentication and live answering will be activated in the next step.",
    timestamp: "Just now",
  },
];

export default function BuntyChatPanel() {
  const [messages, setMessages] = useState<BuntyChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [userApiKey, setUserApiKey] = useState("");
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: BuntyChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsLoading(true);

    try {
      // Future integration point: passes user's API key if provided
      const response = await sendBuntyMessage({
        message: text,
        apiKey: userApiKey || undefined,
      });

      const buntyMsg: BuntyChatMessage = {
        id: `bunty-${Date.now()}`,
        sender: "bunty",
        text: response.reply || "Sorry, I could not generate a response right now.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, buntyMsg]);
    } catch {
      const errorMsg: BuntyChatMessage = {
        id: `err-${Date.now()}`,
        sender: "bunty",
        text: "Encountered a connection delay with the Bunty API stub.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const saveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (userApiKey.trim()) {
      setHasCustomKey(true);
    } else {
      setHasCustomKey(false);
    }
    setShowApiKeyModal(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-lg overflow-hidden flex flex-col transition-all">
      {/* Panel Header */}
      <div className="px-5 py-3.5 border-b border-[var(--border)] bg-[var(--bg-surface-alt)]/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-violet-400 p-[1.5px] shadow-sm">
            <div className="w-full h-full rounded-full bg-[var(--bg-surface)] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping absolute" />
              <span className="w-2 h-2 rounded-full bg-cyan-500 relative" />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
              <span>Bunty Chat Shell</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-medium">
                Prototype Ready
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Interactive preview & API hook ready
            </p>
          </div>
        </div>

        {/* Future API Key toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowApiKeyModal(true)}
            title="Configure Bunty API key"
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors cursor-pointer"
          >
            <Iconify icon="lucide:key-round" className="w-3.5 h-3.5 text-amber-500" />
            <span>{hasCustomKey ? "Key Set" : "Connect API Key"}</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 md:p-6 space-y-4 max-h-[380px] min-h-[260px] overflow-y-auto">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 items-start ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              {!isUser ? (
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-violet-500 shrink-0 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                  B
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-[var(--border)] text-[var(--text-primary)] shrink-0 flex items-center justify-center text-xs font-semibold">
                  You
                </div>
              )}

              {/* Speech bubble */}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? "bg-[var(--accent-red)] text-white rounded-tr-none shadow-sm"
                    : "bg-[var(--bg-surface-alt)] text-[var(--text-primary)] rounded-tl-none border border-[var(--border)]"
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1.5 font-mono ${
                    isUser ? "text-white/70 text-right" : "text-[var(--text-secondary)] text-left"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading state indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center text-[var(--text-secondary)] text-xs">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-violet-500 shrink-0 flex items-center justify-center text-[10px] text-white font-bold">
              B
            </div>
            <div className="flex items-center gap-1.5 bg-[var(--bg-surface-alt)] px-3.5 py-2 rounded-full border border-[var(--border)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
              <span className="ml-1 text-[11px] font-mono">Bunty is formulating...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 md:p-4 border-t border-[var(--border)] bg-[var(--bg-surface-alt)]/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Bunty about robotics, our lab, or projects..."
            className="flex-1 bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-red)] focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="flex items-center justify-center gap-1.5 px-4 md:px-5 py-3 rounded-xl bg-[var(--accent-red)] text-white text-sm font-medium hover:bg-[var(--accent-red-strong)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer shrink-0"
          >
            <span>Send</span>
            <Iconify icon="lucide:send" className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between mt-2.5 px-1 text-[11px] text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Frontend shell active • API ready
          </span>
          <span className="font-mono text-[10px]">Press Enter to send</span>
        </div>
      </div>

      {/* Modal for setting API key (modular stub) */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Iconify icon="lucide:key-round" className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  Bunty API Key Setup
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowApiKeyModal(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 cursor-pointer"
              >
                <Iconify icon="lucide:x" className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              In the upcoming release, you will be able to supply a personal or organization API key to interact with Bunty in real-time. Keys remain strictly on your client and are never saved to our repository.
            </p>

            <form onSubmit={saveApiKey} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1">
                  API Key (Optional / Future Hook)
                </label>
                <input
                  type="password"
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                  placeholder="bunty_sk_..."
                  className="w-full bg-[var(--bg-surface-alt)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--accent-red)]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--accent-red)] text-white text-xs font-semibold hover:bg-[var(--accent-red-strong)] cursor-pointer"
                >
                  Save Preference
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
