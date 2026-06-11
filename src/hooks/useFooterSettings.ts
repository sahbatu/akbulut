import { useSiteDataContext } from '@/contexts/SiteDataContext'

export function useFooterSettings() {
  const { footer, loading } = useSiteDataContext()
  return { footer, loading }
}
