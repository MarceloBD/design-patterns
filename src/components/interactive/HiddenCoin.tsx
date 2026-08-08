"use client";

import { useState, useCallback } from "react";
import { useGameStore } from "@/hooks/useGameStore";
import { useSound } from "@/hooks/useSound";

interface HiddenCoinProps {
  coinId: string;
  position?: "left" | "right" | "center";
}

export function HiddenCoin({ coinId, position = "right" }: HiddenCoinProps) {
  const { player, handleCollectCoin, isHydrated } = useGameStore();
  const { play } = useSound();
  const [isCollecting, setIsCollecting] = useState(false);

  const handleClick = useCallback(() => {
    if (isCollecting) return;
    setIsCollecting(true);
    play("coin");
    setTimeout(() => {
      handleCollectCoin(coinId);
    }, 300);
  }, [isCollecting, coinId, handleCollectCoin, play]);

  if (!isHydrated) return null;
  if (player.collectedCoins?.includes(coinId)) return null;
  if (isCollecting) {
    return (
      <div className={`absolute ${position === "left" ? "left-2" : position === "center" ? "left-1/2 -translate-x-1/2" : "right-2"} bottom-2 z-10`}>
        <div className="w-5 h-5 animate-[coin-collect_0.5s_ease-out_forwards]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" fill="#ffaa00" stroke="#cc7700" strokeWidth="1" />
            <circle cx="10" cy="10" r="6" fill="none" stroke="#cc7700" strokeWidth="0.5" />
            <text x="10" y="14" textAnchor="middle" fill="#885500" fontSize="8" fontWeight="bold">$</text>
          </svg>
        </div>
      </div>
    );
  }

  const positionClasses: Record<string, string> = {
    left: "left-2",
    right: "right-2",
    center: "left-1/2 -translate-x-1/2",
  };

  return (
    <button
      onClick={handleClick}
      className={`absolute ${positionClasses[position]} bottom-2 z-10`}
      aria-label="Collect hidden coin"
      title="You found a coin!"
    >
      <div className="w-5 h-5 animate-[coin-shimmer_4s_ease-in-out_infinite]">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="9" fill="#ffaa00" stroke="#cc7700" strokeWidth="1" />
          <circle cx="10" cy="10" r="6" fill="none" stroke="#cc7700" strokeWidth="0.5" />
          <text x="10" y="14" textAnchor="middle" fill="#885500" fontSize="8" fontWeight="bold">$</text>
        </svg>
      </div>
    </button>
  );
}
