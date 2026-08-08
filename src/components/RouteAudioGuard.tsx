"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { stopBackgroundMusic } from "@/lib/audio-engine";

export function RouteAudioGuard() {
  const pathname = usePathname();

  useEffect(() => {
    stopBackgroundMusic();
  }, [pathname]);

  return null;
}
