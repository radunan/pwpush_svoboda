'use client'

import PushForm from './PushForm'
import { useT } from '@/context/LanguageContext'

export default function HomeContent() {
  const t = useT()

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="h-1 w-24 rounded-full bg-brand-yellow mb-5" />
        <h1 className="text-2xl font-bold text-[var(--fg)] tracking-tight">{t.home.heading}</h1>
        <p className="mt-2 text-base text-[var(--muted-col)] leading-relaxed">
          {t.home.description}
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border-col)] bg-white shadow-sm">
        <div className="p-6 border-b border-[var(--border-col)]">
          <PushForm />
        </div>

        <div className="px-6 py-4 grid grid-cols-3 gap-4 bg-[var(--bg)] rounded-b-xl">
          <div className="flex gap-2.5 text-sm text-[var(--muted-col)]">
            <span className="font-bold text-brand shrink-0">1.</span>
            <span>{t.home.step1}</span>
          </div>
          <div className="flex gap-2.5 text-sm text-[var(--muted-col)]">
            <span className="font-bold text-brand shrink-0">2.</span>
            <span>{t.home.step2}</span>
          </div>
          <div className="flex gap-2.5 text-sm text-[var(--muted-col)]">
            <span className="font-bold text-brand shrink-0">3.</span>
            <span>{t.home.step3}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-[var(--muted-col)] text-center">
        {t.home.securityNote}{' '}
        <a href="/settings" className="text-brand hover:underline">{t.home.securityNoteLink}</a>.
      </p>
    </div>
  )
}
