import Iconify from "@/components/Iconify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import { projectFilters } from "@/data/projects";
import { supabase } from "@/utils/supabase";

export const revalidate = 60;

export default async function ProjectsPage() {
  const { data: projects = [], error } = await supabase
    .from('projects')
    .select('*')
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
    link: p.demo_url || '#'
  }));

  const isEmpty = mappedProjects.length === 0;

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

            <div className="reveal flex flex-wrap justify-center gap-2 mb-12" id="project-filters">
              {projectFilters.map((filter, i) => (
                <button
                  key={filter}
                  className={`px-4 py-1.5 text-[10px] font-bold font-mono uppercase tracking-widest rounded border transition-all cursor-pointer ${
                    i === 0
                      ? "bg-[#d83a32] text-white border-[#d83a32]"
                      : "bg-transparent text-[#A6AAAE] border-[#292D32] hover:border-white/20 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal" id="projects-container">
              {isEmpty ? (
                <div className="col-span-full text-center text-[#A6AAAE] py-20 font-mono">
                  No projects found at the moment.
                </div>
              ) : (
                mappedProjects.map((project, i) => (
                  <div key={i} className={`stagger-${(i % 3) + 1}`}>
                    <ProjectCard project={project} />
                  </div>
                ))
              )}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
