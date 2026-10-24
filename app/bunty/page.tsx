import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import Iconify from "@/components/Iconify";
import BuntyVisual from "@/components/bunty/BuntyVisual";
import BuntyChatPanel from "@/components/bunty/BuntyChatPanel";

export const metadata: Metadata = {
  title: "Bunty - e-Yantra AI Assistant | e-Yantra MSIT",
  description:
    "Meet Bunty, the autonomous intelligence for e-Yantra MSIT. Discover our robotics society, explore projects, and prepare for live conversational assistance.",
};

const BUNTY_CAPABILITIES = [
  {
    icon: "lucide:cpu",
    title: "Lab & Hardware Intel",
    desc: "Provides instant queries on lab tools, microcontrollers, sensor pinouts, and workbench equipment.",
  },
  {
    icon: "lucide:bot",
    title: "Competition Navigator",
    desc: "Answers rulebook questions, domain guidelines, and past team winning strategies across national hackathons.",
  },
  {
    icon: "lucide:sparkles",
    title: "Project Guidance",
    desc: "Helps members brainstorm architecture ideas, explore ROS2 workflows, and troubleshoot firmware.",
  },
  {
    icon: "lucide:code-2",
    title: "Modular API Ready",
    desc: "Engineered with a pluggable client layer supporting user-provided or society keys for future live LLM routing.",
  },
];

const EXAMPLE_PROMPTS = [
  "What microcontrollers do we use for autonomous rovers?",
  "How can I join the software domain of e-Yantra MSIT?",
  "Tell me about the Maze Solver Robot project.",
  "Which workshops are scheduled for this semester?",
];

export default function BuntyPage() {
  return (
    <>
      <Navbar />

      <main className="relative z-10 pt-32 pb-24 min-h-screen">
        {/* Subtle background ambient mesh */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 180px, rgba(103, 232, 249, 0.15), rgba(168, 85, 247, 0.08) 40%, transparent 70%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6">
          {/* ─── Hero Section ─── */}
          <section className="text-center mb-16 relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] text-xs font-mono mb-8 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>e-Yantra MSIT Autonomous Companion</span>
            </div>

            {/* Glowing Aurora Bunty Avatar Visual */}
            <div className="mb-8">
              <BuntyVisual />
            </div>

            <SectionHeading
              title="Meet"
              highlight="Bunty"
              subtitle="The resident AI companion of e-Yantra MSIT — crafted to guide developers, illuminate robotics domains, and streamline society knowledge."
            />

            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs font-mono text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--bg-surface-alt)] border border-[var(--border)]">
                <Iconify icon="lucide:shield-check" className="w-3.5 h-3.5 text-cyan-500" />
                Head-Only Notion Vector Geometry
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--bg-surface-alt)] border border-[var(--border)]">
                <Iconify icon="lucide:sparkles" className="w-3.5 h-3.5 text-violet-500" />
                Aurora Light Dispersion
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--bg-surface-alt)] border border-[var(--border)]">
                <Iconify icon="lucide:layers" className="w-3.5 h-3.5 text-blue-500" />
                BYOK API Extensible
              </span>
            </div>
          </section>

          {/* ─── Interactive Chat Shell Section ─── */}
          <section className="mb-24">
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                Interactive Chat Shell
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-lg mx-auto">
                Test the interface below. Backend model connection and API key orchestration are staged for direct plug-in.
              </p>
            </div>

            <BuntyChatPanel />
          </section>

          {/* ─── Example Prompts ─── */}
          <section className="mb-20">
            <div className="text-center mb-6">
              <h3 className="text-sm uppercase tracking-wider font-semibold text-[var(--accent-red)]">
                Starter Inquiries
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Typical questions Bunty will specialize in once connected
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {EXAMPLE_PROMPTS.map((prompt, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--accent-red)]/50 transition-all text-xs text-[var(--text-primary)] cursor-default shadow-xs"
                >
                  <Iconify
                    icon="lucide:message-square"
                    className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform"
                  />
                  <span className="leading-relaxed">&ldquo;{prompt}&rdquo;</span>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Capabilities Grid ─── */}
          <section className="mb-16">
            <div className="text-center mb-10">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[var(--accent-red)]">
                Core Architecture
              </h3>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mt-1">
                What Bunty Can Do
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {BUNTY_CAPABILITIES.map((cap, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] flex flex-col justify-between hover:border-[var(--accent-red)]/40 transition-all hover:-translate-y-1 shadow-xs group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface-alt)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-red)] mb-4 group-hover:scale-105 transition-transform">
                      <Iconify icon={cap.icon} className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                      {cap.title}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Future Integration Callout ─── */}
          <section className="rounded-2xl border border-[var(--border)] bg-gradient-to-r from-cyan-500/5 via-violet-500/5 to-transparent p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400 font-medium">
                <Iconify icon="lucide:terminal" className="w-4 h-4" />
                <span>Future API Integration Ready</span>
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                Preparing Bunty for Production Intelligence
              </h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-xl">
                The frontend shell isolates API contracts in <code className="px-1.5 py-0.5 rounded-md bg-[var(--bg-surface-alt)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-[11px]">utils/buntyApi.ts</code>. Simply link your endpoint and secret keys to bring Bunty to life without touching site-wide layouts.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <span className="font-mono text-xs px-3 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 font-medium">
                API Ready: Staged
              </span>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
