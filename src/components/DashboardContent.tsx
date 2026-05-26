'use client'

import Link from 'next/link'
import DashboardTable from './DashboardTable'
import type { Push } from '@/lib/pwpush'
import { useT } from '@/context/LanguageContext'

interface Props {
  pushes: Push[]
  tab: string
  hasAdminCredentials: boolean
}

export default function DashboardContent({ pushes, tab, hasAdminCredentials }: Props) {
  const t = useT()

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-[var(--fg)]">{t.dashboard.title}</h1>
        {!hasAdminCredentials && (
          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
            {t.dashboard.noCredentials}
          </span>
        )}
      </div>

      <div className="flex gap-1 border-b border-[var(--border-col)] mb-4">
        <Link
          href="/dashboard?tab=active"
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab !== 'expired'
              ? 'border-brand text-brand'
              : 'border-transparent text-[var(--muted-col)] hover:text-[var(--fg)]'
          }`}
        >
          {t.dashboard.tabActive}
        </Link>
        <Link
          href="/dashboard?tab=expired"
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab === 'expired'
              ? 'border-brand text-brand'
              : 'border-transparent text-[var(--muted-col)] hover:text-[var(--fg)]'
          }`}
        >
          {t.dashboard.tabExpired}
        </Link>
      </div>

      <DashboardTable pushes={pushes} expired={tab === 'expired'} />
    </div>
  )
}
