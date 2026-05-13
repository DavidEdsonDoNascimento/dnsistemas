import type { User } from '@supabase/supabase-js'

/** Reexport central para evitar imports profundos no painel. */
export type AuthUser = User

/** Estado retornado pela Server Action de login (consumido via useActionState). */
export interface LoginFormState {
  error: string | null
}
