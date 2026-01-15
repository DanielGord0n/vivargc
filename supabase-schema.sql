-- Supabase Schema for Viva RGC CMS
-- Run this in the Supabase SQL Editor

-- Coaches table
CREATE TABLE coaches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    bio TEXT,
    image TEXT,
    images TEXT[] DEFAULT '{}',
    credentials TEXT[] DEFAULT '{}',
    specialties TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery table
CREATE TABLE gallery (
    id TEXT PRIMARY KEY,
    src TEXT NOT NULL,
    category TEXT DEFAULT 'Performance',
    alt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule table
CREATE TABLE schedule (
    id SERIAL PRIMARY KEY,
    location TEXT NOT NULL CHECK (location IN ('scarborough', 'bayview')),
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    group_name TEXT NOT NULL
);

-- Programs table
CREATE TABLE programs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT,
    ages TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - but allow all operations for now
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since we have password protection in the app)
CREATE POLICY "Allow all operations on coaches" ON coaches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on schedule" ON schedule FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on programs" ON programs FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Allow public access to images bucket
CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Allow authenticated deletes" ON storage.objects FOR DELETE USING (bucket_id = 'images');
