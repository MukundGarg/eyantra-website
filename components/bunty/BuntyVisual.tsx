"use client";

import { useEffect, useRef } from "react";

type BuntyVisualProps = {
  chatState: "idle" | "thinking" | "answered";
};

export default function BuntyVisual({ chatState }: BuntyVisualProps) {
  const visualRef = useRef<HTMLDivElement>(null);
  const showCloud = chatState !== "idle";

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const resetPosition = () => {
      visual.style.setProperty("--bunty-follow-x", "0px");
      visual.style.setProperty("--bunty-follow-y", "0px");
      visual.style.setProperty("--bunty-tilt-x", "0deg");
      visual.style.setProperty("--bunty-tilt-y", "0deg");
      visual.style.setProperty("--bunty-light-x", "0px");
      visual.style.setProperty("--bunty-light-y", "0px");
      visual.style.setProperty("--bunty-counter-x", "0px");
      visual.style.setProperty("--bunty-counter-y", "0px");
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || motionPreference.matches) return;

      const bounds = visual.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - (bounds.left + bounds.width / 2)) / (window.innerWidth / 2)));
      const y = Math.max(-1, Math.min(1, (event.clientY - (bounds.top + bounds.height / 2)) / (window.innerHeight / 2)));

      visual.style.setProperty("--bunty-follow-x", `${x * 8}px`);
      visual.style.setProperty("--bunty-follow-y", `${y * 8}px`);
      visual.style.setProperty("--bunty-tilt-x", `${-y * 5}deg`);
      visual.style.setProperty("--bunty-tilt-y", `${x * 5}deg`);
      visual.style.setProperty("--bunty-light-x", `${x * 22}px`);
      visual.style.setProperty("--bunty-light-y", `${y * 16}px`);
      visual.style.setProperty("--bunty-counter-x", `${x * -16}px`);
      visual.style.setProperty("--bunty-counter-y", `${y * -12}px`);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("blur", resetPosition);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetPosition);
    };
  }, []);

  return (
    <div
      ref={visualRef}
      className="bunty-visual"
      role="img"
      aria-label="Bunty, a softly glowing character"
    >
      <div className="bunty-aura" />
      <div className="bunty-head">
        <div className="bunty-head-light bunty-head-light-one" />
        <div className="bunty-head-light bunty-head-light-two" />
      </div>
      <div className="bunty-face">
        <svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
          <path d="M49 76 Q65 58 82 73" />
          <path d="M118 73 Q135 58 151 76" />
          <circle cx="67" cy="91" r="3.8" />
          <circle cx="133" cy="91" r="3.8" />
          <path d="M99 82 V116 H111" />
        </svg>
      </div>

      {showCloud && (
        <div
          className={`bunty-thinking-cloud ${
            chatState === "thinking" ? "is-thinking" : "is-answering"
          }`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 180 112" fill="none">
            <defs>
              <linearGradient id="bunty-cloud-gradient" x1="20" y1="16" x2="160" y2="88">
                <stop stopColor="#65C9DE" />
                <stop offset="0.55" stopColor="#A48DE6" />
                <stop offset="1" stopColor="#86B7E9" />
              </linearGradient>
            </defs>
            <path
              className="bunty-cloud-outline"
              d="M27 72h117c14 0 23-9 23-21 0-12-9-21-22-22-2-14-14-24-29-24-11 0-20 5-25 14-5-5-12-8-20-8-14 0-25 10-27 23-14 0-24 9-24 21 0 9 3 14 7 17Z"
            />
            <circle className="bunty-cloud-dot bunty-cloud-dot-one" cx="39" cy="91" r="4" />
            <circle className="bunty-cloud-dot bunty-cloud-dot-two" cx="25" cy="103" r="2.5" />
          </svg>
        </div>
      )}
    </div>
  );
}
