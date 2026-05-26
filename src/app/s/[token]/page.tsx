import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SecretPageShell from '@/components/SecretPageShell'
import { getBase } from '@/lib/pwpush'
import type { Push } from '@/lib/pwpush'

export const metadata: Metadata = { title: 'Údaje' }

export default async function SecretPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const base = getBase()

  let push: Push | null = null
  let fetchError = false
  let isLocked = false

  try {
    const res = await fetch(`${base}/p/${token}.json`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    if (res.status === 404) return notFound()

    if (res.status === 401) {
      const errData = await res.json().catch(() => ({}))
      if (errData.status === 'unauthorized') {
        isLocked = true
      } else {
        fetchError = true
      }
    } else if (res.ok) {
      push = await res.json()
    } else {
      fetchError = true
    }
  } catch {
    fetchError = true
  }

  if (!fetchError && !push && !isLocked) return notFound()

  return (
    <SecretPageShell
      push={push}
      token={token}
      isLocked={isLocked}
      fetchError={fetchError}
    />
  )
}
