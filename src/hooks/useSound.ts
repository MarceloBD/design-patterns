"use client";

import { useCallback } from "react";
import { playSoundEffect, playBackgroundMusic, stopBackgroundMusic, isMuted } from "@/lib/audio-engine";

type SoundEffect = "click" | "hit" | "hurt" | "gameover" | "purchase" | "coin" | "levelup" | "lightning";
type MusicRealm = "creational" | "structural" | "behavioral" | "boss";

export function useSound() {
  const play = useCallback((effect: SoundEffect) => {
    if (!isMuted()) {
      playSoundEffect(effect);
    }
  }, []);

  const startMusic = useCallback((realm: MusicRealm) => {
    if (!isMuted()) {
      playBackgroundMusic(realm);
    }
  }, []);

  const stopMusic = useCallback(() => {
    stopBackgroundMusic();
  }, []);

  return { play, startMusic, stopMusic };
}
