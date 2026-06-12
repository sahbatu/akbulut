import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSiteData } from '@/hooks/useSiteData'

const CONSENT_KEY = 'akbulut_analytics_consent'

type ConsentState = 'pending' | 'accepted' | 'rejected'

function readConsentState(): ConsentState {
  const stored = localStorage.getItem(CONSENT_KEY)
  if (stored === 'true') return 'accepted'
  if (stored === 'false') return 'rejected'
  return 'pending'
}

function normalizeAnalyticsId(raw: string | undefined, pattern: RegExp) {
  const cleaned = String(raw ?? '')
    .replace(/^"|"$/g, '')
    .trim()
  const match = cleaned.match(pattern)
  return match?.[0] ?? cleaned
}

export function AnalyticsScripts() {
  const { settings } = useSiteData()
  const [consent, setConsent] = useState<ConsentState>(readConsentState)

  const gaId = normalizeAnalyticsId(settings.ga_measurement_id, /G-[A-Z0-9]+/i)
  const gtmId = normalizeAnalyticsId(settings.gtm_container_id, /GTM-[A-Z0-9]+/i)

  if (!gaId && !gtmId) return null

  return (
    <>
      {consent === 'pending' && (gaId || gtmId) && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[90] bg-paper border border-ink/10 p-4 rounded-xl shadow-xl shadow-ink/10">
          <p className="text-ink/70 text-xs leading-relaxed mb-3">
            Deneyiminizi iyileştirmek için analitik çerezler kullanıyoruz. Detaylar için{' '}
            <Link to="/cerez-politikasi" className="text-gold hover:underline">
              Çerez Politikası
            </Link>
            &apos;nı inceleyebilirsiniz.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                localStorage.setItem(CONSENT_KEY, 'false')
                setConsent('rejected')
              }}
              className="flex-1 py-2 border border-ink/15 text-ink/70 text-xs rounded-lg hover:border-ink/25"
            >
              Reddet
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem(CONSENT_KEY, 'true')
                setConsent('accepted')
              }}
              className="flex-1 py-2 bg-gold text-paper text-xs font-medium rounded-lg hover:bg-gold-light"
            >
              Kabul Et
            </button>
          </div>
        </div>
      )}
      {consent === 'accepted' && (
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
