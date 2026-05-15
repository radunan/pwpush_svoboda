'use client'

import { useState } from 'react'
import PushResult from './PushResult'
import type { CreatePushInput } from '@/lib/pwpush'

const VIEW_OPTIONS = [1, 2, 3, 5, 10, 25, 50, 100]
const DAY_OPTIONS = [1, 2, 3, 7, 14, 21, 28]

export default function PushForm() {
  const [payload, setPayload] = useState('')
  const [expireViews, setExpireViews] = useState(5)
  const [expireDays, setExpireDays] = useState(7)
  const [retrievalStep, setRetrievalStep] = useState(false)
  const [deletable, setDeletable] = useState(true)
  const [passphrase, setPassphrase] = useState('')
  const [note, setNote] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [resultToken, setResultToken] = useState<string | null>(null)

  function reset() {
    setPayload('')
    setExpireViews(5)
    setExpireDays(7)
    setRetrievalStep(false)
    setDeletable(true)
    setPassphrase('')
    setNote('')
    setShowAdvanced(false)
    setError('')
    setResultToken(null)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!payload.trim()) {
      setError('Zadejte text tajemství.')
      return
    }
    setError('')
    setSubmitting(true)

    const body: CreatePushInput = {
      payload: payload.trim(),
      expire_after_views: expireViews,
      expire_after_days: expireDays,
      retrieval_step: retrievalStep,
      deletable_by_viewer: deletable,
    }
    if (passphrase) body.passphrase = passphrase
    if (note) body.note = note

    try {
      const res = await fetch('/api/pushes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Chyba při vytváření push.')
      } else {
        setResultToken(data.url_token ?? data.token)
      }
    } catch {
      setError('Nelze se připojit k serveru.')
    } finally {
      setSubmitting(false)
    }
  }

  if (resultToken) {
    return <PushResult token={resultToken} onReset={reset} />
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Textarea */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-[var(--fg)]">
          Tajemství
        </label>
        <textarea
          value={payload}
          onChange={e => setPayload(e.target.value)}
          placeholder="Heslo, API klíč, certifikát, cokoliv citlivého…"
          className="w-full min-h-[180px] px-4 py-3 text-sm font-mono rounded-lg border border-[var(--border-col)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--muted-col)] resize-y focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors"
          required
        />
      </div>

      {/* Expiry selects */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[var(--fg)]">Počet zobrazení</label>
          <select
            value={expireViews}
            onChange={e => setExpireViews(Number(e.target.value))}
            className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--border-col)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {VIEW_OPTIONS.map(v => (
              <option key={v} value={v}>{v} zobrazení</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[var(--fg)]">Platnost</label>
          <select
            value={expireDays}
            onChange={e => setExpireDays(Number(e.target.value))}
            className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--border-col)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {DAY_OPTIONS.map(d => (
              <option key={d} value={d}>{d} {d === 1 ? 'den' : 'dní'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(v => !v)}
          className="flex items-center gap-1.5 text-sm text-[var(--muted-col)] hover:text-[var(--fg)] transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Pokročilé možnosti
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 pt-4 border-t border-[var(--border-col)]">
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={retrievalStep}
                  onChange={e => setRetrievalStep(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand"
                />
                <span className="text-[var(--fg)]">Vyžadovat klik pro zobrazení</span>
              </label>

              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={deletable}
                  onChange={e => setDeletable(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand"
                />
                <span className="text-[var(--fg)]">Umožnit příjemci smazat</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[var(--fg)]">Heslo pro přístup</label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={e => setPassphrase(e.target.value)}
                  placeholder="Volitelné"
                  className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--border-col)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--muted-col)] focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[var(--fg)]">Poznámka</label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Jen pro vás"
                  className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--border-col)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--muted-col)] focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || !payload.trim()}
        className="w-full h-11 text-base font-semibold rounded-lg bg-brand hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
      >
        {submitting ? 'Vytváření…' : 'Vytvořit bezpečný odkaz'}
      </button>
    </form>
  )
}
