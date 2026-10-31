"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Iconify from "@/components/Iconify";
import {
  sendBuntyMessage,
  type BuntyChatMessage,
} from "@/utils/buntyApi";
import YantraBuddy, { type YantraBuddyState } from "./YantraBuddy";
import styles from "./FloatingBunty.module.css";

const inactivityDelay = 30_000;
const drowsyDuration = 3500;

function timestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getBuddyTip(pathname: string) {
  if (pathname.startsWith("/projects")) {
    return "Discover our robotics projects.";
  }
  if (pathname.startsWith("/events")) {
    return "Explore our robotics events.";
  }
  if (pathname.startsWith("/team")) {
    return "Meet the team behind e-Yantra.";
  }
  return "Welcome! Explore what we're building.";
}

export default function FloatingBunty() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<BuntyChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const [mascotState, setMascotState] = useState<YantraBuddyState>("waking");
  const [tipDismissed, setTipDismissed] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sendingRef = useRef(false);
  const stateTimerRef = useRef<number | null>(null);
  const workingTimerRef = useRef<number | null>(null);
  const inactivityTimerRef = useRef<number | null>(null);
  const drowsyTimerRef = useRef<number | null>(null);
  const chatOpenRef = useRef(false);
  const baseStateRef = useRef<YantraBuddyState>("idle");
  const lastActivityAtRef = useRef(0);
  const isDrowsyRef = useRef(false);
  const initialWakeTimerRef = useRef<number | null>(null);

  const clearStateTimer = () => {
    if (stateTimerRef.current !== null) {
      window.clearTimeout(stateTimerRef.current);
      stateTimerRef.current = null;
    }
  };

  const showReaction = (
    state: YantraBuddyState,
    duration: number,
    returnState: YantraBuddyState = baseStateRef.current,
    settleDuration = 0,
  ) => {
    if (initialWakeTimerRef.current !== null) {
      window.clearTimeout(initialWakeTimerRef.current);
      initialWakeTimerRef.current = null;
    }
    clearStateTimer();
    setMascotState(state);
    stateTimerRef.current = window.setTimeout(() => {
      setMascotState(returnState);
      if (settleDuration > 0) {
        stateTimerRef.current = window.setTimeout(() => {
          setMascotState(baseStateRef.current);
          stateTimerRef.current = null;
        }, settleDuration);
      } else {
        stateTimerRef.current = null;
      }
    }, duration);
  };

  useEffect(() => {
    setMascotState("waking");
    initialWakeTimerRef.current = window.setTimeout(() => {
      setMascotState("idle");
      initialWakeTimerRef.current = null;
    }, 900);
    return () => {
      if (initialWakeTimerRef.current !== null) {
        window.clearTimeout(initialWakeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setTipDismissed(false);
    const timer = window.setTimeout(() => setTipDismissed(true), 7000);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const clearInactivityTimers = () => {
      if (inactivityTimerRef.current !== null) {
        window.clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      if (drowsyTimerRef.current !== null) {
        window.clearTimeout(drowsyTimerRef.current);
        drowsyTimerRef.current = null;
      }
    };

    const scheduleDrowsiness = () => {
      clearInactivityTimers();
      if (open || document.hidden) return;
      inactivityTimerRef.current = window.setTimeout(() => {
        isDrowsyRef.current = true;
        setMascotState("drowsy");
        drowsyTimerRef.current = window.setTimeout(() => {
          setMascotState("sleeping");
          drowsyTimerRef.current = null;
        }, drowsyDuration);
        inactivityTimerRef.current = null;
      }, inactivityDelay);
    };

    const handleActivity = () => {
      const now = performance.now();
      const mascotIsDrowsy = isDrowsyRef.current;
      if (!mascotIsDrowsy && now - lastActivityAtRef.current < 750) return;
      lastActivityAtRef.current = now;
      if (mascotIsDrowsy) {
        isDrowsyRef.current = false;
        clearStateTimer();
        setMascotState("waking");
        stateTimerRef.current = window.setTimeout(() => {
          setMascotState(baseStateRef.current);
          stateTimerRef.current = null;
        }, 900);
      }
      scheduleDrowsiness();
    };

    const handleVisibilityChange = () => {
      setPageHidden(document.hidden);
      if (document.hidden) {
        clearInactivityTimers();
        return;
      }
      lastActivityAtRef.current = performance.now();
      scheduleDrowsiness();
    };

    document.addEventListener("pointermove", handleActivity, { passive: true });
    document.addEventListener("pointerdown", handleActivity, { passive: true });
    document.addEventListener("touchstart", handleActivity, { passive: true });
    document.addEventListener("keydown", handleActivity);
    document.addEventListener("scroll", handleActivity, { passive: true, capture: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    scheduleDrowsiness();

    return () => {
      document.removeEventListener("pointermove", handleActivity);
      document.removeEventListener("pointerdown", handleActivity);
      document.removeEventListener("touchstart", handleActivity);
      document.removeEventListener("keydown", handleActivity);
      document.removeEventListener("scroll", handleActivity, true);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInactivityTimers();
    };
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
      clearStateTimer();
      if (workingTimerRef.current !== null) {
        window.clearTimeout(workingTimerRef.current);
      }
      if (inactivityTimerRef.current !== null) {
        window.clearTimeout(inactivityTimerRef.current);
      }
      if (drowsyTimerRef.current !== null) {
        window.clearTimeout(drowsyTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        chatOpenRef.current = false;
        baseStateRef.current = "idle";
        setOpen(false);
        clearStateTimer();
        setMascotState("idle");
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
    clearStateTimer();
    setMascotState("thinking");
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
    workingTimerRef.current = window.setTimeout(() => {
      if (sendingRef.current) setMascotState("searching");
      workingTimerRef.current = null;
    }, 850);

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
      showReaction("celebrate", 650, "happy", 850);
    } catch (requestError) {
      if (controller.signal.aborted) return;
      setError(
        requestError instanceof Error
          ? requestError.message
          : "I couldn’t connect just now. Please try again.",
      );
      showReaction("confused", 1200);
    } finally {
      if (workingTimerRef.current !== null) {
        window.clearTimeout(workingTimerRef.current);
        workingTimerRef.current = null;
      }
      if (!controller.signal.aborted) {
        sendingRef.current = false;
        setThinking(false);
      }
    }
  };

  const toggleChat = () => {
    const nextOpen = !chatOpenRef.current;
    chatOpenRef.current = nextOpen;
    baseStateRef.current = nextOpen ? "listening" : "idle";
    setOpen(nextOpen);
    if (!sendingRef.current) {
      showReaction("playful", 700, baseStateRef.current);
    }
  };

  return (
    <div
      className={styles.widget}
      data-page-hidden={pageHidden}
      data-panel-side="right"
      data-panel-position="above"
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
                chatOpenRef.current = false;
                baseStateRef.current = "idle";
                setOpen(false);
                clearStateTimer();
                setMascotState("idle");
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
        aria-label={open ? "Close chat with Bunty" : "Open Bunty chat with Yantra Buddy"}
        aria-expanded={open}
        aria-controls={open ? "floating-bunty-dialog" : undefined}
        aria-describedby={!open && !tipDismissed ? "yantra-buddy-tip-text" : undefined}
        onClick={toggleChat}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse" && !sendingRef.current) {
            showReaction("curious", 900);
          }
        }}
        onPointerLeave={() => {
          setMascotState((current) => current === "curious" ? baseStateRef.current : current);
        }}
      >
        <span className={styles.mascotAura} aria-hidden="true" />
        <YantraBuddy state={mascotState} />
      </button>
      {!open && !tipDismissed && (
        <div className={styles.thoughtBubble}>
          <span id="yantra-buddy-tip-text">{getBuddyTip(pathname)}</span>
          <button
            className={styles.bubbleCloseButton}
            type="button"
            aria-label="Dismiss Yantra Buddy tip"
            onClick={() => setTipDismissed(true)}
          >
            <Iconify icon="lucide:x" />
          </button>
        </div>
      )}
    </div>
  );
}
