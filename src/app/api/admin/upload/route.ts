import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const BUCKET = 'images';

/** Supabase Storage rejects objects above this by default. */
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
    'jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg',
    'mp4', 'webm', 'mov', 'm4v',
    'pdf', 'doc', 'docx',
]);

/**
 * Issues a one-time signed upload URL instead of accepting the file itself.
 *
 * Accepting the bytes here meant they travelled through a serverless function
 * request body, and Vercel rejects those over 4.5 MB with a 413 before the
 * handler runs - so every video upload failed in production. Now only a small
 * JSON request reaches this route and the file goes browser -> Supabase
 * directly. The signed token is what authorises the write, so this keeps
 * working once the anon key is reduced to read-only.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const originalName = typeof body?.filename === 'string' ? body.filename : '';
        const size = typeof body?.size === 'number' ? body.size : 0;

        if (!originalName) {
            return NextResponse.json({ error: 'A filename is required' }, { status: 400 });
        }

        if (size > MAX_UPLOAD_BYTES) {
            return NextResponse.json(
                {
                    error: `That file is ${(size / 1024 / 1024).toFixed(1)} MB. The limit is ${
                        MAX_UPLOAD_BYTES / 1024 / 1024
                    } MB per file.`,
                },
                { status: 413 }
            );
        }

        const dot = originalName.lastIndexOf('.');
        const extension =
            dot > -1 ? originalName.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : '';

        if (!ALLOWED_EXTENSIONS.has(extension)) {
            return NextResponse.json(
                { error: `Files of type ".${extension || 'unknown'}" are not allowed.` },
                { status: 400 }
            );
        }

        // Built here rather than taken from the client so the caller cannot
        // choose where in the bucket the object lands.
        const objectName = `upload_${Date.now()}_${crypto.randomUUID().slice(0, 8)}.${extension}`;

        const { data, error } = await supabaseAdmin.storage
            .from(BUCKET)
            .createSignedUploadUrl(objectName);

        if (error || !data) {
            console.error('Could not create signed upload URL:', error);
            return NextResponse.json(
                { error: error?.message || 'Could not prepare the upload' },
                { status: 500 }
            );
        }

        const { data: publicUrlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(objectName);

        return NextResponse.json({
            path: objectName,
            token: data.token,
            publicUrl: publicUrlData.publicUrl,
        });
    } catch (error) {
        console.error('Upload preparation failed:', error);
        return NextResponse.json({ error: 'Could not prepare the upload' }, { status: 500 });
    }
}
