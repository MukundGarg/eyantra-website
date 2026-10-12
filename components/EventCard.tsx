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

export default function EventCard({
  event,
  variant = "upcoming",
}: {
  event: EventProps;
  variant?: "upcoming" | "past" | "ongoing";
}) {
  if (variant === "past") {
    return (
      <div className="group flex flex-col overflow-hidden p-6 border border-[#D9D9D5] bg-white hover:border-[#111214]/20 transition-all duration-300 rounded-xl hover:-translate-y-1 shadow-sm hover:shadow-md">
        <div className="w-full h-36 bg-[#F3F3F0] border border-[#D9D9D5] rounded-lg mb-4 overflow-hidden relative flex items-center justify-center">
          {event.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
            />
          ) : (
            <Iconify icon="lucide:image" className="w-8 h-8 text-[#D9D9D5]" />
          )}
          {event.date && (
            <div className="absolute bottom-2 left-2 z-20">
              <span className="px-2 py-0.5 bg-white/90 backdrop-blur border border-[#D9D9D5] rounded text-[10px] text-[#111214] font-mono shadow-sm">
                {event.date}
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-base font-bold font-mono text-[#111214] tracking-tight">{event.title}</h3>
          {event.highlight && (
            <span className="shrink-0 px-2 py-0.5 bg-[#F3F3F0] border border-[#D9D9D5] rounded text-[9px] text-[#111214] uppercase font-mono font-medium">
              {event.highlight}
            </span>
          )}
        </div>
        {event.category && (
          <p className="text-[#d83a32] font-mono text-[10px] mb-2 uppercase tracking-widest font-bold">
            {event.category}
          </p>
        )}
        {event.summary && (
          <p className="text-[#5F6368] text-xs mb-4 flex-1 line-clamp-2 font-normal leading-relaxed">
            {event.summary}
          </p>
        )}

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-4 bg-[#FAFAF8] border border-[#D9D9D5] hover:border-[#111214]/30 text-[#5F6368] hover:text-[#111214] rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all text-center mt-auto"
          >
            Archive Details
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden border border-[#D9D9D5] bg-white rounded-2xl flex flex-col md:flex-row hover:border-[#d83a32] transition-all duration-300 shadow-[0_4px_20px_rgba(17,18,20,0.04)] hover:shadow-md hover:-translate-y-1">
      <div className="w-full md:w-2/5 h-52 md:h-auto relative overflow-hidden bg-[#F3F3F0] flex items-center justify-center">
        <div className="absolute inset-0 bg-[#d83a32]/5 z-10 group-hover:opacity-0 transition-opacity" />
        {event.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <Iconify icon="lucide:calendar" className="w-12 h-12 text-[#D9D9D5] relative z-20" />
        )}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {event.category && (
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur border border-[#D9D9D5] rounded text-[10px] text-[#111214] uppercase font-mono tracking-wider font-bold shadow-sm">
              {event.category}
            </span>
          )}
          {variant === "ongoing" && (
            <span className="px-2.5 py-1 bg-emerald-50 backdrop-blur border border-emerald-200 text-emerald-700 rounded text-[10px] uppercase font-mono tracking-wider font-bold animate-pulse">
              Ongoing Session
            </span>
          )}
        </div>
      </div>
      <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col">
        <h3 className="text-xl md:text-2xl font-bold font-mono text-[#111214] mb-4 tracking-tight leading-tight">
          {event.title}
        </h3>

        <div className="flex flex-col gap-2 mb-4">
          {(event.date || event.time) && (
            <div className="flex items-center gap-2 text-xs md:text-sm text-[#5F6368] font-mono">
              <Iconify icon="lucide:calendar" className="w-4 h-4 text-[#d83a32]" />
              <span>{[event.date, event.time].filter(Boolean).join(" • ")}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-xs md:text-sm text-[#5F6368] font-mono">
              <Iconify icon="lucide:map-pin" className="w-4 h-4 text-[#d83a32]" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {event.desc && (
          <p className="text-[#5F6368] text-sm mb-6 flex-1 line-clamp-3 leading-relaxed font-normal">
            {event.desc}
          </p>
        )}

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#d83a32] hover:bg-[#B82D27] text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all w-fit mt-auto shadow-sm"
          >
            Session Registration <Iconify icon="lucide:arrow-right" className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
