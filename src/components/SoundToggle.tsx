"use client";

import { useState, useEffect } from "react";
import { isMuted, setMuted } from "@/lib/audio-engine";

export function SoundToggle() {
  const [muted, setMutedState] = useState(true);

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  const toggle = () => {
    const newMuted = !muted;
    setMutedState(newMuted);
    setMuted(newMuted);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-7 h-7 rounded-md bg-[var(--surface-overlay)] border border-[var(--border-default)] hover:border-[var(--accent-teal)]/40 transition-colors"
      title={muted ? "Enable sound" : "Mute sound"}
      aria-label={muted ? "Enable sound" : "Mute sound"}
    >
      {muted ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--text-faint)]">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--accent-teal)]">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19 5a9 9 0 0 1 0 14" />
        </svg>
      )}
    </button>
  );
}
