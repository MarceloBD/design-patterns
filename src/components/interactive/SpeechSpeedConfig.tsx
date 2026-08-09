"use client";

interface SpeechSpeedConfigProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function SpeechSpeedConfig({ speed, onSpeedChange }: SpeechSpeedConfigProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">Speed</span>
      <div className="flex gap-1">
        {SPEED_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => onSpeedChange(option)}
            className={`text-[9px] font-mono px-1.5 py-0.5 rounded border transition-all ${
              speed === option
                ? "bg-[var(--accent-teal)]/15 border-[var(--accent-teal)]/40 text-[var(--accent-teal)]"
                : "border-[var(--border-subtle)] text-[var(--text-faint)] hover:text-[var(--text-muted)] hover:border-[var(--border-default)]"
            }`}
          >
            {option}x
          </button>
        ))}
      </div>
    </div>
  );
}
