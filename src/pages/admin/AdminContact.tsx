import { useEffect, useState } from 'react'
import { siteSettings as fallback } from '@/data/seed'
import { upsertSiteSettings } from '@/lib/admin'
import { supabase } from '@/lib/supabase'
import { AdminField, AdminInput, AdminTextarea } from '@/components/admin/ui/AdminField'
import { SaveBar } from '@/components/admin/ui/SaveBar'
import type { SiteSettings } from '@/types'

export function AdminContact() {
  const [form, setForm] = useState<Pick<SiteSettings, 'address' | 'phones' | 'fax' | 'email' | 'map_embed_url' | 'years_experience' | 'company_name'>>({
    company_name: fallback.company_name,
    address: fallback.address,
    phones: fallback.phones,
    fax: fallback.fax,
    email: fallback.email,
    map_embed_url: fallback.map_embed_url,
    years_experience: fallback.years_experience,
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      if (!data) return
      const merged = { ...form }
      for (const row of data) {
        const k = row.key as keyof typeof merged
        if (k in merged) (merged as Record<string, unknown>)[k] = row.value
      }
      setForm(merged)
    })
  }, [])

  const save = async () => {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      await upsertSiteSettings(form as Record<string, unknown>)
      setMessage('İletişim bilgileri kaydedildi.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kayıt başarısız')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">İletişim Bilgileri</h1>
      <p className="text-slate-500 text-sm mt-1">İletişim sayfası ve footer bu bilgileri kullanır</p>

      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <AdminField label="Firma Adı">
          <AdminInput value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
        </AdminField>
        <AdminField label="Adres" hint="Tek satır veya tam adres">
          <AdminTextarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </AdminField>
        <AdminField label="Telefonlar" hint="Her satıra bir numara">
          <AdminTextarea
            value={form.phones.join('\n')}
            onChange={(e) => setForm({ ...form, phones: e.target.value.split('\n').filter(Boolean) })}
          />
        </AdminField>
        <AdminField label="Faks">
          <AdminInput value={form.fax} onChange={(e) => setForm({ ...form, fax: e.target.value })} />
        </AdminField>
        <AdminField label="E-posta">
          <AdminInput type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </AdminField>
        <AdminField label="Harita Embed URL" hint="Google Maps iframe src adresi">
          <AdminTextarea value={form.map_embed_url} onChange={(e) => setForm({ ...form, map_embed_url: e.target.value })} />
        </AdminField>
        <AdminField label="Deneyim Yılı">
          <AdminInput
            type="number"
            value={form.years_experience}
            onChange={(e) => setForm({ ...form, years_experience: Number(e.target.value) })}
          />
        </AdminField>
        <SaveBar saving={saving} message={message} error={error} onSave={save} />
      </div>
    </div>
  )
}
