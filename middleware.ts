import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Skip API routes from trailing slash redirect
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // 2. Skip files with extensions (images, scripts, etc.)
  if (pathname.includes('.')) {
    return NextResponse.next()
  }

  // 3. Handle trailing slash redirect for all other routes
  // This maintains the 'trailingSlash: true' behavior for standard pages
  if (!pathname.endsWith('/')) {
    const url = request.nextUrl.clone()
    url.pathname += '/'
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

// Optionally, specify exactly which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
