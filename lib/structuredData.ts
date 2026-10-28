import { SITE_CONFIG, getAbsoluteUrl } from "@/lib/seo";

/**
 * Generates Schema.org Organization structured data for e-Yantra MSIT.
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${getAbsoluteUrl("/")}#organization`,
    name: SITE_CONFIG.name,
    alternateName: ["e-Yantra MSIT Robotics Club", "eYantra MSIT"],
    url: getAbsoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: getAbsoluteUrl("/images/eyantra-logo.png"),
      width: 512,
      height: 512,
      caption: "e-Yantra MSIT Logo",
    },
    image: getAbsoluteUrl(SITE_CONFIG.ogImage.url),
    description: SITE_CONFIG.defaultDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE_CONFIG.location.addressLocality,
      addressRegion: SITE_CONFIG.location.state,
      postalCode: SITE_CONFIG.location.postalCode,
      addressCountry: "IN",
    },
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: SITE_CONFIG.collegeName,
      alternateName: "MSIT Delhi",
      url: "https://www.msit.in",
    },
    sameAs: [
      SITE_CONFIG.socialLinks.instagram,
      SITE_CONFIG.socialLinks.linkedin,
      SITE_CONFIG.socialLinks.github,
    ],
  };
}

/**
 * Generates Schema.org WebSite structured data.
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getAbsoluteUrl("/")}#website`,
    url: getAbsoluteUrl("/"),
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.defaultDescription,
    publisher: {
      "@id": `${getAbsoluteUrl("/")}#organization`,
    },
    inLanguage: "en-US",
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data.
 */
export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getAbsoluteUrl(item.path),
    })),
  };
}

/**
 * Generates Schema.org CreativeWork schema for project portfolio items.
 */
export function getProjectListSchema(
  projects: Array<{
    title: string;
    description?: string | null;
    category?: string | null;
    tech_stack?: string[] | null;
    image?: string | null;
    github_url?: string | null;
    demo_url?: string | null;
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "e-Yantra MSIT Engineering & Robotics Projects",
    description: "Student-built autonomous rovers, computer vision systems, and IoT prototypes.",
    itemListElement: projects.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: p.title,
        description: p.description || `${p.title} robotics engineering project at e-Yantra MSIT.`,
        genre: p.category || "Robotics",
        keywords: p.tech_stack?.join(", "),
        image: p.image || getAbsoluteUrl(SITE_CONFIG.ogImage.url),
        creator: {
          "@id": `${getAbsoluteUrl("/")}#organization`,
        },
        ...(p.github_url ? { codeRepository: p.github_url } : {}),
        ...(p.demo_url ? { url: p.demo_url } : {}),
      },
    })),
  };
}

/**
 * Generates Schema.org Event schema for robotics workshops & hackathons.
 */
export function getEventListSchema(
  events: Array<{
    title: string;
    description?: string | null;
    event_date?: string | null;
    event_time?: string | null;
    location?: string | null;
    status?: string | null;
    cover_image?: string | null;
    registration_url?: string | null;
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "e-Yantra MSIT Robotics Events & Workshops",
    itemListElement: events.map((e, index) => {
      // Build ISO start date if event_date exists
      let startDateStr = e.event_date || undefined;
      if (startDateStr && e.event_time) {
        // e.g., 2026-11-09
        startDateStr = `${startDateStr}T09:30:00+05:30`;
      }

      const eventStatusMapping: Record<string, string> = {
        upcoming: "https://schema.org/EventScheduled",
        ongoing: "https://schema.org/EventScheduled",
        past: "https://schema.org/EventPostponed",
      };

      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Event",
          name: e.title,
          description: e.description || `${e.title} organized by e-Yantra MSIT.`,
          startDate: startDateStr,
          eventStatus: eventStatusMapping[e.status || "upcoming"] || "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            name: e.location || "Maharaja Surajmal Institute of Technology",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Janakpuri, New Delhi",
              addressRegion: "Delhi",
              postalCode: "110058",
              addressCountry: "IN",
            },
          },
          image: e.cover_image || getAbsoluteUrl(SITE_CONFIG.ogImage.url),
          organizer: {
            "@id": `${getAbsoluteUrl("/")}#organization`,
          },
          ...(e.registration_url && e.registration_url !== "#" ? { offers: { "@type": "Offer", url: e.registration_url, price: "0", priceCurrency: "INR", availability: "https://schema.org/InStock" } } : {}),
        },
      };
    }),
  };
}
