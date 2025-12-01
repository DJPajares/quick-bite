import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Next.js routes
 * Note: Admin authentication is handled client-side via JWT tokens
 * The AdminAuthProvider component protects admin routes
 */
export function middleware(_req: NextRequest) {
  // Add any global middleware logic here if needed
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
