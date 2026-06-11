import { useEffect, useState } from 'react'
import { sliderImages } from '@/data/seed'
import { isSupabaseConfigured } from '@/lib/supabaseConfig'
import type { FeaturedShowcase, MediaSlide } from '@/types'

const seedSlides: MediaSlide[] = sliderImages.map((url, i) => ({
  id: `seed-${i}`,
  image_url: url,
  alt_text: null,
  sort_order: i + 1,
  is_active: true,
}))

const defaultFeatured: FeaturedShowcase = {
  eyebrow: 'Öne Çıkan',
  title: 'Mont Blanc',
  subtitle: 'Premium kırtasiye koleksiyonu',
}

export function useFeaturedShowcase() {
  const [featured, setFeatured] = useState<FeaturedShowcase>(defaultFeatured)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    void import('@/lib/supabase').then(({ supabase }) => {
      if (!supabase) {
        setLoading(false)
        return
      }
      supabase
        .from('page_sections')
        .select('content')
        .eq('section_key', 'featured_showcase')
        .maybeSingle()
        .then(({ data }) => {
          if (data?.content) {
            setFeatured({ ...defaultFeatured, ...(data.content as FeaturedShowcase) })
          }
          setLoading(false)
        })
    })
  }, [])

  return { featured, loading }
}

export function useMediaSlides() {
  const [slides, setSlides] = useState<MediaSlide[]>(isSupabaseConfigured ? [] : seedSlides)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    void import('@/lib/supabase').then(({ supabase }) => {
      if (!supabase) {
        setLoading(false)
        return
      }
      supabase
        .from('media_slides')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .then(({ data }) => {
          setSlides((data as MediaSlide[]) ?? [])
          setLoading(false)
        })
    })
  }, [])

  return { slides, loading }
}
