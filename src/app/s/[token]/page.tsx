import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SecretView from '@/components/SecretView'
import { getBase } from '@/lib/pwpush'
import type { Push } from '@/lib/pwpush'

export const metadata: Metadata = { title: 'Tajemství' }

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

  if (fetchError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 text-center space-y-2">
        <p className="font-medium text-[var(--fg)]">Nelze načíst tajemství</p>
        <p className="text-sm text-[var(--muted-col)]">Zkontrolujte připojení k pwpush instanci.</p>
      </div>
    )
  }

  if (!push && !isLocked) return notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-[var(--fg)]">Sdílené tajemství</h1>
        <p className="text-sm text-[var(--muted-col)] mt-0.5">
          Byl vám sdílen odkaz na citlivé informace.
        </p>
      </div>
      <SecretView initialPush={push} token={token} isLocked={isLocked} />
    </div>
  )
}
