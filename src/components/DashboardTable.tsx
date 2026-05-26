'use client'

import Link from 'next/link'
import ExpireButton from './ExpireButton'
import type { Push } from '@/lib/pwpush'
import { useT, useLang } from '@/context/LanguageContext'
import { formatDate } from '@/lib/i18n'

interface Props {
  pushes: Push[]
  expired?: boolean
}

export default function DashboardTable({ pushes, expired = false }: Props) {
  const t = useT()
  const [locale] = useLang()

  if (pushes.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-[var(--muted-col)]">
        {expired ? t.dashboard.noExpired : t.dashboard.noActive}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border-col)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--card-bg)] border-b border-[var(--border-col)]">
            <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">{t.dashboard.colToken}</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">{t.dashboard.colNote}</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">{t.dashboard.colViews}</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">{t.dashboard.colExpires}</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">{t.dashboard.colActions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-col)]">
          {pushes.map(push => (
            <tr key={push.url_token} className="hover:bg-[var(--card-bg)] transition-colors">
              <td className="px-3 py-2 font-mono">
                <Link
                  href={`/s/${push.url_token}`}
                  className="text-brand hover:underline"
                >
                  {push.url_token.slice(0, 8)}…
                </Link>
              </td>
              <td className="px-3 py-2 text-[var(--muted-col)]">
                {push.note ?? <span className="text-[var(--border-col)]">–</span>}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {expired ? (
                  <span className="text-[var(--muted-col)]">{t.dashboard.expiredStatus}</span>
                ) : (
                  <span>
                    <span className="font-medium">{push.views_remaining}</span>
                    <span className="text-[var(--muted-col)]">/{push.expire_after_views}</span>
                  </span>
                )}
              </td>
              <td className="px-3 py-2 text-[var(--muted-col)] tabular-nums">
                {formatDate(push.expiration_date, locale)}
              </td>
              <td className="px-3 py-2 text-right">
                <div className="flex justify-end items-center gap-3">
                  <Link
                    href={`/dashboard/${push.url_token}/audit`}
                    className="text-xs text-[var(--muted-col)] hover:text-[var(--fg)] hover:underline"
                  >
                    {t.dashboard.audit}
                  </Link>
                  {!expired && <ExpireButton token={push.url_token} />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
