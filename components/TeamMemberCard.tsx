import Iconify from "@/components/Iconify";
export interface TeamMemberProps {
  name: string;
  photo: string;
  role?: string; // For core/dept
  designation?: string; // For mentors
  department?: string; // For mentors
  subtitle?: string; // For core
  desc?: string; // For mentors
  linkedin?: string;
  github?: string;
  twitter?: string;
  email?: string;
}

export default function TeamMemberCard({ member, variant = "core" }: { member: TeamMemberProps, variant?: "mentor" | "core" | "dept" }) {
  const renderSocialLinks = () => (
    <div className="social-reveal flex gap-3">
      {member.linkedin && (
        <a href={member.linkedin} className="text-[#A6AAAE] hover:text-white transition-colors">
          <Iconify icon="lucide:linkedin" className="w-4 h-4" />
        </a>
      )}
      {member.github && (
        <a href={member.github} className="text-[#A6AAAE] hover:text-white transition-colors">
          <Iconify icon="lucide:github" className="w-4 h-4" />
        </a>
      )}
      {member.twitter && (
        <a href={member.twitter} className="text-[#A6AAAE] hover:text-white transition-colors">
          <Iconify icon="lucide:twitter" className="w-4 h-4" />
        </a>
      )}
      {member.email && (
        <a href={`mailto:${member.email}`} className="text-[#A6AAAE] hover:text-white transition-colors">
          <Iconify icon="lucide:mail" className="w-4 h-4" />
        </a>
      )}
    </div>
  );

  if (variant === "mentor") {
    return (
      <div className="card-hover group relative overflow-hidden p-6 border border-[#292D32] bg-[#15181C] rounded-xl flex items-start gap-4">
        <img
          src={member.photo}
          alt={member.name}
          className="card-img w-20 h-20 rounded-lg object-cover bg-[#0B0D10] border border-[#292D32] grayscale opacity-80"
        />
        <div className="flex-1">
          <h3 className="text-lg font-bold font-mono text-white tracking-tight">{member.name}</h3>
          <p className="text-[#d83a32] text-xs font-mono uppercase tracking-wider mb-2">{member.designation}</p>
          <p className="text-xs text-[#A6AAAE] mb-3">{member.department}</p>
          {member.desc && <p className="text-sm text-[#A6AAAE] leading-relaxed mb-4">{member.desc}</p>}
          {renderSocialLinks()}
        </div>
      </div>
    );
  }

  if (variant === "dept") {
    return (
      <div className="card-hover group relative overflow-hidden p-5 border border-[#292D32] bg-[#15181C] rounded-xl flex items-center gap-4 filter-fade">
        <img
          src={member.photo}
          alt={member.name}
          className="card-img w-16 h-16 rounded-lg object-cover bg-[#0B0D10] border border-[#292D32] grayscale opacity-80"
        />
        <div className="flex-1">
          <h3 className="text-md font-bold font-mono text-white tracking-tight leading-tight mb-1">{member.name}</h3>
          <p className="text-[10px] text-[#A6AAAE] uppercase tracking-wider">{member.role}</p>
          <div className="social-reveal mt-2 flex gap-3">
            {member.linkedin && (
              <a href={member.linkedin} className="text-[#A6AAAE] hover:text-white transition-colors">
                <Iconify icon="lucide:linkedin" className="w-3 h-3" />
              </a>
            )}
            {member.github && (
              <a href={member.github} className="text-[#A6AAAE] hover:text-white transition-colors">
                <Iconify icon="lucide:github" className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-hover group relative overflow-hidden p-6 border border-[#292D32] bg-gradient-to-b from-[#15181C] to-[#0B0D10] rounded-xl text-center flex flex-col items-center">
      <img
        src={member.photo}
        alt={member.name}
        className="card-img w-24 h-24 rounded-full object-cover bg-[#0B0D10] border-2 border-[#292D32] group-hover:border-[#d83a32] transition-colors mb-4 grayscale opacity-80"
      />
      <h3 className="text-lg font-bold font-mono text-white tracking-tight">{member.name}</h3>
      <p className="text-[#d83a32] text-xs font-mono uppercase tracking-wider mt-1">{member.role}</p>
      {member.subtitle && <p className="text-[10px] text-[#A6AAAE] mt-1 uppercase tracking-widest">{member.subtitle}</p>}
      <div className="mt-auto pt-4 w-full flex justify-center">
        {renderSocialLinks()}
      </div>
    </div>
  );
}
