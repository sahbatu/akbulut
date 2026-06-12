import type { Category } from '@/types'

export interface HeroPanel {
  slug: string
  label: string
  image: string
}

/** Ana sayfa hero — dört kök kategori kolajı */
export const heroPanelDefaults: HeroPanel[] = [
  {
    slug: 'promosyon',
    label: 'Promosyon',
    image: '/hero/promosyon.webp',
  },
  {
    slug: 'matbaa',
    label: 'Matbaa',
    image: '/hero/matbaa.webp',
  },
  {
    slug: 'kirtasiye',
    label: 'Kırtasiye',
    image: '/hero/kirtasiye.webp',
  },
  {
    slug: 'tabela',
    label: 'Tabela',
    image: '/hero/tabela.webp',
  },
]

export function resolveHeroPanels(categories: Category[]): HeroPanel[] {
  const bySlug = new Map(categories.map((c) => [c.slug, c]))

  return heroPanelDefaults.map((panel) => {
    const category = bySlug.get(panel.slug)
    return {
      ...panel,
      label: category?.name ?? panel.label,
      image: category?.image_url?.trim() || panel.image,
    }
  })
}
