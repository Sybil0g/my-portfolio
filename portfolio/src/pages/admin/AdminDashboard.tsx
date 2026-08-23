import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { deleteProject, getAllProjects } from '../../lib/projects'
import type { Project } from '../../types'
import ProjectForm from './ProjectForm'

export default function AdminDashboard() {
  const { logout, user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Project | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => {
    setLoading(true)
    getAllProjects()
      .then(setProjects)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (project: Project) => {
    if (!confirm(`Delete "${project.title}"? This can't be undone.`)) return
    await deleteProject(project.id)
    load()
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    load()
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-ink">Admin dashboard</h1>
          <p className="font-body text-sm text-muted mt-1">Signed in as {user?.email}</p>
        </div>
        <div className="flex gap-3">
          {!showForm && (
            <button
              onClick={() => {
                setEditing(null)
                setShowForm(true)
              }}
              className="font-body text-sm uppercase tracking-wide px-5 py-2.5 rounded-full bg-rose text-cream hover:bg-rose-deep transition-colors"
            >
              + Add project
            </button>
          )}
          <button
            onClick={logout}
            className="font-body text-sm uppercase tracking-wide px-5 py-2.5 rounded-full border border-blush text-ink hover:border-rose transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-8">
          <ProjectForm existing={editing} onDone={closeForm} onCancel={closeForm} />
        </div>
      )}

      <div className="mt-10 space-y-3">
        {loading && <p className="font-body text-muted">Loading projects…</p>}
        {!loading && projects.length === 0 && (
          <p className="font-body text-muted">No projects yet — add your first one above.</p>
        )}
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 bg-white border border-blush rounded-xl p-4"
          >
            <div className="w-20 h-16 rounded-lg overflow-hidden bg-blush-light shrink-0">
              {p.thumbnailUrl && (
                <img src={p.thumbnailUrl} alt={p.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-lg text-ink truncate">{p.title}</p>
              <p className="font-body text-xs text-muted truncate">
                {p.summary} {p.featured && <span className="text-rose">· Featured</span>}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => {
                  setEditing(p)
                  setShowForm(true)
                }}
                className="font-body text-xs uppercase tracking-wide px-4 py-2 rounded-full border border-blush hover:border-rose transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p)}
                className="font-body text-xs uppercase tracking-wide px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
