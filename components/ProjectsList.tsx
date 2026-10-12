"use client";

import { useState } from "react";
import ProjectCard, { ProjectProps } from "./ProjectCard";

export default function ProjectsList({ projects }: { projects: ProjectProps[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean))),
  ];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      <div className="reveal flex flex-wrap justify-center gap-2 mb-16" id="project-filters">
        {categories.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as string)}
            className={`px-4 py-2 text-[10px] font-bold font-mono uppercase tracking-widest rounded-full border transition-all cursor-pointer ${
              activeFilter === filter
                ? "bg-[var(--accent-red)] text-white border-[var(--accent-red)] shadow-sm"
                : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-primary)]/30 hover:text-[var(--text-primary)] shadow-sm"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal"
        id="projects-container"
      >
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center text-[var(--text-secondary)] py-24 font-mono text-sm border border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg-surface)]">
            {"// NO REPOSITORIES FOUND IN THIS DISCIPLINE"}
          </div>
        ) : (
          filteredProjects.map((project, i) => (
            <div key={project.title + i} className={`stagger-${(i % 3) + 1}`}>
              <ProjectCard project={project} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
