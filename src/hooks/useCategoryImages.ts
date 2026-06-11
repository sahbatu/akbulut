import { useEffect, useState } from 'react'
import categoryImagesFallback from '@/data/category-images.json'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { CategoryImage } from '@/types'

const fallback = (categoryImagesFallback as Omit<CategoryImage, 'title'>[]).map(
  (img) => ({ ...img, title: null }),
)

export function useCategoryImages(categoryId: string | undefined) {
  const [images, setImages] = useState<CategoryImage[]>([])
  const [loading, setLoading] = useState(Boolean(categoryId))

  useEffect(() => {
    if (!categoryId) {
      setImages([])
      setLoading(false)
      return
    }

    const local = fallback
      .filter((img) => img.category_id === categoryId)
      .sort((a, b) => a.sort_order - b.sort_order)

    if (!isSupabaseConfigured || !supabase) {
      setImages(local)
      setLoading(false)
      return
    }

    const id = categoryId

    async function fetchImages() {
      const { data, error } = await supabase!
        .from('category_images')
        .select('*')
        .eq('category_id', id)
        .order('sort_order', { ascending: true })

      if (error || !data?.length) {
        setImages(local)
      } else {
        setImages(data as CategoryImage[])
      }
      setLoading(false)
    }

    setLoading(true)
    fetchImages()
  }, [categoryId])

  return { images, loading }
}
