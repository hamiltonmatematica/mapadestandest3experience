import { createClient } from '@supabase/supabase-js';

export const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!key) {
      throw new Error("⚠️ CHAVE SERVICE_ROLE AUSENTE NO .ENV.LOCAL");
  }

  return createClient(url, key);
};
