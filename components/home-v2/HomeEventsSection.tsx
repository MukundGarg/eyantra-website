import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import Iconify from "@/components/Iconify";
import type { Event } from "@/types/index";
import { supabase } from "@/utils/supabase";
import styles from "./HomeEventsSection.module.css";

type FeaturedEvent = Pick<
  Event,
  "id" | "title" | "event_type" | "short_description" | "event_date" | "cover_image" | "status"
>;

const today = () => new Date().toISOString().slice(0, 10);

function formatEventDate(date: string | null) {
  if (!date) return "Date to be announced";

  const parsed = new Date(`${date.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "Date to be announced";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function isUpcomingEvent(event: FeaturedEvent) {
  const status = event.status?.toLowerCase().trim();
  if (status === "past") return false;
  if (status === "ongoing" || status === "upcoming") return true;
  return Boolean(event.event_date && event.event_date.slice(0, 10) >= today());
}

async function getFeaturedEvents(): Promise<FeaturedEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("id, title, event_type, short_description, event_date, cover_image, status")
    .eq("published", true)
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Homepage events error:", error);
    return [];
  }

  const events = (data ?? []) as FeaturedEvent[];
  const upcoming = events.filter(isUpcomingEvent);
  const recentPast = events.filter((event) => !isUpcomingEvent(event)).reverse();

  return [...upcoming, ...recentPast].slice(0, 3);
}

export default async function HomeEventsSection() {
  const events = await getFeaturedEvents();

  return (
    <section className={styles.section} aria-labelledby="home-events-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Ideas brought to life</p>
            <h2 id="home-events-title" className={styles.title}>
              Our events<span>.</span>
            </h2>
            <p className={styles.subtitle}>
              Workshops, challenges, and moments that bring makers together.
            </p>
          </div>
          <Link className={styles.allEvents} href="/events">
            <span>Explore all events</span>
            <Iconify icon="lucide:arrow-up-right" className={styles.linkIcon} />
          </Link>
        </header>

        {events.length ? (
          <div className={styles.stack}>
            {events.map((event, index) => (
              <div
                className={styles.stickyCard}
                key={event.id}
                style={{ "--card-index": index } as CSSProperties}
              >
                <article className={styles.card}>
                  <div className={styles.imagePanel}>
                    {event.cover_image ? (
                      <Image
                        src={event.cover_image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 700px) 100vw, 45vw"
                        unoptimized
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.imageFallback} aria-hidden="true">
                        eY
                      </div>
                    )}
                    <span className={styles.imageIndex}>
                      0{index + 1} / 0{events.length}
                    </span>
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.cardMeta}>
                      <span>{event.event_type || "e-Yantra MSIT"}</span>
                      <span className={styles.metaDot} aria-hidden="true" />
                      <span>{formatEventDate(event.event_date)}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{event.title}</h3>
                    <p className={styles.cardDescription}>
                      {event.short_description ||
                        "A chance to learn, experiment, and build with the e-Yantra community."}
                    </p>
                    <Link className={styles.cardLink} href="/events">
                      Discover this event
                      <Iconify
                        icon="lucide:arrow-up-right"
                        className={styles.linkIcon}
                      />
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>New events are taking shape.</p>
            <span>Check back soon for the next opportunity to build together.</span>
          </div>
        )}
      </div>
    </section>
  );
}
