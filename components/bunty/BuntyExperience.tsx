"use client";

import { useState } from "react";
import BuntyChatPanel, { type BuntyChatState } from "@/components/bunty/BuntyChatPanel";
import BuntyVisual from "@/components/bunty/BuntyVisual";

export default function BuntyExperience() {
  const [chatState, setChatState] = useState<BuntyChatState>("idle");

  return (
    <div className="bunty-page-content">
      <BuntyVisual chatState={chatState} />
      <BuntyChatPanel chatState={chatState} onChatStateChange={setChatState} />
    </div>
  );
}
