import { Link } from 'react-router-dom'
import type { Project } from '../types'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-blush hover:border-rose transition-colors hover:-translate-y-1 duration-200"
    >
      <div className="aspect-[4/3] overflow-hidden bg-blush-light">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted font-body text-sm">
            No image yet
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-ink">{project.title}</h3>
        <p className="font-body text-sm text-muted mt-1 line-clamp-2">{project.summary}</p>
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {project.techStack.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-xs font-body px-2 py-1 rounded-full bg-blush-light text-rose-deep"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
