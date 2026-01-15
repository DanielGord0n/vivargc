import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DBCoach {
    id: string;
    name: string;
    role: string;
    bio: string;
    image: string;
    images: string[];
    credentials: string[];
    specialties: string[];
    created_at?: string;
}

export interface DBGalleryItem {
    id: string;
    src: string;
    category: string;
    alt: string;
    created_at?: string;
}

export interface DBScheduleItem {
    id?: number;
    location: 'scarborough' | 'bayview';
    day: string;
    time: string;
    group_name: string;
}

export interface DBProgram {
    id: string;
    title: string;
    slug: string;
    ages: string;
    description: string;
    created_at?: string;
}
