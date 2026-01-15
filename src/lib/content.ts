import { supabase } from './supabase';

// Types
export interface Coach {
    id: string;
    name: string;
    role: string;
    bio: string;
    image: string;
    images: string[];
    credentials: string[];
    specialties: string[];
}

export interface GalleryItem {
    id: string;
    src: string;
    category: string;
    alt: string;
    pinned?: boolean;
}

export interface ScheduleItem {
    time: string;
    group: string;
}

export interface Schedule {
    scarborough: Record<string, ScheduleItem[]>;
    bayview: Record<string, ScheduleItem[]>;
}

export interface Program {
    id: string;
    title: string;
    slug: string;
    ages: string;
    description: string;
}

// Fallback data from JSON (used at build time if Supabase isn't configured)
import contentData from '@/data/content.json';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
    return process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url_here';
};

// Get coaches
export async function getCoachesAsync(): Promise<Coach[]> {
    if (!isSupabaseConfigured()) {
        return contentData.coaches as Coach[];
    }

    const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .order('created_at');

    if (error) {
        console.error('Error fetching coaches:', error);
        return contentData.coaches as Coach[];
    }

    return data || [];
}

// Get gallery
export async function getGalleryAsync(): Promise<GalleryItem[]> {
    if (!isSupabaseConfigured()) {
        return contentData.gallery as GalleryItem[];
    }

    // Try with pinned ordering first, fall back to simple query if column doesn't exist
    let { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('pinned', { ascending: false, nullsFirst: false })
        .order('created_at');

    // If pinned column doesn't exist, try without it
    if (error && error.code === '42703') {
        const fallback = await supabase
            .from('gallery')
            .select('*')
            .order('created_at');
        data = fallback.data;
        error = fallback.error;
    }

    if (error) {
        console.error('Error fetching gallery:', error);
        return contentData.gallery as GalleryItem[];
    }

    // Sort client-side with pinned first (in case pinned column exists)
    const sorted = (data || []).sort((a: GalleryItem, b: GalleryItem) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
    });

    return sorted;
}

// Get schedule
export async function getScheduleAsync(): Promise<Schedule> {
    if (!isSupabaseConfigured()) {
        return contentData.schedule as Schedule;
    }

    const { data, error } = await supabase
        .from('schedule')
        .select('*');

    if (error) {
        console.error('Error fetching schedule:', error);
        return contentData.schedule as Schedule;
    }

    // Transform to expected format
    const schedule: Schedule = {
        scarborough: {},
        bayview: {},
    };

    (data || []).forEach((item: { location: string; day: string; time: string; group_name: string }) => {
        const loc = item.location as 'scarborough' | 'bayview';
        if (!schedule[loc][item.day]) {
            schedule[loc][item.day] = [];
        }
        schedule[loc][item.day].push({ time: item.time, group: item.group_name });
    });

    return schedule;
}

// Get programs
export async function getProgramsAsync(): Promise<Program[]> {
    if (!isSupabaseConfigured()) {
        return contentData.programs as Program[];
    }

    const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at');

    if (error) {
        console.error('Error fetching programs:', error);
        return contentData.programs as Program[];
    }

    return data || [];
}

// Synchronous versions (for static generation fallback)
export function getCoaches(): Coach[] {
    return contentData.coaches as Coach[];
}

export function getGallery(): GalleryItem[] {
    return contentData.gallery as GalleryItem[];
}

export function getSchedule(): Schedule {
    return contentData.schedule as Schedule;
}

export function getPrograms(): Program[] {
    return contentData.programs as Program[];
}
