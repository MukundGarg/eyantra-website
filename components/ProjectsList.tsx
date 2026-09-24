'use client'

import { useState } from 'react'
import ProjectCard, { ProjectProps } from './ProjectCard'

export default function ProjectsList({ projects }: { projects: ProjectProps[] }) {
  const [activeFilter, setActiveFilter] = useState('All')

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))]

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter)

  return (
    <>
      <div className="reveal flex flex-wrap justify-center gap-2 mb-12" id="project-filters">
        {categories.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as string)}
            className={`px-4 py-1.5 text-[10px] font-bold font-mono uppercase tracking-widest rounded border transition-all cursor-pointer ${
              activeFilter === filter
                ? "bg-[#d83a32] text-white border-[#d83a32]"
                : "bg-transparent text-[#A6AAAE] border-[#292D32] hover:border-white/20 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal" id="projects-container">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full text-center text-[#A6AAAE] py-20 font-mono">
            No projects found in this category.
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
  )
}
