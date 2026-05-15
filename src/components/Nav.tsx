import Image from 'next/image'
import Link from 'next/link'

export default function Nav() {
  return (
    <header className="h-14 border-b border-[var(--border-col)] flex items-center px-6 gap-6 bg-white shadow-sm">
      <Link href="/" className="flex items-center shrink-0">
        <Image
          src="/severotisk_logo.png"
          alt="Severotisk"
          width={200}
          height={22}
          priority
          unoptimized
          className="h-7 w-auto"
        />
      </Link>

      <nav className="flex items-center gap-1 text-sm font-medium">
        <Link href="/" className="px-3 py-1.5 rounded-md text-[var(--muted-col)] hover:text-brand hover:bg-[var(--bg)] transition-colors">
          Nový push
        </Link>
        <Link href="/dashboard" className="px-3 py-1.5 rounded-md text-[var(--muted-col)] hover:text-brand hover:bg-[var(--bg)] transition-colors">
          Dashboard
        </Link>
        <Link href="/health" className="px-3 py-1.5 rounded-md text-[var(--muted-col)] hover:text-brand hover:bg-[var(--bg)] transition-colors">
          Zdraví
        </Link>
      </nav>

      <div className="ml-auto">
        <Link
          href="/settings"
          title="Nastavení"
          className="w-8 h-8 flex items-center justify-center rounded-md text-[var(--muted-col)] hover:text-brand hover:bg-[var(--bg)] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>
    </header>
  )
}
