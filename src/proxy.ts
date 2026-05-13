import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Proxy de autenticação (Next.js 16 — substitui a convenção `middleware`).
 *
 * Responsabilidades:
 *  1. Atualizar tokens da sessão Supabase (refresh transparente via cookies).
 *  2. Proteger /painel/* — não-autenticados são redirecionados para /login?next=...
 *  3. Bloquear /login para usuários já autenticados — redireciona para /painel.
 *
 * Escopo restrito (matcher): atua apenas em /painel/* e /login para evitar
 * impacto na landing page pública e nos route handlers (ex.: /auth/callback).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Fail-safe: sem envs, não bloqueia a navegação (evita brick em dev sem setup).
  if (!url || !anon) {
    return response
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        )
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname, search } = request.nextUrl

  if (!user && pathname.startsWith('/painel')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.search = ''
    redirectUrl.searchParams.set('next', `${pathname}${search}`)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && pathname === '/login') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/painel'
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/painel/:path*', '/login'],
}
