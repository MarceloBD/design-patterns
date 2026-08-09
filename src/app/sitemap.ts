import type { MetadataRoute } from "next";
import { PATTERN_METADATA, getAllCategories } from "@/data/patterns";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://design-patterns-quest.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/skill-tree`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const realmPages: MetadataRoute.Sitemap = getAllCategories().map((category) => ({
    url: `${SITE_URL}/realm/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const questPages: MetadataRoute.Sitemap = PATTERN_METADATA.map((pattern) => ({
    url: `${SITE_URL}/quest/${pattern.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const finalBossPages: MetadataRoute.Sitemap = getAllCategories().map((category) => ({
    url: `${SITE_URL}/final-boss/${category}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...realmPages, ...questPages, ...finalBossPages];
}
