-- Viva RGC - lock down write access and add content snapshots
-- Run this once in the Supabase SQL Editor.
--
-- WHY
-- Every table and the images bucket currently allow ALL operations to anyone,
-- including the anon key. That key ships inside the public JavaScript bundle,
-- so anyone who opens devtools can edit or delete site content without ever
-- seeing the admin login. This migration reduces the anon key to read-only.
-- Writes then happen only through the admin API routes, which authenticate the
-- session cookie and use the service-role key.
--
-- BEFORE RUNNING: set SUPABASE_SERVICE_ROLE_KEY in .env.local and in the Vercel
-- project's environment variables. Without it the admin can no longer save.
-- Find it at: Supabase Dashboard -> Project Settings -> API -> service_role.

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

DROP POLICY IF EXISTS "Allow all operations on coaches" ON coaches;
DROP POLICY IF EXISTS "Allow all operations on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow all operations on schedule" ON schedule;
DROP POLICY IF EXISTS "Allow all operations on programs" ON programs;
DROP POLICY IF EXISTS "Allow all operations on page_content" ON page_content;

-- Dropped first as well, so this file can be run again safely.
DROP POLICY IF EXISTS "Public read access" ON coaches;
DROP POLICY IF EXISTS "Public read access" ON gallery;
DROP POLICY IF EXISTS "Public read access" ON schedule;
DROP POLICY IF EXISTS "Public read access" ON programs;
DROP POLICY IF EXISTS "Public read access" ON page_content;

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

DROP POLICY IF EXISTS "Allow public read access"    ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

DROP POLICY IF EXISTS "Public read access to images" ON storage.objects;

CREATE POLICY "Public read access to images"
    ON storage.objects FOR SELECT USING (bucket_id = 'images');

-- ---------------------------------------------------------------------------
-- 4. Show what is left, so the result is visible rather than assumed
-- ---------------------------------------------------------------------------
-- Every row below should be a SELECT-only policy. Any INSERT/UPDATE/DELETE/ALL
-- row still listed means something is writable by the public anon key.

SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE (schemaname = 'public'
       AND tablename IN ('coaches','gallery','schedule','programs','page_content','content_backups'))
   OR (schemaname = 'storage' AND tablename = 'objects')
ORDER BY schemaname, tablename, policyname;
