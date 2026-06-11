import { useState, useEffect, useCallback } from 'react'
import { useFeaturedShowcase, useMediaSlides } from '@/hooks/useMediaSlides'

export function MontBlancCarousel() {
  const { featured } = useFeaturedShowcase()
  const { slides } = useMediaSlides()
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, slides.length])

  useEffect(() => {
    setCurrent(0)
  }, [slides.length])

  if (slides.length === 0) return null

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-gold text-xs tracking-[0.3em] uppercase">{featured.eyebrow}</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-paper mt-2">
              {featured.title}
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={prev}
              className="w-12 h-12 border border-paper/10 flex items-center justify-center text-paper/60 hover:border-gold/40 hover:text-gold transition-all"
              aria-label="Önceki"
            >
              ←
            </button>
            <button
              onClick={next}
              className="w-12 h-12 border border-paper/10 flex items-center justify-center text-paper/60 hover:border-gold/40 hover:text-gold transition-all"
              aria-label="Sonraki"
            >
              →
            </button>
          </div>
        </div>

        <div className="relative aspect-[16/7] overflow-hidden bg-ink-light">
          {slides.map((slide, i) => (
            <img
              key={slide.id}
              src={slide.image_url}
              alt={slide.alt_text || `${featured.title} vitrin ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
                i === current ? 'opacity-100' : 'opacity-0'
              }`}
              fetchPriority={i === 0 ? 'high' : 'low'}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/20 pointer-events-none" />

          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
            <span className="font-display text-2xl md:text-3xl text-paper/90">{featured.title}</span>
            <p className="text-paper/50 text-sm mt-1">{featured.subtitle}</p>
          </div>

          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => setCurrent(i)}
                className={`h-px transition-all duration-300 ${
                  i === current ? 'w-8 bg-gold' : 'w-4 bg-paper/30 hover:bg-paper/50'
                }`}
                aria-label={`Slayt ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
