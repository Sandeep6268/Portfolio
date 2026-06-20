import { NextResponse } from "next/server";
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth";

// Protect /admin pages (but allow the login page itself).
export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isLogin = pathname === "/admin/login";
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  if (isLogin) {
    if (session) {
      // already logged in -> go to dashboard
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const url = new URL("/admin/login", req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
