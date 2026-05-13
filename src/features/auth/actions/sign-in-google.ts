'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '../lib/supabase-server'

const SAFE_NEXT_PATH = /^\/painel(?:\/.*)?$/

async function resolveOrigin(): Promise<string> {
  const h = await headers()
  const explicitOrigin = h.get('origin')
  if (explicitOrigin) return explicitOrigin

  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto =
    h.get('x-forwarded-proto') ??
    (host && host.startsWith('localhost') ? 'http' : 'https')

  if (host) return `${proto}://${host}`
  return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}

/**
 * Server Action: inicia o fluxo OAuth com Google.
 * Gera a URL de autorização no servidor e redireciona o navegador.
 * O retorno do Google passará por `/auth/callback` para troca de `code` por sessão.
 */
export async function signInWithGoogleAction(formData: FormData) {
  const nextRaw = String(formData.get('next') ?? '/painel')
  const next = SAFE_NEXT_PATH.test(nextRaw) ? nextRaw : '/painel'

  const origin = await resolveOrigin()
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })

  if (error || !data?.url) {
    redirect(`/login?error=oauth`)
  }

  redirect(data.url)
}
