import { createClient } from '@supabase/supabase-js'

export function createServerClient() {
  const url = process.env.SUPABASE_URL ?? 'https://GQfB9He6oEKDaFkx.supabase.co'
  const key = process.env.SUPABASE_ANON_KEY
  if (!key) throw new Error('SUPABASE_ANON_KEY nao configurada')
  return createClient(url, key)
}
