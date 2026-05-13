'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseAnonKey, getSupabaseUrl } from './env'

/**
 * Cliente Supabase no browser (Client Components).
 * Compartilha sessão via cookies escritos pelo middleware/route handlers.
 * Manter como singleton evita múltiplas instâncias por render.
 */
let browserClient: ReturnType<typeof createBrowserClient> | undefined

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
  }
  return browserClient
}
