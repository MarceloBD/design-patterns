import { HammerIcon, BuildingIcon, BoltIcon } from "@/components/icons";

interface CategoryIconProps {
  iconId: string;
  className?: string;
  size?: number;
}

const ICON_MAP: Record<string, typeof HammerIcon> = {
  hammer: HammerIcon,
  building: BuildingIcon,
  bolt: BoltIcon,
};

export function CategoryIcon({ iconId, className = "", size = 24 }: CategoryIconProps) {
  const IconComponent = ICON_MAP[iconId] ?? HammerIcon;
  return <IconComponent className={className} size={size} />;
}
