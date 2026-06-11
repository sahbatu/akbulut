import { useEffect, useState } from 'react'
import { footerSettingsFallback } from '@/data/seed'
import { supabase } from '@/lib/supabase'
import { AdminField, AdminInput, AdminTextarea } from '@/components/admin/ui/AdminField'
import { SaveBar } from '@/components/admin/ui/SaveBar'
import type { FooterSettings } from '@/types'

export function AdminFooter() {
  const [form, setForm] = useState<FooterSettings>(footerSettingsFallback)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase.from('footer_settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) {
        setForm({
          brand_title: data.brand_title,
          brand_text: data.brand_text,
          copyright_text: data.copyright_text,
          extra_links: (data.extra_links as FooterSettings['extra_links']) ?? [],
        })
      }
    })
  }, [])

  const save = async () => {
    if (!supabase) return
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const { error: err } = await supabase.from('footer_settings').upsert({
        id: 1,
        ...form,
        updated_at: new Date().toISOString(),
      })
      if (err) throw err
      setMessage('Footer ayarları kaydedildi.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kayıt başarısız')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">Footer Düzenleme</h1>
      <p className="text-slate-500 text-sm mt-1">Sitenin alt kısmındaki metinleri düzenleyin</p>

      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <AdminField label="Marka Başlığı">
          <AdminInput value={form.brand_title} onChange={(e) => setForm({ ...form, brand_title: e.target.value })} />
        </AdminField>
        <AdminField label="Marka Açıklaması">
          <AdminTextarea value={form.brand_text} onChange={(e) => setForm({ ...form, brand_text: e.target.value })} />
        </AdminField>
        <AdminField label="Copyright Metni">
          <AdminInput value={form.copyright_text} onChange={(e) => setForm({ ...form, copyright_text: e.target.value })} />
        </AdminField>
        <SaveBar saving={saving} message={message} error={error} onSave={save} />
      </div>
    </div>
  )
}
