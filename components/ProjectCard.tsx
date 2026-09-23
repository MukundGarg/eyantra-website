import Iconify from "@/components/Iconify";
export interface ProjectProps {
  image: string;
  title: string;
  category: string;
  desc: string;
  techStack: string[];
  link: string;
}

export default function ProjectCard({ project }: { project: ProjectProps }) {
  return (
    <div className="group flex flex-col overflow-hidden p-6 border border-[#292D32] bg-[#15181C] hover:border-white/20 transition-all rounded-xl animate-fade-up">
      <div className="w-full h-48 bg-[#0B0D10] border border-[#292D32] rounded-lg mb-6 overflow-hidden relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 duration-500"
        />
      </div>
      <p className="text-[#d83a32] font-mono text-[10px] mb-2 uppercase tracking-widest">{project.category}</p>
      <h3 className="text-lg font-bold font-mono text-white tracking-tight mb-2">{project.title}</h3>
      <p className="text-[#A6AAAE] text-sm mb-6 flex-1 line-clamp-3">{project.desc}</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {project.techStack.map((tech) => (
          <span key={tech} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-[#F3F2EE] font-mono">
            {tech}
          </span>
        ))}
      </div>

      <a
        href={project.link}
        className="w-full py-3 px-4 bg-white/5 hover:bg-[#d83a32] hover:border-[#d83a32] text-white border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
      >
        Details <Iconify icon="lucide:arrow-right" />
      </a>
    </div>
  );
}
