-- Viva RGC - lock down write access and add content snapshots
-- Run this once in the Supabase SQL Editor, or via the Supabase MCP.
--
-- WHY
-- Every table and the images bucket allowed ALL operations to anyone,
-- including the anon key. That key ships inside the public JavaScript bundle,
-- so anyone who opened devtools could edit or delete site content without ever
-- seeing the admin login. This migration reduces the anon key to read-only.
-- Writes then happen only through the admin API routes, which authenticate the
-- session cookie and use the service-role key.
--
-- BEFORE RUNNING: set SUPABASE_SERVICE_ROLE_KEY in .env.local and in the Vercel
-- project's environment variables, and deploy. Without it the admin cannot save.
-- Find it at: Supabase Dashboard -> Project Settings -> API -> Secret keys.
--
-- Policies are dropped by discovery rather than by name. An earlier version of
-- this file named each policy explicitly and would have silently left
-- page_content writable, because its policy was called "Allow all" rather than
-- the "Allow all operations on page_content" the file assumed. DROP POLICY IF
-- EXISTS on a wrong name fails silently, so this now enumerates whatever is
-- actually there.

-- ---------------------------------------------------------------------------
-- 1. Content snapshots, so the admin's "Undo last save" has something to restore
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS content_backups (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    snapshot JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS content_backups_created_at_idx
    ON content_backups (created_at DESC);

ALTER TABLE content_backups ENABLE ROW LEVEL SECURITY;
-- No policy is created on purpose: with RLS on and no policy, the anon key
-- cannot read or write this table at all. The service-role key bypasses RLS.

-- ---------------------------------------------------------------------------
-- 2. Reduce the anon key to read-only on the content tables
-- ---------------------------------------------------------------------------

DO $$
DECLARE
    policy_row RECORD;
BEGIN
    FOR policy_row IN
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename IN ('coaches', 'gallery', 'schedule', 'programs', 'page_content')
    LOOP
        EXECUTE format(
            'DROP POLICY %I ON public.%I',
            policy_row.policyname,
            policy_row.tablename
        );
        RAISE NOTICE 'Dropped policy % on %', policy_row.policyname, policy_row.tablename;
    END LOOP;
END $$;

CREATE POLICY "Public read access" ON coaches      FOR SELECT USING (true);
CREATE POLICY "Public read access" ON gallery      FOR SELECT USING (true);
CREATE POLICY "Public read access" ON schedule     FOR SELECT USING (true);
CREATE POLICY "Public read access" ON programs     FOR SELECT USING (true);
CREATE POLICY "Public read access" ON page_content FOR SELECT USING (true);

ALTER TABLE coaches      ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery      ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule     ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 3. Reduce the images bucket to read-only for the public
-- ---------------------------------------------------------------------------
-- Admin uploads still work: the API route mints a one-time signed upload URL
-- with the service-role key, and the signed token authorises that single write
-- without needing an INSERT policy.
--
-- Only policies that mention the images bucket are touched, so any other
-- bucket's policies are left alone.

DO $$
DECLARE
    policy_row RECORD;
BEGIN
    FOR policy_row IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND (COALESCE(qual::text, '') LIKE '%images%'
               OR COALESCE(with_check::text, '') LIKE '%images%')
    LOOP
        EXECUTE format('DROP POLICY %I ON storage.objects', policy_row.policyname);
        RAISE NOTICE 'Dropped storage policy %', policy_row.policyname;
    END LOOP;
END $$;

CREATE POLICY "Public read access to images"
    ON storage.objects FOR SELECT USING (bucket_id = 'images');
