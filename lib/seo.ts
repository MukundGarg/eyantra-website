/**
 * Centralized SEO & Canonical Configuration for e-Yantra MSIT Website.
 * Ensures consistent canonical URLs, Open Graph parameters, and Schema.org metadata across all routes.
 */

export const SITE_CONFIG = {
  name: "e-Yantra MSIT",
  shortName: "e-Yantra",
  collegeName: "Maharaja Surajmal Institute of Technology",
  universityName: "Guru Gobind Singh Indraprastha University (GGSIPU)",
  location: {
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    addressLocality: "Janakpuri",
    postalCode: "110058",
  },
  // Canonical origin fallback. Uses NEXT_PUBLIC_SITE_URL if configured, otherwise production Vercel domain.
  canonicalOrigin: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://eyantra-website-wine.vercel.app",
  defaultTitle: "e-Yantra MSIT | Robotics & Innovation Society",
  titleTemplate: "%s | e-Yantra MSIT",
  defaultDescription:
    "Explore the e-Yantra robotics community at Maharaja Surajmal Institute of Technology, Delhi. Discover student-built robotics projects, engineering workshops, hackathons, and our multidisciplinary team.",
  ogImage: {
    url: "/images/og-image.png",
    width: 1200,
    height: 630,
    alt: "e-Yantra MSIT — Robotics & Innovation Society at Maharaja Surajmal Institute of Technology, Delhi",
    type: "image/png",
  },
  socialLinks: {
    instagram: "https://www.instagram.com/eyantramsit/",
    linkedin: "https://www.linkedin.com/company/e-yantra-msit/",
    github: "https://github.com/MukundGarg/eyantra-website",
  },
  routes: {
    home: "/",
    projects: "/projects",
    events: "/events",
    team: "/team",
    bunty: "/bunty",
  },
} as const;

export function getAbsoluteUrl(path: string = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.canonicalOrigin}${cleanPath === "/" ? "" : cleanPath}`;
}
