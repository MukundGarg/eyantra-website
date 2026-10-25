"use client";

import { useState } from "react";
import BuntyChatPanel, { type BuntyChatState } from "@/components/bunty/BuntyChatPanel";
import BuntyVisual from "@/components/bunty/BuntyVisual";

export default function BuntyExperience() {
  const [chatState, setChatState] = useState<BuntyChatState>("idle");

  return (
    <div className="bunty-page-content">
      <header className="bunty-intro">
        <p className="bunty-eyebrow">e-Yantra MSIT</p>
        <h1>
          Meet <span>Bunty</span>
        </h1>
        <p className="bunty-intro-copy">Your guide to the e-Yantra community.</p>
      </header>
      <BuntyVisual chatState={chatState} />
      <BuntyChatPanel chatState={chatState} onChatStateChange={setChatState} />
    </div>
  );
}
