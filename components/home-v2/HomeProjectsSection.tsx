import Iconify from "@/components/Iconify";
import Link from "next/link";
import type { Project } from "@/types/index";
import { supabase } from "@/utils/supabase";
import ProjectCardStack from "./ProjectCardStack";
import styles from "./HomeProjectsSection.module.css";

type FeaturedProject = Pick<
  Project,
  | "id"
  | "title"
  | "short_description"
  | "category"
  | "tech_stack"
  | "cover_image"
  | "demo_url"
  | "github_url"
  | "year"
>;

async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, short_description, category, tech_stack, cover_image, demo_url, github_url, year",
    )
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("display_order", { ascending: true })
    .limit(5);

  if (error) {
    console.error("Homepage projects error:", error);
    return [];
  }

  return (data ?? []) as FeaturedProject[];
}

export default async function HomeProjectsSection() {
  const projects = await getFeaturedProjects();

  return (
    <section className={styles.section} aria-labelledby="home-projects-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Selected student work</p>
          <h2 id="home-projects-title" className={styles.title}>
            Ideas made
            <span> tangible.</span>
          </h2>
          <p className={styles.description}>
            From first sketches to working machines, these projects are built
            by students who love figuring out how things work.
          </p>
          <Link className={styles.allProjects} href="/projects">
            <span>Explore all projects</span>
            <Iconify icon="lucide:arrow-up-right" className={styles.arrow} />
          </Link>
        </div>

        <div className={styles.showcase}>
          {projects.length ? (
            <ProjectCardStack projects={projects} />
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyMark} aria-hidden="true">
                eY
              </span>
              <p>Our next build is taking shape.</p>
              <span>Explore the project archive to see what we have made.</span>
              <Link href="/projects">Visit projects</Link>
            </div>
          )}
        </div>
      </div>
      <span className={styles.sectionIndex} aria-hidden="true">
        03 / THE WORK
      </span>
    </section>
  );
}
