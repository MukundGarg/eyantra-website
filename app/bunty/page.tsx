import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BuntyExperience from "@/components/bunty/BuntyExperience";
import { SITE_CONFIG } from "@/lib/seo";
import { getBreadcrumbSchema } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "Bunty AI — Robotics Assistant",
  description:
    "Meet Bunty, the interactive AI guide to e-Yantra MSIT. Ask questions about student robotics projects, hardware labs, upcoming hackathons, and society recruitment.",
  alternates: {
    canonical: "/bunty",
  },
  openGraph: {
    title: "Bunty AI — Robotics Assistant | e-Yantra MSIT",
    description:
      "Meet Bunty, your interactive conversational guide to e-Yantra MSIT student robotics society.",
    url: `${SITE_CONFIG.canonicalOrigin}/bunty`,
    type: "website",
    images: [
      {
        url: "/images/bunty-companion.png",
        width: 800,
        height: 800,
        alt: "Bunty AI Companion — e-Yantra MSIT",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bunty AI — Robotics Assistant | e-Yantra MSIT",
    description:
      "Meet Bunty, your interactive conversational guide to e-Yantra MSIT student robotics society.",
    images: ["/images/bunty-companion.png"],
  },
};

export default function BuntyPage() {
  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Bunty AI", path: "/bunty" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <Navbar />
      <main className="bunty-page">
        <div className="bunty-page-glow" aria-hidden="true" />
        <BuntyExperience />
      </main>
    </>
  );
}
