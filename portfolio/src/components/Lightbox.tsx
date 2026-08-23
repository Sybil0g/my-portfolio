import { useEffect, useState } from 'react'

interface Props {
  images: string[]
  startIndex: number
  onClose: () => void
}

export default function Lightbox({ images, startIndex, onClose }: Props) {
  const [index, setIndex] = useState(startIndex)
  const [zoomed, setZoomed] = useState(false)

  const goNext = () => {
    setZoomed(false)
    setIndex((i) => (i + 1) % images.length)
  }
  const goPrev = () => {
    setZoomed(false)
    setIndex((i) => (i - 1 + images.length) % images.length)
  }

  // Keyboard support: arrows to navigate, escape to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length])

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-cream/80 hover:text-cream text-3xl leading-none w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
      >
        ×
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 font-body text-xs uppercase tracking-wide text-cream/70">
          {index + 1} / {images.length}
        </div>
      )}

      {/* Previous */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            goPrev()
          }}
          aria-label="Previous image"
          className="absolute left-2 sm:left-6 text-cream/80 hover:text-cream text-3xl w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          ‹
        </button>
      )}

      {/* Image — click toggles zoom, doesn't close the lightbox */}
      <div
        className="max-w-[90vw] max-h-[85vh] overflow-auto flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[index]}
          alt={`Image ${index + 1} of ${images.length}`}
          onClick={() => setZoomed((z) => !z)}
          className={`transition-transform duration-200 rounded-md ${
            zoomed ? 'max-w-none cursor-zoom-out scale-150' : 'max-w-[90vw] max-h-[85vh] object-contain cursor-zoom-in'
          }`}
        />
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            goNext()
          }}
          aria-label="Next image"
          className="absolute right-2 sm:right-6 text-cream/80 hover:text-cream text-3xl w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          ›
        </button>
      )}

      {/* Zoom hint */}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-body text-xs text-cream/50 uppercase tracking-wide hidden sm:block">
        Tap image to {zoomed ? 'zoom out' : 'zoom in'} · Arrow keys to navigate · Esc to close
      </p>
    </div>
  )
}
