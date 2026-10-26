"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Iconify from "@/components/Iconify";
import {
  sendBuntyMessage,
  type BuntyChatMessage,
} from "@/utils/buntyApi";
import styles from "./FloatingBunty.module.css";

type Position = {
  x: number;
  y: number;
  panelSide: "left" | "right";
  panelPosition: "above" | "below";
};

const buntyPrompts = [
  "Need a project idea?",
  "Curious about our next event?",
  "Ask me about robotics!",
];

function timestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function FloatingBunty() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [messages, setMessages] = useState<BuntyChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [error, setError] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sendingRef = useRef(false);
  const openRef = useRef(open);
  const pointerRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(pointer: coarse)");

    const setDefaultPosition = () => {
      setPosition({
        x: Math.max(16, window.innerWidth - 120),
        y: Math.max(16, window.innerHeight - 128),
        panelSide: "right",
        panelPosition: "above",
      });
    };

    const moveWithPointer = (event: PointerEvent) => {
      if (
        event.pointerType !== "mouse" ||
        mobileQuery.matches ||
        openRef.current
      ) {
        return;
      }

      pointerRef.current = { x: event.clientX, y: event.clientY };
      const widget = widgetRef.current;
      if (!widget || widget.contains(event.target as Node)) return;
      const bounds = widget.getBoundingClientRect();
      const approachZone = 56;
      if (
        event.clientX >= bounds.left - approachZone &&
        event.clientX <= bounds.right + approachZone &&
        event.clientY >= bounds.top - approachZone &&
        event.clientY <= bounds.bottom + approachZone
      ) {
        return;
      }
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const { x: pointerX, y: pointerY } = pointerRef.current;
        const widgetWidth = 104;
        const widgetHeight = 104;
        const margin = 12;
        const widget = widgetRef.current;
        if (!widget) return;

        const x = Math.min(
          Math.max(
            margin,
            pointerX + widgetWidth + 22 < window.innerWidth - margin
              ? pointerX + 22
              : pointerX - widgetWidth - 22,
          ),
          window.innerWidth - widgetWidth - margin,
        );
        const y = Math.min(
          Math.max(
            margin,
            pointerY + widgetHeight + 22 < window.innerHeight - margin
              ? pointerY + 22
              : pointerY - widgetHeight - 22,
          ),
          window.innerHeight - widgetHeight - margin,
        );

        widget.style.left = `${x}px`;
        widget.style.top = `${y}px`;
        widget.dataset.panelSide =
          x < window.innerWidth / 2 ? "left" : "right";
        widget.dataset.panelPosition = y < 420 ? "below" : "above";
      });
    };

    setDefaultPosition();
    window.addEventListener("resize", setDefaultPosition, { passive: true });
    window.addEventListener("pointermove", moveWithPointer, { passive: true });

    return () => {
      window.removeEventListener("resize", setDefaultPosition);
      window.removeEventListener("pointermove", moveWithPointer);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const interval = window.setInterval(() => {
      setPromptIndex((current) => (current + 1) % buntyPrompts.length);
    }, 6500);
    return () => window.clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (pathname === "/bunty" || pathname.startsWith("/admin")) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || sendingRef.current) return;

    sendingRef.current = true;
    setThinking(true);
    setError("");
    setInput("");
    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text,
        timestamp: timestamp(),
      },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await sendBuntyMessage({
        message: text,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;

      const reply = response.reply?.trim();
      if (!response.success || !reply) {
        throw new Error(response.error || "Bunty could not reply just now.");
      }

      setMessages((current) => [
        ...current,
        {
          id: `bunty-${Date.now()}`,
          sender: "bunty",
          text: reply,
          timestamp: timestamp(),
        },
      ]);
    } catch (requestError) {
      if (controller.signal.aborted) return;
      setError(
        requestError instanceof Error
          ? requestError.message
          : "I couldn’t connect just now. Please try again.",
      );
    } finally {
      if (!controller.signal.aborted) {
        sendingRef.current = false;
        setThinking(false);
      }
    }
  };

  const toggleChat = () => {
    const widget = widgetRef.current;
    if (widget) {
      const { left, top } = widget.getBoundingClientRect();
      setPosition({
        x: left,
        y: top,
        panelSide: left < window.innerWidth / 2 ? "left" : "right",
        panelPosition: top < 420 ? "below" : "above",
      });
    }
    setOpen((current) => !current);
  };

  return (
    <div
      ref={widgetRef}
      className={styles.widget}
      data-panel-side={position?.panelSide ?? "right"}
      data-panel-position={position?.panelPosition ?? "above"}
      style={
        position
          ? { left: `${position.x}px`, top: `${position.y}px` }
          : undefined
      }
    >
      {open && (
        <section
          className={styles.panel}
          id="floating-bunty-dialog"
          role="dialog"
          aria-labelledby="floating-bunty-title"
          aria-modal="false"
        >
          <header className={styles.panelHeader}>
            <div className={styles.headerMascot} aria-hidden="true">
              <span className={styles.headerFace}>⌣</span>
              <span className={styles.headerEyes} />
            </div>
            <div className={styles.headerCopy}>
              <h2 id="floating-bunty-title">Chat with Bunty</h2>
              <p>Your e-Yantra guide</p>
            </div>
            <button
              className={styles.closeButton}
              type="button"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label="Close Bunty chat"
            >
              <Iconify icon="lucide:x" />
            </button>
          </header>

          <div className={styles.messages} ref={logRef} role="log" aria-live="polite">
            {messages.length === 0 && (
              <div className={styles.welcome}>
                <span className={styles.welcomeEyebrow}>Hey there!</span>
                <p>
                  I’m Bunty. Ask me about our projects, events, or robotics at
                  e-Yantra MSIT.
                </p>
                <button
                  className={styles.suggestion}
                  type="button"
                  onClick={() => setInput("What does e-Yantra MSIT do?")}
                >
                  What does e-Yantra MSIT do?
                </button>
              </div>
            )}

            {messages.map((message) => (
              <div
                className={`${styles.messageRow} ${
                  message.sender === "user" ? styles.userRow : ""
                }`}
                key={message.id}
              >
                <p
                  className={`${styles.message} ${
                    message.sender === "user" ? styles.userMessage : ""
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}

            {thinking && (
              <div className={styles.messageRow} role="status" aria-label="Bunty is thinking">
                <p className={`${styles.message} ${styles.typing}`}>
                  <span />
                  <span />
                  <span />
                </p>
              </div>
            )}
            {error && <p className={styles.error} role="alert">{error}</p>}
          </div>

          <form className={styles.composer} onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="floating-bunty-message">
              Message Bunty
            </label>
            <textarea
              ref={inputRef}
              id="floating-bunty-message"
              rows={1}
              maxLength={4000}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Ask Bunty anything..."
              disabled={thinking}
            />
            <button
              type="submit"
              aria-label="Send message to Bunty"
              disabled={thinking || !input.trim()}
            >
              <Iconify icon="lucide:arrow-up" />
            </button>
          </form>
        </section>
      )}

      <button
        ref={buttonRef}
        className={styles.mascotButton}
        type="button"
        aria-label={open ? "Close chat with Bunty" : "Chat with Bunty"}
        aria-expanded={open}
        aria-controls="floating-bunty-dialog"
        onClick={toggleChat}
      >
        <span className={styles.mascotAura} aria-hidden="true" />
        {!open && (
          <span className={styles.thoughtBubble} aria-live="polite">
            <span className={styles.thoughtDot} aria-hidden="true" />
            {buntyPrompts[promptIndex]}
          </span>
        )}
        <Image
          className={styles.mascotImage}
          src="/images/bunty-companion.png"
          alt=""
          width={554}
          height={554}
          unoptimized
          draggable={false}
        />
      </button>
    </div>
  );
}
