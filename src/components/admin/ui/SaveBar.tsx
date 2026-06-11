interface SaveBarProps {
  saving?: boolean
  message?: string | null
  error?: string | null
  onSave: () => void
  saveLabel?: string
}

export function SaveBar({ saving, message, error, onSave, saveLabel = 'Kaydet' }: SaveBarProps) {
  return (
    <div className="sticky bottom-0 z-20 -mx-6 -mb-6 mt-8 border-t border-slate-200 bg-white/95 backdrop-blur px-6 py-4 flex items-center justify-between gap-4">
      <div className="text-sm">
        {error && <span className="text-red-600">{error}</span>}
        {!error && message && <span className="text-emerald-600">{message}</span>}
        {!error && !message && <span className="text-slate-400">Değişiklikleri kaydetmeyi unutmayın</span>}
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 transition-colors"
      >
        {saving ? 'Kaydediliyor...' : saveLabel}
      </button>
    </div>
  )
}
