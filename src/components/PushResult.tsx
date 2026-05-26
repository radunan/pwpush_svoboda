'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useT } from '@/context/LanguageContext'

interface Props {
  token: string
  onReset: () => void
}

export default function PushResult({ token, onReset }: Props) {
  const t = useT()
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/s/${token}`
    : `/s/${token}`

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      {/* Success header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold text-[var(--fg)]">{t.result.title}</p>
          <p className="text-sm text-[var(--muted-col)]">{t.result.subtitle}</p>
        </div>
      </div>

      {/* URL row */}
      <div className="flex gap-2">
        <input
          readOnly
          value={url}
          className="flex-1 h-10 px-3 text-sm font-mono rounded-lg border border-[var(--border-col)] bg-[var(--bg)] text-[var(--fg)] min-w-0 focus:outline-none focus:ring-2 focus:ring-brand"
          onFocus={e => e.target.select()}
        />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={t.result.openLink}
          className="h-10 w-10 flex items-center justify-center rounded-lg border border-[var(--border-col)] bg-white hover:border-brand hover:text-brand text-[var(--muted-col)] transition-colors shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <button
          onClick={copy}
          className="h-10 px-4 text-sm font-semibold rounded-lg transition-colors shrink-0 text-white"
          style={{ backgroundColor: copied ? '#0c496c' : '#00a3e4' }}
        >
          {copied ? t.result.copied : t.result.copy}
        </button>
      </div>

      {/* QR code toggle */}
      <div>
        <button
          onClick={() => setShowQr(v => !v)}
          className="flex items-center gap-2 text-sm text-[var(--muted-col)] hover:text-brand transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 shrink-0">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 14h2v2h-2zM18 14h3M14 18v3M18 18h3v3h-3zM20 14v2" />
          </svg>
          {showQr ? t.result.hideQr : t.result.showQr}
        </button>

        {showQr && (
          <div className="mt-3 flex justify-center p-4 rounded-lg border border-[var(--border-col)] bg-white">
            <QRCodeSVG
              value={url}
              size={180}
              fgColor="#0c496c"
              bgColor="#ffffff"
              level="M"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-[var(--border-col)]">
        <p className="text-xs text-[var(--muted-col)]">
          {t.result.expireNote}
        </p>
        <button
          onClick={onReset}
          className="text-sm text-brand hover:text-brand-dark font-medium transition-colors shrink-0 ml-4"
        >
          {t.result.newPush}
        </button>
      </div>
    </div>
  )
}
