"use client";

import { useState } from "react";
import Image from "next/image";
import { useGameStore } from "@/hooks/useGameStore";
import { SHOP_ITEMS } from "@/data/shop-items";
import { ShopItem, ItemCategory } from "@/types/shop";
import { spendCoins, addToInventory } from "@/stores/gameStore";
import { ShieldIcon, PotionIcon, ScrollIcon, CoinIcon } from "@/components/icons";
import { useSound } from "@/hooks/useSound";

const CATEGORY_TABS: { id: ItemCategory; label: string; icon: React.ReactNode }[] = [
  { id: "armor", label: "Armor", icon: <ShieldIcon size={14} /> },
  { id: "potion", label: "Potions", icon: <PotionIcon size={14} /> },
  { id: "scroll", label: "Scrolls", icon: <ScrollIcon size={14} /> },
];

export function ShopContent() {
  const { player, updatePlayer, isHydrated } = useGameStore();
  const { play } = useSound();
  const [activeTab, setActiveTab] = useState<ItemCategory>("armor");
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  if (!isHydrated) {
    return <div className="text-center text-[var(--text-muted)]">Loading shop...</div>;
  }

  const filteredItems = SHOP_ITEMS.filter((item) => item.category === activeTab);

  const handlePurchase = (item: ShopItem) => {
    if (player.coins < item.price) {
      setPurchaseMessage("Not enough coins!");
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }
    if (player.inventory?.includes(item.id)) {
      setPurchaseMessage("You already own this item!");
      setTimeout(() => setPurchaseMessage(null), 2000);
      return;
    }

    let state = spendCoins(player, item.price);
    state = addToInventory(state, item.id);
    updatePlayer(state);
    play("purchase");
    setPurchaseMessage(`Purchased ${item.name}!`);
    setTimeout(() => setPurchaseMessage(null), 2000);
  };

  const isOwned = (itemId: string) => player.inventory?.includes(itemId);

  return (
    <div>
      {/* Coin balance */}
      <div className="mb-6 flex items-center gap-2">
        <CoinIcon size={18} className="text-[var(--realm-creational)]" />
        <span className="text-lg font-bold text-[var(--realm-creational)]">{player.coins ?? 0}</span>
        <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">coins</span>
      </div>

      {/* Purchase notification */}
      {purchaseMessage && (
        <div className="mb-4 rounded-lg p-3 bg-[var(--surface-overlay)] border border-[var(--accent-teal)]/30 text-[12px] text-[var(--accent-teal)]">
          {purchaseMessage}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 mb-6">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${
              activeTab === tab.id
                ? "bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/40 text-[var(--accent-teal)]"
                : "bg-[var(--surface-overlay)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-default)]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Item grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const owned = isOwned(item.id);
          const canAfford = (player.coins ?? 0) >= item.price;

          return (
            <div
              key={item.id}
              className={`rounded-xl p-[1px] ${
                owned
                  ? "bg-gradient-to-br from-[var(--accent-green)]/30 via-[var(--border-subtle)] to-[var(--accent-green)]/20"
                  : "bg-gradient-to-br from-[var(--border-muted)] via-[var(--border-subtle)] to-[var(--border-muted)]"
              }`}
            >
              <div className="rounded-[11px] bg-[var(--surface-raised)] p-4 relative overflow-hidden">
                {owned && (
                  <div className="absolute top-2 right-2 text-[8px] font-bold uppercase tracking-wider bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30 text-[var(--accent-green)] px-2 py-0.5 rounded">
                    Owned
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[var(--surface-overlay)] border border-[var(--border-default)] flex items-center justify-center p-1">
                    <Image
                      src={item.sprite}
                      alt={item.name}
                      width={32}
                      height={32}
                      className="pixelated"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-bold text-[var(--text-primary)]">{item.name}</h3>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-[1.6]">{item.description}</p>
                    <span className={`inline-block mt-1 text-[8px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                      item.usageType === "active"
                        ? "bg-[var(--accent-pink)]/10 text-[var(--accent-pink)] border border-[var(--accent-pink)]/20"
                        : "bg-[var(--accent-teal)]/10 text-[var(--accent-teal)] border border-[var(--accent-teal)]/20"
                    }`}>
                      {item.usageType}
                    </span>
                    {item.lore && (
                      <p className="text-[11px] italic mt-2 leading-[1.7]" style={{ color: "var(--text-lore)" }}>
                        &ldquo;{item.lore}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center gap-1">
                    <CoinIcon size={12} className="text-[var(--realm-creational)]" />
                    <span className="text-[12px] font-bold text-[var(--realm-creational)]">{item.price}</span>
                  </div>

                  {!owned && (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-all ${
                        canAfford
                          ? "bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/40 text-[var(--accent-teal)] hover:bg-[var(--accent-teal)]/20"
                          : "bg-[var(--surface-overlay)] border border-[var(--border-subtle)] text-[var(--text-faint)] opacity-50"
                      }`}
                    >
                      {canAfford ? "Buy" : "Need more"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inventory section */}
      {player.inventory && player.inventory.length > 0 && (
        <section className="mt-10">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">
            Your Inventory ({player.inventory.length} items)
          </h2>
          <div className="flex flex-wrap gap-2">
            {player.inventory.map((itemId) => {
              const item = SHOP_ITEMS.find((shopItem) => shopItem.id === itemId);
              if (!item) return null;
              return (
                <div
                  key={itemId}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface-overlay)] border border-[var(--border-default)]"
                  title={item.description}
                >
                  <Image src={item.sprite} alt={item.name} width={20} height={20} className="pixelated" />
                  <span className="text-[10px] font-medium text-[var(--text-primary)]">{item.name}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
