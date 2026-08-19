import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/adminAuth";

/**
 * Gate every /api/admin route behind a valid admin session.
 *
 * Named proxy.ts rather than middleware.ts: Next.js 16 deprecated the
 * middleware file convention in favour of proxy.
 *
 * /api/admin/auth is excluded because that is where you log in, check whether
 * the session is still good, and log out.
 */
export async function proxy(request: NextRequest) {
    const authenticated = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);

    if (authenticated) return NextResponse.next();

    return NextResponse.json(
        { error: "Not authenticated. Please log in to the admin again." },
        { status: 401 }
    );
}

export const config = {
    matcher: ["/api/admin/((?!auth).*)"],
};
