import { Helmet } from 'react-helmet-async'
import { useSiteData } from '@/hooks/useSiteData'

export function SiteBranding() {
  const { settings } = useSiteData()

  return (
    <Helmet>
      <meta name="theme-color" content="#0B2D5B" />
      {settings.favicon_url && <link rel="icon" href={settings.favicon_url} />}
    </Helmet>
  )
}
