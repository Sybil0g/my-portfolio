import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { createProject, updateProject } from '../../lib/projects'
import { uploadToImgBB, validateImageFile, ACCEPTED_IMAGE_TYPES } from '../../lib/imgbb'
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

// One gallery item as tracked in local state while it's being picked/uploaded.
interface GalleryItem {
  id: string
  url: string // final ImgBB url once uploaded, or a local object URL while uploading
  uploading: boolean
  error: string | null
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

  // Thumbnail: single image, auto-uploads on selection
  const [thumbnailPreview, setThumbnailPreview] = useState(form.thumbnailUrl)
  const [thumbnailUploading, setThumbnailUploading] = useState(false)
  const [thumbnailError, setThumbnailError] = useState('')
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  // Gallery: many images, each auto-uploads independently on selection
  const [gallery, setGallery] = useState<GalleryItem[]>(
    existing ? existing.imageUrls.map((url, i) => ({ id: `existing-${i}`, url, uploading: false, error: null })) : []
  )
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const anyUploading = thumbnailUploading || gallery.some((g) => g.uploading)

  // ---- Thumbnail: pick file -> preview immediately -> upload -> store ImgBB url ----
  const handleThumbnailSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      setThumbnailError(validationError)
      return
    }

    setThumbnailError('')
    const localPreview = URL.createObjectURL(file)
    setThumbnailPreview(localPreview)
    setThumbnailUploading(true)

    try {
      const uploadedUrl = await uploadToImgBB(file)
      setForm((f) => ({ ...f, thumbnailUrl: uploadedUrl }))
      setThumbnailPreview(uploadedUrl)
    } catch (err) {
      console.error(err)
      setThumbnailError(err instanceof Error ? err.message : 'Upload failed. Try again.')
      setThumbnailPreview(form.thumbnailUrl) // fall back to whatever was there before
    } finally {
      setThumbnailUploading(false)
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = ''
    }
  }

  // ---- Gallery: pick one or more files -> each gets its own preview + upload ----
  const handleGallerySelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    files.forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const validationError = validateImageFile(file)

      if (validationError) {
        setGallery((prev) => [...prev, { id, url: '', uploading: false, error: validationError }])
        return
      }

      const localPreview = URL.createObjectURL(file)
      setGallery((prev) => [...prev, { id, url: localPreview, uploading: true, error: null }])

      uploadToImgBB(file)
        .then((uploadedUrl) => {
          setGallery((prev) => prev.map((g) => (g.id === id ? { ...g, url: uploadedUrl, uploading: false } : g)))
        })
        .catch((err) => {
          console.error(err)
          setGallery((prev) =>
            prev.map((g) =>
              g.id === id
                ? { ...g, uploading: false, error: err instanceof Error ? err.message : 'Upload failed.' }
                : g
            )
          )
        })
    })

    if (galleryInputRef.current) galleryInputRef.current.value = ''
  }

  const removeGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (anyUploading) {
      setError('Please wait for all images to finish uploading before saving.')
      return
    }

    setSaving(true)
    try {
      const payload: ProjectFormData = {
        ...form,
        techStack: techInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        // Only keep gallery items that uploaded successfully (skip any that errored out)
        imageUrls: gallery.filter((g) => g.url && !g.error).map((g) => g.url),
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

      {/* Thumbnail: choose file -> preview -> auto-uploads to ImgBB -> URL stored automatically */}
      <div>
        <label className="font-body text-xs uppercase tracking-wide text-muted">
          Thumbnail image <span className="normal-case text-muted/70">(shown on the project card)</span>
        </label>

        <div className="flex items-center gap-4 mt-2">
          {thumbnailPreview ? (
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="w-24 h-20 object-cover rounded-lg border border-blush"
            />
          ) : (
            <div className="w-24 h-20 rounded-lg border border-dashed border-blush flex items-center justify-center text-muted text-xs font-body">
              No image
            </div>
          )}

          <div>
            <button
              type="button"
              onClick={() => thumbnailInputRef.current?.click()}
              disabled={thumbnailUploading}
              className="font-body text-xs uppercase tracking-wide px-4 py-2 rounded-full border border-blush hover:border-rose transition-colors disabled:opacity-60"
            >
              {thumbnailUploading ? 'Uploading…' : existing ? 'Replace image' : 'Choose image'}
            </button>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              onChange={handleThumbnailSelect}
              className="hidden"
            />
            {thumbnailError && <p className="font-body text-xs text-red-600 mt-1">{thumbnailError}</p>}
          </div>
        </div>
      </div>

      {/* Gallery: choose one or more files -> each previews and auto-uploads independently */}
      <div>
        <label className="font-body text-xs uppercase tracking-wide text-muted">
          Gallery images{' '}
          <span className="normal-case text-muted/70">
            (add as many as you want — shown as the tap-to-view carousel on the project page)
          </span>
        </label>

        <div className="flex flex-wrap gap-3 mt-2">
          {gallery.map((item) => (
            <div key={item.id} className="relative w-20 h-20">
              {item.url ? (
                <img
                  src={item.url}
                  alt="Gallery item"
                  className={`w-20 h-20 object-cover rounded-lg border ${
                    item.error ? 'border-red-300' : 'border-blush'
                  } ${item.uploading ? 'opacity-50' : ''}`}
                />
              ) : (
                <div className="w-20 h-20 rounded-lg border border-red-300 flex items-center justify-center bg-red-50">
                  <span className="font-body text-[10px] text-red-600 text-center px-1">Invalid</span>
                </div>
              )}
              {item.uploading && (
                <span className="absolute inset-0 flex items-center justify-center font-body text-[10px] text-ink bg-white/70 rounded-lg">
                  Uploading…
                </span>
              )}
              <button
                type="button"
                onClick={() => removeGalleryItem(item.id)}
                aria-label="Remove image"
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-ink text-cream text-xs flex items-center justify-center hover:bg-rose-deep transition-colors"
              >
                ×
              </button>
              {item.error && (
                <p className="font-body text-[10px] text-red-600 mt-1 w-20 leading-tight">{item.error}</p>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="w-20 h-20 rounded-lg border border-dashed border-blush hover:border-rose flex items-center justify-center font-body text-xs text-muted transition-colors"
          >
            + Add
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(',')}
            multiple
            onChange={handleGallerySelect}
            className="hidden"
          />
        </div>
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
          disabled={saving || anyUploading}
          className="font-body text-sm uppercase tracking-wide px-6 py-3 rounded-full bg-rose text-cream hover:bg-rose-deep transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : anyUploading ? 'Waiting for uploads…' : existing ? 'Save changes' : 'Add project'}
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
