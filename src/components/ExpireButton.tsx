'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ExpireButton({ token }: { token: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function expire() {
    if (!confirm('Opravdu chcete tento push expirovat?')) return
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
      {loading ? 'Mazání...' : 'Expirovat'}
    </button>
  )
}
