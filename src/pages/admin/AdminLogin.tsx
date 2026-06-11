import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AdminField, AdminInput } from '@/components/admin/ui/AdminField'

export function AdminLogin() {
  const { signIn, session, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session && isAdmin) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const result = await signIn(email, password)
    setSubmitting(false)
    if (result.error) {
      setError(result.error)
      return
    }
    navigate(from, { replace: true })
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-panel min-h-screen flex items-center justify-center bg-slate-50 p-6 text-slate-900">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-900">Supabase Gerekli</h1>
          <p className="text-sm text-slate-500 mt-2">
            Admin paneli için `.env` dosyasında `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` tanımlayın.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel min-h-screen flex items-center justify-center bg-slate-50 p-6 text-slate-900">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <h1 className="font-display text-2xl font-semibold text-slate-900">Yönetim Paneli</h1>
        <p className="text-sm text-slate-500 mt-1">Devam etmek için giriş yapın</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <AdminField label="E-posta">
            <AdminInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </AdminField>
          <AdminField label="Şifre">
            <AdminInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </AdminField>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-slate-900 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  )
}
