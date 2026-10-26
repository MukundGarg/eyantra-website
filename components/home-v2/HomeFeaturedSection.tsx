import Image from "next/image";
import Link from "next/link";
import Iconify from "@/components/Iconify";
import type { Event, Project } from "@/types/index";
import { supabase } from "@/utils/supabase";
import styles from "./HomeFeaturedSection.module.css";

type RecentUpdate = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  createdAt: string;
  category: string;
  href: "/events" | "/projects";
};

type RecentEvent = Pick<
  Event,
  "id" | "title" | "short_description" | "cover_image" | "created_at" | "event_type"
>;

type RecentProject = Pick<
  Project,
  "id" | "title" | "short_description" | "cover_image" | "created_at" | "category"
>;

async function getRecentUpdates(): Promise<RecentUpdate[]> {
  const [eventsResult, projectsResult] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, short_description, cover_image, created_at, event_type")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("projects")
      .select("id, title, short_description, cover_image, created_at, category")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  if (eventsResult.error) {
    console.error("Homepage featured events error:", eventsResult.error);
  }
  if (projectsResult.error) {
    console.error("Homepage featured projects error:", projectsResult.error);
  }

  const events = (eventsResult.data ?? []) as RecentEvent[];
  const projects = (projectsResult.data ?? []) as RecentProject[];
  const updates: RecentUpdate[] = [
    ...events.map((event) => ({
      id: `event-${event.id}`,
      title: event.title,
      description: event.short_description,
      image: event.cover_image,
      createdAt: event.created_at,
      category: event.event_type || "Society update",
      href: "/events" as const,
    })),
    ...projects.map((project) => ({
      id: `project-${project.id}`,
      title: project.title,
      description: project.short_description,
      image: project.cover_image,
      createdAt: project.created_at,
      category: project.category || "Project",
      href: "/projects" as const,
    })),
  ];

  return updates
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    )
    .slice(0, 3);
}

function formatUpdateDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Recently added";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export default async function HomeFeaturedSection() {
  const updates = await getRecentUpdates();

  return (
    <section className={styles.section} aria-labelledby="home-featured-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Latest from the society</p>
            <h2 className={styles.title} id="home-featured-title">
              Featured<span>.</span>
            </h2>
          </div>
          <p className={styles.intro}>
            New builds, events, and moments from the e-Yantra MSIT community.
          </p>
        </header>

        {updates.length ? (
          <div className={styles.grid}>
            {updates.map((update, index) => (
              <Link
                className={styles.card}
                href={update.href}
                key={update.id}
              >
                <div className={styles.imageFrame}>
                  {update.image ? (
                    <Image
                      src={update.image}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 88vw, (max-width: 1000px) 45vw, 30vw"
                      unoptimized
                      className={styles.image}
                    />
                  ) : (
                    <span className={styles.imageFallback} aria-hidden="true">
                      eY
                    </span>
                  )}
                  <span className={styles.imageIndex}>
                    0{index + 1} / 0{updates.length}
                  </span>
                </div>
                <div className={styles.cardCopy}>
                  <div className={styles.meta}>
                    <span>{update.category}</span>
                    <time dateTime={update.createdAt}>
                      {formatUpdateDate(update.createdAt)}
                    </time>
                  </div>
                  <h3>{update.title}</h3>
                  <p>
                    {update.description ||
                      "Discover what the e-Yantra MSIT community has been building."}
                  </p>
                  <span className={styles.cardLink}>
                    {update.href === "/events" ? "Explore event" : "View project"}
                    <Iconify icon="lucide:arrow-up-right" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Fresh updates are on the way.</p>
            <span>
              Explore the society’s events and projects in the meantime.
            </span>
            <div>
              <Link href="/events">Events</Link>
              <Link href="/projects">Projects</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
