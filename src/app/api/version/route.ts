import { getBase } from '@/lib/pwpush'

export async function GET() {
  const base = getBase()
  try {
    const res = await fetch(`${base}/api/v1/version`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) {
      return Response.json({ error: 'Failed to fetch version' }, { status: res.status })
    }
    const data = await res.json()
    return Response.json(data)
  } catch {
    return Response.json({ error: 'Cannot connect to pwpush instance' }, { status: 503 })
  }
}
