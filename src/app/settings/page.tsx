import type { Metadata } from 'next'
import { getAdminEmail, getAdminToken } from '@/lib/pwpush'
import SettingsContent from '@/components/SettingsContent'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Nastavení' }

export default function SettingsPage() {
  const hasCredentials = !!(getAdminEmail() && getAdminToken())
  const email = getAdminEmail()

  return (
    <SettingsContent hasCredentials={hasCredentials} email={email} />
  )
}
