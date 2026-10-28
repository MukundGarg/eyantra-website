import type { MetadataRoute } from "next";
import { SITE_CONFIG, getAbsoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/admin/*",
          "/api/",
          "/api/*",
        ],
      },
    ],
    sitemap: getAbsoluteUrl("/sitemap.xml"),
    host: SITE_CONFIG.canonicalOrigin,
  };
}
