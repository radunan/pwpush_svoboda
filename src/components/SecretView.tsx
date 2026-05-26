'use client'

import { useState } from 'react'
import type { Push } from '@/lib/pwpush'
import { useT, useLang } from '@/context/LanguageContext'
import { pluralDays, pluralViews } from '@/lib/i18n'

interface Props {
  initialPush: Push | null
  token: string
  isLocked?: boolean
}

export default function SecretView({ initialPush, token, isLocked = false }: Props) {
  const t = useT()
  const [locale] = useLang()
  const [push, setPush] = useState<Push | null>(initialPush)
  const [revealed, setRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [passphrase, setPassphrase] = useState('')
  const [needsPassphrase, setNeedsPassphrase] = useState(isLocked)
  const [passphraseError, setPassphraseError] = useState('')
  const [fetching, setFetching] = useState(false)

  async function fetchWithPassphrase() {
    setPassphraseError('')
    setFetching(true)
    const url = `/api/pushes/${token}${passphrase ? `?passphrase=${encodeURIComponent(passphrase)}` : ''}`
    const res = await fetch(url)
    const data = await res.json()
    setFetching(false)
    if (!res.ok || data.error) {
      setPassphraseError(t.secret.wrongPassphrase)
      return
    }
    setPush(data)
    setNeedsPassphrase(false)
    setRevealed(false)
  }

  async function copy() {
    if (!push?.payload) return
    await navigator.clipboard.writeText(push.payload)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function deleteNow() {
    setDeleting(true)
    const res = await fetch(`/api/pushes/${token}`, { method: 'DELETE' })
    if (res.ok) setDeleted(true)
    setDeleting(false)
  }

  if ((push?.expired || push?.deleted) || deleted) {
    return (
      <div className="rounded-lg border border-[var(--border-col)] bg-[var(--card-bg)] p-6 text-center space-y-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-10 h-10 mx-auto text-[var(--muted-col)]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <p className="font-medium text-[var(--fg)]">{t.secret.expiredTitle}</p>
        <p className="text-sm text-[var(--muted-col)]">{t.secret.expiredText}</p>
        <a href="/" className="inline-block mt-2 text-sm text-brand hover:underline">{t.secret.expiredLink}</a>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Passphrase gate */}
      {needsPassphrase && (
        <div className="rounded-lg border border-[var(--border-col)] bg-[var(--card-bg)] p-6 text-center space-y-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-10 h-10 mx-auto text-brand">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <p className="font-medium text-[var(--fg)]">{t.secret.passwordProtected}</p>
          <div className="flex gap-2 max-w-xs mx-auto">
            <input
              type="password"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchWithPassphrase()}
              placeholder={t.secret.passphrasePlaceholder}
              className="flex-1 h-8 px-2.5 text-sm rounded-md border border-[var(--border-col)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--muted-col)] focus:outline-none focus:ring-2 focus:ring-brand"
              autoFocus
            />
            <button
              onClick={fetchWithPassphrase}
              disabled={fetching}
              className="h-8 px-3 text-sm font-medium rounded-md bg-brand hover:bg-brand-dark text-white transition-colors disabled:opacity-50"
            >
              {fetching ? '...' : t.secret.passphraseSubmit}
            </button>
          </div>
          {passphraseError && <p className="text-sm text-red-500">{passphraseError}</p>}
        </div>
      )}

      {/* Secret content with blur-to-reveal */}
      {!needsPassphrase && push?.payload && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--fg)]">{t.secret.secretLabel}</span>
            {revealed && (
              <button
                onClick={copy}
                className="h-7 px-2.5 text-xs rounded-md border border-[var(--border-col)] hover:bg-[var(--card-bg)] text-[var(--muted-col)] hover:text-[var(--fg)] transition-colors"
              >
                {copied ? t.secret.copied : t.secret.copy}
              </button>
            )}
          </div>

          <div className="relative rounded-lg border border-[var(--border-col)] overflow-hidden">
            <pre className={`p-5 text-sm font-mono whitespace-pre-wrap break-all bg-[var(--card-bg)] text-[var(--fg)] leading-relaxed transition-[filter] duration-300 ${revealed ? 'min-h-[5rem]' : 'blur-sm select-none max-h-44 min-h-[7rem]'}`}>
              {push.payload}
            </pre>
            {!revealed && (
              <div
                onClick={() => setRevealed(true)}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/10 hover:bg-black/15 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6 text-brand drop-shadow">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-xs font-medium text-white drop-shadow-sm bg-brand/80 px-2.5 py-1 rounded-full">
                  {t.secret.clickToReveal}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadata */}
      {!needsPassphrase && push && (
        <div className="flex flex-wrap gap-3 text-xs text-[var(--muted-col)]">
          {push.views_remaining !== undefined && (
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {push.views_remaining} {pluralViews(push.views_remaining, locale)} {t.secret.viewsLeftSuffix}
            </span>
          )}
          {push.days_remaining !== undefined && (
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {t.secret.expiresInPrefix} {push.days_remaining} {pluralDays(push.days_remaining, locale)}
            </span>
          )}
          {push.deletable_by_viewer && revealed && (
            <button
              onClick={deleteNow}
              disabled={deleting}
              className="flex items-center gap-1 text-red-500 hover:underline disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {deleting ? t.secret.deleting : t.secret.delete}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
