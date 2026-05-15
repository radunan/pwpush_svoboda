import type { Metadata } from 'next'
import Link from 'next/link'
import { getBase, buildAuthHeaders, getAdminEmail, getAdminToken } from '@/lib/pwpush'
import type { AuditEvent } from '@/lib/pwpush'

export const metadata: Metadata = { title: 'Audit log' }

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('cs-CZ', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export default async function AuditPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const base = getBase()
  let events: AuditEvent[] = []
  let fetchError = false

  try {
    const res = await fetch(`${base}/p/${token}/audit.json`, {
      headers: buildAuthHeaders(getAdminEmail(), getAdminToken()),
      cache: 'no-store',
    })
    if (res.ok) {
      const data = await res.json()
      events = Array.isArray(data) ? data : (data.views ?? [])
    } else {
      fetchError = true
    }
  } catch {
    fetchError = true
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/dashboard" className="text-sm text-[var(--muted-col)] hover:text-[var(--fg)] transition-colors">
          ← Dashboard
        </Link>
        <span className="text-[var(--border-col)]">/</span>
        <h1 className="text-lg font-semibold text-[var(--fg)]">
          Audit log – <span className="font-mono text-sm">{token.slice(0, 8)}…</span>
        </h1>
      </div>

      {fetchError ? (
        <div className="text-sm text-[var(--muted-col)] py-4">Nepodařilo se načíst audit log.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--border-col)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--card-bg)] border-b border-[var(--border-col)]">
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">Čas</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">IP adresa</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">Referrer</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">User agent</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-[var(--muted-col)] uppercase tracking-wide">Úspěch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-col)]">
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-[var(--muted-col)]">
                    Žádné záznamy.
                  </td>
                </tr>
              )}
              {events.map((e, i) => (
                <tr key={i} className="hover:bg-[var(--card-bg)] transition-colors">
                  <td className="px-3 py-2 tabular-nums text-xs whitespace-nowrap">{formatDate(e.created_at)}</td>
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
