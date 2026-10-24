import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import EventsList from "@/components/EventsList";
import { supabase } from "@/utils/supabase";

export const revalidate = 60;

function normalizeStatus(status: string | null | undefined, dateStr: string | null | undefined): 'upcoming' | 'ongoing' | 'past' {
  const s = (status || '').toLowerCase().trim();
  if (s === 'upcoming' || s === 'ongoing' || s === 'past') {
    return s;
  }
  // Fallback based on ISO date comparison if status is null or unexpected
  if (dateStr) {
    const today = new Date().toISOString().split('T')[0];
    const eventDay = dateStr.split('T')[0];
    if (eventDay < today) {
      return 'past';
    }
  }
  return 'upcoming';
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  // Format YYYY-MM-DD cleanly without timezone shift issues
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(Date.UTC(year, month, day));
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', {
        timeZone: 'UTC',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  }
  const fallback = new Date(dateStr);
  return isNaN(fallback.getTime()) ? '' : fallback.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

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
      date: formatDate(e.event_date),
      time: e.event_time,
      location: e.location,
      desc: e.short_description,
      summary: e.short_description,
      link: e.registration_url
    },
    variant: normalizeStatus(e.status, e.event_date)
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
