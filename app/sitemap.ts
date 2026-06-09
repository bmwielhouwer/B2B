import type { MetadataRoute } from "next";
import { agencies } from "@/lib/agencies";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/submit`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const agencyRoutes: MetadataRoute.Sitemap = agencies.map((a) => ({
    url: `${SITE_URL}/agencies/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...agencyRoutes];
}
