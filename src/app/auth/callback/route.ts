import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/features/auth/lib/supabase-server'

const SAFE_NEXT = /^\/painel(?:\/.*)?$/

/**
 * OAuth callback handler.
 *
 * O provedor (Google) redireciona para esta rota com `?code=...`.
 * Trocamos o code por uma sessão (PKCE) e redirecionamos para o destino seguro.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextRaw = searchParams.get('next') ?? '/painel'
  const next = SAFE_NEXT.test(nextRaw) ? nextRaw : '/painel'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=callback`)
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=callback`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
