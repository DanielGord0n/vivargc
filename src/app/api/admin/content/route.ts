import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get all content
export async function GET() {
    try {
        // Fetch all data in parallel
        const [coachesRes, galleryRes, scheduleRes, programsRes] = await Promise.all([
            supabase.from('coaches').select('*').order('created_at'),
            supabase.from('gallery').select('*').order('created_at'),
            supabase.from('schedule').select('*'),
            supabase.from('programs').select('*').order('created_at'),
        ]);

        // Transform schedule to the expected format
        const schedule: Record<string, Record<string, { time: string; group: string }[]>> = {
            scarborough: {},
            bayview: {},
        };

        (scheduleRes.data || []).forEach((item: { location: string; day: string; time: string; group_name: string }) => {
            const loc = item.location as 'scarborough' | 'bayview';
            if (!schedule[loc][item.day]) {
                schedule[loc][item.day] = [];
            }
            schedule[loc][item.day].push({ time: item.time, group: item.group_name });
        });

        return NextResponse.json({
            coaches: coachesRes.data || [],
            gallery: galleryRes.data || [],
            schedule,
            programs: programsRes.data || [],
        });
    } catch (error) {
        console.error('Error fetching content:', error);
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

// Save all content
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Update coaches - delete all and insert new
        if (body.coaches) {
            await supabase.from('coaches').delete().neq('id', '');
            if (body.coaches.length > 0) {
                await supabase.from('coaches').insert(body.coaches);
            }
        }

        // Update gallery
        if (body.gallery) {
            await supabase.from('gallery').delete().neq('id', '');
            if (body.gallery.length > 0) {
                await supabase.from('gallery').insert(body.gallery);
            }
        }

        // Update schedule
        if (body.schedule) {
            await supabase.from('schedule').delete().neq('id', 0);

            const scheduleItems: { location: string; day: string; time: string; group_name: string }[] = [];

            Object.entries(body.schedule).forEach(([location, days]) => {
                Object.entries(days as Record<string, { time: string; group: string }[]>).forEach(([day, slots]) => {
                    slots.forEach((slot) => {
                        scheduleItems.push({
                            location,
                            day,
                            time: slot.time,
                            group_name: slot.group,
                        });
                    });
                });
            });

            if (scheduleItems.length > 0) {
                await supabase.from('schedule').insert(scheduleItems);
            }
        }

        // Update programs
        if (body.programs) {
            await supabase.from('programs').delete().neq('id', '');
            if (body.programs.length > 0) {
                await supabase.from('programs').insert(body.programs);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving content:', error);
        return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
    }
}
