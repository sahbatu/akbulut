import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { stopPageScroll, startPageScroll } from '@/lib/lenis'

interface LightboxImage {
  full_url: string
  thumb_url: string
  title?: string
  alt?: string
}

interface LightboxProps {
  images: LightboxImage[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null
  const current = index !== null ? images[index] : null
  const caption = current?.title ?? current?.alt ?? ''

  const goPrev = useCallback(() => {
    if (index === null) return
    onNavigate(index === 0 ? images.length - 1 : index - 1)
  }, [index, images.length, onNavigate])

  const goNext = useCallback(() => {
    if (index === null) return
    onNavigate(index === images.length - 1 ? 0 : index + 1)
  }, [index, images.length, onNavigate])

  useEffect(() => {
    if (!open) return
    stopPageScroll()
    return () => startPageScroll()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, goPrev, goNext])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/92 backdrop-blur-md"
            onClick={onClose}
            aria-label="Kapat"
          />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-12 h-12 flex items-center justify-center text-paper/70 hover:text-gold text-2xl transition-colors"
            aria-label="Kapat"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 border border-paper/20 flex items-center justify-center text-paper/70 hover:border-gold/50 hover:text-gold transition-colors"
                aria-label="Önceki"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 border border-paper/20 flex items-center justify-center text-paper/70 hover:border-gold/50 hover:text-gold transition-colors"
                aria-label="Sonraki"
              >
                →
              </button>
            </>
          )}

          <motion.div
            key={current.full_url}
            className="relative z-10 flex flex-col items-center max-w-[min(92vw,1100px)] mx-4"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.full_url}
              alt={caption}
              className="max-w-full max-h-[min(72vh,800px)] w-auto h-auto object-contain shadow-2xl"
            />

            {caption && (
              <div className="w-full mt-4 px-2 text-center">
                <p className="font-display text-lg md:text-xl text-paper">{caption}</p>
                {images.length > 1 && index !== null && (
                  <p className="mt-2 text-paper/40 text-xs tracking-widest">
                    {index + 1} / {images.length}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
