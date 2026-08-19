import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

/** Longest value accepted for any single field, to keep junk submissions small. */
const MAX_FIELD_LENGTH = 5000;

/**
 * Anything a stranger types ends up inside the HTML of an email we send to the
 * club's inbox, so it has to be escaped. Without this, a submission containing
 * markup renders as real HTML in that inbox - an easy way to slip a convincing
 * fake link into a message that looks like it came from the website.
 */
function escapeHtml(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

/**
 * Sender address. Defaults to Resend's shared sandbox domain, which works but
 * is a spam-folder risk. Verify a domain in Resend and set CONTACT_FROM_EMAIL
 * to something like "Viva RGC <hello@vivargc.com>" to fix deliverability.
 */
const FROM_ADDRESS =
    process.env.CONTACT_FROM_EMAIL || 'Viva RGC Contact Form <onboarding@resend.dev>';

/**
 * Coarse per-IP throttle so one sender cannot flood the club's inbox.
 *
 * Deliberately in-memory: it needs no extra service and cannot fail the form.
 * The tradeoff is that it only sees traffic hitting the same warm instance, so
 * it stops a naive flood rather than a distributed one. Anything stronger
 * belongs in the Vercel WAF rather than here.
 */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const recentSubmissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const cutoff = now - RATE_LIMIT_WINDOW_MS;

    // Drop stale callers so the map cannot grow without bound.
    for (const [key, times] of recentSubmissions) {
        const live = times.filter((t) => t > cutoff);
        if (live.length === 0) recentSubmissions.delete(key);
        else recentSubmissions.set(key, live);
    }

    const timestamps = (recentSubmissions.get(ip) ?? []).filter((t) => t > cutoff);
    if (timestamps.length >= RATE_LIMIT_MAX) return true;

    timestamps.push(now);
    recentSubmissions.set(ip, timestamps);
    return false;
}

export async function POST(request: NextRequest) {
    try {
        // Never let the throttle itself break a legitimate submission.
        try {
            const ip =
                request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
            if (isRateLimited(ip)) {
                return NextResponse.json(
                    { error: 'Too many messages sent. Please try again in a few minutes.' },
                    { status: 429 }
                );
            }
        } catch (error) {
            console.error('Rate limit check failed, allowing request:', error);
        }

        const body = await request.json();
        const { name, email, phone, location, message, newsletter } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        if (!isValidEmail(String(email))) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        for (const [field, value] of Object.entries({ name, email, phone, location, message })) {
            if (typeof value === 'string' && value.length > MAX_FIELD_LENGTH) {
                return NextResponse.json(
                    { error: `The ${field} field is too long` },
                    { status: 400 }
                );
            }
        }

        const safe = {
            name: escapeHtml(name),
            email: escapeHtml(email),
            phone: phone ? escapeHtml(phone) : 'Not provided',
            location: escapeHtml(location),
            message: escapeHtml(message).replace(/\n/g, '<br>'),
        };

        // Initialize Resend client
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Send email via Resend
        const { data, error } = await resend.emails.send({
            from: FROM_ADDRESS,
            to: ['nathaly.vivier@gmail.com'],
            replyTo: String(email),
            subject: `New Contact Form Submission from ${safe.name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${safe.name}</p>
                <p><strong>Email:</strong> ${safe.email}</p>
                <p><strong>Phone:</strong> ${safe.phone}</p>
                <p><strong>Preferred Location:</strong> ${safe.location}</p>
                <p><strong>Newsletter Signup:</strong> ${newsletter ? 'Yes' : 'No'}</p>
                <hr />
                <h3>Message:</h3>
                <p>${safe.message}</p>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                { error: 'Failed to send email' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, messageId: data?.id });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
