import { useEffect, useState } from 'react'
import { uploadFile, upsertSiteSettings } from '@/lib/admin'
import { supabase } from '@/lib/supabase'
import { AdminField, AdminInput } from '@/components/admin/ui/AdminField'
import { FileDropzone } from '@/components/admin/ui/FileDropzone'
import { SaveBar } from '@/components/admin/ui/SaveBar'

export function AdminBrand() {
  const [logoUrl, setLogoUrl] = useState('')
  const [logoAlt, setLogoAlt] = useState('Akbulut')
  const [faviconUrl, setFaviconUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase.from('site_settings').select('key, value').then(({ data }) => {
      for (const row of data ?? []) {
        if (row.key === 'logo_url') setLogoUrl(String(row.value).replace(/^"|"$/g, '') || '')
        if (row.key === 'logo_alt') setLogoAlt(String(row.value).replace(/^"|"$/g, '') || 'Akbulut')
        if (row.key === 'favicon_url') setFaviconUrl(String(row.value).replace(/^"|"$/g, '') || '')
      }
    })
  }, [])

  const uploadLogo = async (file: File) => {
    const ext = file.name.split('.').pop() ?? 'png'
    const url = await uploadFile('brand', `logo.${ext}`, file)
    setLogoUrl(url)
  }

  const uploadFavicon = async (file: File) => {
    const ext = file.name.split('.').pop() ?? 'png'
    const url = await uploadFile('brand', `favicon.${ext}`, file)
    setFaviconUrl(url)
  }

  const save = async () => {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      await upsertSiteSettings({ logo_url: logoUrl, logo_alt: logoAlt, favicon_url: faviconUrl })
      if (faviconUrl) {
        const link = document.querySelector<HTMLLinkElement>("link[rel='icon']")
        if (link) link.href = faviconUrl
      }
      setMessage('Marka ayarları kaydedildi.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kayıt başarısız')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900">Logo & Favicon</h1>
      <p className="text-slate-500 text-sm mt-1">Site başlığında görünen logo ve tarayıcı ikonu</p>

      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <AdminField label="Logo" hint="Header'da görünür. Önerilen: şeffaf PNG veya SVG">
          <FileDropzone previewUrl={logoUrl || null} onFile={uploadLogo} label="Logo yükle" />
        </AdminField>

        {logoUrl && (
          <div className="bg-slate-900 rounded-lg p-4 flex items-center gap-3">
            <img src={logoUrl} alt={logoAlt} className="h-10 object-contain" />
            <span className="text-white text-sm">Önizleme</span>
          </div>
        )}

        <AdminField label="Logo Alt Metni (SEO)">
          <AdminInput value={logoAlt} onChange={(e) => setLogoAlt(e.target.value)} />
        </AdminField>

        <AdminField label="Favicon" hint="Tarayıcı sekmesinde görünen ikon">
          <FileDropzone previewUrl={faviconUrl || null} onFile={uploadFavicon} label="Favicon yükle" accept="image/*,.ico" />
        </AdminField>

        <SaveBar saving={saving} message={message} error={error} onSave={save} />
      </div>
    </div>
  )
}
