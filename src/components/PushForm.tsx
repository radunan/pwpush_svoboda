'use client'

import { useState } from 'react'
import PushResult from './PushResult'
import type { CreatePushInput } from '@/lib/pwpush'
import { useT, useLang } from '@/context/LanguageContext'
import { pluralDays, pluralViews } from '@/lib/i18n'

const VIEW_OPTIONS = [1, 2, 3, 5, 10, 25, 50, 100]
const DAY_OPTIONS = [1, 2, 3, 7, 14, 21, 28]

function generatePassword(
  length: number,
  upper: boolean,
  lower: boolean,
  numbers: boolean,
  special: boolean,
): string {
  const pool = [
    upper   ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '',
    lower   ? 'abcdefghijklmnopqrstuvwxyz' : '',
    numbers ? '0123456789' : '',
    special ? '!@#$%^&*()-_=+[]{}|;:,.<>?' : '',
  ].join('')
  if (!pool) return ''
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, n => pool[n % pool.length]).join('')
}

export default function PushForm() {
  const t = useT()
  const [locale] = useLang()

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

  // Generator state
  const [showGenerator, setShowGenerator] = useState(false)
  const [genLength, setGenLength] = useState(20)
  const [genUpper, setGenUpper] = useState(true)
  const [genLower, setGenLower] = useState(true)
  const [genNumbers, setGenNumbers] = useState(true)
  const [genSpecial, setGenSpecial] = useState(true)

  const noCharsSelected = !genUpper && !genLower && !genNumbers && !genSpecial

  function reset() {
    setPayload('')
    setExpireViews(5)
    setExpireDays(7)
    setRetrievalStep(false)
    setDeletable(true)
    setPassphrase('')
    setNote('')
    setShowAdvanced(false)
    setShowGenerator(false)
    setError('')
    setResultToken(null)
  }

  function handleGenerate() {
    const pwd = generatePassword(genLength, genUpper, genLower, genNumbers, genSpecial)
    if (pwd) setPayload(pwd)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!payload.trim()) {
      setError(t.form.errorEmpty)
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
        setError(data.error ?? t.form.errorCreate)
      } else {
        setResultToken(data.url_token ?? data.token)
      }
    } catch {
      setError(t.form.errorConnect)
    } finally {
      setSubmitting(false)
    }
  }

  if (resultToken) {
    return <PushResult token={resultToken} onReset={reset} />
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Textarea with generator toggle */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-[var(--fg)]">
            {t.form.secret}
          </label>
          <button
            type="button"
            onClick={() => setShowGenerator(v => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted-col)] hover:text-brand transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            {t.form.generator.toggle}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className={`w-3 h-3 transition-transform ${showGenerator ? 'rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Generator panel */}
        {showGenerator && (
          <div className="p-4 rounded-lg border border-[var(--border-col)] bg-[var(--bg)] space-y-3">
            {/* Length slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--fg)]">{t.form.generator.length}</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={8}
                    max={64}
                    value={genLength}
                    onChange={e => setGenLength(Math.min(64, Math.max(8, Number(e.target.value))))}
                    className="w-14 h-7 px-2 text-xs text-center rounded-md border border-[var(--border-col)] bg-white text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>
              <input
                type="range"
                min={8}
                max={64}
                value={genLength}
                onChange={e => setGenLength(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </div>

            {/* Character type checkboxes */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { key: 'upper', label: t.form.generator.uppercase, val: genUpper, set: setGenUpper },
                { key: 'lower', label: t.form.generator.lowercase, val: genLower, set: setGenLower },
                { key: 'nums',  label: t.form.generator.numbers,   val: genNumbers, set: setGenNumbers },
                { key: 'spec',  label: t.form.generator.special,   val: genSpecial, set: setGenSpecial },
              ].map(({ key, label, val, set }) => (
                <label key={key} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={e => set(e.target.checked)}
                    className="w-3.5 h-3.5 rounded accent-brand"
                  />
                  <span className="text-[var(--fg)]">{label}</span>
                </label>
              ))}
            </div>

            {noCharsSelected && (
              <p className="text-xs text-red-500">{t.form.generator.noChars}</p>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={noCharsSelected}
                className="h-8 px-4 text-xs font-semibold rounded-lg border border-brand text-brand hover:bg-brand hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {t.form.generator.generate} →
              </button>
            </div>
          </div>
        )}

        <textarea
          value={payload}
          onChange={e => setPayload(e.target.value)}
          placeholder={t.form.secretPlaceholder}
          className="w-full min-h-[180px] px-4 py-3 text-sm font-mono rounded-lg border border-[var(--border-col)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--muted-col)] resize-y focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors"
          required
        />
      </div>

      {/* Expiry selects */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[var(--fg)]">{t.form.views}</label>
          <select
            value={expireViews}
            onChange={e => setExpireViews(Number(e.target.value))}
            className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--border-col)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {VIEW_OPTIONS.map(v => (
              <option key={v} value={v}>{v} {pluralViews(v, locale)}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[var(--fg)]">{t.form.days}</label>
          <select
            value={expireDays}
            onChange={e => setExpireDays(Number(e.target.value))}
            className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--border-col)] bg-[var(--bg)] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {DAY_OPTIONS.map(d => (
              <option key={d} value={d}>{d} {pluralDays(d, locale)}</option>
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
          {t.form.advanced}
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
                <span className="text-[var(--fg)]">{t.form.retrievalStep}</span>
              </label>

              <label className="flex items-center gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={deletable}
                  onChange={e => setDeletable(e.target.checked)}
                  className="w-4 h-4 rounded accent-brand"
                />
                <span className="text-[var(--fg)]">{t.form.deletable}</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[var(--fg)]">{t.form.passphrase}</label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={e => setPassphrase(e.target.value)}
                  placeholder={t.form.passphrasePlaceholder}
                  className="w-full h-10 px-3 text-sm rounded-lg border border-[var(--border-col)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--muted-col)] focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-[var(--fg)]">{t.form.note}</label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder={t.form.notePlaceholder}
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
        {submitting ? t.form.submitting : t.form.submit}
      </button>
    </form>
  )
}
