import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbox } from '@/components/ui/Lightbox'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProductCard, getProductTitle } from '@/components/sections/ProductCard'
import type { CategoryImage } from '@/types'
import { staggerContainer } from '@/lib/animations'

interface CategoryGalleryProps {
  images: CategoryImage[]
  loading?: boolean
  categoryName: string
}

function ProductCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-paper/5 bg-ink-light">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="p-4">
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  )
}

export function CategoryGallery({ images, loading, categoryName }: CategoryGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-paper px-6 py-16 text-center shadow-sm">
        <p className="font-display text-2xl text-ink/85 mb-2">Mevcut ürün yok</p>
        <p className="text-ink/50 text-sm max-w-md mx-auto">
          Bu kategori için henüz ürün görseli eklenmemiş. Diğer kategorilerimize göz atabilir veya
          teklif almak için bizimle iletişime geçebilirsiniz.
        </p>
      </div>
    )
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {images.map((image, i) => (
          <ProductCard
            key={image.id}
            image={image}
            categoryName={categoryName}
            index={i}
            onClick={() => setLightboxIndex(i)}
          />
        ))}
      </motion.div>

      <Lightbox
        images={images.map((img) => ({
          full_url: img.full_url,
          thumb_url: img.thumb_url,
          title: getProductTitle(img, categoryName),
        }))}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  )
}
