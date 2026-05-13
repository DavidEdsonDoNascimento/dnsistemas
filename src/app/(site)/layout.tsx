import type { ReactNode } from 'react'
import FloatingButtons from '@/components/FloatingButtons'

/**
 * Layout do site público (landing).
 * Mantém o FloatingButtons (WhatsApp / scroll-to-top) restrito ao site,
 * sem vazar para a área interna do painel.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <FloatingButtons />
    </>
  )
}
