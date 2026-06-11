import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { PageTransition } from './PageTransition'
import { lazy, Suspense } from 'react'

const AnalyticsScripts = lazy(() =>
  import('@/components/seo/AnalyticsScripts').then((m) => ({ default: m.AnalyticsScripts })),
)
import { SiteBranding } from '@/components/seo/SiteBranding'
import { useLenis } from '@/hooks/useLenis'
import { useScrollToTop } from '@/hooks/useScrollToTop'

export function Layout() {
  useLenis()
  useScrollToTop()

  return (
    <>
      <SiteBranding />
      <Suspense fallback={null}>
        <AnalyticsScripts />
      </Suspense>
      <div className="grain-overlay" aria-hidden="true" />
      <Header />
      <main>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </>
  )
}
