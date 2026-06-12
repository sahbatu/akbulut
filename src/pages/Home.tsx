import { lazy, Suspense } from 'react'
import { PageSeo } from '@/components/seo/PageSeo'
import { Hero } from '@/components/sections/Hero'
import { LazySection } from '@/components/ui/LazySection'
import { useCategories } from '@/hooks/useCategories'
import { useSiteData } from '@/hooks/useSiteData'

const MontBlancCarousel = lazy(() =>
  import('@/components/sections/MontBlancCarousel').then((m) => ({ default: m.MontBlancCarousel })),
)
const CategoryBand = lazy(() =>
  import('@/components/sections/CategoryBand').then((m) => ({ default: m.CategoryBand })),
)
const AboutTeaser = lazy(() =>
  import('@/components/sections/AboutTeaser').then((m) => ({ default: m.AboutTeaser })),
)
const Announcements = lazy(() =>
  import('@/components/sections/Announcements').then((m) => ({ default: m.Announcements })),
)
const CtaBand = lazy(() =>
  import('@/components/sections/CtaBand').then((m) => ({ default: m.CtaBand })),
)

export function Home() {
  const { rootCategories, loading: categoriesLoading } = useCategories()
  const { settings, announcements } = useSiteData()

  return (
    <>
      <PageSeo pageKey="home" />
      <Hero tagline={settings.tagline} categories={rootCategories} />
      <LazySection minHeight={420}>
        <Suspense fallback={null}>
          <MontBlancCarousel />
        </Suspense>
      </LazySection>
      <LazySection minHeight={280}>
        <Suspense fallback={null}>
          <CategoryBand categories={rootCategories} loading={categoriesLoading} />
        </Suspense>
      </LazySection>
      <LazySection minHeight={200}>
        <Suspense fallback={null}>
          <AboutTeaser text={settings.about_short} />
        </Suspense>
      </LazySection>
      <LazySection minHeight={240}>
        <Suspense fallback={null}>
          <Announcements items={announcements} />
        </Suspense>
      </LazySection>
      <LazySection minHeight={160}>
        <Suspense fallback={null}>
          <CtaBand />
        </Suspense>
      </LazySection>
    </>
  )
}
