import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArduinoHero from "@/components/ArduinoHero";
import IntroSection from "@/components/IntroSection";
import DomainsSection from "@/components/DomainsSection";
import FeaturedProjectsSection from "@/components/FeaturedProjectsSection";
import Link from "next/link";
import Iconify from "@/components/Iconify";
import { supabase } from "@/utils/supabase";

export const revalidate = 60;

export default async function Home() {
  const { data: featuredProjects = [] } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .limit(3);

  const mappedProjects = (featuredProjects || []).map((p) => ({
    image: p.cover_image,
    title: p.title,
    category: p.category,
    desc: p.short_description,
    techStack: p.tech_stack,
    link: p.demo_url,
    githubUrl: p.github_url,
  }));

  return (
    <>
      <Navbar />

      <main className="relative z-10">
        {/* 1. Dedicated 3D Arduino Interactive Hero */}
        <ArduinoHero />

        {/* 2. Large Editorial Intro Section (Arago inspired) */}
        <IntroSection />

        {/* 3. Core Disciplines / Domains Section (Large Typography & Separators) */}
        <DomainsSection />

        {/* 4. Fully Animated 3D Featured Engineering Projects Section */}
        <FeaturedProjectsSection projects={mappedProjects} />

        {/* 5. Minimal Editorial Closing Section */}
        <section className="py-36 px-6 text-center relative overflow-hidden border-t border-[#292D32]/60 bg-[#0B0D10]">
          <div className="reveal max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d83a32]" />
              <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest">
                LABORATORY ARCHITECTURE
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold font-mono mb-6 tracking-tighter text-white">
              Built on <span className="text-[#d83a32]">First Principles</span>
            </h2>
            <p className="text-base sm:text-lg text-[#A6AAAE] max-w-xl mx-auto mb-10 font-light leading-relaxed">
              Explore the autonomous robots, custom circuits, and technical documentation produced inside our lab.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/projects" className="shiny-cta group cta-press">
                <span className="relative z-10 flex items-center gap-2 text-white font-mono text-xs uppercase tracking-wider">
                  View Repository <Iconify icon="lucide:arrow-right" className="cta-arrow w-4 h-4" />
                </span>
              </Link>
              <Link
                href="/team"
                className="cta-press group px-6 py-3.5 rounded-full bg-[#15181C] border border-[#292D32] text-zinc-300 font-mono text-xs tracking-wider uppercase hover:text-white hover:border-[#d83a32] transition-all flex items-center gap-2"
              >
                Meet The Engineers
                <Iconify
                  icon="lucide:arrow-right"
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
