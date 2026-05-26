import type { Metadata } from 'next'
import DashboardContent from '@/components/DashboardContent'
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
    <DashboardContent
      pushes={pushes}
      tab={tab}
      hasAdminCredentials={hasAdminCredentials}
    />
  )
}
