import { useState, type FormEvent } from 'react'
import { createProject, updateProject } from '../../lib/projects'
import type { Project, ProjectFormData } from '../../types'

interface Props {
  existing?: Project | null
  onDone: () => void
  onCancel: () => void
}

const emptyForm: ProjectFormData = {
  title: '',
  summary: '',
  description: '',
  thumbnailUrl: '',
  imageUrls: [],
  techStack: [],
  liveUrl: '',
  repoUrl: '',
  order: 0,
  featured: false,
}

export default function ProjectForm({ existing, onDone, onCancel }: Props) {
  const [form, setForm] = useState<ProjectFormData>(
    existing
      ? {
          title: existing.title,
          summary: existing.summary,
          description: existing.description,
          thumbnailUrl: existing.thumbnailUrl,
          imageUrls: existing.imageUrls,
          techStack: existing.techStack,
          liveUrl: existing.liveUrl ?? '',
          repoUrl: existing.repoUrl ?? '',
          order: existing.order,
          featured: existing.featured,
        }
      : emptyForm
  )
  const [techInput, setTechInput] = useState(form.techStack.join(', '))
  // One image URL per line - as many as you want, this is not capped.
  const [galleryInput, setGalleryInput] = useState(form.imageUrls.join('\n'))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload: ProjectFormData = {
        ...form,
        techStack: techInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        imageUrls: galleryInput
          .split('\n')
          .map((u) => u.trim())
          .filter(Boolean),
      }

      if (existing) {
        await updateProject(existing.id, payload)
      } else {
        await createProject(payload)
      }
      onDone()
    } catch (err) {
      console.error(err)
      setError('Something went wrong saving this project. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-blush rounded-2xl p-6 space-y-5">
      <h2 className="font-display text-2xl text-ink">{existing ? 'Edit project' : 'Add a new project'}</h2>

      <div>
        <label className="font-body text-xs uppercase tracking-wide text-muted">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full mt-1 px-4 py-2.5 rounded-lg border border-blush focus:outline-none focus:border-rose font-body"
        />
      </div>

      <div>
        <label className="font-body text-xs uppercase tracking-wide text-muted">
          Short summary <span className="normal-case text-muted/70">(shown on the project card)</span>
        </label>
        <input
          required
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          className="w-full mt-1 px-4 py-2.5 rounded-lg border border-blush focus:outline-none focus:border-rose font-body"
        />
      </div>

      <div>
        <label className="font-body text-xs uppercase tracking-wide text-muted">
          Full description <span className="normal-case text-muted/70">(shown on the project's own page)</span>
        </label>
        <textarea
          required
          rows={5}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full mt-1 px-4 py-2.5 rounded-lg border border-blush focus:outline-none focus:border-rose font-body"
        />
      </div>

      <div>
        <label className="font-body text-xs uppercase tracking-wide text-muted">
          Thumbnail image URL <span className="normal-case text-muted/70">(shown on the project card)</span>
        </label>
        <input
          value={form.thumbnailUrl}
          onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
          placeholder="https://i.ibb.co/your-image.jpg"
          className="w-full mt-1 px-4 py-2.5 rounded-lg border border-blush focus:outline-none focus:border-rose font-body"
        />
        <p className="font-body text-xs text-muted mt-1">
          Upload your screenshot to a free image host (e.g. <span className="text-rose">imgbb.com</span> — no
          account needed) and paste the direct image link here.
        </p>
        {form.thumbnailUrl && (
          <img
            src={form.thumbnailUrl}
            alt="thumbnail preview"
            className="w-32 h-24 object-cover rounded-lg mt-2"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        )}
      </div>

      <div>
        <label className="font-body text-xs uppercase tracking-wide text-muted">
          Gallery images{' '}
          <span className="normal-case text-muted/70">
            (paste one image URL per line — add as many as you want, this becomes the tap-to-view carousel on the
            project page)
          </span>
        </label>
        <textarea
          rows={6}
          value={galleryInput}
          onChange={(e) => setGalleryInput(e.target.value)}
          placeholder={'https://i.ibb.co/screenshot-1.jpg\nhttps://i.ibb.co/screenshot-2.jpg\nhttps://i.ibb.co/screenshot-3.jpg'}
          className="w-full mt-1 px-4 py-2.5 rounded-lg border border-blush focus:outline-none focus:border-rose font-body"
        />
        {galleryInput.trim() && (
          <div className="flex flex-wrap gap-2 mt-2">
            {galleryInput
              .split('\n')
              .map((u) => u.trim())
              .filter(Boolean)
              .map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`preview ${i + 1}`}
                  className="w-16 h-16 object-cover rounded-lg border border-blush"
                  onError={(e) => (e.currentTarget.style.opacity = '0.2')}
                />
              ))}
          </div>
        )}
      </div>

      <div>
        <label className="font-body text-xs uppercase tracking-wide text-muted">
          Tech stack <span className="normal-case text-muted/70">(comma-separated, e.g. React, Firebase)</span>
        </label>
        <input
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          className="w-full mt-1 px-4 py-2.5 rounded-lg border border-blush focus:outline-none focus:border-rose font-body"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="font-body text-xs uppercase tracking-wide text-muted">Live URL (optional)</label>
          <input
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-blush focus:outline-none focus:border-rose font-body"
          />
        </div>
        <div>
          <label className="font-body text-xs uppercase tracking-wide text-muted">Repo URL (optional)</label>
          <input
            value={form.repoUrl}
            onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-blush focus:outline-none focus:border-rose font-body"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-center">
        <div>
          <label className="font-body text-xs uppercase tracking-wide text-muted">
            Order <span className="normal-case text-muted/70">(lower shows first)</span>
          </label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-blush focus:outline-none focus:border-rose font-body"
          />
        </div>
        <label className="flex items-center gap-2 font-body text-sm mt-5">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Feature on landing page
        </label>
      </div>

      {error && <p className="font-body text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="font-body text-sm uppercase tracking-wide px-6 py-3 rounded-full bg-rose text-cream hover:bg-rose-deep transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : existing ? 'Save changes' : 'Add project'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-body text-sm uppercase tracking-wide px-6 py-3 rounded-full border border-blush text-ink hover:border-rose transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
