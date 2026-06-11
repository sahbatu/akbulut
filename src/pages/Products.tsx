import { useState, useMemo } from 'react'
import { PageSeo } from '@/components/seo/PageSeo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProductCategoryCard } from '@/components/sections/ProductCategoryCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCategories } from '@/hooks/useCategories'

export function Products() {
  const { rootCategories, getChildren, loading } = useCategories()
  const [search, setSearch] = useState('')

  const matchesSearch = useMemo(() => {
    const q = search.toLowerCase().trim()
    return (catId: string, name: string, slug: string) => {
      if (!q) return true
      if (name.toLowerCase().includes(q) || slug.includes(q)) return true
      return getChildren(catId).some(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.includes(q) ||
          getChildren(c.id).some(
            (n) => n.name.toLowerCase().includes(q) || n.slug.includes(q),
          ),
      )
    }
  }, [getChildren, search])

  const filtered = useMemo(() => {
    if (!search.trim()) return rootCategories
    return rootCategories.filter((cat) => matchesSearch(cat.id, cat.name, cat.slug))
  }, [rootCategories, matchesSearch, search])

  return (
    <>
      <PageSeo pageKey="products" />
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeading
            label="Ürünlerimiz"
            title="Geniş Ürün Yelpazesi"
            subtitle="Promosyondan matbaaya, kırtasiyeden tabelaya — ihtiyacınız olan her şey tek çatı altında."
          />

          <div className="relative max-w-md mb-12">
            <input
              type="search"
              placeholder="Kategori ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ink-light/50 border border-paper/10 px-5 py-3 pl-12 text-paper text-sm focus:outline-none focus:border-gold/50 transition-colors"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-paper/30">⌕</span>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-32">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-paper/50 text-center py-12">
              &quot;{search}&quot; için sonuç bulunamadı.
            </p>
          ) : (
            <div className="space-y-6">
              {filtered.map((cat) => (
                <ProductCategoryCard
                  key={cat.id}
                  category={cat}
                  children={getChildren(cat.id)}
                  getChildren={getChildren}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
