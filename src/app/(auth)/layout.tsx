import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Acesso restrito — Painel interno da ANTERO Sistemas.',
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
