import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSiteData } from '@/hooks/useSiteData'

const CONSENT_KEY = 'akbulut_analytics_consent'

function normalizeAnalyticsId(raw: string | undefined, pattern: RegExp) {
  const cleaned = String(raw ?? '')
    .replace(/^"|"$/g, '')
    .trim()
  const match = cleaned.match(pattern)
  return match?.[0] ?? cleaned
}

export function AnalyticsScripts() {
  const { settings } = useSiteData()
  const [consented, setConsented] = useState(() => localStorage.getItem(CONSENT_KEY) === 'true')

  const gaId = normalizeAnalyticsId(settings.ga_measurement_id, /G-[A-Z0-9]+/i)
  const gtmId = normalizeAnalyticsId(settings.gtm_container_id, /GTM-[A-Z0-9]+/i)

  if (!gaId && !gtmId) return null

  return (
    <>
      {!consented && (gaId || gtmId) && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[90] bg-ink border border-paper/10 p-4 rounded-xl shadow-2xl">
          <p className="text-paper/70 text-xs leading-relaxed mb-3">
            Deneyiminizi iyileştirmek için analitik çerezler kullanıyoruz.
          </p>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem(CONSENT_KEY, 'true')
              setConsented(true)
            }}
            className="w-full py-2 bg-gold text-ink text-xs font-medium rounded-lg hover:bg-gold/90"
          >
            Kabul Et
          </button>
        </div>
      )}
      {consented && (
        <Helmet>
          {gtmId && (
            <script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}</script>
          )}
          {gaId && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
              <script>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}</script>
            </>
          )}
        </Helmet>
      )}
    </>
  )
}
