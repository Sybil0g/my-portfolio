import { useRef, useState } from 'react'
import Lightbox from './Lightbox'

export default function ImageCarousel({ images }: { images: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('[data-carousel-item]') as HTMLElement | null
    const amount = card ? card.offsetWidth + 16 : track.offsetWidth * 0.8
    track.scrollBy({ left: amount * direction, behavior: 'smooth' })
  }

  return (
    <div className="relative mt-10">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {images.map((url, i) => (
          <button
            key={i}
            data-carousel-item
            onClick={() => setLightboxIndex(i)}
            className="snap-start shrink-0 w-[80%] sm:w-[60%] md:w-[45%] aspect-[4/3] rounded-2xl overflow-hidden border border-blush cursor-zoom-in"
            aria-label={`Open image ${i + 1} of ${images.length}`}
          >
            <img
              src={url}
              alt={`Screenshot ${i + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </button>
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full border border-blush hover:border-rose text-ink flex items-center justify-center transition-colors"
          >
            ‹
          </button>
          <button
            onClick={() => scrollByCard(1)}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full border border-blush hover:border-rose text-ink flex items-center justify-center transition-colors"
          >
            ›
          </button>
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox images={images} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  )
}
