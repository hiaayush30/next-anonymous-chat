import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXT_AUTH_SECRET });
    const url = request.nextUrl;

    console.log("Token:", token);

    if (token) {
        if (
            url.pathname.startsWith('/signin') ||
            url.pathname.startsWith('/signup') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/'
        ) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } else {
        if (url.pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    }

    return NextResponse.next(); // Continue as normal
}

// Apply middleware only to these routes
export const config = {
    matcher: ['/dashboard/:path*', '/verify/:path*', '/'],
};
