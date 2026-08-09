"use client";

interface SpeechSpeedConfigProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  voices: SpeechSynthesisVoice[];
  selectedVoiceName: string;
  onVoiceChange: (voiceName: string) => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function SpeechSpeedConfig({ speed, onSpeedChange, voices, selectedVoiceName, onVoiceChange }: SpeechSpeedConfigProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
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

      {voices.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">Voice</span>
          <select
            value={selectedVoiceName}
            onChange={(event) => onVoiceChange(event.target.value)}
            className="text-[9px] px-2 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-overlay)] text-[var(--text-muted)] max-w-[140px] truncate"
          >
            <option value="">Default</option>
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name.replace(/Microsoft |Google /, "")}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
