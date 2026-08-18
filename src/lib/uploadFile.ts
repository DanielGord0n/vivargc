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

function storageFilename(originalName: string) {
    const dot = originalName.lastIndexOf(".");
    const ext =
        dot > -1 ? originalName.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "bin";
    return `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
}

const canUploadDirectly = () =>
    Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_url_here" &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

/**
 * Uploads a file to Supabase Storage straight from the browser.
 *
 * Going through /api/admin/upload puts the whole file in the request body of a
 * serverless function, and Vercel rejects those over 4.5 MB with a 413 before
 * the handler ever runs - which is why video uploads failed in production.
 * Uploading browser -> Supabase skips that hop entirely. The API route is kept
 * as a fallback for when the public Supabase env vars aren't available.
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

    const filename = storageFilename(file.name);

    if (canUploadDirectly()) {
        const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || undefined,
        });

        if (error) {
            throw new Error(`Could not upload "${file.name}": ${error.message}`);
        }

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
        return { path: data.publicUrl, filename };
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });

    if (res.status === 413) {
        throw new Error(
            `"${file.name}" (${formatSize(file.size)}) was rejected as too large by the server.`
        );
    }

    if (!res.ok) {
        throw new Error(`Could not upload "${file.name}" (server returned ${res.status}).`);
    }

    const data = await res.json();
    if (!data.path) {
        throw new Error(`Could not upload "${file.name}": ${data.error || "no URL returned"}`);
    }

    return { path: data.path, filename: data.filename ?? filename };
}
