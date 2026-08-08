import type { Metadata } from "next";
import "./globals.css";
import { GameCursor } from "@/components/GameCursor";
import { EasterEggs } from "@/components/effects/EasterEggs";
import { RouteAudioGuard } from "@/components/RouteAudioGuard";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://design-patterns-quest.vercel.app";

export const metadata: Metadata = {
  title: "Design Patterns Quest - Learn 22 Patterns",
  description:
    "A gamified RPG experience to master all 22 GoF design patterns with interactive quizzes, XP, skill trees, and real TypeScript examples.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Design Patterns Quest - Learn 22 Patterns",
    description: "Master all 22 GoF design patterns through an RPG adventure with quizzes, XP, and TypeScript examples.",
    url: SITE_URL,
    siteName: "Design Patterns Quest",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Design Patterns Quest" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Design Patterns Quest - Learn 22 Patterns",
    description: "Master all 22 GoF design patterns through an RPG adventure with quizzes, XP, and TypeScript examples.",
    images: ["/og-image.png"],
  },
  authors: [{ name: "Design Patterns Quest Team" }],
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Design Patterns Quest",
    url: SITE_URL,
    description: "A gamified RPG experience to master all 22 GoF design patterns.",
    author: { "@type": "Organization", name: "Design Patterns Quest", url: SITE_URL },
    dateModified: new Date().toISOString().split("T")[0],
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Design Patterns Quest",
    url: SITE_URL,
    description: "A gamified learning platform for software design patterns based on Gang of Four.",
    sameAs: [],
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className="antialiased min-h-screen">
        <RouteAudioGuard />
        <GameCursor />
        <EasterEggs />
        <div className="dust-particles" aria-hidden="true">
          <div className="dust" />
          <div className="dust" />
          <div className="dust" />
          <div className="dust" />
          <div className="dust" />
          <div className="dust" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
