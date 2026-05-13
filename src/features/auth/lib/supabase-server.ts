import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseAnonKey, getSupabaseUrl } from './env'

/**
 * Cliente Supabase no servidor (Server Components, Server Actions, Route Handlers).
 * Lê e escreve cookies via `next/headers`.
 *
 * Observação: dentro de Server Components a chamada `cookieStore.set` pode lançar.
 * Engolimos esse caso — o refresh real de tokens é feito pelo middleware.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Server Component: ignore — middleware fará o refresh.
        }
      },
    },
  })
}
