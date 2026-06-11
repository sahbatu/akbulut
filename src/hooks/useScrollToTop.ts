import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToTop } from '@/lib/lenis'

export function useScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    scrollToTop(true)
  }, [pathname])
}
