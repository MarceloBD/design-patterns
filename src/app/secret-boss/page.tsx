import { Navigation } from "@/components/Navigation";
import { SecretBossGate } from "@/components/interactive/SecretBossGate";
import { SECRET_BOSS_QUIZ } from "@/data/secret-boss";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "??? - Design Patterns Quest",
  description: "The ultimate challenge awaits those who have mastered all realms.",
  robots: { index: false, follow: false },
};

export default function SecretBossPage() {
  return (
    <>
      <Navigation />
      <SecretBossGate quiz={SECRET_BOSS_QUIZ} />
    </>
  );
}
