// Supabase integration (Phase 2) - behind feature flag
export const SUPABASE_ENABLED = process.env.NEXT_PUBLIC_SUPABASE_ENABLED === 'true';

export async function initSupabase(){
  if(!SUPABASE_ENABLED) return null;
  const { createClient } = await import('@supabase/supabase-js');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';
  return createClient(url,key);
}
