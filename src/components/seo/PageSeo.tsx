import { SeoHead } from '@/components/seo/SeoHead'
import { useSeoPage } from '@/hooks/useSeo'

export function PageSeo({ pageKey }: { pageKey: string }) {
  const seo = useSeoPage(pageKey)
  if (!seo) return null
  return <SeoHead {...seo} />
}
