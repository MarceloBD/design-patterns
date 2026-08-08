import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ShopContent } from "@/components/interactive/ShopContent";

export const metadata: Metadata = {
  title: "Merchant's Shop - Design Patterns Quest",
  description: "Buy armor, potions, and scrolls with coins found during your quest.",
};

export default function ShopPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <header className="mb-8 pt-4">
          <div className="rounded-2xl p-[1px] bg-gradient-to-br from-[var(--realm-creational)] via-[var(--border-default)] to-[var(--accent-teal)]">
            <div className="rounded-[15px] bg-[var(--surface-raised)] overflow-hidden relative">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--realm-creational)] opacity-[0.03]" />
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-2">
                  <MerchantSprite />
                  <div>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)] block">Trading Post</span>
                    <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Merchant&apos;s Shop</h1>
                  </div>
                </div>
                <p className="text-[13px] leading-[1.8] text-[var(--text-muted)] mt-2">
                  Spend your hard-earned coins on armor, potions, and magical scrolls. Find hidden coins scattered throughout your quests!
                </p>
              </div>
            </div>
          </div>
        </header>

        <ShopContent />
      </main>
      <Footer />
    </>
  );
}

function MerchantSprite() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="4" width="12" height="10" rx="3" fill="var(--realm-creational)" opacity="0.8" />
      <rect x="16" y="8" width="3" height="2" rx="1" fill="var(--accent-teal)" />
      <rect x="21" y="8" width="3" height="2" rx="1" fill="var(--accent-teal)" />
      <path d="M10 14 L20 10 L30 14 L28 18 L12 18 Z" fill="var(--realm-creational)" opacity="0.6" />
      <rect x="14" y="18" width="12" height="14" rx="2" fill="var(--surface-overlay)" stroke="var(--realm-creational)" strokeWidth="0.5" />
      <rect x="18" y="20" width="4" height="4" rx="1" fill="var(--realm-creational)" opacity="0.4" />
      <rect x="16" y="32" width="4" height="6" rx="1" fill="var(--surface-overlay)" stroke="var(--border-muted)" strokeWidth="0.5" />
      <rect x="22" y="32" width="4" height="6" rx="1" fill="var(--surface-overlay)" stroke="var(--border-muted)" strokeWidth="0.5" />
    </svg>
  );
}
