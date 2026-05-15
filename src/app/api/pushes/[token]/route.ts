import { getBase, buildAuthHeaders, getAdminEmail, getAdminToken } from '@/lib/pwpush'
import type { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const base = getBase()
  const passphrase = request.nextUrl.searchParams.get('passphrase') ?? ''

  const url = passphrase
    ? `${base}/p/${token}.json?passphrase=${encodeURIComponent(passphrase)}`
    : `${base}/p/${token}.json`

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return Response.json({ error: 'Cannot connect to pwpush instance' }, { status: 503 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const base = getBase()
  try {
    const res = await fetch(`${base}/p/${token}.json`, {
      method: 'DELETE',
      headers: buildAuthHeaders(getAdminEmail(), getAdminToken()),
      cache: 'no-store',
    })
    const data = await res.json()
    return Response.json(data, { status: res.status })
  } catch {
    return Response.json({ error: 'Cannot connect to pwpush instance' }, { status: 503 })
  }
}
