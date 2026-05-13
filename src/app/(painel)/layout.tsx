import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import PainelShell from '@/features/painel/layout/PainelShell'

export const metadata: Metadata = {
  title: 'Painel interno',
  description: 'Área administrativa interna da ANTERO Sistemas.',
  robots: { index: false, follow: false },
}

export default function PainelLayout({ children }: { children: ReactNode }) {
  return <PainelShell>{children}</PainelShell>
}
