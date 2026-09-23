import Iconify from "@/components/Iconify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import TeamMemberCard from "@/components/TeamMemberCard";
import { teamData } from "@/data/team";

export default function TeamPage() {
  return (
    <>
      <Navbar />

      <main className="relative z-10 pt-32 pb-20">
        <section className="px-6 relative">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              title="The Minds Behind"
              highlight="e-Yantra"
              subtitle="A multidisciplinary team of engineers, developers, and robotics enthusiasts."
            />

            <div className="mb-24">
              <h3 className="text-xl font-bold font-mono text-white mb-8 border-b border-[#292D32] pb-4 reveal">
                Faculty Mentors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
                {teamData.mentors.map((member, i) => (
                  <div key={i} className={`stagger-${i + 1}`}>
                    <TeamMemberCard member={member} variant="mentor" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-24">
              <h3 className="text-xl font-bold font-mono text-white mb-8 border-b border-[#292D32] pb-4 reveal">
                Core Leadership
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 reveal">
                {teamData.core.map((member, i) => (
                  <div key={i} className={`stagger-${i + 1}`}>
                    <TeamMemberCard member={member} variant="core" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-24">
              <h3 className="text-xl font-bold font-mono text-white mb-8 border-b border-[#292D32] pb-4 reveal">
                Technical Department
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 reveal">
                {teamData.departments.technical.map((member, i) => (
                  <div key={i} className={`stagger-${i + 1}`}>
                    <TeamMemberCard member={member} variant="dept" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
