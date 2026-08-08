export type ItemCategory = "armor" | "potion" | "scroll";

export type ItemUsageType = "passive" | "active";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  price: number;
  effect: string;
  iconType: "shield" | "potion" | "scroll";
  sprite: string;
  usageType: ItemUsageType;
}
