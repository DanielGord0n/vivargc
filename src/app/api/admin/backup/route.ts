import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Snapshot / undo for the CMS.
 *
 * The previous version copied src/data/content.json to a sibling file. That was
 * broken twice over: it snapshotted stale fallback JSON rather than the live
 * Supabase content the site actually reads, and Vercel's filesystem is
 * read-only so it could never write anything in production. Snapshots now live
 * in Supabase alongside the content they protect.
 *
 * Every endpoint degrades quietly if the content_backups table has not been
 * created yet - the admin simply reports that no backup is available.
 */

const TABLE = 'content_backups';
const KEEP_SNAPSHOTS = 10;

/** Postgres "relation does not exist" - the table has not been created yet. */
const UNDEFINED_TABLE = '42P01';

function isMissingTable(error: { code?: string } | null) {
    return error?.code === UNDEFINED_TABLE;
}

async function readLiveContent() {
    const [coaches, gallery, schedule, programs, pageContent] = await Promise.all([
        supabaseAdmin.from('coaches').select('*'),
        supabaseAdmin.from('gallery').select('*'),
        supabaseAdmin.from('schedule').select('*'),
        supabaseAdmin.from('programs').select('*'),
        supabaseAdmin.from('page_content').select('*'),
    ]);

    const failed = [coaches, gallery, schedule, programs, pageContent].find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message);

    return {
        coaches: coaches.data ?? [],
        gallery: gallery.data ?? [],
        schedule: schedule.data ?? [],
        programs: programs.data ?? [],
        page_content: pageContent.data ?? [],
    };
}

/** Take a snapshot of the current content. Called just before every save. */
export async function POST() {
    try {
        const snapshot = await readLiveContent();

        const { error } = await supabaseAdmin.from(TABLE).insert({ snapshot });

        if (isMissingTable(error)) {
            return NextResponse.json({ success: false, reason: 'backups-not-configured' });
        }
        if (error) throw new Error(error.message);

        // Keep the table small: drop everything older than the newest few.
        const { data: keep } = await supabaseAdmin
            .from(TABLE)
            .select('id')
            .order('created_at', { ascending: false })
            .limit(KEEP_SNAPSHOTS);

        const oldest = keep?.[keep.length - 1]?.id;
        if (keep && keep.length === KEEP_SNAPSHOTS && oldest) {
            await supabaseAdmin.from(TABLE).delete().lt('id', oldest);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Could not create backup:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Could not create backup' },
            { status: 500 }
        );
    }
}

/** Restore the most recent snapshot. */
export async function PUT() {
    try {
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .select('id, created_at, snapshot')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (isMissingTable(error)) {
            return NextResponse.json({ error: 'Backups are not set up yet' }, { status: 404 });
        }
        if (error) throw new Error(error.message);
        if (!data) {
            return NextResponse.json({ error: 'No backup available' }, { status: 404 });
        }

        const snapshot = data.snapshot as Record<string, Record<string, unknown>[]>;

        for (const table of ['coaches', 'gallery', 'programs', 'page_content'] as const) {
            const rows = snapshot[table] ?? [];
            if (rows.length > 0) {
                const { error: upsertError } = await supabaseAdmin.from(table).upsert(rows);
                if (upsertError) throw new Error(`${table}: ${upsertError.message}`);
            }

            const key = table === 'page_content' ? 'page_id' : 'id';
            const keptKeys = rows.map((row) => String(row[key]));
            const remove = supabaseAdmin.from(table).delete();
            const { error: deleteError } =
                keptKeys.length > 0
                    ? await remove.not(key, 'in', `(${keptKeys.map((k) => `"${k}"`).join(',')})`)
                    : await remove.neq(key, '');
            if (deleteError) throw new Error(`${table} cleanup: ${deleteError.message}`);
        }

        // Schedule rows carry a serial id, so they are replaced wholesale.
        const scheduleRows = snapshot.schedule ?? [];
        const { error: scheduleDeleteError } = await supabaseAdmin
            .from('schedule')
            .delete()
            .neq('id', 0);
        if (scheduleDeleteError) throw new Error(`schedule cleanup: ${scheduleDeleteError.message}`);

        if (scheduleRows.length > 0) {
            const { error: scheduleError } = await supabaseAdmin.from('schedule').insert(scheduleRows);
            if (scheduleError) throw new Error(`schedule: ${scheduleError.message}`);
        }

        // The restored state is now current; drop the snapshot so repeated
        // undo clicks cannot walk backwards past what the admin expects.
        await supabaseAdmin.from(TABLE).delete().eq('id', data.id);

        return NextResponse.json({ success: true, restoredFrom: data.created_at });
    } catch (error) {
        console.error('Could not restore backup:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Could not restore backup' },
            { status: 500 }
        );
    }
}

/** Is there anything to undo, and how old is it? */
export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from(TABLE)
            .select('created_at')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (isMissingTable(error)) {
            return NextResponse.json({ hasBackup: false, configured: false });
        }
        if (error) throw new Error(error.message);

        return NextResponse.json({
            hasBackup: Boolean(data),
            configured: true,
            backupTime: data?.created_at ?? null,
        });
    } catch (error) {
        console.error('Could not check backup status:', error);
        return NextResponse.json({ hasBackup: false, configured: false });
    }
}
