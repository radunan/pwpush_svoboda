'use client'

import { useT } from '@/context/LanguageContext'

interface Props {
  hasCredentials: boolean
  email: string | undefined
}

export default function SettingsContent({ hasCredentials, email }: Props) {
  const t = useT()

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="flex h-1 w-10 mb-5 overflow-hidden rounded-full">
          <div className="flex-1 bg-[#FDEF01]" />
          <div className="flex-1 bg-[#E90189]" />
          <div className="flex-1 bg-[#01ABEC]" />
          <div className="flex-1 bg-[#5D5D5D]" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--fg)] tracking-tight">{t.settings.title}</h1>
        <p className="mt-2 text-[var(--muted-col)]">
          {t.settings.subtitle}
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border-col)] bg-white shadow-sm divide-y divide-[var(--border-col)]">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm font-medium text-[var(--fg)]">{t.settings.account}</span>
          {hasCredentials ? (
            <span className="flex items-center gap-2 text-sm font-medium text-brand">
              <span className="w-2 h-2 rounded-full bg-brand inline-block" />
              {t.settings.configured}
            </span>
          ) : (
            <span className="flex items-center gap-2 text-sm font-medium text-red-500">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              {t.settings.missing}
            </span>
          )}
        </div>

        {hasCredentials && (
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-[var(--muted-col)]">{t.settings.email}</span>
            <span className="text-sm font-mono text-[var(--fg)]">{email}</span>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-[var(--muted-col)]">{t.settings.apiToken}</span>
          <span className="text-sm text-[var(--muted-col)]">
            {hasCredentials ? '••••••••••••' : '—'}
          </span>
        </div>
      </div>

      {!hasCredentials && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 space-y-1">
          <p className="font-semibold">{t.settings.warningTitle}</p>
          <p>{t.settings.warningText}</p>
          <p className="mt-2">{t.settings.warningInstruction}</p>
          <pre className="mt-1 text-xs bg-amber-100 rounded p-2 font-mono">
{`PWPUSH_EMAIL=admin@svoboda.cz
PWPUSH_TOKEN=vas_api_token`}
          </pre>
          <p className="text-xs text-amber-700 mt-1">
            {t.settings.warningRebuild}
          </p>
        </div>
      )}

      <p className="mt-5 text-xs text-[var(--muted-col)]">
        {t.settings.footnote}
      </p>
    </div>
  )
}
