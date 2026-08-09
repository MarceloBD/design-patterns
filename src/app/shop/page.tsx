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
      <main className="pt-16 pb-12 relative z-10">
        <header className="mb-8 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0800 0%, #2d1000 30%, #1a0600 60%, #0d0300 100%)" }}>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-4 left-[20%] w-1 h-1 rounded-full bg-orange-400 animate-pulse" />
            <div className="absolute top-12 right-[30%] w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-8 left-[60%] w-1 h-1 rounded-full bg-orange-300 animate-pulse" style={{ animationDelay: "2s" }} />
          </div>
          <div className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-10">
            <div className="flex items-center gap-4">
              <MerchantSprite />
              <div>
                <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-orange-400/70 block mb-1">
                  Trading Post
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight text-orange-100 italic font-[var(--font-display)]">
                  Merchant&apos;s Shop
                </h1>
              </div>
            </div>
            <p className="text-[12px] leading-[1.9] text-orange-200/50 mt-3 max-w-lg italic">
              &ldquo;Welcome, traveler. My wares are forged from the remnants of the old world. Every item carries a piece of Architectura&apos;s history. Spend wisely — coins are hard-won in these broken lands.&rdquo;
            </p>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <ShopContent />
        </div>
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
