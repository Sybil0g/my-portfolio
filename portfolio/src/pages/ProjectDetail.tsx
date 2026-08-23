import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProjectById } from '../lib/projects'
import type { Project } from '../types'
import ImageCarousel from '../components/ImageCarousel'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    getProjectById(id)
      .then((p) => {
        if (!p) setNotFound(true)
        else setProject(p)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <p className="font-body text-muted max-w-4xl mx-auto px-6 py-20">Loading…</p>
  }

  if (notFound || !project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <p className="font-body text-muted">Couldn't find that project.</p>
        <Link to="/projects" className="text-rose underline font-body">
          ← Back to projects
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-20">
      <Link to="/projects" className="font-body text-sm text-rose hover:text-rose-deep">
        ← Back to projects
      </Link>

      <h1 className="font-display text-4xl sm:text-5xl text-ink mt-6">{project.title}</h1>
      <p className="font-body text-muted mt-3 max-w-2xl">{project.summary}</p>

      {project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {project.techStack.map((t) => (
            <span key={t} className="text-xs font-body px-3 py-1 rounded-full bg-blush-light text-rose-deep">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-6">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="font-body text-sm uppercase tracking-wide px-5 py-2.5 rounded-full bg-rose text-cream hover:bg-rose-deep transition-colors"
          >
            Live site ↗
          </a>
        )}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="font-body text-sm uppercase tracking-wide px-5 py-2.5 rounded-full border border-rose text-rose hover:bg-rose hover:text-cream transition-colors"
          >
            View code ↗
          </a>
        )}
      </div>

      {/* Tap any image to open it full-screen — arrows/swipe to move between them, tap again to zoom */}
      <ImageCarousel
        images={[project.thumbnailUrl, ...project.imageUrls].filter(Boolean)}
      />

      <div className="font-body text-ink/80 leading-relaxed mt-10 whitespace-pre-line">
        {project.description}
      </div>
    </article>
  )
}
