"use client";

import { PatternCategory } from "@/types/pattern";

interface AmbientLightProps {
  realm: PatternCategory;
}

const REALM_AMBIENT: Record<PatternCategory, { gradient: string; animation: string }> = {
  creational: {
    gradient: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(255, 136, 68, 0.04) 0%, transparent 70%)",
    animation: "glow-pulse 6s ease-in-out infinite",
  },
  structural: {
    gradient: "radial-gradient(ellipse 50% 50% at 30% 20%, rgba(68, 170, 255, 0.035) 0%, transparent 60%)",
    animation: "glow-pulse 8s ease-in-out infinite",
  },
  behavioral: {
    gradient: "radial-gradient(ellipse 70% 30% at 70% 10%, rgba(204, 68, 255, 0.03) 0%, transparent 50%)",
    animation: "lightning-flash 12s ease-in-out infinite",
  },
};

export function AmbientLight({ realm }: AmbientLightProps) {
  const config = REALM_AMBIENT[realm];

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1]"
      aria-hidden="true"
      style={{
        background: config.gradient,
        animation: config.animation,
      }}
    />
  );
}
