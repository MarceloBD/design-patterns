import { PatternCategory } from "@/types/pattern";

export interface RealmCreature {
  id: string;
  name: string;
  sprite: React.ReactNode;
  rarity: "common" | "uncommon" | "rare";
  interactionText: string;
}

const CREATIONAL_CREATURES: RealmCreature[] = [
  {
    id: "ember-wisp",
    name: "Ember Wisp",
    rarity: "common",
    interactionText: "The wisp flickers and grants +5 warmth!",
    sprite: (
      <svg viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="20" rx="6" ry="8" fill="#ff6600" opacity="0.8" />
        <ellipse cx="16" cy="16" rx="4" ry="6" fill="#ffaa00" />
        <ellipse cx="16" cy="12" rx="2" ry="4" fill="#ffdd44" opacity="0.9" />
        <circle cx="14" cy="18" r="1.5" fill="#fff" opacity="0.8" />
        <circle cx="18" cy="18" r="1.5" fill="#fff" opacity="0.8" />
        <circle cx="14" cy="18" r="0.7" fill="#331100" />
        <circle cx="18" cy="18" r="0.7" fill="#331100" />
      </svg>
    ),
  },
  {
    id: "molten-construct",
    name: "Molten Construct",
    rarity: "uncommon",
    interactionText: "It tries to instantiate itself... but lacks a factory!",
    sprite: (
      <svg viewBox="0 0 32 32" fill="none">
        <rect x="10" y="8" width="12" height="16" rx="2" fill="#cc4400" />
        <rect x="12" y="10" width="8" height="4" rx="1" fill="#ff8800" />
        <circle cx="14" cy="12" r="1.5" fill="#ffcc00" />
        <circle cx="18" cy="12" r="1.5" fill="#ffcc00" />
        <rect x="12" y="16" width="3" height="6" fill="#aa3300" />
        <rect x="17" y="16" width="3" height="6" fill="#aa3300" />
        <rect x="9" y="14" width="3" height="2" fill="#cc4400" />
        <rect x="20" y="14" width="3" height="2" fill="#cc4400" />
        <ellipse cx="16" cy="26" rx="6" ry="2" fill="#ff6600" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: "forge-drake",
    name: "Forge Drake",
    rarity: "rare",
    interactionText: "The drake breathes a blueprint of pure creation!",
    sprite: (
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M8 18 Q6 14 10 12 L14 10 Q16 8 18 10 L22 12 Q26 14 24 18 L22 22 Q20 26 16 26 Q12 26 10 22 Z" fill="#dd5500" />
        <path d="M6 16 L4 12 L8 14 Z" fill="#ff7700" />
        <path d="M26 16 L28 12 L24 14 Z" fill="#ff7700" />
        <circle cx="13" cy="15" r="2" fill="#ffcc00" />
        <circle cx="19" cy="15" r="2" fill="#ffcc00" />
        <circle cx="13" cy="15" r="1" fill="#220000" />
        <circle cx="19" cy="15" r="1" fill="#220000" />
        <path d="M14 20 Q16 22 18 20" stroke="#ffaa00" fill="none" strokeWidth="1" />
        <path d="M16 6 L15 4 L16 3 L17 4 L16 6" fill="#ff4400" />
      </svg>
    ),
  },
];

const STRUCTURAL_CREATURES: RealmCreature[] = [
  {
    id: "frost-sprite",
    name: "Frost Sprite",
    rarity: "common",
    interactionText: "It adapts to your presence, bridging the cold!",
    sprite: (
      <svg viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="18" rx="7" ry="9" fill="#aaddff" opacity="0.7" />
        <ellipse cx="16" cy="14" rx="5" ry="6" fill="#cceeFF" />
        <path d="M10 10 L12 14 M22 10 L20 14" stroke="#88ccff" strokeWidth="1" />
        <circle cx="14" cy="14" r="1.5" fill="#0066cc" />
        <circle cx="18" cy="14" r="1.5" fill="#0066cc" />
        <path d="M14 18 Q16 20 18 18" stroke="#4488cc" fill="none" strokeWidth="0.8" />
        <path d="M16 4 L15 8 L16 6 L17 8 L16 4" fill="#88ddff" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "crystal-golem",
    name: "Crystal Golem",
    rarity: "uncommon",
    interactionText: "A composite of shattered interfaces, seeking wholeness!",
    sprite: (
      <svg viewBox="0 0 32 32" fill="none">
        <polygon points="16,4 22,10 22,20 16,26 10,20 10,10" fill="#4488cc" opacity="0.8" />
        <polygon points="16,6 20,11 20,19 16,24 12,19 12,11" fill="#66aadd" />
        <rect x="13" y="12" width="2" height="2" fill="#003366" />
        <rect x="17" y="12" width="2" height="2" fill="#003366" />
        <rect x="14" y="17" width="4" height="1" fill="#003366" />
        <path d="M8 14 L10 14 M22 14 L24 14" stroke="#4488cc" strokeWidth="2" />
        <rect x="12" y="26" width="3" height="4" fill="#3377aa" />
        <rect x="17" y="26" width="3" height="4" fill="#3377aa" />
      </svg>
    ),
  },
  {
    id: "prism-wraith",
    name: "Prism Wraith",
    rarity: "rare",
    interactionText: "It refracts into multiple proxies of itself!",
    sprite: (
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M10 28 V14 a6 6 0 0 1 12 0 v14 l-2-3-2 3-2-3-2 3-2-3-2 3z" fill="#88ccff" opacity="0.5" />
        <circle cx="14" cy="14" r="2" fill="#0044aa" />
        <circle cx="18" cy="14" r="2" fill="#0044aa" />
        <path d="M12 19 Q16 22 20 19" stroke="#4488cc" fill="none" strokeWidth="0.8" />
        <path d="M8 10 L10 14 M24 10 L22 14" stroke="#66aaff" strokeWidth="0.5" opacity="0.5" />
        <ellipse cx="16" cy="16" rx="8" ry="10" fill="none" stroke="#44aaff" strokeWidth="0.3" opacity="0.3" />
      </svg>
    ),
  },
];

const BEHAVIORAL_CREATURES: RealmCreature[] = [
  {
    id: "spark-imp",
    name: "Spark Imp",
    rarity: "common",
    interactionText: "It observes your click and notifies all subscribers!",
    sprite: (
      <svg viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="20" rx="6" ry="7" fill="#9933cc" />
        <ellipse cx="16" cy="16" rx="5" ry="5" fill="#bb55ee" />
        <circle cx="14" cy="15" r="2" fill="#ffdd00" />
        <circle cx="18" cy="15" r="2" fill="#ffdd00" />
        <circle cx="14" cy="15" r="1" fill="#220044" />
        <circle cx="18" cy="15" r="1" fill="#220044" />
        <path d="M12 10 L14 12 M20 10 L18 12" stroke="#cc66ff" strokeWidth="1.5" />
        <path d="M14 20 Q16 22 18 20" stroke="#7722aa" fill="none" strokeWidth="1" />
        <path d="M24 8 L22 12 L26 10 Z" fill="#ffcc00" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "storm-elemental",
    name: "Storm Elemental",
    rarity: "uncommon",
    interactionText: "Commands chain through it like a responsibility pattern!",
    sprite: (
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M10 24 Q8 18 12 14 Q10 10 14 8 Q16 6 20 8 Q24 10 22 14 Q26 18 22 24 Z" fill="#7733cc" opacity="0.7" />
        <circle cx="14" cy="14" r="2" fill="#ffff00" />
        <circle cx="19" cy="14" r="2" fill="#ffff00" />
        <path d="M16 18 L14 22 L18 20 L16 26" stroke="#ffdd00" strokeWidth="1.5" fill="none" />
        <path d="M8 8 L10 12 L12 8 L14 10" stroke="#cc66ff" strokeWidth="0.5" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: "void-sentinel",
    name: "Void Sentinel",
    rarity: "rare",
    interactionText: "It iterates through dimensional states endlessly!",
    sprite: (
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" fill="#330066" opacity="0.6" />
        <circle cx="16" cy="16" r="7" fill="#440088" />
        <circle cx="16" cy="16" r="4" fill="#6600cc" />
        <circle cx="14" cy="14" r="1.5" fill="#cc00ff" />
        <circle cx="18" cy="14" r="1.5" fill="#cc00ff" />
        <path d="M14 18 L18 18" stroke="#aa00dd" strokeWidth="1" />
        <circle cx="16" cy="16" r="11" fill="none" stroke="#8800ff" strokeWidth="0.5" opacity="0.3" />
        <circle cx="16" cy="16" r="13" fill="none" stroke="#6600cc" strokeWidth="0.3" opacity="0.2" />
      </svg>
    ),
  },
];

export const REALM_CREATURES: Record<PatternCategory, RealmCreature[]> = {
  creational: CREATIONAL_CREATURES,
  structural: STRUCTURAL_CREATURES,
  behavioral: BEHAVIORAL_CREATURES,
};

export function getRandomCreatureForRealm(category: PatternCategory): RealmCreature {
  const creatures = REALM_CREATURES[category];
  const roll = Math.random();
  const rarityPool = roll < 0.1
    ? creatures.filter((c) => c.rarity === "rare")
    : roll < 0.35
    ? creatures.filter((c) => c.rarity === "uncommon")
    : creatures.filter((c) => c.rarity === "common");

  return rarityPool[Math.floor(Math.random() * rarityPool.length)] ?? creatures[0];
}
