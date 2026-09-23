import Iconify from "@/components/Iconify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import EventCard from "@/components/EventCard";
import { eventFilters } from "@/data/events";
import { supabase } from "@/utils/supabase";

export const revalidate = 60;

export default async function EventsPage() {
  const { data: events = [], error } = await supabase
    .from('events')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error("Supabase events error:", error);
  }

  const safeEvents = events || [];

  const upcomingEvents = safeEvents.filter(e => e.status === 'upcoming').map(e => ({
    image: e.cover_image,
    title: e.title,
    category: e.event_type,
    date: e.event_date ? new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    time: e.event_time,
    location: e.location,
    desc: e.short_description,
    link: e.registration_url || '#'
  }));

  const pastEvents = safeEvents.filter(e => e.status === 'past').map(e => ({
    image: e.cover_image,
    title: e.title,
    category: e.event_type,
    date: e.event_date ? new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
    summary: e.short_description,
    link: e.registration_url || '#'
  }));

  const isEmptyUpcoming = upcomingEvents.length === 0;
  const isEmptyPast = pastEvents.length === 0;

  return (
    <>
      <Navbar />

      <main className="relative z-10 pt-32 pb-20">
        <section className="px-6 relative">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              title="Events &"
              highlight="Workshops"
              subtitle="Join us for hands-on sessions, expert talks, and hackathons."
            />

            <div className="reveal flex flex-wrap justify-center gap-2 mb-16" id="event-filters">
              {eventFilters.map((filter, i) => (
                <button
                  key={filter}
                  className={`px-4 py-1.5 text-[10px] font-bold font-mono uppercase tracking-widest rounded border transition-all cursor-pointer ${
                    i === 0
                      ? "bg-[#292D32] text-white border-[#292D32]"
                      : "bg-transparent text-[#A6AAAE] border-[#292D32] hover:border-white/20 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mb-24">
              <h3 className="text-xl font-bold font-mono text-white mb-8 border-b border-[#292D32] pb-4 reveal">
                Upcoming Sessions
              </h3>
              <div className="flex flex-col gap-6 reveal" id="upcoming-container">
                {isEmptyUpcoming ? (
                  <div className="text-center text-[#A6AAAE] py-10 font-mono">
                    No upcoming events right now.
                  </div>
                ) : (
                  upcomingEvents.map((event, i) => (
                    <div key={i} className={`stagger-${i + 1}`}>
                      <EventCard event={event} variant="upcoming" />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mb-24">
              <h3 className="text-xl font-bold font-mono text-white mb-8 border-b border-[#292D32] pb-4 reveal">
                Past Archive
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal" id="past-container">
                {isEmptyPast ? (
                  <div className="col-span-full text-center text-[#A6AAAE] py-10 font-mono">
                    No past events.
                  </div>
                ) : (
                  pastEvents.map((event, i) => (
                    <div key={i} className={`stagger-${(i % 3) + 1}`}>
                      <EventCard event={event} variant="past" />
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
