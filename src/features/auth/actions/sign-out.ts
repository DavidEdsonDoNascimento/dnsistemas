'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '../lib/supabase-server'

/**
 * Server Action: logout. Limpa cookies de sessão e redireciona para /login.
 */
export async function signOutAction() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/login')
}
