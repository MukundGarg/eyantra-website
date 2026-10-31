"use client";

import { useEffect, useState } from "react";
import styles from "./YantraBuddy.module.css";

export type YantraBuddyState =
  | "waking"
  | "idle"
  | "listening"
  | "thinking"
  | "searching"
  | "excited"
  | "curious"
  | "confused"
  | "happy"
  | "playful"
  | "drowsy"
  | "sleeping"
  | "celebrate";

type YantraBuddyProps = {
  state: YantraBuddyState;
};

export default function YantraBuddy({ state }: YantraBuddyProps) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let timer: number | null = null;
    let closeTimer: number | null = null;
    let stopped = false;

    const clearTimers = () => {
      if (timer !== null) window.clearTimeout(timer);
      if (closeTimer !== null) window.clearTimeout(closeTimer);
      timer = null;
      closeTimer = null;
    };

    const scheduleBlink = () => {
      if (
        stopped ||
        motionPreference.matches ||
        document.hidden ||
        state === "sleeping" ||
        state === "drowsy"
      ) {
        return;
      }

      timer = window.setTimeout(
        () => {
          setBlink(true);
          closeTimer = window.setTimeout(() => {
            setBlink(false);
            closeTimer = null;
            scheduleBlink();
          }, 125);
        },
        2600 + Math.random() * 3200,
      );
    };

    const updateSchedule = () => {
      clearTimers();
      setBlink(false);
      if (!document.hidden && !motionPreference.matches) scheduleBlink();
    };

    const handleVisibilityChange = () => updateSchedule();
    const handleMotionPreferenceChange = () => updateSchedule();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionPreference.addEventListener("change", handleMotionPreferenceChange);
    updateSchedule();

    return () => {
      stopped = true;
      clearTimers();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionPreference.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, [state]);

  return (
    <span
      className={styles.buddy}
      data-state={state}
      data-blink={blink}
      aria-hidden="true"
    >
      <svg viewBox="0 0 190 230" focusable="false">
        <defs>
          <linearGradient
            id="yantra-buddy-shell"
            x1="35"
            y1="38"
            x2="150"
            y2="166"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFF9EC" />
            <stop offset="1" stopColor="#CDB69A" />
          </linearGradient>
          <linearGradient
            id="yantra-buddy-metal"
            x1="42"
            y1="155"
            x2="143"
            y2="214"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F5E5CF" />
            <stop offset="1" stopColor="#B99A7B" />
          </linearGradient>
          <linearGradient
            id="yantra-buddy-visor-trim"
            x1="55"
            y1="60"
            x2="137"
            y2="143"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFE7B3" />
            <stop offset="1" stopColor="#A77F55" />
          </linearGradient>
          <linearGradient
            id="yantra-buddy-visor"
            x1="54"
            y1="67"
            x2="134"
            y2="135"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#38302A" />
            <stop offset="1" stopColor="#151413" />
          </linearGradient>
          <radialGradient
            id="yantra-buddy-beacon"
            cx="0"
            cy="0"
            r="1"
            gradientTransform="matrix(3 7 -7 3 92 19)"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFB2A0" />
            <stop offset="1" stopColor="#C9362E" />
          </radialGradient>
          <filter id="yantra-buddy-eye-glow" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse className={styles.shadow} cx="95" cy="224" rx="57" ry="7" />
        <g className={state === "waking" ? styles.entrance : undefined}>
          <g className={styles.bodyFloat} data-motion="float">
            <g className={styles.breathing}>
            <g className={styles.headMotion}>
              <g className={styles.antennaMotion}>
                <path
                  d="M95 38V23"
                  stroke="#927354"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="95" cy="19" r="9" fill="url(#yantra-buddy-beacon)" />
                <circle cx="94" cy="16" r="2.5" fill="#FFF2DC" opacity=".8" />
              </g>
              <path
                d="M46 66c0-15 12-27 27-27h44c15 0 27 12 27 27v67c0 15-12 27-27 27H73c-15 0-27-12-27-27V66Z"
                fill="url(#yantra-buddy-shell)"
                stroke="#9E8061"
                strokeWidth="3"
              />
              <path
                d="M57 67c0-9 7-16 16-16h45c9 0 16 7 16 16v48H57V67Z"
                fill="#7B5F46"
                opacity=".7"
              />
              <path
                d="M57 67c0-9 7-16 16-16h45c9 0 16 7 16 16v48H57V67Z"
                fill="url(#yantra-buddy-visor)"
                stroke="url(#yantra-buddy-visor-trim)"
                strokeWidth="4"
              />
              <path
                d="M69 62c10-7 39-9 51-2"
                fill="none"
                stroke="#FFF8E9"
                strokeWidth="2"
                strokeLinecap="round"
                opacity=".14"
              />
              <g
                className={styles.eyes}
                data-blink={blink}
                filter="url(#yantra-buddy-eye-glow)"
              >
                <path
                  className={styles.openEyes}
                  d="M73 84c5-7 13-7 18 0m12 0c5-7 13-7 18 0"
                  stroke="#FFE7B3"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  className={styles.closedEyes}
                  d="M73 84h18m12 0h18"
                  stroke="#FFE7B3"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>
              <path
                className={styles.smile}
                d="M84 101c6 8 17 8 23 0"
                stroke="#FFE7B3"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                className={styles.happySmile}
                d="M79 98c8 12 24 12 32 0"
                stroke="#FFE7B3"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                className={styles.confusedMouth}
                d="M86 104c6-5 12-5 18 0"
                stroke="#FFE7B3"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                className={styles.sleepMouth}
                d="M87 102h16"
                stroke="#FFE7B3"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M35 75h11v39H35c-7 0-12-5-12-12V87c0-7 5-12 12-12ZM155 75h-11v39h11c7 0 12-5 12-12V87c0-7-5-12-12-12Z"
                fill="#42362F"
                stroke="#A5825D"
                strokeWidth="3"
              />
              <path
                d="M41 84v20m108-20v20"
                stroke="#E3BD84"
                strokeWidth="2"
                strokeLinecap="round"
                opacity=".58"
              />
            </g>

            <g className={styles.arms}>
              <path
                d="m47 170-16 14m112-14 16 14"
                stroke="#9E8061"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d="m31 184-5 11m133-11 5 11"
                stroke="#D8C2A5"
                strokeWidth="9"
                strokeLinecap="round"
              />
            </g>

            <path
              d="M69 163h52v30c0 7-6 13-13 13H82c-7 0-13-6-13-13v-30Z"
              fill="url(#yantra-buddy-metal)"
              stroke="#9E8061"
              strokeWidth="3"
            />
            <path
              d="M84 179h22"
              stroke="#8E6D50"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="95" cy="178" r="4" fill="#C83B30" />
            <path
              d="M75 206 69 222m46-16 6 16"
              stroke="#8D7155"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M56 221h21m36 0h21"
              stroke="#E7D3B7"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="m67 221 7 0m48 0h7"
              stroke="#C83B30"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="41" cy="134" r="3" fill="#C83B30" />
            <circle cx="149" cy="134" r="3" fill="#C83B30" />

            <g className={styles.thinkingMarks}>
              <circle cx="157" cy="47" r="4" />
              <circle cx="168" cy="36" r="3" />
              <circle cx="176" cy="27" r="2" />
            </g>
            <g className={styles.celebrationMarks}>
              <path d="m22 52 5 5m-5 0 5-5m133 21 5 5m-5 0 5-5M47 29v8m-4-4h8" />
            </g>
            <text className={styles.sleepMarks} x="147" y="52">
              z
            </text>
            <text className={`${styles.sleepMarks} ${styles.sleepMarkTwo}`} x="160" y="38">
              z
            </text>
            </g>
          </g>
        </g>
      </svg>
    </span>
  );
}
