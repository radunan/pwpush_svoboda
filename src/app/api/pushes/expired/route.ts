import { getBase, buildAuthHeaders, getAdminEmail, getAdminToken } from '@/lib/pwpush'

export async function GET() {
  const base = getBase()

  try {
    const res = await fetch(`${base}/p/expired.json`, {
      headers: buildAuthHeaders(getAdminEmail(), getAdminToken()),
      cache: 'no-store',
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return Response.json({ error: 'Cannot connect to pwpush instance' }, { status: 503 })
  }
}
