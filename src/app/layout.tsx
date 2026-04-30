import type { Metadata } from 'next'
// import './globals.css'
// import ThemeRegistry from '@/theme/ThemeRegistry'

import '@/assets/vendor/bootstrap/css/bootstrap.min.css'
// import '@/assets/vendor/aos/aos.css'
// import '@/assets/vendor/swiper/swiper-bundle.min.css'
// import '@/assets/vendor/glightbox/css/glightbox.min.css'
import '@/assets/css/main.css'
import '@/theme/landing-root.css'
import '@/assets/vendor/bootstrap-icons/bootstrap-icons.css'
import ThemeRegistry from '@/theme/ThemeRegistry'

export const metadata: Metadata = {
  title: 'DN Sistemas Corporativos',
  description: 'Soluções em sistemas corporativos, sites institucionais e aplicações empresariais.',
  icons: {
    icon: '/favicon_v1.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}