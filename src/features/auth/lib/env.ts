/**
 * Leitura tipada e lazy das variáveis públicas do Supabase.
 *
 * Lazy porque queremos:
 *  - falhar cedo em runtime (request real, dev server, prod) com mensagem clara;
 *  - NÃO quebrar `next build` em ambientes que ainda não definiram as envs
 *    (ex.: CI de checagem de tipos, primeira clonagem do repo).
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `[auth/env] Variável de ambiente ausente: ${name}. ` +
        `Defina-a em .env.local ou na infra de deploy.`,
    )
  }
  return value
}

export function getSupabaseUrl(): string {
  return required('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL)
}

export function getSupabaseAnonKey(): string {
  return required(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
