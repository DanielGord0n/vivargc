"use client";

import { supabase } from "./supabase";

export interface UploadResult {
    /** Public URL of the stored file. */
    path: string;
    /** Name the file was stored under in the bucket. */
    filename: string;
}

const BUCKET = "images";

/**
 * Supabase Storage caps a single object at 50 MB by default.
 * Anything larger is rejected by the storage API, so reject it up front
 * with a message the admin can act on.
 */
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

export function formatSize(bytes: number) {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Uploads a file to Supabase Storage straight from the browser.
 *
 * Posting the file to /api/admin/upload put the whole thing in the request body
 * of a serverless function, and Vercel rejects those over 4.5 MB with a 413
 * before the handler runs - which is why video uploads failed in production but
 * worked locally. Instead the API route now issues a one-time signed upload
 * URL (a small JSON round trip) and the bytes go browser -> Supabase directly,
 * with no size ceiling other than Supabase's own.
 *
 * Throws with a readable message on failure; callers should surface it.
 */
export async function uploadFile(file: File): Promise<UploadResult> {
    if (file.size > MAX_UPLOAD_BYTES) {
        throw new Error(
            `"${file.name}" is ${formatSize(file.size)}. The limit is ${formatSize(
                MAX_UPLOAD_BYTES
            )} per file - please compress it and try again.`
        );
    }

    const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            filename: file.name,
            size: file.size,
            contentType: file.type,
        }),
    });

    if (res.status === 401) {
        throw new Error("Your admin session has expired. Please log in again.");
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.token) {
        throw new Error(
            `Could not upload "${file.name}": ${data.error || `server returned ${res.status}`}`
        );
    }

    const { error } = await supabase.storage
        .from(BUCKET)
        .uploadToSignedUrl(data.path, data.token, file, {
            contentType: file.type || undefined,
        });

    if (error) {
        throw new Error(`Could not upload "${file.name}": ${error.message}`);
    }

    return { path: data.publicUrl, filename: data.path };
}
