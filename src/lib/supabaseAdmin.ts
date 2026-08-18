import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * True once SUPABASE_SERVICE_ROLE_KEY is set, which is what allows the RLS
 * policies to be tightened so the public anon key can only read.
 */
export const hasServiceRole = Boolean(serviceRoleKey);

/**
 * Server-side Supabase client for admin writes.
 *
 * Falls back to the anon key so nothing breaks before the service-role key is
 * configured - but until it is, the anon key still carries write permission and
 * the database is only as private as the RLS policies allow. Never import this
 * from a client component: the service-role key bypasses RLS entirely.
 */
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey || anonKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});
