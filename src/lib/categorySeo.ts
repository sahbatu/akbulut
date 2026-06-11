import type { Category, CategoryImage, CategorySeo } from '@/types'

const SITE_NAME = 'Akbulut'

export type CategorySeoForm = Omit<CategorySeo, 'updated_at'>

export function emptyCategorySeo(slug: string): CategorySeoForm {
  return {
    category_slug: slug,
    title: null,
    meta_description: null,
    keywords: null,
    og_title: null,
    og_description: null,
    og_image_url: null,
    canonical_url: null,
    robots_index: true,
    robots_follow: true,
    json_ld: null,
  }
}

export function categoryPagePath(slug: string) {
  return `/urunlerimiz/${slug}`
}

const DEFAULT_SITE_ORIGIN =
  (typeof import.meta !== 'undefined' &&
    (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '')) ||
  'https://akbulutltd.com'

export function suggestCanonicalUrl(slug: string) {
  if (typeof window !== 'undefined' && window.location.origin !== 'http://localhost:5173') {
    return `${window.location.origin}${categoryPagePath(slug)}`
  }
  return `${DEFAULT_SITE_ORIGIN}${categoryPagePath(slug)}`
}

export function buildDefaultCategorySeo(
  name: string,
  slug: string,
  description?: string | null,
  pathNames: string[] = [],
): CategorySeoForm {
  const desc =
    description?.trim() ||
    `${name} ürünlerimizi inceleyin. Akbulut ile kurumsal baskı, promosyon ve kırtasiye çözümleri.`

  const keywords = [name, ...pathNames.filter((p) => p !== name), 'akbulut', 'ürünler']
    .filter(Boolean)
    .join(', ')

  return {
    category_slug: slug,
    title: `${name} | ${SITE_NAME}`,
    meta_description: desc.slice(0, 160),
    keywords,
    og_title: `${name} | ${SITE_NAME}`,
    og_description: desc.slice(0, 200),
    og_image_url: null,
    canonical_url: suggestCanonicalUrl(slug),
    robots_index: true,
    robots_follow: true,
    json_ld: null,
  }
}

export function buildCategoryJsonLd(
  category: Pick<Category, 'name' | 'description' | 'slug'>,
  images: CategoryImage[],
  canonicalUrl: string,
) {
  const page: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description || undefined,
    url: canonicalUrl,
  }

  if (images.length > 0) {
    page.mainEntity = {
      '@type': 'ItemList',
      numberOfItems: images.length,
      itemListElement: images.map((image, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: image.title?.trim() || `${category.name} ${index + 1}`,
          image: image.full_url,
        },
      })),
    }
  }

  return page
}

export function mergeCategorySeo(
  template: {
    title?: string
    description?: string
    keywords?: string
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
    canonical?: string
    robotsIndex?: boolean
    robotsFollow?: boolean
    jsonLd?: Record<string, unknown> | null
  } | null,
  override: CategorySeo | null,
  fallbacks: {
    description?: string | null
    ogImage?: string | null
    canonical?: string
    jsonLd?: Record<string, unknown> | null
  } = {},
) {
  if (!template && !override) return null

  return {
    title: override?.title ?? template?.title,
    description: override?.meta_description ?? fallbacks.description ?? template?.description,
    keywords: override?.keywords ?? template?.keywords,
    ogTitle: override?.og_title ?? override?.title ?? template?.ogTitle,
    ogDescription:
      override?.og_description ?? override?.meta_description ?? template?.ogDescription,
    ogImage: override?.og_image_url ?? fallbacks.ogImage ?? template?.ogImage,
    canonical: override?.canonical_url ?? fallbacks.canonical ?? template?.canonical,
    robotsIndex: override?.robots_index ?? template?.robotsIndex ?? true,
    robotsFollow: override?.robots_follow ?? template?.robotsFollow ?? true,
    jsonLd: override?.json_ld ?? fallbacks.jsonLd ?? template?.jsonLd,
  }
}
