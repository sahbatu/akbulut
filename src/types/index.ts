export interface Category {
  id: string
  parent_id: string | null
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
  is_featured: boolean
}

export interface CategoryImage {
  id: string
  category_id: string
  thumb_url: string
  full_url: string
  title: string | null
  sort_order: number
}

export interface Announcement {
  id: string
  title: string
  excerpt: string
  published_at: string
}

export interface SiteSettings {
  company_name: string
  tagline: string
  about_short: string
  about_full: string
  address: string
  phones: string[]
  fax: string
  email: string
  map_embed_url: string
  years_experience: number
  logo_url: string
  logo_alt: string
  favicon_url: string
  ga_measurement_id: string
  gtm_container_id: string
  seo_site_name: string
  seo_default_og_image: string
  seo_twitter_handle: string
  robots_txt: string
}

export interface FooterSettings {
  brand_title: string
  brand_text: string
  copyright_text: string
  extra_links: { label: string; url: string }[]
}

export interface SeoPage {
  page_key: string
  title: string | null
  meta_description: string | null
  keywords: string | null
  og_title: string | null
  og_description: string | null
  og_image_url: string | null
  canonical_url: string | null
  robots_index: boolean
  robots_follow: boolean
  json_ld: Record<string, unknown> | null
}

export interface CategorySeo {
  category_slug: string
  title: string | null
  meta_description: string | null
  keywords: string | null
  og_title: string | null
  og_description: string | null
  og_image_url: string | null
  canonical_url: string | null
  robots_index: boolean
  robots_follow: boolean
  json_ld: Record<string, unknown> | null
}

export interface ContactSubmission {
  id: string
  name: string
  company: string
  phone: string
  email: string
  subject: string
  message: string
  is_read: boolean
  notes: string | null
  created_at: string
}

export interface MediaSlide {
  id: string
  image_url: string
  alt_text: string | null
  sort_order: number
  is_active: boolean
}

export interface FeaturedShowcase {
  eyebrow: string
  title: string
  subtitle: string
}

export interface TimelineItem {
  year: string
  title: string
  description: string
}

export interface ValueItem {
  icon: string
  title: string
  description: string
}

export type { ContactFormData } from '@/lib/contactFormSchema'
