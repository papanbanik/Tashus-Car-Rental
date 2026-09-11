import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { handleGetAuthCookies } from './utils/Functions/auth/cookiesHelper';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const url = new URL(request?.url);
  if (url.searchParams.get('from') === 'redirection') {
    return NextResponse.next();
  }
  const userToken = handleGetAuthCookies();
  // Redirect to login page if user is not logged in
  if (!userToken?.value) {
    const returnUrl = request.nextUrl.pathname; // Get the current path
    // Construct the raw redirect URL without using searchParams
    const loginUrl = `/login?return_url=${returnUrl}`;

    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  return NextResponse.next();
}

// Add protected paths
export const config = {
  matcher: ['/dashboard/:path*', '/au/verify-account/:path*', '/car-listing/:path*', '/on-boarding/driver-verification/:path*', '/payment/:path*'],
};
