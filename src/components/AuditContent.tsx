'use client'

import Link from 'next/link'
import type { AuditEvent } from '@/lib/pwpush'
import { useT, useLang } from '@/context/LanguageContext'
import { formatDateTime } from '@/lib/i18n'

interface Props {
  events: AuditEvent[]
  token: string
  fetchError: boolean
}

export default function AuditContent({ events, token, fetchError }: Props) {
  const t = useT()
  const [locale] = useLang()

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/dashboard" className="text-sm text-[var(--muted-col)] hover:text-[var(--fg)] transition-colors">
          {t.audit.backLink}
        </Link>
        <span className="text-[var(--border-col)]">/</span>
        <h1 className="text-lg font-semibold text-[var(--fg)]">
          {t.audit.titlePrefix}<span className="font-mono text-sm">{token.slice(0, 8)}…</span>
        </h1>
      </div>

      {fetchError ? (
        <div className="text-sm text-[var(--muted-col)] py-4">{t.audit.loadError}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--border-col)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--card-bg)] border-b border-[var(--border-col)]">
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">{t.audit.colTime}</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">{t.audit.colIp}</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">{t.audit.colReferrer}</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">{t.audit.colUserAgent}</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">{t.audit.colSuccess}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-col)]">
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-[var(--muted-col)]">
                    {t.audit.noRecords}
                  </td>
                </tr>
              )}
              {events.map((e, i) => (
                <tr key={i} className="hover:bg-[var(--card-bg)] transition-colors">
                  <td className="px-3 py-2 tabular-nums text-xs whitespace-nowrap">{formatDateTime(e.created_at, locale)}</td>
                  <td className="px-3 py-2 font-mono text-xs">{e.ip || '–'}</td>
                  <td className="px-3 py-2 text-[var(--muted-col)] text-xs max-w-xs truncate">{e.referrer || '–'}</td>
                  <td className="px-3 py-2 text-[var(--muted-col)] text-xs max-w-xs truncate">{e.user_agent || '–'}</td>
                  <td className="px-3 py-2 text-center">
                    {e.successful
                      ? <span className="text-brand font-bold text-xs">✓</span>
                      : <span className="text-red-500 font-bold text-xs">✗</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
