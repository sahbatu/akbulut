import { useMemo } from 'react'
import { useCategories } from '@/hooks/useCategories'

export function useCategoryBySlug(slug: string | undefined) {
  const { categories, getChildren, loading } = useCategories()

  const category = useMemo(
    () => categories.find((c) => c.slug === slug),
    [categories, slug],
  )

  const parent = useMemo(
    () => (category?.parent_id ? categories.find((c) => c.id === category.parent_id) : null),
    [categories, category],
  )

  const root = useMemo(() => {
    if (!category) return null
    let current = category
    while (current.parent_id) {
      const p = categories.find((c) => c.id === current.parent_id)
      if (!p) break
      current = p
    }
    return current
  }, [categories, category])

  const siblings = useMemo(() => {
    if (!category) return []
    if (category.parent_id) return getChildren(category.parent_id)
    return categories.filter((c) => c.parent_id === null)
  }, [category, categories, getChildren])

  const children = useMemo(
    () => (category ? getChildren(category.id) : []),
    [category, getChildren],
  )

  return { category, parent, root, siblings, children, loading }
}
