import Iconify from "@/components/Iconify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

export const revalidate = 60;

export default async function Home() {
  const { data: featuredProjects = [] } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('display_order', { ascending: true })
    .limit(3);

  const mappedProjects = (featuredProjects || []).map(p => ({
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

      <main className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6">
          <div className="text-center max-w-5xl mx-auto">
            <div className="hero-stagger hero-stagger-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d83a32]"></span>
              </span>
              <span className="text-xs font-medium text-red-100/90 tracking-wide font-mono">
                Engineering Lab & Robotics Community
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter font-mono leading-[1.1] mb-8">
              <span className="hero-stagger hero-stagger-2 block text-transparent bg-clip-text bg-gradient-to-b from-[#F3F2EE] via-white to-white/40">
                Think. Build.
              </span>
              <span className="hero-stagger hero-stagger-3 block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                <span className="text-[#d83a32] inline-block relative">
                  Innovate.
                  <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#d83a32] opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              </span>
            </h1>

            <p className="hero-stagger hero-stagger-4 text-xl md:text-2xl text-[#A6AAAE] max-w-2xl mx-auto mb-12 leading-relaxed">
              Where ideas become engineering. A student community pushing the boundaries of robotics, embedded systems, and automation.
            </p>

            <div className="hero-stagger hero-stagger-5 flex flex-col md:flex-row items-center justify-center gap-6">
              <Link href="/projects" className="shiny-cta group cta-press">
                <span className="relative z-10 flex items-center gap-2 text-white font-medium font-mono text-sm uppercase tracking-wider">
                  Explore Projects <Iconify icon="lucide:arrow-right" className="cta-arrow" />
                </span>
              </Link>
              <Link
                href="/team"
                className="cta-press group px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium font-mono text-sm tracking-wider uppercase hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-2"
              >
                Meet The Team <Iconify icon="lucide:arrow-right" className="cta-arrow opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          <div
            className="hero-stagger hero-stagger-6 w-full max-w-6xl mx-auto mt-24 border border-[#292D32] bg-[#15181C]/50 backdrop-blur-md rounded-xl p-8 relative overflow-hidden flex items-center justify-center"
            style={{ height: "400px" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d83a32]/10 via-[#15181C]/0 to-[#0B0D10]/0"></div>
            <div className="relative z-10 text-center">
              <Iconify icon="lucide:cpu" className="w-16 h-16 text-[#d83a32] mb-4 opacity-80 animate-pulse" />
              <p className="text-[#A6AAAE] font-mono text-sm tracking-widest uppercase">
                [ Interactive 3D Robotics Visualization Area ]
              </p>
              <p className="text-xs text-[#A6AAAE]/50 mt-2">Chassis → Motors → PCB → Sensors → Working Robot</p>
            </div>
          </div>
        </section>

        <section className="py-36 px-6 relative section-fade-top">
          <div className="max-w-7xl mx-auto">
            <div className="reveal mb-20 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight font-mono mb-6">
                Engineering at the <br />
                <span className="text-[#d83a32]">Core</span>
              </h2>
              <p className="text-lg text-[#A6AAAE] font-light">
                Practical implementation of theoretical concepts to solve real-world problems.
              </p>
            </div>

            <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stagger-1 lg:col-span-2 card-hover group relative overflow-hidden p-8 border border-[#292D32] bg-gradient-to-b from-[#15181C] to-[#0B0D10] rounded-xl">
                <div className="relative z-10 h-full flex flex-col">
                  <div className="mb-6 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-[#d83a32] w-fit">
                    <Iconify icon="lucide:bot" className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white font-mono mb-4 tracking-tight">Robotics</h3>
                  <p className="text-[#A6AAAE] text-lg leading-relaxed">
                    Designing and building autonomous systems, manipulator arms, and mobile robots engineered for complex environments.
                  </p>
                </div>
              </div>

              <div className="stagger-2 card-hover group relative overflow-hidden p-8 border border-[#292D32] bg-[#15181C] rounded-xl">
                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-[#F3F2EE] w-fit">
                    <Iconify icon="lucide:cpu" className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white font-mono mb-2">Embedded Systems</h3>
                  <p className="text-sm text-[#A6AAAE]">Microcontrollers, custom PCBs, and low-level firmware architecture.</p>
                </div>
              </div>

              <div className="stagger-3 card-hover group relative overflow-hidden p-8 border border-[#292D32] bg-[#15181C] rounded-xl">
                <div className="relative z-10">
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-[#F3F2EE] w-fit">
                    <Iconify icon="lucide:zap" className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white font-mono mb-2">Automation</h3>
                  <p className="text-sm text-[#A6AAAE]">Industrial control systems and automated manufacturing workflows.</p>
                </div>
              </div>

              <div className="stagger-4 card-hover group relative overflow-hidden p-8 border border-[#292D32] bg-[#15181C] rounded-xl">
                <div className="relative z-10">
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 border border-white/10 text-[#F3F2EE] w-fit">
                    <Iconify icon="lucide:brain-circuit" className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white font-mono mb-2">AI & IoT</h3>
                  <p className="text-sm text-[#A6AAAE]">Machine learning models deployed on edge devices and connected sensor networks.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-36 px-6 bg-[#0B0D10] relative">
          <div className="max-w-7xl mx-auto">
            <div className="reveal text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-semibold text-white font-mono mb-4">Featured Engineering</h2>
              <p className="text-[#A6AAAE]">Projects bridging the gap between theory and application.</p>
            </div>

            <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-8">
              {mappedProjects.map((project, i) => (
                <div key={i} className={`stagger-${i + 1}`}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-36 px-6 text-center relative section-fade-top">
          <div className="reveal max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold font-mono mb-8 tracking-tighter">
              Start <span className="text-[#d83a32]">Innovating</span>
            </h2>
            <p className="text-xl text-[#A6AAAE] mb-12">
              Join the e-Yantra MSIT community and turn your theoretical knowledge into tangible engineering projects.
            </p>

            <button className="shiny-cta cta-press">
              <span className="relative z-10 flex items-center gap-2 text-white font-mono text-sm uppercase tracking-wider">
                Apply Now <Iconify icon="lucide:arrow-right" className="cta-arrow" />
              </span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
