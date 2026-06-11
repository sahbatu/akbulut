import { Helmet } from 'react-helmet-async'
import { useSiteData } from '@/hooks/useSiteData'

export function SiteBranding() {
  const { settings } = useSiteData()

  return (
    <Helmet>
      {settings.favicon_url && <link rel="icon" href={settings.favicon_url} />}
    </Helmet>
  )
}
