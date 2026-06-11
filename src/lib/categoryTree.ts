import type { Category } from '@/types'

export const MAX_CATEGORY_DEPTH = 2 // 0=ana grup, 1=alt, 2=detay

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function getCategoryDepth(
  categoryId: string | null,
  categories: Category[],
): number {
  if (!categoryId) return -1
  let depth = 0
  let current = categories.find((c) => c.id === categoryId)
  while (current?.parent_id) {
    depth += 1
    current = categories.find((c) => c.id === current!.parent_id)
  }
  return depth
}

export function getCategoryPath(
  categoryId: string | null,
  categories: Category[],
): Category[] {
  if (!categoryId) return []
  const path: Category[] = []
  let current = categories.find((c) => c.id === categoryId)
  while (current) {
    path.unshift(current)
    current = current.parent_id
      ? categories.find((c) => c.id === current!.parent_id)
      : undefined
  }
  return path
}

export function getLevelMeta(depth: number) {
  if (depth < 0) {
    return {
      label: 'Seçilmedi',
      short: '—',
      description: 'Üst kategori seçin veya ana grup oluşturun.',
      color: 'bg-slate-100 text-slate-600',
    }
  }
  if (depth === 0) {
    return {
      label: 'Ana Ürün Grubu',
      short: 'Ana',
      description: 'Menüde ve ana sayfa kategori bandında görünür (ör. Promosyon, Matbaa).',
      color: 'bg-amber-100 text-amber-900',
    }
  }
  if (depth === 1) {
    return {
      label: 'Alt Kategori',
      short: 'Alt',
      description: 'Ürün grupları sayfasında ve mega menüde listelenir (ör. Kalemler, Kartvizit).',
      color: 'bg-blue-100 text-blue-900',
    }
  }
  return {
    label: 'Detay Kategorisi',
    short: 'Detay',
    description: 'En alt seviye; ürün görselleri bu sayfada gösterilir (ör. Özel Kesim Modeller).',
    color: 'bg-violet-100 text-violet-900',
  }
}

export function flattenCategoryOptions(
  categories: Category[],
  getChildren: (parentId: string) => Category[],
) {
  const roots = categories.filter((c) => !c.parent_id)
  const rows: { category: Category; depth: number; path: string }[] = []

  const walk = (items: Category[], depth: number, pathNames: string[]) => {
    for (const item of items) {
      const path = [...pathNames, item.name].join(' › ')
      rows.push({ category: item, depth, path })
      walk(getChildren(item.id), depth + 1, [...pathNames, item.name])
    }
  }

  walk(roots, 0, [])
  return rows
}

export function suggestCategoryId(
  name: string,
  parentId: string | null,
  categories: Category[],
): string {
  const base = slugify(name)
  if (!parentId) return base

  const parent = categories.find((c) => c.id === parentId)
  const prefix = parent?.id.includes('-') ? parent.id.split('-')[0] + '-' : `${parentId.split('-')[0]}-`
  return `${prefix}${base}`.replace(/--+/g, '-')
}
