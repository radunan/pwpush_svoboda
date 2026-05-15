import type { Metadata } from 'next'
import { getAdminEmail, getAdminToken } from '@/lib/pwpush'

export const metadata: Metadata = { title: 'Nastavení' }

export default function SettingsPage() {
  const hasCredentials = !!(getAdminEmail() && getAdminToken())
  const email = getAdminEmail()

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="h-1 w-10 rounded-full bg-brand-yellow mb-5" />
        <h1 className="text-2xl font-bold text-[var(--fg)] tracking-tight">Nastavení</h1>
        <p className="mt-2 text-[var(--muted-col)]">
          Stav připojení k pwpush instanci.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border-col)] bg-white shadow-sm divide-y divide-[var(--border-col)]">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm font-medium text-[var(--fg)]">Firemní účet</span>
          {hasCredentials ? (
            <span className="flex items-center gap-2 text-sm font-medium text-brand">
              <span className="w-2 h-2 rounded-full bg-brand inline-block" />
              Nakonfigurován
            </span>
          ) : (
            <span className="flex items-center gap-2 text-sm font-medium text-red-500">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              Chybí
            </span>
          )}
        </div>

        {hasCredentials && (
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-[var(--muted-col)]">Email</span>
            <span className="text-sm font-mono text-[var(--fg)]">{email}</span>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-[var(--muted-col)]">API Token</span>
          <span className="text-sm text-[var(--muted-col)]">
            {hasCredentials ? '••••••••••••' : '—'}
          </span>
        </div>
      </div>

      {!hasCredentials && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 space-y-1">
          <p className="font-semibold">Credentials nejsou nastaveny</p>
          <p>Dashboard nebude zobrazovat vytvořené pushe.</p>
          <p className="mt-2">Přidejte do <code className="font-mono bg-amber-100 px-1 rounded">.env.production</code> na serveru:</p>
          <pre className="mt-1 text-xs bg-amber-100 rounded p-2 font-mono">
{`PWPUSH_EMAIL=admin@severotisk.cz
PWPUSH_TOKEN=vas_api_token`}
          </pre>
          <p className="text-xs text-amber-700 mt-1">
            Po změně je nutné znovu sestavit aplikaci (<code className="font-mono">docker compose up -d --build</code>).
          </p>
        </div>
      )}

      <p className="mt-5 text-xs text-[var(--muted-col)]">
        Credentials jsou uloženy bezpečně na serveru v proměnných prostředí — nejsou přístupné z prohlížeče.
      </p>
    </div>
  )
}
