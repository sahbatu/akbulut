import { useEffect, useMemo, useState } from 'react'
import { siteSettings as fallbackSettings } from '@/data/seed'
import {
  buildCategoryJsonLd,
  mergeCategorySeo,
  suggestCanonicalUrl,
} from '@/lib/categorySeo'
import { isSupabaseConfigured } from '@/lib/supabaseConfig'
import type { Category, CategoryImage, CategorySeo, SeoPage } from '@/types'

function applyTemplate(text: string, vars: Record<string, string>) {
  return Object.entries(vars).reduce(
    (acc, [key, val]) => acc.replaceAll(`{${key}}`, val),
    text,
  )
}

function scheduleIdle(task: () => void, timeout = 2500) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(task, { timeout })
  }
  return setTimeout(task, 1) as unknown as number
}

export function useSeoPage(pageKey: string, templateVars?: Record<string, string>) {
  const [page, setPage] = useState<SeoPage | null>(null)
  const [globalOg, setGlobalOg] = useState('')
  const [siteName, setSiteName] = useState(fallbackSettings.seo_site_name)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const id = scheduleIdle(() => {
      void import('@/lib/supabase').then(({ supabase }) => {
        if (!supabase) return
        Promise.all([
          supabase.from('seo_pages').select('*').eq('page_key', pageKey).maybeSingle(),
          supabase
            .from('site_settings')
            .select('key, value')
            .in('key', ['seo_default_og_image', 'seo_site_name']),
        ]).then(([pageRes, settingsRes]) => {
          if (pageRes.data) setPage(pageRes.data as SeoPage)
          for (const row of settingsRes.data ?? []) {
            if (row.key === 'seo_default_og_image') {
              setGlobalOg(String(row.value).replace(/^"|"$/g, ''))
            }
            if (row.key === 'seo_site_name') {
              setSiteName(String(row.value).replace(/^"|"$/g, '') || 'Akbulut')
            }
          }
        })
      })
    })

    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(id as number)
      } else {
        clearTimeout(id as number)
      }
    }
  }, [pageKey])

  if (!page) return null

  const vars = { site_name: siteName, ...templateVars }
  return {
    title: applyTemplate(page.title ?? '', vars),
    description: applyTemplate(page.meta_description ?? '', vars),
    keywords: page.keywords ?? undefined,
    ogTitle: applyTemplate(page.og_title || page.title || '', vars),
    ogDescription: applyTemplate(page.og_description || page.meta_description || '', vars),
    ogImage: page.og_image_url || globalOg || undefined,
    canonical: page.canonical_url || undefined,
    robotsIndex: page.robots_index,
    robotsFollow: page.robots_follow,
    jsonLd: page.json_ld,
  }
}

interface UseCategorySeoOptions {
  slug: string
  category?: Pick<Category, 'name' | 'description' | 'slug' | 'image_url'> | null
  images?: CategoryImage[]
}

export function useCategorySeo({ slug, category, images = [] }: UseCategorySeoOptions) {
  const categoryName = category?.name ?? ''
  const template = useSeoPage('category_template', { category_name: categoryName })
  const [override, setOverride] = useState<CategorySeo | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !slug) return

    void import('@/lib/supabase').then(({ supabase }) => {
      if (!supabase) return
      supabase
        .from('category_seo')
        .select('*')
        .eq('category_slug', slug)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setOverride(data as CategorySeo)
          else setOverride(null)
        })
    })
  }, [slug])

  return useMemo(() => {
    if (!template && !override) return null

    const canonical = suggestCanonicalUrl(slug)
    const descriptionFallback =
      category?.description?.trim() ||
      (template?.description
        ? template.description
        : categoryName
          ? `${categoryName} ürünlerimizi inceleyin.`
          : undefined)

    const ogImageFallback = images[0]?.full_url || category?.image_url || undefined

    const jsonLd =
      category && slug
        ? buildCategoryJsonLd(
            { name: category.name, description: category.description, slug: category.slug },
            images,
            override?.canonical_url || canonical,
          )
        : null

    return mergeCategorySeo(template, override, {
      description: descriptionFallback,
      ogImage: ogImageFallback,
      canonical,
      jsonLd,
    })
  }, [template, override, slug, category, images, categoryName])
}
