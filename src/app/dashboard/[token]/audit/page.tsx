import type { Metadata } from 'next'
import { getBase, buildAuthHeaders, getAdminEmail, getAdminToken } from '@/lib/pwpush'
import type { AuditEvent } from '@/lib/pwpush'
import AuditContent from '@/components/AuditContent'

export const metadata: Metadata = { title: 'Audit log' }

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
    <AuditContent events={events} token={token} fetchError={fetchError} />
  )
}
