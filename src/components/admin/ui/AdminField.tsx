import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface AdminFieldProps {
  label: string
  hint?: string
  error?: string
  children?: React.ReactNode
}

export function AdminField({ label, hint, error, children }: AdminFieldProps) {
  return (
    <div className="space-y-1.5 text-slate-900">
      <label className="block text-sm font-medium text-slate-800">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-600">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20 ${props.className ?? ''}`}
    />
  )
}

export function AdminSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 [&>option]:bg-white [&>option]:text-slate-900 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20 ${props.className ?? ''}`}
    />
  )
}

export function AdminTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600/20 min-h-[100px] ${props.className ?? ''}`}
    />
  )
}

export function CharCount({ value, recommended }: { value: string; recommended: number }) {
  const len = value.length
  const over = len > recommended
  return (
    <span className={`text-xs ${over ? 'text-amber-600' : 'text-slate-400'}`}>
      {len} / {recommended} önerilen
    </span>
  )
}
