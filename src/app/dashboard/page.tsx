import type { Metadata } from 'next'
import Link from 'next/link'
import DashboardTable from '@/components/DashboardTable'
import { getBase, buildAuthHeaders, getAdminEmail, getAdminToken } from '@/lib/pwpush'
import type { Push } from '@/lib/pwpush'

export const metadata: Metadata = { title: 'Dashboard' }

async function fetchPushes(tab: string): Promise<Push[]> {
  const base = getBase()
  const endpoint = tab === 'expired' ? 'expired' : 'active'
  try {
    const res = await fetch(`${base}/p/${endpoint}.json`, {
      headers: buildAuthHeaders(getAdminEmail(), getAdminToken()),
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab = 'active' } = await searchParams
  const pushes = await fetchPushes(tab)
  const hasAdminCredentials = !!(getAdminEmail() && getAdminToken())

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-[var(--fg)]">Dashboard</h1>
        {!hasAdminCredentials && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
            Chybí firemní API token — nastavte PWPUSH_EMAIL a PWPUSH_TOKEN v .env
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border-col)] mb-4">
        <Link
          href="/dashboard?tab=active"
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab !== 'expired'
              ? 'border-brand text-brand'
              : 'border-transparent text-[var(--muted-col)] hover:text-[var(--fg)]'
          }`}
        >
          Aktivní
        </Link>
        <Link
          href="/dashboard?tab=expired"
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab === 'expired'
              ? 'border-brand text-brand'
              : 'border-transparent text-[var(--muted-col)] hover:text-[var(--fg)]'
          }`}
        >
          Expirované
        </Link>
      </div>

      <DashboardTable pushes={pushes} expired={tab === 'expired'} />
    </div>
  )
}
