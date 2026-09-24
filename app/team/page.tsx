import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import TeamMemberCard from "@/components/TeamMemberCard";
import { supabase } from "@/utils/supabase";

export const revalidate = 60; // Revalidate every minute to keep it fresh without hammering DB

export default async function TeamPage() {
  const { data: members = [], error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error("Supabase team members error:", error);
  }

  const safeMembers = members || [];

  const mentors = safeMembers.filter(m => m.category === 'mentors').map(m => ({
    name: m.name,
    photo: m.image_url,
    designation: m.role,
    department: m.department,
    linkedin: m.linkedin_url,
    github: m.github_url
  }));

  const core = safeMembers.filter(m => m.category === 'core').map(m => ({
    name: m.name,
    photo: m.image_url,
    role: m.role,
    linkedin: m.linkedin_url,
    github: m.github_url
  }));

  const technical = safeMembers.filter(m => m.category === 'departments' && m.department === 'technical').map(m => ({
    name: m.name,
    photo: m.image_url,
    role: m.role,
    linkedin: m.linkedin_url,
    github: m.github_url
  }));

  const management = safeMembers.filter(m => m.category === 'departments' && m.department === 'management').map(m => ({
    name: m.name,
    photo: m.image_url,
    role: m.role,
    linkedin: m.linkedin_url,
    github: m.github_url
  }));

  const isEmpty = safeMembers.length === 0;

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

            {isEmpty ? (
              <div className="text-center text-[#A6AAAE] py-20 font-mono">
                No team members found at the moment.
              </div>
            ) : (
              <>
                {mentors.length > 0 && (
                  <div className="mb-24">
                    <h3 className="text-xl font-bold font-mono text-white mb-8 border-b border-[#292D32] pb-4 reveal">
                      Faculty Mentors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
                      {mentors.map((member, i) => (
                        <div key={i} className={`stagger-${(i % 3) + 1}`}>
                          <TeamMemberCard member={member} variant="mentor" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {core.length > 0 && (
                  <div className="mb-24">
                    <h3 className="text-xl font-bold font-mono text-white mb-8 border-b border-[#292D32] pb-4 reveal">
                      Core Leadership
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 reveal">
                      {core.map((member, i) => (
                        <div key={i} className={`stagger-${(i % 4) + 1}`}>
                          <TeamMemberCard member={member} variant="core" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {technical.length > 0 && (
                  <div className="mb-24">
                    <h3 className="text-xl font-bold font-mono text-white mb-8 border-b border-[#292D32] pb-4 reveal">
                      Technical Department
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 reveal">
                      {technical.map((member, i) => (
                        <div key={i} className={`stagger-${(i % 3) + 1}`}>
                          <TeamMemberCard member={member} variant="dept" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {management.length > 0 && (
                  <div className="mb-24">
                    <h3 className="text-xl font-bold font-mono text-white mb-8 border-b border-[#292D32] pb-4 reveal">
                      Management Department
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 reveal">
                      {management.map((member, i) => (
                        <div key={i} className={`stagger-${(i % 3) + 1}`}>
                          <TeamMemberCard member={member} variant="dept" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
