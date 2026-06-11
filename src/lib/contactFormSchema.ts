import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Ad en az 2 karakter olmalı').max(120, 'Ad çok uzun'),
  company: z.string().trim().min(2, 'Firma adı gerekli').max(200, 'Firma adı çok uzun'),
  phone: z
    .string()
    .trim()
    .regex(/^\d+$/, 'Telefon yalnızca rakam içermelidir')
    .min(10, 'Telefon en az 10 haneli olmalıdır')
    .max(11, 'Telefon en fazla 11 haneli olmalıdır'),
  email: z
    .string()
    .trim()
    .min(1, 'E-posta gerekli')
    .email('Geçerli bir e-posta adresi girin')
    .max(254, 'E-posta çok uzun'),
  subject: z.string().trim().min(3, 'Konu gerekli').max(200, 'Konu çok uzun'),
  message: z.string().trim().min(10, 'Mesaj en az 10 karakter olmalı').max(5000, 'Mesaj çok uzun'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export function sanitizePhoneInput(value: string) {
  return value.replace(/\D/g, '').slice(0, 11)
}
