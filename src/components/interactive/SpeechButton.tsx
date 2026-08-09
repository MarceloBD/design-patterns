"use client";

interface SpeechButtonProps {
  onClick: () => void;
  isActive: boolean;
}

export function SpeechButton({ onClick, isActive }: SpeechButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center w-6 h-6 rounded-md border transition-all ${
        isActive
          ? "bg-[var(--accent-teal)]/15 border-[var(--accent-teal)]/40 text-[var(--accent-teal)]"
          : "bg-transparent border-[var(--border-subtle)] text-[var(--text-faint)] hover:text-[var(--accent-teal)] hover:border-[var(--accent-teal)]/30"
      }`}
      aria-label={isActive ? "Stop reading" : "Read aloud"}
      title={isActive ? "Stop reading" : "Read aloud"}
    >
      {isActive ? (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <rect x="1" y="1" width="3" height="8" rx="0.5" />
          <rect x="6" y="1" width="3" height="8" rx="0.5" />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
          <path d="M2 1.5v9l8-4.5-8-4.5z" />
        </svg>
      )}
    </button>
  );
}
