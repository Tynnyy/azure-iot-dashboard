import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';

/**
 * Create an admin Supabase client using SERVICE_ROLE_KEY
 * This client bypasses Row Level Security (RLS) policies
 * USE WITH CAUTION - only for server-side admin operations
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
