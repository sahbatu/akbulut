import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance
}

export function scrollToTop(immediate = true) {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate })
    return
  }

  window.scrollTo({ top: 0, left: 0, behavior: immediate ? 'auto' : 'smooth' })
}

export function stopPageScroll() {
  lenisInstance?.stop()
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
}

export function startPageScroll() {
  lenisInstance?.start()
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
}
