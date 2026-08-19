/**
 * Admin session handling.
 *
 * The login form still takes the same ADMIN_PASSWORD it always did. What
 * changed is what happens after: a successful login now mints a signed,
 * httpOnly session cookie, and every /api/admin route checks it. Previously
 * "logged in" was React state in the browser, so the API routes themselves were
 * wide open to anyone who knew the URLs.
 *
 * Web Crypto only - this module runs in middleware (Edge runtime) as well as in
 * route handlers.
 */

export const ADMIN_COOKIE = "viva_admin_session";

export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

const encoder = new TextEncoder();

function sessionSecret(): string {
    const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
    if (!secret) {
        throw new Error("ADMIN_PASSWORD (or ADMIN_SESSION_SECRET) is not configured");
    }
    return secret;
}

function toBase64Url(bytes: Uint8Array): string {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(message: string): Promise<Uint8Array> {
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(sessionSecret()),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

async function sha256(value: string): Promise<Uint8Array> {
    return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

/** Compares without leaking where the first difference is. */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
}

/** Checks a submitted password against ADMIN_PASSWORD in constant time. */
export async function passwordMatches(candidate: unknown): Promise<boolean> {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || typeof candidate !== "string" || candidate.length === 0) return false;

    // Hash both first so the comparison runs over fixed-length input and the
    // password's length is not observable from timing.
    const [candidateHash, expectedHash] = await Promise.all([sha256(candidate), sha256(expected)]);
    return constantTimeEqual(candidateHash, expectedHash);
}

/** Mints a session token of the form "<expiryMs>.<signature>". */
export async function createSessionToken(now: number = Date.now()): Promise<string> {
    const expiresAt = String(now + SESSION_MAX_AGE_SECONDS * 1000);
    return `${expiresAt}.${toBase64Url(await hmac(expiresAt))}`;
}

/**
 * Verifies a session cookie. Never throws - an unset ADMIN_PASSWORD or a
 * malformed token both fail closed.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
    if (!token) return false;

    try {
        const separator = token.lastIndexOf(".");
        if (separator < 1) return false;

        const expiresAt = token.slice(0, separator);
        const signature = token.slice(separator + 1);

        if (!/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now()) return false;

        const expected = toBase64Url(await hmac(expiresAt));
        return constantTimeEqual(encoder.encode(signature), encoder.encode(expected));
    } catch {
        return false;
    }
}

export function sessionCookieOptions(maxAge: number) {
    return {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge,
    };
}
