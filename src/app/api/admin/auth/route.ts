import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
    ADMIN_COOKIE,
    SESSION_MAX_AGE_SECONDS,
    createSessionToken,
    passwordMatches,
    sessionCookieOptions,
    verifySessionToken,
} from '@/lib/adminAuth';

/** Is the current visitor still logged in? Lets the admin survive a refresh. */
export async function GET() {
    const store = await cookies();
    const authenticated = await verifySessionToken(store.get(ADMIN_COOKIE)?.value);
    return NextResponse.json({ authenticated });
}

/** Log in with ADMIN_PASSWORD and receive an httpOnly session cookie. */
export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));

        if (!(await passwordMatches(body?.password))) {
            // Small fixed delay so the endpoint is not a fast password oracle.
            await new Promise((resolve) => setTimeout(resolve, 400));
            return NextResponse.json(
                { success: false, error: 'Incorrect password' },
                { status: 401 }
            );
        }

        const response = NextResponse.json({ success: true });
        response.cookies.set({
            name: ADMIN_COOKIE,
            value: await createSessionToken(),
            ...sessionCookieOptions(SESSION_MAX_AGE_SECONDS),
        });
        return response;
    } catch (error) {
        console.error('Admin login failed:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

/** Log out by clearing the session cookie. */
export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.set({
        name: ADMIN_COOKIE,
        value: '',
        ...sessionCookieOptions(0),
    });
    return response;
}
