import Link from "next/link";
import Iconify from "@/components/Iconify";

type HomeProject = {
  title: string;
  image: string | null;
  category: string | null;
  description: string | null;
  techStack: string[] | null;
  href: string | null;
  githubUrl: string | null;
};

type HomeEvent = {
  title: string;
  type: string | null;
  description: string | null;
  date: string | null;
  href: string | null;
};

export default function HomeContent({
  projects,
  events,
}: {
  projects: HomeProject[];
  events: HomeEvent[];
}) {
  return (
    <div id="home-work" className="home-content">
      <section className="home-belief" aria-labelledby="home-belief-title">
        <p className="home-section-index">A place to make things real</p>
        <div>
          <h2 id="home-belief-title">
            Learn by
            <br />
            <span>making.</span>
          </h2>
          <p>
            From the first sketch to the last test run, we bring students
            together to build, break, and understand real robotic systems.
          </p>
          <Link href="/team" className="home-text-link">
            Meet the people behind it
            <Iconify icon="lucide:arrow-up-right" className="h-4 w-4" />
          </Link>
        </div>
        <div className="home-focus-list" aria-label="Our areas of work">
          <span><b>01</b> Robotics &amp; automation</span>
          <span><b>02</b> Embedded systems</span>
          <span><b>03</b> Design &amp; fabrication</span>
        </div>
      </section>

      <section className="home-projects" aria-labelledby="home-projects-title">
        <div className="home-section-heading">
          <div>
            <p className="home-section-index">Built at MSIT</p>
            <h2 id="home-projects-title">Selected projects</h2>
          </div>
          <Link href="/projects" className="home-text-link">
            All projects
            <Iconify icon="lucide:arrow-up-right" className="h-4 w-4" />
          </Link>
        </div>
        {projects.length > 0 ? (
          <div className="home-project-grid">
            {projects.map((project, index) => (
              <article className="home-project-card" key={`${project.title}-${index}`}>
                <div
                  className={`home-project-art home-project-art-${index + 1}`}
                  style={{
                    backgroundImage: project.image
                      ? `linear-gradient(180deg, rgba(17, 18, 20, 0.04), rgba(17, 18, 20, 0.55)), url(${JSON.stringify(project.image)})`
                      : undefined,
                  }}
                  aria-hidden="true"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="home-project-art-orbit" />
                  <span className="home-project-art-core" />
                </div>
                <div className="home-project-meta">
                  <span>{project.category || "Student project"}</span>
                  <span>{project.techStack?.slice(0, 2).join(" · ")}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description || "An engineering project built by e-Yantra MSIT students."}</p>
                <Link
                  href={project.href || project.githubUrl || "/projects"}
                  className="home-project-link"
                  target={
                    /^https?:\/\//.test(project.href || project.githubUrl || "")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    /^https?:\/\//.test(project.href || project.githubUrl || "")
                      ? "noreferrer"
                      : undefined
                  }
                  aria-label={`Explore ${project.title}`}
                >
                  Explore project <Iconify icon="lucide:arrow-up-right" className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="home-empty-projects">
            <p>Projects from the workbench will appear here.</p>
            <Link href="/projects" className="home-text-link">
              Explore projects <Iconify icon="lucide:arrow-up-right" className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      <section className="home-events" aria-labelledby="home-events-title">
        <div className="home-events-heading">
          <div>
            <p className="home-section-index">Around the workbench</p>
            <h2 id="home-events-title">What&apos;s happening</h2>
          </div>
          <Link href="/events" className="home-text-link">
            Event archive
            <Iconify icon="lucide:arrow-up-right" className="h-4 w-4" />
          </Link>
        </div>
        {events.length > 0 ? (
          <div className="home-event-list">
            {events.slice(0, 3).map((event, index) => (
              <Link
                href={event.href || "/events"}
                className="home-event-row"
                key={`${event.title}-${index}`}
                target={/^https?:\/\//.test(event.href || "") ? "_blank" : undefined}
                rel={/^https?:\/\//.test(event.href || "") ? "noreferrer" : undefined}
              >
                <span className="home-event-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="home-event-type">{event.type || "e-Yantra MSIT"}</span>
                <span className="home-event-title">
                  <strong>{event.title}</strong>
                  <small>{event.description}</small>
                </span>
                <span className="home-event-date">{event.date || "Explore event"}</span>
                <Iconify icon="lucide:arrow-up-right" className="home-event-arrow h-4 w-4" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="home-empty-events">
            <p>Workshops, showcases and build days from our community.</p>
            <Link href="/events" className="home-text-link">
              Explore events <Iconify icon="lucide:arrow-up-right" className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      <section className="home-join" aria-labelledby="home-join-title">
        <p className="home-section-index">Curiosity welcome</p>
        <h2 id="home-join-title">Make your next idea move.</h2>
        <Link href="/team" className="home-join-link">
          Find your people <Iconify icon="lucide:arrow-up-right" className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
