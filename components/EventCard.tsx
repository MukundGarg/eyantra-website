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
      <div className="group flex flex-col overflow-hidden p-6 border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border)] transition-all duration-300 rounded-xl hover:-translate-y-1 shadow-sm hover:shadow-md">
        <div className="w-full h-36 bg-[var(--bg-surface-alt)] border border-[var(--border)] rounded-lg mb-4 overflow-hidden relative flex items-center justify-center">
          {event.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
            />
          ) : (
            <Iconify icon="lucide:image" className="w-8 h-8 text-[var(--text-secondary)]" />
          )}
          {event.date && (
            <div className="absolute bottom-2 left-2 z-20">
              <span className="px-2 py-0.5 bg-[var(--bg-surface)]/90 backdrop-blur border border-[var(--border)] rounded text-[10px] text-[var(--text-primary)] font-mono shadow-sm">
                {event.date}
              </span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-base font-bold font-mono text-[var(--text-primary)] tracking-tight">{event.title}</h3>
          {event.highlight && (
            <span className="shrink-0 px-2 py-0.5 bg-[var(--bg-surface-alt)] border border-[var(--border)] rounded text-[9px] text-[var(--text-primary)] uppercase font-mono font-medium">
              {event.highlight}
            </span>
          )}
        </div>
        {event.category && (
          <p className="text-[var(--accent-red)] font-mono text-[10px] mb-2 uppercase tracking-widest font-bold">
            {event.category}
          </p>
        )}
        {event.summary && (
          <p className="text-[var(--text-secondary)] text-xs mb-4 flex-1 line-clamp-2 font-normal leading-relaxed">
            {event.summary}
          </p>
        )}

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-4 bg-[var(--bg-surface-alt)] border border-[var(--border)] hover:border-[var(--text-primary)]/30 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all text-center mt-auto"
          >
            Archive Details
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] rounded-2xl flex flex-col md:flex-row hover:border-[var(--accent-red)] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-md hover:-translate-y-1">
      <div className="w-full md:w-2/5 h-52 md:h-auto relative overflow-hidden bg-[var(--bg-surface-alt)] flex items-center justify-center">
        <div className="absolute inset-0 bg-[var(--accent-red)]/5 z-10 group-hover:opacity-0 transition-opacity" />
        {event.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <Iconify icon="lucide:calendar" className="w-12 h-12 text-[var(--text-secondary)] relative z-20" />
        )}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {event.category && (
            <span className="px-2.5 py-1 bg-[var(--bg-surface)]/90 backdrop-blur border border-[var(--border)] rounded text-[10px] text-[var(--text-primary)] uppercase font-mono tracking-wider font-bold shadow-sm">
              {event.category}
            </span>
          )}
          {variant === "ongoing" && (
            <span className="px-2.5 py-1 bg-emerald-500/10 backdrop-blur border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded text-[10px] uppercase font-mono tracking-wider font-bold animate-pulse">
              Ongoing Session
            </span>
          )}
        </div>
      </div>
      <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col">
        <h3 className="text-xl md:text-2xl font-bold font-mono text-[var(--text-primary)] mb-4 tracking-tight leading-tight">
          {event.title}
        </h3>

        <div className="flex flex-col gap-2 mb-4">
          {(event.date || event.time) && (
            <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--text-secondary)] font-mono">
              <Iconify icon="lucide:calendar" className="w-4 h-4 text-[var(--accent-red)]" />
              <span>{[event.date, event.time].filter(Boolean).join(" • ")}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--text-secondary)] font-mono">
              <Iconify icon="lucide:map-pin" className="w-4 h-4 text-[var(--accent-red)]" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {event.desc && (
          <p className="text-[var(--text-secondary)] text-sm mb-6 flex-1 line-clamp-3 leading-relaxed font-normal">
            {event.desc}
          </p>
        )}

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--accent-red)] hover:opacity-90 text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all w-fit mt-auto shadow-sm"
          >
            Session Registration <Iconify icon="lucide:arrow-right" className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
