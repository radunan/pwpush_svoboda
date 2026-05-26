import type { Metadata } from 'next'
import HomeContent from '@/components/HomeContent'

export const metadata: Metadata = { title: 'Nový push' }

export default function Home() {
  return <HomeContent />
}
