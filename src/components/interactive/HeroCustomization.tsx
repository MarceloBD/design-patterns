"use client";

import { useState } from "react";
import { HeroAppearance } from "@/types/player";
import { useGameStore } from "@/hooks/useGameStore";
import { getXpToNextLevel, getLevelForXp } from "@/data/levels";
import {
  HeroAvatar,
  SKIN_OPTIONS,
  HAIR_STYLE_OPTIONS,
  HAIR_COLOR_OPTIONS,
  HAT_OPTIONS,
  SHIRT_OPTIONS,
  PANTS_OPTIONS,
} from "@/components/interactive/HeroAvatar";

interface OptionSelectorProps {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  renderSwatch?: boolean;
}

function OptionSelector({ label, options, value, onChange, renderSwatch }: OptionSelectorProps) {
  return (
    <div className="mb-3">
      <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] block mb-1.5">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`px-2 py-1 rounded text-[10px] font-medium border transition-all ${
              value === option.id
                ? "border-[var(--accent-teal)] bg-[var(--accent-teal)]/10 text-[var(--accent-teal)]"
                : "border-[var(--border-subtle)] bg-[var(--surface-overlay)] text-[var(--text-muted)] hover:border-[var(--border-default)]"
            }`}
          >
            {renderSwatch && (
              <span
                className="inline-block w-3 h-3 rounded-full mr-1 align-middle border border-[var(--border-subtle)]"
                style={{ backgroundColor: option.id }}
              />
            )}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function HeroCustomization() {
  const { player, updateAppearance } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<HeroAppearance>(player.heroAppearance ?? {
    skinColor: "#f4c794",
    hairStyle: "short",
    hairColor: "#4a3728",
    hat: "none",
    shirt: "tunic-green",
    pants: "brown",
  });

  const handleChange = (key: keyof HeroAppearance, value: string) => {
    const updated = { ...preview, [key]: value };
    setPreview(updated);
    updateAppearance(updated);
  };

  const xpProgress = getXpToNextLevel(player.currentXp);
  const levelInfo = getLevelForXp(player.currentXp);

  if (!isOpen) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-16 h-20 flex-shrink-0">
          <HeroAvatar appearance={preview} size={64} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[11px] font-bold text-[var(--accent-teal)] italic font-[var(--font-display)]">
              {levelInfo.title}
            </span>
            <span className="text-[9px] font-mono text-[var(--text-faint)]">
              Lv.{player.level}
            </span>
          </div>
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">EXP</span>
              <span className="text-[9px] font-mono text-[var(--text-muted)]">
                {xpProgress.current}/{xpProgress.required}
              </span>
            </div>
            <div className="xp-bar-dungeon rounded-sm relative h-[10px]">
              <div className="xp-bar-fill-dungeon" style={{ width: `${xpProgress.progress}%` }} />
              <div className="xp-segments absolute inset-0 flex">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="xp-segment" />
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="text-[9px] font-semibold text-[var(--accent-teal)] hover:text-[var(--accent-teal-light)] transition-colors underline underline-offset-2"
          >
            Customize Hero
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-overlay)] p-4">
      <div className="flex items-start justify-between mb-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-teal)]">
          Hero Customization
        </span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          Close
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Live preview */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-24 h-32 rounded-lg bg-[var(--surface-deep)] border border-[var(--border-subtle)] flex items-center justify-center p-2">
            <HeroAvatar appearance={preview} size={80} />
          </div>
          <span className="text-[9px] text-[var(--text-faint)] mt-1.5">Preview</span>
        </div>

        {/* Options */}
        <div className="flex-1 min-w-0">
          <OptionSelector
            label="Skin"
            options={SKIN_OPTIONS}
            value={preview.skinColor}
            onChange={(value) => handleChange("skinColor", value)}
            renderSwatch
          />
          <OptionSelector
            label="Hair Style"
            options={HAIR_STYLE_OPTIONS}
            value={preview.hairStyle}
            onChange={(value) => handleChange("hairStyle", value)}
          />
          <OptionSelector
            label="Hair Color"
            options={HAIR_COLOR_OPTIONS}
            value={preview.hairColor}
            onChange={(value) => handleChange("hairColor", value)}
            renderSwatch
          />
          <OptionSelector
            label="Head"
            options={HAT_OPTIONS}
            value={preview.hat}
            onChange={(value) => handleChange("hat", value)}
          />
          <OptionSelector
            label="Outfit"
            options={SHIRT_OPTIONS}
            value={preview.shirt}
            onChange={(value) => handleChange("shirt", value)}
          />
          <OptionSelector
            label="Pants"
            options={PANTS_OPTIONS}
            value={preview.pants}
            onChange={(value) => handleChange("pants", value)}
            renderSwatch
          />
        </div>
      </div>
    </div>
  );
}
