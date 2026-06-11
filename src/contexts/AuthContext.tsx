import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured } from '@/lib/supabaseConfig'

interface AuthContextValue {
  session: Session | null
  user: User | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function isAdminRoute(pathname: string) {
  return pathname.startsWith('/admin')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)

  const refreshAdmin = useCallback(async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false)
      return
    }
    const { checkIsAdmin } = await import('@/lib/admin')
    setIsAdmin(await checkIsAdmin(userId))
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !isAdminRoute(pathname)) {
      setLoading(false)
      return
    }

    let cancelled = false
    let unsubscribe: (() => void) | undefined
    setLoading(true)

    void import('@/lib/supabase').then(({ supabase }) => {
      if (!supabase || cancelled) {
        setLoading(false)
        return
      }

      supabase.auth.getSession().then(({ data }) => {
        if (cancelled) return
        setSession(data.session)
        refreshAdmin(data.session?.user?.id).finally(() => {
          if (!cancelled) setLoading(false)
        })
      })

      const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession)
        void refreshAdmin(nextSession?.user?.id)
      })

      unsubscribe = () => sub.subscription.unsubscribe()
    })

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [pathname, refreshAdmin])

  const signIn = useCallback(async (email: string, password: string) => {
    const { supabase } = await import('@/lib/supabase')
    if (!supabase) return { error: 'Supabase yapılandırılmamış' }

    const { checkIsAdmin } = await import('@/lib/admin')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message === 'Failed to fetch') {
          return {
            error:
              'Supabase sunucusuna ulaşılamadı. Sunucuyu yeniden başlatın (npm run dev veya npm run start). Canlı sitede /supabase proxy kurulumu gerekir — deploy/nginx.conf.example dosyasına bakın.',
          }
        }
        return { error: error.message }
      }

      if (data.session) {
        await supabase.auth.setSession(data.session)
      }

      const admin = await checkIsAdmin(data.user?.id ?? '')
      if (!admin) {
        await supabase.auth.signOut()
        return {
          error: `Bu hesabın admin yetkisi yok (${email}). Supabase Studio → SQL Editor'de çalıştırın veya terminalde: npm run admin:grant -- ${email}`,
        }
      }
      setSession(data.session)
      setIsAdmin(true)
      return { error: null }
    } catch {
      return {
        error:
          'Bağlantı hatası (Failed to fetch). npm run dev veya npm run start ile yeniden başlatın. Canlıda nginx /supabase proxy gerekir.',
      }
    }
  }, [])

  const signOut = useCallback(async () => {
    const { supabase } = await import('@/lib/supabase')
    if (supabase) await supabase.auth.signOut()
    setIsAdmin(false)
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin,
      loading,
      signIn,
      signOut,
    }),
    [session, isAdmin, loading, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
