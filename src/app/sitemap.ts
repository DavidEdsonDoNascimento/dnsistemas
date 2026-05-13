import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anterosistemas.com.br'

/**
 * /sitemap.xml dinâmico — App Router (Next.js).
 *
 * Apenas URLs reais e indexáveis (sem fragmentos # — o Google trata como
 * duplicatas da mesma URL e pode marcar como "detectada, mas não indexada").
 *
 * Ao criar páginas dedicadas ou rotas SEO (ex. /servicos/...), inclua-as aqui.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
