export const DEFAULT_BASE = 'http://localhost:5100'

export interface Push {
  url_token: string
  payload: string | null
  expire_after_views: number
  views_remaining: number
  expire_after_days: number
  days_remaining: number
  expired: boolean
  expiration_date: string | null
  retrieval_step: boolean
  note: string | null
  deletable_by_viewer: boolean
  locked?: boolean
  deleted?: boolean
}

export interface AuditEvent {
  ip: string
  user_agent: string
  referrer: string
  successful: boolean
  created_at: string
}

export interface VersionInfo {
  application_version: string
  api_version?: string
  edition?: string
  push_expire_after_days_default?: number
  push_expire_after_views_default?: number
  [key: string]: unknown
}

export interface CreatePushInput {
  payload: string
  expire_after_views?: number
  expire_after_days?: number
  retrieval_step?: boolean
  passphrase?: string
  note?: string
  deletable_by_viewer?: boolean
}

export function getBase(): string {
  return process.env.PWPUSH_API_BASE ?? DEFAULT_BASE
}

export function getAdminEmail(): string | undefined {
  return process.env.PWPUSH_EMAIL
}

export function getAdminToken(): string | undefined {
  return process.env.PWPUSH_TOKEN
}

export function buildAuthHeaders(
  email?: string | null,
  token?: string | null,
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  if (email && token) {
    headers['X-User-Email'] = email
    headers['X-User-Token'] = token
  }
  return headers
}

export function formatExpiry(push: Push): string {
  const parts: string[] = []
  if (push.views_remaining !== undefined) {
    parts.push(`${push.views_remaining} ${push.views_remaining === 1 ? 'zobrazení' : 'zobrazení'} zbývá`)
  }
  if (push.days_remaining !== undefined) {
    parts.push(`vyprší za ${push.days_remaining} ${push.days_remaining === 1 ? 'den' : 'dní'}`)
  }
  return parts.join(' · ')
}
