import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import ProjectsList from "@/components/ProjectsList";
import { supabase } from "@/utils/supabase";

export const revalidate = 60;

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

  return (
    <>
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
