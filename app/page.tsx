import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArduinoHero from "@/components/ArduinoHero";
import IntroSection from "@/components/IntroSection";
import DomainsSection from "@/components/DomainsSection";
import FeaturedProjectsSection from "@/components/FeaturedProjectsSection";
import EventShowcaseSection from "@/components/EventShowcaseSection";
import ClosingSection from "@/components/ClosingSection";
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

  const { data: events = [] } = await supabase
    .from("events")
    .select("*")
    .eq("published", true)
    .order("display_order", { ascending: true });

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

        {/* 5. Scroll-Driven Flagship Event Showcase (Robo Race, Robo Soccer, Robo Forge) */}
        <EventShowcaseSection events={events || []} />

        {/* 6. Cinematic Editorial Closing Section */}
        <ClosingSection />
      </main>

      <Footer />
    </>
  );
}
