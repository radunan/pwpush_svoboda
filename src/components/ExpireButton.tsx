'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useT } from '@/context/LanguageContext'

export default function ExpireButton({ token }: { token: string }) {
  const t = useT()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function expire() {
    if (!confirm(t.dashboard.expireConfirm)) return
    setLoading(true)
    await fetch(`/api/pushes/${token}`, { method: 'DELETE' })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={expire}
      disabled={loading}
      className="text-xs text-red-500 hover:underline disabled:opacity-50"
    >
      {loading ? t.dashboard.expiring : t.dashboard.expire}
    </button>
  )
}
