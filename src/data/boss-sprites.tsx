import { PatternCategory } from "@/types/pattern";

export interface BossSprite {
  name: string;
  sprite: React.ReactNode;
  idleAnimation: string;
  hitAnimation: string;
  color: string;
}

const CreationalBoss: BossSprite = {
  name: "Unformed Construct",
  color: "#ff6600",
  idleAnimation: "boss-idle-fire 2s ease-in-out infinite",
  hitAnimation: "boss-hit-shake 0.4s ease-out",
  sprite: (
    <svg viewBox="0 0 64 64" fill="none">
      {/* Body - molten golem */}
      <path d="M20 50 L18 30 Q18 18 32 16 Q46 18 46 30 L44 50 Z" fill="#cc3300" />
      <path d="M22 48 L20 32 Q22 20 32 18 Q42 20 44 32 L42 48 Z" fill="#ff5500" />
      {/* Glowing cracks */}
      <path d="M28 22 L30 30 L26 36 L30 44" stroke="#ffcc00" strokeWidth="1" opacity="0.8" />
      <path d="M36 24 L34 32 L38 38 L34 46" stroke="#ffcc00" strokeWidth="1" opacity="0.8" />
      {/* Eyes */}
      <circle cx="27" cy="28" r="3" fill="#ffdd00" />
      <circle cx="37" cy="28" r="3" fill="#ffdd00" />
      <circle cx="27" cy="28" r="1.5" fill="#220000" />
      <circle cx="37" cy="28" r="1.5" fill="#220000" />
      {/* Horns */}
      <path d="M24 18 L20 8 L26 14 Z" fill="#882200" />
      <path d="M40 18 L44 8 L38 14 Z" fill="#882200" />
      {/* Mouth */}
      <path d="M27 36 Q32 40 37 36" stroke="#ffaa00" fill="#331100" strokeWidth="1.5" />
      {/* Embers */}
      <circle cx="22" cy="12" r="1" fill="#ff8800" opacity="0.6" />
      <circle cx="42" cy="14" r="1.5" fill="#ffaa00" opacity="0.5" />
    </svg>
  ),
};

const StructuralBoss: BossSprite = {
  name: "Fractured Composite",
  color: "#4488ff",
  idleAnimation: "boss-idle-pulse 3s ease-in-out infinite",
  hitAnimation: "boss-hit-shake 0.4s ease-out",
  sprite: (
    <svg viewBox="0 0 64 64" fill="none">
      {/* Crystal body */}
      <polygon points="32,8 48,20 48,44 32,56 16,44 16,20" fill="#2255aa" />
      <polygon points="32,12 44,22 44,42 32,52 20,42 20,22" fill="#3377cc" />
      {/* Face plate */}
      <rect x="24" y="22" width="16" height="14" rx="2" fill="#1a3366" />
      {/* Eyes */}
      <rect x="26" y="26" width="4" height="4" fill="#44ddff" />
      <rect x="34" y="26" width="4" height="4" fill="#44ddff" />
      {/* Mouth */}
      <rect x="28" y="32" width="8" height="2" fill="#44ddff" opacity="0.6" />
      {/* Arms - segmented */}
      <rect x="10" y="24" width="6" height="4" rx="1" fill="#2255aa" />
      <rect x="6" y="26" width="4" height="3" rx="1" fill="#3377cc" />
      <rect x="48" y="24" width="6" height="4" rx="1" fill="#2255aa" />
      <rect x="54" y="26" width="4" height="3" rx="1" fill="#3377cc" />
      {/* Cracks/joints */}
      <path d="M24 20 L20 16 M40 20 L44 16" stroke="#88ccff" strokeWidth="0.5" opacity="0.5" />
      {/* Legs */}
      <rect x="24" y="52" width="5" height="6" rx="1" fill="#2255aa" />
      <rect x="35" y="52" width="5" height="6" rx="1" fill="#2255aa" />
      {/* Ice crystals */}
      <path d="M12 14 L14 18 L10 18 Z" fill="#88ccff" opacity="0.4" />
      <path d="M50 12 L52 16 L48 16 Z" fill="#88ccff" opacity="0.4" />
    </svg>
  ),
};

const BehavioralBoss: BossSprite = {
  name: "Rogue Algorithm",
  color: "#aa44ff",
  idleAnimation: "boss-idle-spark 2.5s ease-in-out infinite",
  hitAnimation: "boss-hit-shake 0.4s ease-out",
  sprite: (
    <svg viewBox="0 0 64 64" fill="none">
      {/* Ethereal body */}
      <path d="M16 50 Q12 36 18 24 Q22 16 32 14 Q42 16 46 24 Q52 36 48 50 Z" fill="#6622aa" opacity="0.8" />
      <path d="M18 48 Q14 36 20 26 Q24 18 32 16 Q40 18 44 26 Q50 36 46 48 Z" fill="#8844cc" />
      {/* Eyes - glowing */}
      <circle cx="26" cy="28" r="4" fill="#cc00ff" opacity="0.3" />
      <circle cx="38" cy="28" r="4" fill="#cc00ff" opacity="0.3" />
      <circle cx="26" cy="28" r="2.5" fill="#ee44ff" />
      <circle cx="38" cy="28" r="2.5" fill="#ee44ff" />
      <circle cx="26" cy="28" r="1" fill="#ffffff" />
      <circle cx="38" cy="28" r="1" fill="#ffffff" />
      {/* Crown / energy */}
      <path d="M22 14 L24 8 L28 12 L32 6 L36 12 L40 8 L42 14" stroke="#cc66ff" fill="none" strokeWidth="1.5" />
      {/* Lightning marks */}
      <path d="M30 34 L28 38 L32 36 L30 42" stroke="#ffdd00" strokeWidth="1" />
      {/* Tendrils */}
      <path d="M18 40 Q14 44 10 40" stroke="#8844cc" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M46 40 Q50 44 54 40" stroke="#8844cc" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* Floating particles */}
      <circle cx="10" cy="20" r="1" fill="#cc66ff" opacity="0.5" />
      <circle cx="54" cy="22" r="1.5" fill="#aa44ff" opacity="0.4" />
      <circle cx="16" cy="10" r="1" fill="#ee88ff" opacity="0.3" />
    </svg>
  ),
};

export const BOSS_SPRITES: Record<PatternCategory, BossSprite> = {
  creational: CreationalBoss,
  structural: StructuralBoss,
  behavioral: BehavioralBoss,
};

export function getBossForCategory(category: PatternCategory): BossSprite {
  return BOSS_SPRITES[category];
}
