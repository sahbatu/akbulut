import { Link, Navigate, useParams } from 'react-router-dom'
import { CategoryGallery } from '@/components/sections/CategoryGallery'
import { SeoHead } from '@/components/seo/SeoHead'
import { useCategoryBySlug } from '@/hooks/useCategoryBySlug'
import { useCategoryImages } from '@/hooks/useCategoryImages'
import { useCategorySeo } from '@/hooks/useSeo'

export function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { category, children, loading } = useCategoryBySlug(slug)
  const { images, loading: imagesLoading } = useCategoryImages(category?.id)
  const seo = useCategorySeo({
    slug: slug ?? '',
    category: category ?? null,
    images,
  })

  if (!loading && !category) {
    return <Navigate to="/urunlerimiz" replace />
  }

  const hasChildPages = children.length > 0
  const showGallery = !hasChildPages || images.length > 0

  return (
    <>
      {seo && <SeoHead {...seo} />}
      <section className="pt-24 pb-8 md:pt-28 md:pb-12">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          {hasChildPages && images.length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {children.map((child) => (
                <Link
                  key={child.id}
                  to={`/urunlerimiz/${child.slug}`}
                  className="group aspect-square border border-paper/10 hover:border-gold/40 bg-ink-light/30 transition-all duration-300 flex items-center justify-center p-4"
                >
                  <span className="font-display text-lg text-paper group-hover:text-gold transition-colors text-center">
                    {child.name}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {showGallery && (
            <CategoryGallery
              images={images}
              loading={loading || imagesLoading}
              categoryName={category?.name ?? ''}
            />
          )}
        </div>
      </section>
    </>
  )
}
