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

export async function POST(request: NextRequest) {
    try {
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
            from: 'Viva RGC Contact Form <onboarding@resend.dev>',
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
