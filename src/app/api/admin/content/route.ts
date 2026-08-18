import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

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
//
// Rows are upserted BEFORE stale rows are deleted. The previous version deleted
// everything first and then inserted without checking for errors, so any failed
// insert (a bad column, a size limit, a network blip) silently emptied the table
// while the admin UI still reported success.
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Coaches / gallery / programs are keyed by a stable text id.
        for (const table of ['coaches', 'gallery', 'programs'] as const) {
            const rows = body[table];
            if (!rows) continue;

            if (rows.length > 0) {
                const { error } = await supabase.from(table).upsert(rows);
                if (error) throw new Error(`${table}: ${error.message}`);
            }

            const keptIds = rows.map((row: { id: string }) => row.id);
            const remove = supabase.from(table).delete();
            const { error: deleteError } = keptIds.length > 0
                ? await remove.not('id', 'in', `(${keptIds.map((id: string) => `"${id}"`).join(',')})`)
                : await remove.neq('id', '');
            if (deleteError) throw new Error(`${table} cleanup: ${deleteError.message}`);
        }

        // Schedule rows have no stable key, so they are replaced wholesale.
        if (body.schedule) {
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

            const { error: deleteError } = await supabase.from('schedule').delete().neq('id', 0);
            if (deleteError) throw new Error(`schedule cleanup: ${deleteError.message}`);

            if (scheduleItems.length > 0) {
                const { error } = await supabase.from('schedule').insert(scheduleItems);
                if (error) throw new Error(`schedule: ${error.message}`);
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving content:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to save content' },
            { status: 500 }
        );
    }
}
