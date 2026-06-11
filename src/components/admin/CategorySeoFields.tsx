import { Sparkles } from 'lucide-react'
import { AdminField, AdminInput, AdminTextarea, CharCount } from '@/components/admin/ui/AdminField'
import { buildDefaultCategorySeo, categoryPagePath, type CategorySeoForm } from '@/lib/categorySeo'

interface CategorySeoFieldsProps {
  value: CategorySeoForm
  onChange: (patch: Partial<CategorySeoForm>) => void
  categoryName: string
  slug: string
  description?: string | null
  pathNames?: string[]
  compact?: boolean
}

export function CategorySeoFields({
  value,
  onChange,
  categoryName,
  slug,
  description,
  pathNames = [],
  compact = false,
}: CategorySeoFieldsProps) {
  const applyDefaults = () => {
    if (!categoryName.trim() || !slug.trim()) return
    onChange(buildDefaultCategorySeo(categoryName, slug, description, pathNames))
  }

  return (
    <div className={compact ? 'space-y-4' : 'space-y-5'}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-slate-800">Sayfa SEO</p>
          <p className="text-xs text-slate-600 mt-0.5">
            Bu kategori <code className="text-slate-700">{categoryPagePath(slug || '...')}</code>{' '}
            adresinde yayınlanır.
          </p>
        </div>
        <button
          type="button"
          onClick={applyDefaults}
          disabled={!categoryName.trim() || !slug.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:border-amber-300 disabled:opacity-40"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Önerilen metinleri doldur
        </button>
      </div>

      <AdminField
        label="Sayfa Başlığı (title)"
        hint="Google sonuçlarında görünen başlık — 50–60 karakter ideal"
      >
        <AdminInput
          value={value.title ?? ''}
          onChange={(e) => onChange({ title: e.target.value || null })}
          placeholder={`${categoryName || 'Kategori'} | Akbulut`}
        />
        <CharCount value={value.title ?? ''} recommended={60} />
      </AdminField>

      <AdminField
        label="Meta Açıklama"
        hint="Arama sonuçlarındaki kısa açıklama — 150–160 karakter ideal"
      >
        <AdminTextarea
          value={value.meta_description ?? ''}
          onChange={(e) => onChange({ meta_description: e.target.value || null })}
          className="min-h-[80px]"
          placeholder="Kategori ve ürünler hakkında kısa, anahtar kelime içeren açıklama..."
        />
        <CharCount value={value.meta_description ?? ''} recommended={160} />
      </AdminField>

      <AdminField label="Anahtar Kelimeler" hint="Virgülle ayırın">
        <AdminInput
          value={value.keywords ?? ''}
          onChange={(e) => onChange({ keywords: e.target.value || null })}
          placeholder="promosyon kalem, kurumsal hediye, akbulut"
        />
      </AdminField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminField label="Paylaşım Başlığı (OG)" hint="Boş bırakılırsa sayfa başlığı kullanılır">
          <AdminInput
            value={value.og_title ?? ''}
            onChange={(e) => onChange({ og_title: e.target.value || null })}
          />
        </AdminField>
        <AdminField label="Paylaşım Görseli URL" hint="Sosyal medyada önizleme görseli">
          <AdminInput
            value={value.og_image_url ?? ''}
            onChange={(e) => onChange({ og_image_url: e.target.value || null })}
            placeholder="https://..."
          />
        </AdminField>
      </div>

      <AdminField label="Paylaşım Açıklaması (OG)" hint="Boş bırakılırsa meta açıklama kullanılır">
        <AdminTextarea
          value={value.og_description ?? ''}
          onChange={(e) => onChange({ og_description: e.target.value || null })}
          className="min-h-[72px]"
        />
      </AdminField>

      <AdminField label="Canonical URL" hint="Arama motorları için tercih edilen tam sayfa adresi">
        <AdminInput
          value={value.canonical_url ?? ''}
          onChange={(e) => onChange({ canonical_url: e.target.value || null })}
          placeholder={slug ? `https://site.com${categoryPagePath(slug)}` : ''}
        />
      </AdminField>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            checked={value.robots_index}
            onChange={(e) => onChange({ robots_index: e.target.checked })}
          />
          Arama motorlarında indeksle (index)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            checked={value.robots_follow}
            onChange={(e) => onChange({ robots_follow: e.target.checked })}
          />
          Linkleri takip et (follow)
        </label>
      </div>
    </div>
  )
}
