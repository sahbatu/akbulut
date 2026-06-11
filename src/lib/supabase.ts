import { createClient } from '@supabase/supabase-js'
import { isSupabaseConfigured } from '@/lib/supabaseConfig'

export { isSupabaseConfigured } from '@/lib/supabaseConfig'

const remoteUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Tarayıcıda her zaman aynı origin üzerinden proxy kullan (dev, preview, canlı nginx) */
function resolveSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/supabase`
  }
  return remoteUrl ?? ''
}

export const supabaseUrl = resolveSupabaseUrl()

export const supabase = isSupabaseConfigured
  ? createClient(resolveSupabaseUrl(), supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null
