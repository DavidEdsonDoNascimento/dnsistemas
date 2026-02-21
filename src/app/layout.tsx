import './globals.css'
import { ReactNode } from 'react'
import ThemeRegistry from '@/theme/ThemeRegistry'
import { Inter } from 'next/font/google'
import { Header } from '@/components/Header'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'DN Sistemas Corporativos',
  description: 'Soluções Digitais Corporativas sob Medida',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeRegistry>
          <Header />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  )
}