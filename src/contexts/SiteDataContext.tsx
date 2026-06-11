import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { announcements as fallbackAnnouncements, siteSettings as fallbackSettings } from '@/data/seed'
import { footerSettingsFallback } from '@/data/seed'
import { isSupabaseConfigured } from '@/lib/supabaseConfig'
import type { Announcement, FooterSettings, SiteSettings } from '@/types'

function parseSettingValue(value: unknown): unknown {
  if (typeof value === 'string') return value.replace(/^"|"$/g, '')
  return value
}

function scheduleIdle(task: () => void, timeout = 2000) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(task, { timeout })
  }
  return setTimeout(task, 1) as unknown as number
}

interface SiteDataContextValue {
  settings: SiteSettings
  announcements: Announcement[]
  footer: FooterSettings
  loading: boolean
  refetch: () => Promise<void>
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null)

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings)
  const [announcements, setAnnouncements] = useState<Announcement[]>(fallbackAnnouncements)
  const [footer, setFooter] = useState<FooterSettings>(footerSettingsFallback)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured) return

    const { supabase } = await import('@/lib/supabase')
    if (!supabase) return

    const [settingsRes, announcementsRes, footerRes] = await Promise.all([
      supabase.from('site_settings').select('key, value'),
      supabase.from('announcements').select('*').order('published_at', { ascending: false }),
      supabase.from('footer_settings').select('*').eq('id', 1).maybeSingle(),
    ])

    if (settingsRes.data?.length) {
      const merged = { ...fallbackSettings }
      for (const row of settingsRes.data) {
        const key = row.key as keyof SiteSettings
        if (key in merged) {
          ;(merged as Record<string, unknown>)[key] = parseSettingValue(row.value)
        }
      }
      setSettings(merged)
    }

    if (!announcementsRes.error) {
      setAnnouncements((announcementsRes.data as Announcement[]) ?? [])
    }

    if (footerRes.data) {
      setFooter({
        brand_title: footerRes.data.brand_title,
        brand_text: footerRes.data.brand_text,
        copyright_text: footerRes.data.copyright_text,
        extra_links: (footerRes.data.extra_links as FooterSettings['extra_links']) ?? [],
      })
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return

    setLoading(true)
    const id = scheduleIdle(() => {
      void fetchData()
    })
    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(id as number)
      } else {
        clearTimeout(id as number)
      }
    }
  }, [fetchData])

  const value = useMemo(
    () => ({ settings, announcements, footer, loading, refetch: fetchData }),
    [settings, announcements, footer, loading, fetchData],
  )

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export function useSiteDataContext() {
  const ctx = useContext(SiteDataContext)
  if (!ctx) throw new Error('useSiteDataContext must be used within SiteDataProvider')
  return ctx
}
