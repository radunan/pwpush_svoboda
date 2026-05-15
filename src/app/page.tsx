import type { Metadata } from 'next'
import PushForm from '@/components/PushForm'

export const metadata: Metadata = { title: 'Nový push' }

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Page header */}
      <div className="mb-8">
        <div className="h-1 w-24 rounded-full bg-brand-yellow mb-5" />
        <h1 className="text-2xl font-bold text-[var(--fg)] tracking-tight">Bezpečné sdílení tajemství</h1>
        <p className="mt-2 text-base text-[var(--muted-col)] leading-relaxed">
          Vložte heslo, API klíč nebo jiný citlivý text. Vygeneruje se odkaz s expirací — po dosažení limitu je obsah trvale smazán.
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-[var(--border-col)] bg-white shadow-sm">
        <div className="p-6 border-b border-[var(--border-col)]">
          <PushForm />
        </div>

        {/* Steps footer */}
        <div className="px-6 py-4 grid grid-cols-3 gap-4 bg-[var(--bg)] rounded-b-xl">
          <div className="flex gap-2.5 text-sm text-[var(--muted-col)]">
            <span className="font-bold text-brand shrink-0">1.</span>
            <span>Vložte tajemství a nastavte expiraci</span>
          </div>
          <div className="flex gap-2.5 text-sm text-[var(--muted-col)]">
            <span className="font-bold text-brand shrink-0">2.</span>
            <span>Zkopírujte a pošlete odkaz příjemci</span>
          </div>
          <div className="flex gap-2.5 text-sm text-[var(--muted-col)]">
            <span className="font-bold text-brand shrink-0">3.</span>
            <span>Po vypršení je tajemství automaticky smazáno</span>
          </div>
        </div>
      </div>

      {/* Security note */}
      <p className="mt-4 text-xs text-[var(--muted-col)] text-center">
        Tajemství jsou šifrována na serveru. Pro správu odkazů zadejte API token v{' '}
        <a href="/settings" className="text-brand hover:underline">Nastavení</a>.
      </p>
    </div>
  )
}
