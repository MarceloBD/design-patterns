"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { PatternCategory } from "@/types/pattern";
import { REALM_CREATURES, RealmCreature } from "@/data/realm-creatures";
import { useSound } from "@/hooks/useSound";

type AnimationType = "walk" | "float" | "peek" | "fall";

interface ActiveCreature {
  id: number;
  creature: RealmCreature;
  animation: AnimationType;
  fromLeft: boolean;
  y: number;
  speed: number;
  size: number;
  interacted: boolean;
}

const GENERIC_CREATURES: RealmCreature[] = [
  {
    id: "slime",
    name: "Slime",
    rarity: "common",
    interactionText: "Squish! The slime bounces happily.",
    sprite: (
      <svg viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="24" rx="12" ry="8" fill="#44cc88" opacity="0.8" />
        <ellipse cx="16" cy="18" rx="10" ry="10" fill="#55dd99" />
        <circle cx="12" cy="16" r="3" fill="#fff" />
        <circle cx="20" cy="16" r="3" fill="#fff" />
        <circle cx="12" cy="16" r="1.5" fill="#222" />
        <circle cx="20" cy="16" r="1.5" fill="#222" />
        <ellipse cx="16" cy="22" rx="3" ry="1.5" fill="#33aa66" />
      </svg>
    ),
  },
  {
    id: "bat",
    name: "Bat",
    rarity: "common",
    interactionText: "Screech! The bat flutters away nervously.",
    sprite: (
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M4 14 Q8 10 12 14 L16 12 L20 14 Q24 10 28 14 Q24 18 20 16 L16 18 L12 16 Q8 18 4 14Z" fill="#6644aa" />
        <circle cx="14" cy="14" r="1" fill="#ff4444" />
        <circle cx="18" cy="14" r="1" fill="#ff4444" />
        <ellipse cx="16" cy="14" rx="4" ry="3" fill="#553399" />
      </svg>
    ),
  },
  {
    id: "ghost",
    name: "Ghost",
    rarity: "uncommon",
    interactionText: "Boo! ...wait, you scared it instead!",
    sprite: (
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M8 28V16a8 8 0 0 1 16 0v12l-3-3-2 3-3-3-2 3-3-3-3 3z" fill="#ddeeff" opacity="0.7" />
        <circle cx="13" cy="16" r="2" fill="#223" />
        <circle cx="19" cy="16" r="2" fill="#223" />
        <ellipse cx="16" cy="20" rx="2" ry="1.5" fill="#99aabb" />
      </svg>
    ),
  },
];

const ANIMATIONS: AnimationType[] = ["walk", "float", "peek", "fall"];
const MIN_SPAWN_INTERVAL = 45000;
const MAX_SPAWN_INTERVAL = 120000;

function detectRealm(pathname: string): PatternCategory | null {
  if (pathname.includes("creational") || pathname.includes("factory") || pathname.includes("builder") || pathname.includes("prototype") || pathname.includes("singleton")) {
    return "creational";
  }
  if (pathname.includes("structural") || pathname.includes("adapter") || pathname.includes("bridge") || pathname.includes("composite") || pathname.includes("decorator") || pathname.includes("facade") || pathname.includes("flyweight") || pathname.includes("proxy")) {
    return "structural";
  }
  if (pathname.includes("behavioral") || pathname.includes("chain") || pathname.includes("command") || pathname.includes("iterator") || pathname.includes("mediator") || pathname.includes("memento") || pathname.includes("observer") || pathname.includes("state") || pathname.includes("strategy") || pathname.includes("template") || pathname.includes("visitor")) {
    return "behavioral";
  }
  return null;
}

function getAnimationStyle(creature: ActiveCreature): React.CSSProperties {
  switch (creature.animation) {
    case "walk":
      return {
        top: `${creature.y}%`,
        animation: `${creature.fromLeft ? "creature-walk-right" : "creature-walk-left"} ${creature.speed}s linear forwards`,
      };
    case "float":
      return {
        top: `${20 + Math.random() * 30}%`,
        animation: `${creature.fromLeft ? "creature-walk-right" : "creature-walk-left"} ${creature.speed * 1.5}s ease-in-out forwards`,
        opacity: 0.6,
      };
    case "peek":
      return {
        bottom: "0",
        left: `${20 + Math.random() * 60}%`,
        animation: `creature-peek ${creature.speed * 0.4}s ease-in-out forwards`,
      };
    case "fall":
      return {
        left: `${10 + Math.random() * 80}%`,
        top: "-40px",
        animation: `creature-fall ${creature.speed * 0.6}s ease-in forwards`,
      };
  }
}

function getInnerAnimation(animation: AnimationType): string {
  switch (animation) {
    case "walk": return "creature-bob 0.6s ease-in-out infinite";
    case "float": return "creature-float 2s ease-in-out infinite";
    case "peek": return "none";
    case "fall": return "creature-spin 0.8s linear infinite";
  }
}

export function EasterEggs() {
  const [creatures, setCreatures] = useState<ActiveCreature[]>([]);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const nextIdRef = useRef(0);
  const pathname = usePathname();
  const { play } = useSound();

  const currentRealm = detectRealm(pathname);

  const handleCreatureClick = useCallback((creature: ActiveCreature, event: React.MouseEvent) => {
    if (creature.interacted) return;

    play("coin");
    setCreatures((prev) =>
      prev.map((c) => c.id === creature.id ? { ...c, interacted: true } : c)
    );
    setTooltip({
      text: creature.creature.interactionText,
      x: event.clientX,
      y: event.clientY - 40,
    });
    setTimeout(() => setTooltip(null), 2500);
  }, [play]);

  useEffect(() => {
    function spawnCreature() {
      const pool = currentRealm
        ? [...REALM_CREATURES[currentRealm], ...GENERIC_CREATURES]
        : GENERIC_CREATURES;

      const creatureData = pool[Math.floor(Math.random() * pool.length)];
      const animation = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
      const fromLeft = Math.random() > 0.5;
      const y = 65 + Math.random() * 25;
      const speed = 10 + Math.random() * 15;
      const size = 28 + Math.floor(Math.random() * 20);

      const id = nextIdRef.current++;
      const newCreature: ActiveCreature = { id, creature: creatureData, animation, fromLeft, y, speed, size, interacted: false };
      setCreatures((previous) => [...previous, newCreature]);

      const removeDelay = animation === "peek" ? speed * 400 + 1000 : speed * 1000 + 2000;
      setTimeout(() => {
        setCreatures((previous) => previous.filter((c) => c.id !== id));
      }, removeDelay);
    }

    const initialDelay = 30000 + Math.random() * 60000;
    let timerId: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      const interval = MIN_SPAWN_INTERVAL + Math.random() * (MAX_SPAWN_INTERVAL - MIN_SPAWN_INTERVAL);
      timerId = setTimeout(() => {
        spawnCreature();
        scheduleNext();
      }, interval);
    }

    timerId = setTimeout(() => {
      spawnCreature();
      scheduleNext();
    }, initialDelay);

    return () => clearTimeout(timerId);
  }, [currentRealm]);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
        {creatures.map((creature) => (
          <div
            key={creature.id}
            className={`absolute pointer-events-auto cursor-pointer transition-transform ${creature.interacted ? "scale-125" : "hover:scale-110"}`}
            style={{
              width: `${creature.size}px`,
              height: `${creature.size}px`,
              transform: creature.fromLeft ? "scaleX(1)" : "scaleX(-1)",
              ...getAnimationStyle(creature),
            }}
            onClick={(event) => handleCreatureClick(creature, event)}
            title={creature.creature.name}
          >
            <div
              className="w-full h-full"
              style={{
                animation: creature.interacted
                  ? "creature-interact 0.5s ease-out"
                  : getInnerAnimation(creature.animation),
              }}
            >
              {creature.creature.sprite}
            </div>
            {creature.interacted && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[var(--accent-green)] whitespace-nowrap animate-[fade-in_0.3s_ease-out]">
                +1
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interaction tooltip */}
      {tooltip && (
        <div
          className="fixed z-[100] px-3 py-1.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-default)] shadow-lg text-[10px] text-[var(--text-primary)] pointer-events-none animate-[fade-in_0.2s_ease-out]"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }}
        >
          {tooltip.text}
        </div>
      )}
    </>
  );
}
