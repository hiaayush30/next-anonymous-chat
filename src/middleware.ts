import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;  //the url user is wanting to go to

    if(token && 
        (
            url.pathname.startsWith('/signin') ||
            url.pathname.startsWith('/signup') ||
            url.pathname.startsWith('/verify') ||
            url.pathname.startsWith('/')
        )
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {  //where you want the middleware to run
    matcher: [
        '/auth/signin',
        '/auth/signup',
        '/dashboard/:path*',
        // '/verify/:path*',
        '/'
    ],
}