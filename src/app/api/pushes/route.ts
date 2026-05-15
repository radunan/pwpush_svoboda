import { getBase, buildAuthHeaders, getAdminEmail, getAdminToken, type CreatePushInput } from '@/lib/pwpush'

export async function POST(request: Request) {
  const base = getBase()

  let body: CreatePushInput
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const res = await fetch(`${base}/p.json`, {
      method: 'POST',
      headers: buildAuthHeaders(getAdminEmail(), getAdminToken()),
      body: JSON.stringify({ password: body }),
      cache: 'no-store',
    })
    const data = await res.json()
    if (!res.ok) {
      return Response.json(data, { status: res.status })
    }
    return Response.json(data, { status: 201 })
  } catch {
    return Response.json({ error: 'Cannot connect to pwpush instance' }, { status: 503 })
  }
}
