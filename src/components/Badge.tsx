import { DiamondIcon, BoltIcon, CrownIcon, HammerIcon, BuildingIcon, TrophyIcon, StarIcon } from "@/components/icons";

interface BadgeProps {
  badgeId: string;
  earned: boolean;
  size?: "sm" | "md" | "lg";
}

interface BadgeConfig {
  icon: typeof DiamondIcon;
  label: string;
  color: string;
}

const BADGE_CONFIG: Record<string, BadgeConfig> = {
  "perfect-score": { icon: DiamondIcon, label: "Perfect Score", color: "var(--color-accent)" },
  "speed-runner": { icon: BoltIcon, label: "Speed Runner", color: "var(--color-secondary)" },
  "completionist": { icon: CrownIcon, label: "Completionist", color: "var(--color-accent)" },
  "realm-creational": { icon: HammerIcon, label: "Creational Master", color: "var(--color-primary)" },
  "realm-structural": { icon: BuildingIcon, label: "Structural Master", color: "var(--color-primary)" },
  "realm-behavioral": { icon: BoltIcon, label: "Behavioral Master", color: "var(--color-primary)" },
};

function getPatternBadgeConfig(): BadgeConfig {
  return { icon: TrophyIcon, label: "Pattern Master", color: "var(--color-secondary)" };
}

export function Badge({ badgeId, earned, size = "md" }: BadgeProps) {
  const config = BADGE_CONFIG[badgeId] || getPatternBadgeConfig();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const iconSizes = {
    sm: 14,
    md: 20,
    lg: 28,
  };

  return (
    <div
      className={`relative flex flex-col items-center gap-1 ${!earned ? "opacity-30 grayscale" : ""}`}
      title={config.label}
    >
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center border-2`}
        style={{ borderColor: earned ? config.color : "var(--color-locked)" }}
      >
        <IconComponent size={iconSizes[size]} className={earned ? "" : "text-[var(--color-locked)]"} />
      </div>
      {size !== "sm" && (
        <span className="text-[10px] text-[var(--color-text-muted)] text-center max-w-[60px] truncate">
          {config.label}
        </span>
      )}
    </div>
  );
}
