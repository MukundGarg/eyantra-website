import Iconify from "@/components/Iconify";

export interface ProjectProps {
  image: string | null;
  title: string;
  category: string | null;
  desc: string | null;
  techStack: string[] | null;
  link?: string | null;
  githubUrl?: string | null;
}

export default function ProjectCard({ project }: { project: ProjectProps }) {
  const safeTechStack = project.techStack || [];
  const linkToUse = project.link || project.githubUrl || null;

  return (
    <div className="group flex flex-col overflow-hidden p-6 border border-[#292D32] bg-[#15181C]/90 hover:border-white/30 transition-all duration-500 rounded-xl hover:-translate-y-1.5 shadow-lg hover:shadow-2xl">
      <div className="w-full h-52 bg-[#0B0D10] border border-[#292D32] rounded-lg mb-6 overflow-hidden relative flex items-center justify-center">
        {project.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
          />
        ) : (
          <Iconify icon="lucide:cpu" className="w-10 h-10 text-[#292D32]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10]/80 via-transparent to-transparent pointer-events-none opacity-60 group-hover:opacity-20 transition-opacity" />
      </div>

      {project.category && (
        <span className="text-[#d83a32] font-mono text-[10px] mb-2 uppercase tracking-widest font-bold">
          {project.category}
        </span>
      )}

      <h3 className="text-lg font-bold font-mono text-white tracking-tight mb-2 group-hover:text-white transition-colors">
        {project.title}
      </h3>

      {project.desc && (
        <p className="text-[#A6AAAE] text-sm mb-6 flex-1 line-clamp-3 font-light leading-relaxed">
          {project.desc}
        </p>
      )}

      {safeTechStack.length > 0 && (
        <div className="flex gap-1.5 mb-6 flex-wrap">
          {safeTechStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-0.5 bg-white/[0.04] border border-white/10 rounded text-[10px] text-zinc-300 font-mono tracking-wider"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {linkToUse && (
        <a
          href={linkToUse}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 bg-white/5 hover:bg-[#d83a32] text-zinc-200 hover:text-white border border-white/10 hover:border-[#d83a32] rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 text-center flex items-center justify-center gap-2 mt-auto"
        >
          Inspect Project <Iconify icon="lucide:arrow-right" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </a>
      )}
    </div>
  );
}
