"use client";

import { useEffect } from "react";
import { useSound } from "@/hooks/useSound";
import { PatternCategory } from "@/types/pattern";

interface RealmMusicProps {
  realm: PatternCategory;
}

export function RealmMusic({ realm }: RealmMusicProps) {
  const { startMusic, stopMusic } = useSound();

  useEffect(() => {
    const timer = setTimeout(() => {
      startMusic(realm);
    }, 300);

    return () => {
      clearTimeout(timer);
      stopMusic();
    };
  }, [realm, startMusic, stopMusic]);

  return null;
}
