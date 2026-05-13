'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '../lib/supabase-server'
import type { LoginFormState } from '../types'

const SAFE_NEXT_PATH = /^\/painel(?:\/.*)?$/

function pickSafeRedirect(next: FormDataEntryValue | null): string {
  const raw = typeof next === 'string' ? next : ''
  return SAFE_NEXT_PATH.test(raw) ? raw : '/painel'
}

/**
 * Server Action: login com email/senha.
 * Assinatura compatível com React 19 `useActionState`.
 */
export async function signInWithPasswordAction(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Informe email e senha.' }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Credenciais inválidas. Verifique e tente novamente.' }
  }

  redirect(pickSafeRedirect(formData.get('next')))
}
