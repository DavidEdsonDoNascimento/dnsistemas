import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getCurrentUser } from '@/features/auth/session/get-user'
import PainelShell from '@/features/painel/layout/PainelShell'

export const metadata: Metadata = {
  title: 'Painel interno',
  description: 'Área administrativa interna da ANTERO Sistemas.',
  robots: { index: false, follow: false },
}

export default async function PainelLayout({ children }: { children: ReactNode }) {
  // Defesa em camadas: o middleware já barra não-autenticados,
  // mas obtemos o user aqui para alimentar a Topbar (avatar, nome, logout).
  const user = await getCurrentUser()
  return <PainelShell user={user}>{children}</PainelShell>
}
