'use client'

import type { Push } from '@/lib/pwpush'
import SecretView from './SecretView'
import { useT } from '@/context/LanguageContext'

interface Props {
  push: Push | null
  token: string
  isLocked: boolean
  fetchError: boolean
}

export default function SecretPageShell({ push, token, isLocked, fetchError }: Props) {
  const t = useT()

  if (fetchError) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 text-center space-y-2">
        <p className="font-medium text-[var(--fg)]">{t.secret.fetchError}</p>
        <p className="text-sm text-[var(--muted-col)]">{t.secret.fetchErrorHint}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-[var(--fg)]">{t.secret.title}</h1>
        <p className="text-sm text-[var(--muted-col)] mt-0.5">
          {t.secret.subtitle}
        </p>
      </div>
      <SecretView initialPush={push} token={token} isLocked={isLocked} />
    </div>
  )
}
