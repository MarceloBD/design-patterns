"use client";

import { useState, useEffect, useRef } from "react";

type AnimationType = "walk" | "float" | "peek" | "fall";

interface Creature {
  id: number;
  type: keyof typeof CREATURES;
  animation: AnimationType;
  fromLeft: boolean;
  y: number;
  speed: number;
  size: number;
}

const CREATURES = {
  slime: (
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
  bat: (
    <svg viewBox="0 0 32 32" fill="none">
      <path d="M4 14 Q8 10 12 14 L16 12 L20 14 Q24 10 28 14 Q24 18 20 16 L16 18 L12 16 Q8 18 4 14Z" fill="#6644aa" />
      <circle cx="14" cy="14" r="1" fill="#ff4444" />
      <circle cx="18" cy="14" r="1" fill="#ff4444" />
      <ellipse cx="16" cy="14" rx="4" ry="3" fill="#553399" />
    </svg>
  ),
  ghost: (
    <svg viewBox="0 0 32 32" fill="none">
      <path d="M8 28V16a8 8 0 0 1 16 0v12l-3-3-2 3-3-3-2 3-3-3-3 3z" fill="#ddeeff" opacity="0.7" />
      <circle cx="13" cy="16" r="2" fill="#223" />
      <circle cx="19" cy="16" r="2" fill="#223" />
      <ellipse cx="16" cy="20" rx="2" ry="1.5" fill="#99aabb" />
    </svg>
  ),
  mushroom: (
    <svg viewBox="0 0 32 32" fill="none">
      <ellipse cx="16" cy="14" rx="10" ry="8" fill="#ff4466" />
      <circle cx="12" cy="12" r="2" fill="#fff" opacity="0.7" />
      <circle cx="18" cy="10" r="1.5" fill="#fff" opacity="0.7" />
      <rect x="13" y="20" width="6" height="8" rx="2" fill="#eedd99" />
      <circle cx="14" cy="24" r="1.5" fill="#222" />
      <circle cx="18" cy="24" r="1.5" fill="#222" />
    </svg>
  ),
  skeleton: (
    <svg viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="10" r="6" fill="#eee" />
      <circle cx="14" cy="9" r="2" fill="#222" />
      <circle cx="18" cy="9" r="2" fill="#222" />
      <rect x="14" y="12" width="4" height="2" fill="#222" />
      <rect x="14" y="16" width="4" height="10" fill="#ddd" />
      <rect x="10" y="18" width="4" height="2" fill="#ddd" />
      <rect x="18" y="18" width="4" height="2" fill="#ddd" />
      <rect x="13" y="26" width="3" height="4" fill="#ddd" />
      <rect x="17" y="26" width="3" height="4" fill="#ddd" />
    </svg>
  ),
};

const CREATURE_TYPES = Object.keys(CREATURES) as (keyof typeof CREATURES)[];
const ANIMATIONS: AnimationType[] = ["walk", "float", "peek", "fall"];
const MIN_SPAWN_INTERVAL = 45000;
const MAX_SPAWN_INTERVAL = 120000;

function getAnimationStyle(creature: Creature): React.CSSProperties {
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
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const nextIdRef = useRef(0);

  useEffect(() => {
    function spawnCreature() {
      const type = CREATURE_TYPES[Math.floor(Math.random() * CREATURE_TYPES.length)];
      const animation = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
      const fromLeft = Math.random() > 0.5;
      const y = 65 + Math.random() * 25;
      const speed = 10 + Math.random() * 15;
      const size = 24 + Math.floor(Math.random() * 16);

      const id = nextIdRef.current++;
      const newCreature: Creature = { id, type, animation, fromLeft, y, speed, size };
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
  }, []);

  if (creatures.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {creatures.map((creature) => (
        <div
          key={creature.id}
          className="absolute"
          style={{
            width: `${creature.size}px`,
            height: `${creature.size}px`,
            transform: creature.fromLeft ? "scaleX(1)" : "scaleX(-1)",
            ...getAnimationStyle(creature),
          }}
        >
          <div
            className="w-full h-full"
            style={{ animation: getInnerAnimation(creature.animation) }}
          >
            {CREATURES[creature.type]}
          </div>
        </div>
      ))}
    </div>
  );
}
