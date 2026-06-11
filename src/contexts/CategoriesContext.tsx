import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { categories as fallbackCategories } from '@/data/seed'
import { isSupabaseConfigured } from '@/lib/supabaseConfig'
import type { Category } from '@/types'

function scheduleIdle(task: () => void, timeout = 2000) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(task, { timeout })
  }
  return setTimeout(task, 1) as unknown as number
}

interface CategoriesContextValue {
  categories: Category[]
  rootCategories: Category[]
  getChildren: (parentId: string) => Category[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null)

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    if (!isSupabaseConfigured) return

    const { supabase } = await import('@/lib/supabase')
    if (!supabase) return

    const { data, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (fetchError) {
      setError(fetchError.message)
      setLoading(false)
      return
    }

    setCategories((data as Category[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return

    setLoading(true)
    const id = scheduleIdle(() => {
      void fetchCategories()
    })
    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(id as number)
      } else {
        clearTimeout(id as number)
      }
    }
  }, [fetchCategories])

  const getChildren = useCallback(
    (parentId: string) => categories.filter((c) => c.parent_id === parentId),
    [categories],
  )

  const rootCategories = useMemo(
    () => categories.filter((c) => c.parent_id === null),
    [categories],
  )

  const value = useMemo(
    () => ({
      categories,
      rootCategories,
      getChildren,
      loading,
      error,
      refetch: fetchCategories,
    }),
    [categories, rootCategories, getChildren, loading, error, fetchCategories],
  )

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
}

export function useCategoriesContext() {
  const ctx = useContext(CategoriesContext)
  if (!ctx) throw new Error('useCategoriesContext must be used within CategoriesProvider')
  return ctx
}
