import type { ReactNode } from 'react'

import { SeoHead } from '@/components/seo/SeoHead'



interface LegalPageLayoutProps {

  title: string

  description: string

  children: ReactNode

}



export function LegalSection({ title, children }: { title: string; children: ReactNode }) {

  return (

    <section className="space-y-3">

      <h2 className="font-display text-xl text-ink">{title}</h2>

      <div className="space-y-3 text-ink/65 text-sm leading-relaxed">{children}</div>

    </section>

  )

}



export function LegalPageLayout({ title, description, children }: LegalPageLayoutProps) {

  return (

    <>

      <SeoHead title={`${title} | Akbulut`} description={description} robotsIndex={true} />

      <article className="pt-32 pb-20 md:pt-40 md:pb-28">

        <div className="max-w-3xl mx-auto px-5 md:px-8">

          <p className="eyebrow text-gold mb-4">Yasal</p>

          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-4">{title}</h1>

          <p className="text-ink/50 text-sm mb-10">{description}</p>

          <div className="space-y-10 border-t border-ink/10 pt-10">{children}</div>

        </div>

      </article>

    </>

  )

}

