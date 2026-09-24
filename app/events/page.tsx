import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import EventsList from "@/components/EventsList";
import { supabase } from "@/utils/supabase";

export const revalidate = 60;

export default async function EventsPage() {
  const { data: events = [], error } = await supabase
    .from('events')
    .select('*')
    .eq('published', true) // PUBLIC PAGE: Only show published events
    .order('event_date', { ascending: true }); // sort by date

  if (error) {
    console.error("Supabase events error:", error);
  }

  const safeEvents = events || [];

  const mappedEvents = safeEvents.map(e => ({
    event: {
      image: e.cover_image,
      title: e.title,
      category: e.event_type,
      date: e.event_date ? new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      time: e.event_time,
      location: e.location,
      desc: e.short_description,
      summary: e.short_description,
      link: e.registration_url
    },
    variant: e.status as 'upcoming' | 'past' | 'ongoing'
  }));

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

            <EventsList events={mappedEvents} />

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
