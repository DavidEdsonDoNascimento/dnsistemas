import 'server-only'

import { createSupabaseServerClient } from '../lib/supabase-server'
import type { AuthUser } from '../types'

/**
 * Recupera o usuário autenticado no contexto de Server Component / Server Action.
 *
 * Usa `getUser()` (e não `getSession()`) para forçar validação do JWT no servidor
 * Supabase — recomendação oficial para checagens sensíveis em SSR.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
