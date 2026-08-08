"use client";

import { useEffect } from "react";

const DEFAULT_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cdefs%3E%3Cfilter id='g'%3E%3CfeDropShadow dx='0' dy='0' stdDeviation='1' flood-color='%2300d4aa' flood-opacity='0.5'/%3E%3C/filter%3E%3C/defs%3E%3Cpath d='M4 2L12 24L15 16L23 13L4 2Z' fill='%23081c1c' stroke='%2300d4aa' stroke-width='1.5' stroke-linejoin='round' filter='url(%23g)'/%3E%3Cpath d='M15 16L21 22' stroke='%2300d4aa' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") 4 2, auto`;

const POINTER_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cdefs%3E%3Cfilter id='g'%3E%3CfeDropShadow dx='0' dy='0' stdDeviation='1.5' flood-color='%234af0cc' flood-opacity='0.8'/%3E%3C/filter%3E%3C/defs%3E%3Cpath d='M4 2L12 24L15 16L23 13L4 2Z' fill='%23082a2a' stroke='%234af0cc' stroke-width='2' stroke-linejoin='round' filter='url(%23g)'/%3E%3Cpath d='M15 16L21 22' stroke='%234af0cc' stroke-width='2' stroke-linecap='round'/%3E%3Ccircle cx='21' cy='22' r='2.5' fill='%234af0cc' opacity='0.7'/%3E%3C/svg%3E") 4 2, pointer`;

export function GameCursor() {
  useEffect(() => {
    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    if (isMobile) return;

    const style = document.createElement("style");
    style.id = "game-cursor-style";
    style.textContent = `
      *, *::before, *::after { cursor: ${DEFAULT_CURSOR} !important; }
      a, button, [role="button"], input[type="submit"], select, label[for],
      .cursor-pointer, [data-clickable],
      a *, button *, [role="button"] * {
        cursor: ${POINTER_CURSOR} !important;
      }
      .cursor-not-allowed, [disabled] { cursor: not-allowed !important; }
      input:not([type="submit"]):not([type="button"]), textarea { cursor: text !important; }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  return null;
}
