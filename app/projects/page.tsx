import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import ProjectsList from "@/components/ProjectsList";
import { supabase } from "@/utils/supabase";
import { SITE_CONFIG } from "@/lib/seo";
import { getBreadcrumbSchema, getProjectListSchema } from "@/lib/structuredData";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Robotics & Engineering Projects",
  description:
    "Explore innovative robotics, embedded systems, and AI projects engineered by students at e-Yantra MSIT Delhi. Browse our open-source hardware and software prototypes.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Robotics & Engineering Projects | e-Yantra MSIT",
    description:
      "Explore innovative robotics, embedded systems, and AI projects engineered by students at e-Yantra MSIT Delhi.",
    url: `${SITE_CONFIG.canonicalOrigin}/projects`,
    type: "website",
    images: [
      {
        url: SITE_CONFIG.ogImage.url,
        width: SITE_CONFIG.ogImage.width,
        height: SITE_CONFIG.ogImage.height,
        alt: "e-Yantra MSIT Robotics & Engineering Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Robotics & Engineering Projects | e-Yantra MSIT",
    description:
      "Explore innovative robotics, embedded systems, and AI projects engineered by students at e-Yantra MSIT Delhi.",
  },
};

export default async function ProjectsPage() {
  const { data: projects = [], error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true) // PUBLIC PAGE: Only show published projects
    .order('display_order', { ascending: true });

  if (error) {
    console.error("Supabase projects error:", error);
  }

  const safeProjects = projects || [];
  const mappedProjects = safeProjects.map(p => ({
    image: p.cover_image,
    title: p.title,
    category: p.category,
    desc: p.short_description,
    techStack: p.tech_stack,
    link: p.demo_url,
    githubUrl: p.github_url
  }));

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
  ]);
  const projectsSchema = getProjectListSchema(
    safeProjects.map(p => ({
      title: p.title,
      description: p.short_description || p.description,
      category: p.category,
      tech_stack: p.tech_stack,
      image: p.cover_image,
      github_url: p.github_url,
      demo_url: p.demo_url,
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
      />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20">
        <section className="px-6 relative">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              title="Engineering"
              highlight="Portfolio"
              subtitle="Showcasing our journey from concept to deployment."
            />

            <ProjectsList projects={mappedProjects} />

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
