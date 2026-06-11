import { useEffect } from 'react'
import Lenis from 'lenis'
import { setLenisInstance } from '@/lib/lenis'

export function useLenis() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let lenis: Lenis | null = null
    let rafId = 0

    const start = () => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        allowNestedScroll: true,
      })

      setLenisInstance(lenis)

      function raf(time: number) {
        lenis?.raf(time)
        rafId = requestAnimationFrame(raf)
      }

      rafId = requestAnimationFrame(raf)
    }

    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1))
    const idleId = idle(start)

    return () => {
      if (typeof idleId === 'number' && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId)
      }
      cancelAnimationFrame(rafId)
      lenis?.destroy()
      setLenisInstance(null)
    }
  }, [])
}
