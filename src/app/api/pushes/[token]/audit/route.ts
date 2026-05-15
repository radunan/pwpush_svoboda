import { getBase, buildAuthHeaders, getAdminEmail, getAdminToken } from '@/lib/pwpush'
import type { NextRequest } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const base = getBase()

  try {
    const res = await fetch(`${base}/p/${token}/audit.json`, {
      headers: buildAuthHeaders(getAdminEmail(), getAdminToken()),
      cache: 'no-store',
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return Response.json({ error: 'Cannot connect to pwpush instance' }, { status: 503 })
  }
}
