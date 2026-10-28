import type { MetadataRoute } from "next";
import { SITE_CONFIG, getAbsoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  return [
    {
      url: getAbsoluteUrl(SITE_CONFIG.routes.home),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: getAbsoluteUrl(SITE_CONFIG.routes.projects),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: getAbsoluteUrl(SITE_CONFIG.routes.events),
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: getAbsoluteUrl(SITE_CONFIG.routes.team),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl(SITE_CONFIG.routes.bunty),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
