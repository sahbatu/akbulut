import { useEffect, useState } from 'react'
import { regenerateSeoFiles, upsertSiteSettings } from '@/lib/admin'
import { buildRobotsTxt, getSiteOrigin, parseSettingValue } from '@/lib/seoFiles'
import { supabase } from '@/lib/supabase'
import { AdminField, AdminInput, AdminTextarea, CharCount } from '@/components/admin/ui/AdminField'
import { SaveBar } from '@/components/admin/ui/SaveBar'
import type { SeoPage } from '@/types'

const PAGE_LABELS: Record<string, string> = {
  home: 'Ana Sayfa',
  about: 'Hakkımızda',
  products: 'Ürünlerimiz',
  contact: 'İletişim',
  category_template: 'Kategori Şablonu',
}

const emptyPage = (key: string): SeoPage => ({
  page_key: key,
  title: '',
  meta_description: '',
  keywords: '',
  og_title: '',
  og_description: '',
  og_image_url: '',
  canonical_url: '',
  robots_index: true,
  robots_follow: true,
  json_ld: null,
})

export function AdminSeo() {
  const [tab, setTab] = useState<'global' | 'pages'>('global')
  const [globalSettings, setGlobalSettings] = useState({
    seo_site_name: 'Akbulut',
    seo_default_og_image: '',
    seo_twitter_handle: '',
    ga_measurement_id: '',
    gtm_container_id: '',
    robots_txt:
      'User-agent: *\nAllow: /\n\nDisallow: /admin/\n\nSitemap: https://akbulutltd.com/sitemap.xml',
  })
  const [pages, setPages] = useState<SeoPage[]>([])
  const [activePage, setActivePage] = useState('home')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    Promise.all([
      supabase.from('site_settings').select('key, value'),
      supabase.from('seo_pages').select('*'),
    ]).then(([settingsRes, pagesRes]) => {
      const g = { ...globalSettings }
      for (const row of settingsRes.data ?? []) {
        const k = row.key as keyof typeof g
        if (k in g) {
          const val = row.value
          ;(g as Record<string, unknown>)[k] =
            k === 'robots_txt' ? parseSettingValue(val) : val
        }
      }
      setGlobalSettings(g)
      const loaded = (pagesRes.data as SeoPage[]) ?? []
      const keys = Object.keys(PAGE_LABELS)
      setPages(keys.map((k) => loaded.find((p) => p.page_key === k) ?? emptyPage(k)))
    })
  }, [])

  const current = pages.find((p) => p.page_key === activePage) ?? emptyPage(activePage)

  const updatePage = (patch: Partial<SeoPage>) => {
    setPages(pages.map((p) => (p.page_key === activePage ? { ...p, ...patch } : p)))
  }

  const saveGlobal = async () => {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const origin = getSiteOrigin()
      const robots_txt = buildRobotsTxt(globalSettings.robots_txt, origin)
      const payload = { ...globalSettings, robots_txt }
      setGlobalSettings(payload)
      await upsertSiteSettings(payload as Record<string, unknown>)
      const regen = await regenerateSeoFiles()
      setMessage(
        regen.ok
          ? `Genel SEO ayarları kaydedildi. ${regen.detail}`
          : `Genel SEO ayarları kaydedildi. ${regen.detail}`,
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kayıt başarısız')
    } finally {
      setSaving(false)
    }
  }

  const savePages = async () => {
    if (!supabase) return
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const { error: err } = await supabase.from('seo_pages').upsert(
        pages.map((p) => ({ ...p, updated_at: new Date().toISOString() })),
      )
      if (err) throw err
      setMessage('Sayfa SEO ayarları kaydedildi.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kayıt başarısız')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">SEO Ayarları</h1>
      <p className="text-slate-500 text-sm mt-1">Arama motoru ve sosyal medya optimizasyonu</p>

      <div className="mt-6 flex gap-2">
        {(['global', 'pages'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              tab === t ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {t === 'global' ? 'Genel Ayarlar' : 'Sayfa Bazlı SEO'}
          </button>
        ))}
      </div>

      {tab === 'global' && (
        <div className="mt-6 max-w-2xl bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <AdminField label="Site Adı">
            <AdminInput value={globalSettings.seo_site_name} onChange={(e) => setGlobalSettings({ ...globalSettings, seo_site_name: e.target.value })} />
          </AdminField>
          <AdminField label="Varsayılan OG Görsel URL" hint="Sosyal medyada paylaşımda kullanılır">
            <AdminInput value={globalSettings.seo_default_og_image} onChange={(e) => setGlobalSettings({ ...globalSettings, seo_default_og_image: e.target.value })} />
          </AdminField>
          <AdminField label="Twitter / X Kullanıcı Adı" hint="@ olmadan">
            <AdminInput value={globalSettings.seo_twitter_handle} onChange={(e) => setGlobalSettings({ ...globalSettings, seo_twitter_handle: e.target.value })} />
          </AdminField>
          <AdminField label="Google Analytics 4 ID" hint="Örn: G-XXXXXXXXXX">
            <AdminInput value={globalSettings.ga_measurement_id} onChange={(e) => setGlobalSettings({ ...globalSettings, ga_measurement_id: e.target.value })} />
          </AdminField>
          <AdminField label="Google Tag Manager ID" hint="Opsiyonel. Örn: GTM-XXXXXXX">
            <AdminInput value={globalSettings.gtm_container_id} onChange={(e) => setGlobalSettings({ ...globalSettings, gtm_container_id: e.target.value })} />
          </AdminField>
          <AdminField
            label="robots.txt İçeriği"
            hint="Kayıtta Sitemap ve Disallow: /admin/ satırları otomatik eklenir/güncellenir."
          >
            <AdminTextarea value={globalSettings.robots_txt} onChange={(e) => setGlobalSettings({ ...globalSettings, robots_txt: e.target.value })} className="font-mono text-xs min-h-[120px]" />
          </AdminField>
          <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            Canlı adres:{' '}
            <a href="/robots.txt" target="_blank" rel="noreferrer" className="text-amber-800 underline">
              /robots.txt
            </a>
            {' · '}
            <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="text-amber-800 underline">
              /sitemap.xml
            </a>
            . Kayıt sonrası dev ortamında dosyalar otomatik güncellenir; canlıda{' '}
            <code className="text-slate-800">npm run build</code> ile deploy edin.
          </p>
          <SaveBar saving={saving} message={message} error={error} onSave={saveGlobal} />
        </div>
      )}

      {tab === 'pages' && (
        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          <div className="lg:w-48 shrink-0 space-y-1">
            {Object.entries(PAGE_LABELS).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActivePage(key)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  activePage === key ? 'bg-amber-50 text-amber-900 font-medium' : 'text-slate-600 hover:bg-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            {activePage === 'category_template' && (
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3">
                Placeholder: {'{category_name}'}, {'{site_name}'} — kategori sayfalarında otomatik değiştirilir.
              </p>
            )}
            <AdminField label="Meta Başlık">
              <AdminInput value={current.title ?? ''} onChange={(e) => updatePage({ title: e.target.value })} />
              <CharCount value={current.title ?? ''} recommended={60} />
            </AdminField>
            <AdminField label="Meta Açıklama">
              <AdminTextarea value={current.meta_description ?? ''} onChange={(e) => updatePage({ meta_description: e.target.value })} />
              <CharCount value={current.meta_description ?? ''} recommended={160} />
            </AdminField>
            <AdminField label="Anahtar Kelimeler" hint="Virgülle ayırın">
              <AdminInput value={current.keywords ?? ''} onChange={(e) => updatePage({ keywords: e.target.value })} />
            </AdminField>
            <AdminField label="OG Başlık">
              <AdminInput value={current.og_title ?? ''} onChange={(e) => updatePage({ og_title: e.target.value })} />
            </AdminField>
            <AdminField label="OG Açıklama">
              <AdminTextarea value={current.og_description ?? ''} onChange={(e) => updatePage({ og_description: e.target.value })} />
            </AdminField>
            <AdminField label="OG Görsel URL">
              <AdminInput value={current.og_image_url ?? ''} onChange={(e) => updatePage({ og_image_url: e.target.value })} />
            </AdminField>
            <AdminField label="Canonical URL">
              <AdminInput value={current.canonical_url ?? ''} onChange={(e) => updatePage({ canonical_url: e.target.value })} />
            </AdminField>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={current.robots_index} onChange={(e) => updatePage({ robots_index: e.target.checked })} />
                Index (arama motorlarında göster)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={current.robots_follow} onChange={(e) => updatePage({ robots_follow: e.target.checked })} />
                Follow (linkleri takip et)
              </label>
            </div>
            <SaveBar saving={saving} message={message} error={error} onSave={savePages} />
          </div>
        </div>
      )}
    </div>
  )
}
