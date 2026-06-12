import { useState, type MouseEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { contactFormSchema, sanitizePhoneInput, type ContactFormData } from '@/lib/contactFormSchema'
import { Button } from '@/components/ui/Button'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ContactFormData>({ resolver: zodResolver(contactFormSchema) })

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null)

    const payload = {
      ...data,
      phone: sanitizePhoneInput(data.phone),
      email: data.email.trim().toLowerCase(),
    }

    if (!isSupabaseConfigured || !supabase) {
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted(true)
      reset()
      return
    }

    const { error } = await supabase.from('contact_submissions').insert([payload])

    if (error) {
      setSubmitError('Gönderim sırasında bir hata oluştu. Lütfen tekrar deneyin.')
      return
    }

    setSubmitted(true)
    reset()
  }

  const handleRipple = (e: MouseEvent<HTMLFormElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setTimeout(() => setRipple(null), 800)
  }

  const fields: {
    name: keyof ContactFormData
    label: string
    type?: string
    rows?: number
    inputMode?: 'numeric' | 'email' | 'text'
    maxLength?: number
  }[] = [
    { name: 'name', label: 'Adınız', maxLength: 120 },
    { name: 'company', label: 'Firmanız', maxLength: 200 },
    { name: 'phone', label: 'Telefon', type: 'tel', inputMode: 'numeric', maxLength: 11 },
    { name: 'email', label: 'E-posta', type: 'email', inputMode: 'email', maxLength: 254 },
    { name: 'subject', label: 'Konu', maxLength: 200 },
    { name: 'message', label: 'Sipariş Detayı', rows: 5, maxLength: 5000 },
  ]

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            className="flex flex-col items-center justify-center py-16 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-5xl text-gold mb-4">✓</span>
            <h3 className="font-display text-2xl text-ink mb-2">Mesajınız Alındı</h3>
            <p className="text-ink/55 text-sm">En kısa sürede size dönüş yapacağız.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 text-gold text-sm tracking-widest uppercase hover:underline"
              data-cursor-hover
            >
              Yeni Mesaj Gönder
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit)}
            onClick={handleRipple}
            className="relative space-y-6 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {ripple && (
              <span
                className="absolute rounded-full bg-gold/20 pointer-events-none"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: 20,
                  height: 20,
                  transform: 'translate(-50%, -50%)',
                  animation: 'ink-ripple 0.8s ease-out forwards',
                }}
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={field.rows ? 'sm:col-span-2' : ''}
                >
                  <label className="eyebrow block text-ink/55 mb-2">
                    {field.label}
                  </label>
                  {field.rows ? (
                    <textarea
                      {...register(field.name)}
                      rows={field.rows}
                      maxLength={field.maxLength}
                      className="w-full bg-paper-dark/50 border border-ink/10 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold/50 transition-colors resize-none rounded-lg"
                    />
                  ) : field.name === 'phone' ? (
                    <input
                      {...register('phone', {
                        onChange: (e) => {
                          const sanitized = sanitizePhoneInput(e.target.value)
                          if (e.target.value !== sanitized) {
                            e.target.value = sanitized
                          }
                          setValue('phone', sanitized, { shouldValidate: true })
                        },
                      })}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      pattern="[0-9]*"
                      maxLength={11}
                      placeholder="05XXXXXXXXX"
                      className="w-full bg-paper-dark/50 border border-ink/10 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold/50 transition-colors rounded-lg"
                    />
                  ) : (
                    <input
                      {...register(field.name)}
                      type={field.type ?? 'text'}
                      inputMode={field.inputMode}
                      maxLength={field.maxLength}
                      autoComplete={field.name === 'email' ? 'email' : undefined}
                      className="w-full bg-paper-dark/50 border border-ink/10 px-4 py-3 text-ink text-sm focus:outline-none focus:border-gold/50 transition-colors rounded-lg"
                    />
                  )}
                  {errors[field.name] && (
                    <p className="text-red-400/80 text-xs mt-1">{errors[field.name]?.message}</p>
                  )}
                </div>
              ))}
            </div>

            {submitError && <p className="text-red-400/80 text-sm">{submitError}</p>}

            {!isSupabaseConfigured && (
              <p className="text-ink/40 text-xs">
                Demo modu: Supabase yapılandırılmadı, form simüle edilecek.
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full sm:w-auto">
              {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
