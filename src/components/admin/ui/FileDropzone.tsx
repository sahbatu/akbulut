import { useRef, useState, type DragEvent } from 'react'
import { Loader2, Upload } from 'lucide-react'

interface FileDropzoneProps {
  accept?: string
  label?: string
  hint?: string
  previewUrl?: string | null
  disabled?: boolean
  busy?: boolean
  onFile: (file: File) => void | Promise<void>
}

export function FileDropzone({
  accept = 'image/*',
  label,
  hint,
  previewUrl,
  disabled = false,
  busy = false,
  onFile,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const isDisabled = disabled || busy

  const handleFile = (file: File) => {
    void Promise.resolve(onFile(file)).finally(() => {
      if (inputRef.current) inputRef.current.value = ''
    })
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (isDisabled) return
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        if (!isDisabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => {
        if (!isDisabled) inputRef.current?.click()
      }}
      className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
        isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      } ${
        dragging ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={isDisabled}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
      {busy ? (
        <Loader2 className="mx-auto h-8 w-8 text-amber-600 mb-3 animate-spin" />
      ) : previewUrl ? (
        <img src={previewUrl} alt="" className="mx-auto max-h-32 object-contain mb-3" />
      ) : (
        <Upload className="mx-auto h-8 w-8 text-slate-400 mb-3" />
      )}
      <p className="text-sm text-slate-600">
        {busy ? 'Yükleniyor...' : (label ?? 'Dosyayı sürükleyin veya tıklayın')}
      </p>
      <p className="text-xs text-slate-400 mt-1">{hint ?? 'PNG, JPG, WebP (en fazla 5 MB)'}</p>
    </div>
  )
}
