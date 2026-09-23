"use client";

import React from "react";

export default function Iconify({ icon, className }: { icon: string; className?: string }) {
  // @ts-expect-error custom element
  return <iconify-icon icon={icon} class={className}></iconify-icon>;
}
