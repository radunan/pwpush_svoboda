import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Nav from '@/components/Nav'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: { default: 'Severotisk – Sdílení údajů', template: '%s | Severotisk' },
  description: 'Bezpečně sdílejte hesla a citlivé informace pomocí odkazů s expirací',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="cs"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <LanguageProvider>
          <Nav />
          <main className="flex-1">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  )
}
