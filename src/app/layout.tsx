import type { Metadata, Viewport } from 'next'

import '@/assets/vendor/bootstrap/css/bootstrap.min.css'
import '@/assets/css/main.css'
import '@/theme/landing-root.css'
import '@/assets/vendor/bootstrap-icons/bootstrap-icons.css'
import ThemeRegistry from '@/theme/ThemeRegistry'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anterosistemas.com.br'
const SITE_NAME = 'ANTERO Sistemas'
const DEFAULT_TITLE =
  'Desenvolvimento de software personalizado para empresas em Santa Catarina | ANTERO Sistemas'
const DEFAULT_DESCRIPTION =
  'Empresa de desenvolvimento de software sob medida em Santa Catarina. Criamos sistemas empresariais, automação de processos e aplicativos personalizados para empresas em todo o Brasil. Solicite um orçamento.'

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | ANTERO Sistemas',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: 'Next.js',
  keywords: [
    'desenvolvimento de software personalizado',
    'criação de sistemas sob medida',
    'sistemas empresariais',
    'automação de processos empresariais',
    'desenvolvimento de sistemas web',
    'software sob medida para empresas',
    'empresa de software em Santa Catarina',
    'fábrica de software no Brasil',
    'desenvolvimento de aplicativos personalizados',
    'integração de sistemas',
    'ERP sob medida',
    'consultoria em desenvolvimento de software',
    'ANTERO Sistemas',
  ],
  authors: [{ name: 'ANTERO Sistemas', url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'Tecnologia',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/antero_logo_v1.png', type: 'image/png' },
    ],
    apple: '/antero_logo_v1.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/antero_logo_v1.png',
        width: 1200,
        height: 630,
        alt: 'ANTERO Sistemas — Desenvolvimento de software sob medida',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/antero_logo_v1.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    // Preencha quando configurar o Google Search Console:
    // google: 'GOOGLE_SITE_VERIFICATION_TOKEN',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}
