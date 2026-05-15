import Link from 'next/link'
import ExpireButton from './ExpireButton'
import type { Push } from '@/lib/pwpush'

interface Props {
  pushes: Push[]
  expired?: boolean
}

function formatDate(iso: string | null) {
  if (!iso) return '–'
  return new Date(iso).toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function DashboardTable({ pushes, expired = false }: Props) {
  if (pushes.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-[var(--muted-col)]">
        {expired ? 'Žádné expirované pushe.' : 'Žádné aktivní pushe.'}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border-col)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--card-bg)] border-b border-[var(--border-col)]">
            <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">Token</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">Poznámka</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">Zobrazení</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">Vyprší</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">Akce</th>
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
                  <span className="text-[var(--muted-col)]">expirováno</span>
                ) : (
                  <span>
                    <span className="font-medium">{push.views_remaining}</span>
                    <span className="text-[var(--muted-col)]">/{push.expire_after_views}</span>
                  </span>
                )}
              </td>
              <td className="px-3 py-2 text-[var(--muted-col)] tabular-nums">
                {formatDate(push.expiration_date)}
              </td>
              <td className="px-3 py-2 text-right">
                <div className="flex justify-end items-center gap-3">
                  <Link
                    href={`/dashboard/${push.url_token}/audit`}
                    className="text-xs text-[var(--muted-col)] hover:text-[var(--fg)] hover:underline"
                  >
                    Audit
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
