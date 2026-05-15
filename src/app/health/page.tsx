import type { Metadata } from 'next'
import { getBase } from '@/lib/pwpush'
import type { VersionInfo } from '@/lib/pwpush'

export const metadata: Metadata = { title: 'Zdraví systému' }

export default async function HealthPage() {
  const base = getBase()
  let version: VersionInfo | null = null
  let connected = false
  let errorMsg = ''

  try {
    const res = await fetch(`${base}/api/v1/version`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    if (res.ok) {
      version = await res.json()
      connected = true
    } else {
      errorMsg = `HTTP ${res.status}`
    }
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : 'Neznámá chyba'
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-lg font-semibold text-[var(--fg)] mb-4">Zdraví systému</h1>

      <div className="rounded-lg border border-[var(--border-col)] bg-[var(--card-bg)] divide-y divide-[var(--border-col)]">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium text-[var(--fg)]">Stav připojení</span>
          {connected ? (
            <span className="flex items-center gap-1.5 text-sm text-brand font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Připojeno
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              Odpojeno
            </span>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-[var(--muted-col)]">URL instance</span>
          <span className="text-sm font-mono text-[var(--fg)]">{base}</span>
        </div>

        {version && (
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-[var(--muted-col)]">Verze pwpush</span>
            <span className="text-sm font-mono text-[var(--fg)]">{version.application_version ?? '–'}</span>
          </div>
        )}
        {version?.api_version && (
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-[var(--muted-col)]">Verze API</span>
            <span className="text-sm font-mono text-[var(--fg)]">{version.api_version}</span>
          </div>
        )}
        {version?.edition && (
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-[var(--muted-col)]">Edice</span>
            <span className="text-sm font-mono text-[var(--fg)]">{version.edition}</span>
          </div>
        )}

        {version?.push_expire_after_days_default !== undefined && (
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-[var(--muted-col)]">Výchozí expirování (dní)</span>
            <span className="text-sm text-[var(--fg)]">{version.push_expire_after_days_default}</span>
          </div>
        )}

        {version?.push_expire_after_views_default !== undefined && (
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-[var(--muted-col)]">Výchozí expirování (zobrazení)</span>
            <span className="text-sm text-[var(--fg)]">{version.push_expire_after_views_default}</span>
          </div>
        )}

        {!connected && errorMsg && (
          <div className="px-4 py-3">
            <p className="text-sm text-red-500">{errorMsg}</p>
            <p className="text-xs text-[var(--muted-col)] mt-1">
              Zkontrolujte, zda běží pwpush Docker kontejner na portu {base.split(':').pop()}.
            </p>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-[var(--muted-col)]">
        Tato stránka se neukládá do cache – zobrazuje aktuální stav.
      </p>
    </div>
  )
}
