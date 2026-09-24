import Iconify from "@/components/Iconify";
export interface EventProps {
  image: string | null;
  title: string;
  category: string | null;
  date: string | null;
  time?: string | null;
  location?: string | null;
  desc?: string | null;
  summary?: string | null;
  highlight?: string | null;
  link?: string | null;
}

export default function EventCard({ event, variant = "upcoming" }: { event: EventProps, variant?: "upcoming" | "past" | "ongoing" }) {
  if (variant === "past") {
    return (
      <div className="group flex flex-col overflow-hidden p-5 border border-[#292D32] bg-[#15181C] hover:border-white/20 transition-all rounded-xl animate-fade-up">
        <div className="w-full h-32 bg-[#0B0D10] border border-[#292D32] rounded-lg mb-4 overflow-hidden relative flex items-center justify-center">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-500"
            />
          ) : (
            <Iconify icon="lucide:image" className="w-8 h-8 text-[#292D32]" />
          )}
          {event.date && (
            <div className="absolute bottom-2 left-2 z-20">
              <span className="px-2 py-0.5 bg-black/60 backdrop-blur border border-white/10 rounded text-[10px] text-white font-mono">
                {event.date}
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-md font-bold font-mono text-white tracking-tight">{event.title}</h3>
          {event.highlight && (
            <span className="shrink-0 px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-[#F3F2EE] uppercase font-mono">
              {event.highlight}
            </span>
          )}
        </div>
        {event.category && (
          <p className="text-[#d83a32] font-mono text-[10px] mb-2 uppercase tracking-widest">{event.category}</p>
        )}
        {event.summary && (
          <p className="text-[#A6AAAE] text-xs mb-4 flex-1 line-clamp-2">{event.summary}</p>
        )}

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-4 bg-transparent border border-[#292D32] group-hover:border-white/20 text-[#A6AAAE] group-hover:text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all text-center mt-auto"
          >
            View Details
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden border border-[#292D32] bg-gradient-to-b from-[#15181C] to-[#0B0D10] rounded-2xl flex flex-col md:flex-row hover:border-[#d83a32]/50 transition-all shadow-lg animate-fade-up">
      <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden bg-[#0B0D10] flex items-center justify-center">
        <div className="absolute inset-0 bg-[#d83a32]/20 z-10 group-hover:opacity-0 transition-opacity"></div>
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <Iconify icon="lucide:image" className="w-12 h-12 text-[#292D32] relative z-20" />
        )}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {event.category && (
            <span className="px-2.5 py-1 bg-black/80 backdrop-blur border border-white/10 rounded text-[10px] text-white uppercase font-mono tracking-wider">
              {event.category}
            </span>
          )}
          {variant === 'ongoing' && (
            <span className="px-2.5 py-1 bg-green-500/20 backdrop-blur border border-green-500/30 text-green-400 rounded text-[10px] uppercase font-mono tracking-wider animate-pulse">
              Ongoing
            </span>
          )}
        </div>
      </div>
      <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col">
        <h3 className="text-2xl font-bold font-mono text-white mb-4 tracking-tight leading-tight">{event.title}</h3>

        <div className="flex flex-col gap-2 mb-4">
          {(event.date || event.time) && (
            <div className="flex items-center gap-2 text-sm text-[#A6AAAE] font-mono">
              <Iconify icon="lucide:calendar" className="w-4 h-4 text-[#d83a32]" />
              <span>{[event.date, event.time].filter(Boolean).join(" • ")}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-[#A6AAAE] font-mono">
              <Iconify icon="lucide:map-pin" className="w-4 h-4 text-[#d83a32]" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {event.desc && (
          <p className="text-[#A6AAAE] text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">{event.desc}</p>
        )}

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#d83a32] hover:bg-[#b02d25] text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-all w-fit mt-auto"
          >
            Register Now <Iconify icon="lucide:arrow-right" />
          </a>
        )}
      </div>
    </div>
  );
}
