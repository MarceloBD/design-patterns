"use client";

import { HeroAppearance } from "@/types/player";

interface HeroAvatarProps {
  appearance: HeroAppearance;
  size?: number;
}

const HAIR_PATHS: Record<string, (color: string) => React.ReactNode> = {
  short: (color) => (
    <path d="M14 10 Q14 6 20 5 Q26 6 26 10 L26 12 Q24 10 20 9 Q16 10 14 12 Z" fill={color} />
  ),
  long: (color) => (
    <>
      <path d="M13 10 Q13 5 20 4 Q27 5 27 10 L27 14 Q25 10 20 9 Q15 10 13 14 Z" fill={color} />
      <path d="M13 14 Q12 20 13 24 L14 20 Q14 16 14 14" fill={color} opacity="0.9" />
      <path d="M27 14 Q28 20 27 24 L26 20 Q26 16 26 14" fill={color} opacity="0.9" />
    </>
  ),
  spiky: (color) => (
    <>
      <path d="M14 11 Q14 7 20 5 Q26 7 26 11 L26 12 Q24 10 20 9 Q16 10 14 12 Z" fill={color} />
      <path d="M15 7 L13 3 L17 6 Z" fill={color} />
      <path d="M19 5 L18 1 L21 4 Z" fill={color} />
      <path d="M23 6 L25 2 L24 7 Z" fill={color} />
    </>
  ),
  ponytail: (color) => (
    <>
      <path d="M14 10 Q14 6 20 5 Q26 6 26 10 L26 12 Q24 10 20 9 Q16 10 14 12 Z" fill={color} />
      <path d="M24 10 Q28 12 27 18 Q26 22 25 24" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  bald: () => null,
};

const HAT_RENDERS: Record<string, React.ReactNode> = {
  none: null,
  "wizard-hat": (
    <>
      <path d="M12 10 L20 0 L28 10 Z" fill="#4422aa" />
      <rect x="11" y="9" width="18" height="3" rx="1" fill="#5533bb" />
      <circle cx="20" cy="2" r="1.5" fill="#ffdd00" />
    </>
  ),
  "iron-helm": (
    <>
      <path d="M13 12 Q13 5 20 4 Q27 5 27 12 Z" fill="#778899" />
      <rect x="12" y="11" width="16" height="2" rx="1" fill="#556677" />
      <path d="M18 8 L22 8 L22 12 L18 12 Z" fill="#334455" opacity="0.6" />
    </>
  ),
  headband: (
    <rect x="13" y="9" width="14" height="2" rx="1" fill="#cc2222" />
  ),
  crown: (
    <>
      <path d="M13 10 L14 6 L17 9 L20 4 L23 9 L26 6 L27 10 Z" fill="#ffcc00" />
      <rect x="13" y="10" width="14" height="2" rx="0.5" fill="#ddaa00" />
      <circle cx="17" cy="8" r="0.8" fill="#ff4444" />
      <circle cx="20" cy="6" r="0.8" fill="#4488ff" />
      <circle cx="23" cy="8" r="0.8" fill="#44cc44" />
    </>
  ),
};

const SHIRT_COLORS: Record<string, { primary: string; secondary: string }> = {
  "tunic-green": { primary: "#2d7a3a", secondary: "#1d5a2a" },
  "tunic-blue": { primary: "#2a5a8a", secondary: "#1a3a5a" },
  "tunic-red": { primary: "#8a2a2a", secondary: "#5a1a1a" },
  "armor-silver": { primary: "#8899aa", secondary: "#667788" },
  "robe-purple": { primary: "#5a2a8a", secondary: "#3a1a5a" },
  "vest-brown": { primary: "#7a5533", secondary: "#5a3a1a" },
};

const PANTS_COLORS: Record<string, string> = {
  brown: "#5a3a20",
  black: "#2a2a2a",
  blue: "#2a3a5a",
  gray: "#555566",
  green: "#2a4a2a",
};

export function HeroAvatar({ appearance, size = 80 }: HeroAvatarProps) {
  const { skinColor, hairStyle, hairColor, hat, shirt, pants } = appearance;
  const shirtColors = SHIRT_COLORS[shirt] ?? SHIRT_COLORS["tunic-green"];
  const pantsColor = PANTS_COLORS[pants] ?? PANTS_COLORS["brown"];

  return (
    <svg viewBox="0 0 40 48" width={size} height={size * 1.2} fill="none">
      {/* Shadow */}
      <ellipse cx="20" cy="46" rx="8" ry="2" fill="rgba(0,0,0,0.2)" />

      {/* Legs / Pants */}
      <rect x="16" y="34" width="4" height="8" rx="1.5" fill={pantsColor} />
      <rect x="21" y="34" width="4" height="8" rx="1.5" fill={pantsColor} />
      {/* Boots */}
      <rect x="15" y="40" width="5" height="4" rx="1.5" fill="#3a2a1a" />
      <rect x="20" y="40" width="5" height="4" rx="1.5" fill="#3a2a1a" />

      {/* Body / Shirt */}
      <rect x="14" y="22" width="12" height="14" rx="3" fill={shirtColors.primary} />
      {/* Shirt details */}
      <rect x="18" y="23" width="4" height="6" rx="1" fill={shirtColors.secondary} opacity="0.5" />
      {/* Belt */}
      <rect x="14" y="33" width="12" height="2" rx="0.5" fill="#4a3520" />
      <rect x="19" y="32.5" width="3" height="3" rx="0.5" fill="#8a7030" />

      {/* Arms */}
      <rect x="10" y="23" width="4" height="10" rx="2" fill={shirtColors.primary} />
      <rect x="26" y="23" width="4" height="10" rx="2" fill={shirtColors.primary} />
      {/* Hands */}
      <circle cx="12" cy="34" r="2" fill={skinColor} />
      <circle cx="28" cy="34" r="2" fill={skinColor} />

      {/* Head */}
      <ellipse cx="20" cy="14" rx="7" ry="7.5" fill={skinColor} />

      {/* Eyes */}
      <ellipse cx="17.5" cy="14" rx="1.5" ry="2" fill="#fff" />
      <ellipse cx="22.5" cy="14" rx="1.5" ry="2" fill="#fff" />
      <circle cx="17.5" cy="14.5" r="1" fill="#2a2a2a" />
      <circle cx="22.5" cy="14.5" r="1" fill="#2a2a2a" />
      {/* Eye shine */}
      <circle cx="18" cy="14" r="0.4" fill="#fff" />
      <circle cx="23" cy="14" r="0.4" fill="#fff" />

      {/* Mouth */}
      <path d="M18 17.5 Q20 19 22 17.5" stroke="#6a4a3a" fill="none" strokeWidth="0.6" />

      {/* Hair */}
      {HAIR_PATHS[hairStyle]?.(hairColor)}

      {/* Hat */}
      {HAT_RENDERS[hat]}
    </svg>
  );
}

export const SKIN_OPTIONS = [
  { id: "#f4c794", label: "Light" },
  { id: "#d4a574", label: "Medium" },
  { id: "#8d5524", label: "Dark" },
  { id: "#c68642", label: "Tan" },
  { id: "#ffdbac", label: "Fair" },
  { id: "#6b4226", label: "Deep" },
];

export const HAIR_STYLE_OPTIONS = [
  { id: "short", label: "Short" },
  { id: "long", label: "Long" },
  { id: "spiky", label: "Spiky" },
  { id: "ponytail", label: "Ponytail" },
  { id: "bald", label: "Bald" },
];

export const HAIR_COLOR_OPTIONS = [
  { id: "#4a3728", label: "Brown" },
  { id: "#1a1a1a", label: "Black" },
  { id: "#d4a030", label: "Blonde" },
  { id: "#8a2a1a", label: "Red" },
  { id: "#777777", label: "Silver" },
  { id: "#3a1a5a", label: "Purple" },
];

export const HAT_OPTIONS = [
  { id: "none", label: "None" },
  { id: "headband", label: "Headband" },
  { id: "iron-helm", label: "Iron Helm" },
  { id: "wizard-hat", label: "Wizard Hat" },
  { id: "crown", label: "Crown" },
];

export const SHIRT_OPTIONS = [
  { id: "tunic-green", label: "Green Tunic" },
  { id: "tunic-blue", label: "Blue Tunic" },
  { id: "tunic-red", label: "Red Tunic" },
  { id: "armor-silver", label: "Silver Armor" },
  { id: "robe-purple", label: "Purple Robe" },
  { id: "vest-brown", label: "Brown Vest" },
];

export const PANTS_OPTIONS = [
  { id: "brown", label: "Brown" },
  { id: "black", label: "Black" },
  { id: "blue", label: "Blue" },
  { id: "gray", label: "Gray" },
  { id: "green", label: "Green" },
];
