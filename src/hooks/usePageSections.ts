import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import type { TimelineItem, ValueItem } from '@/types'

const defaultTimeline: TimelineItem[] = [
  { year: '2006', title: 'Kuruluş', description: 'Akbulut Kırtasiye faaliyetlerine başladı.' },
  { year: '2010', title: 'Matbaa & Reklam', description: 'Matbaa ve reklam hizmetleri portföye eklendi.' },
  { year: '2014', title: 'Genişleme', description: 'Temizlik ve ofis gıda malzemeleri satışları başladı.' },
  { year: '2024', title: '18. Yıl', description: 'Kadıköy merkezli geniş ürün yelpazesiyle hizmet vermeye devam.' },
]

const defaultValues: ValueItem[] = [
  { icon: '◷', title: 'Zamanında Teslim', description: 'Sipariş edilen ürün ve hizmetlerin eksiksiz ve zamanında teslimi önceliğimizdir.' },
  { icon: '◈', title: 'Kalite Takibi', description: 'Her aşamada titiz kontrol ve takip ile arzu edilen kaliteyi garanti ediyoruz.' },
  { icon: '◇', title: 'Ekonomik Teklif', description: 'Taleplerinize uygun, makul ve en ekonomik teklifleri hazırlıyoruz.' },
  { icon: '◎', title: 'Paylaşım Odaklı', description: 'Kazanç değil başarı ve paylaşımı öncelikli prensip olarak benimsiyoruz.' },
]

export function usePageSection<T>(sectionKey: string, fallback: T) {
  const [content, setContent] = useState<T>(fallback)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('page_sections')
      .select('content')
      .eq('section_key', sectionKey)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) setContent(data.content as T)
        setLoading(false)
      })
  }, [sectionKey])

  return { content, loading }
}

export function useTimeline() {
  return usePageSection<TimelineItem[]>('timeline', defaultTimeline)
}

export function useValues() {
  return usePageSection<ValueItem[]>('values', defaultValues)
}
