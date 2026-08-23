import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import { getAllProjects } from '../lib/projects'
import type { Project } from '../types'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllProjects()
      .then(setProjects)
      .catch(() => setError('Could not load projects right now.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <p className="font-body text-sm text-rose uppercase tracking-wide">Featured work</p>
      <h1 className="font-display text-4xl text-ink mt-3">
        Making ideas look and work  <span className="font-script text-rose text-5xl">better.</span>
      </h1>

      {loading && <p className="font-body text-muted mt-10">Loading projects…</p>}
      {error && <p className="font-body text-red-600 mt-10">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p className="font-body text-muted mt-10">
          No projects added yet. Head to{' '}
          <Link to="/admin" className="text-rose underline">
            /admin
          </Link>{' '}
          to add your first one.
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}
