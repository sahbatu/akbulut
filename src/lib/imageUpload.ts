const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
}

export const BRAND_IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const SLIDE_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export function imageExtension(file: File) {
  const fromMime = MIME_TO_EXT[file.type]
  if (fromMime) return fromMime

  const fromName = file.name.split('.').pop()?.toLowerCase()
  if (fromName && ['jpg', 'jpeg', 'png', 'webp'].includes(fromName)) {
    return fromName === 'jpeg' ? 'jpg' : fromName
  }

  return 'jpg'
}

export function validateSlideImage(file: File) {
  if (!SLIDE_ALLOWED_TYPES.includes(file.type as (typeof SLIDE_ALLOWED_TYPES)[number])) {
    throw new Error('Desteklenmeyen format. PNG, JPG veya WebP yükleyin (iPhone HEIC desteklenmez).')
  }
  if (file.size > BRAND_IMAGE_MAX_BYTES) {
    throw new Error(`Dosya çok büyük (en fazla ${BRAND_IMAGE_MAX_BYTES / (1024 * 1024)} MB).`)
  }
}

export function formatStorageError(error: unknown): string {
  if (!(error instanceof Error)) return 'Yükleme başarısız oldu.'

  const msg = error.message.toLowerCase()
  if (msg.includes('payload too large') || msg.includes('exceeded')) {
    return 'Dosya boyutu sunucu limitini aşıyor. Daha küçük bir görsel deneyin.'
  }
  if (msg.includes('mime') || msg.includes('invalid')) {
    return 'Dosya formatı desteklenmiyor. PNG, JPG veya WebP kullanın.'
  }
  if (msg.includes('row-level security') || msg.includes('policy')) {
    return 'Yükleme yetkisi yok. Admin olarak giriş yaptığınızdan emin olun.'
  }
  if (msg.includes('failed to fetch')) {
    return 'Sunucuya bağlanılamadı. npm run dev ile yeniden başlatın veya /supabase proxy kontrol edin.'
  }

  return error.message
}
