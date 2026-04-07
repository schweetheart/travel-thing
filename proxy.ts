import { NextRequest, NextResponse } from "next/server"

export const proxy = (request: NextRequest) => {
  const userId = request.cookies.get("userId")

  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/${userId.value}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - api/auth (auth endpoints)
     */
    "/((?!_next/static|_next/image|favicon.ico|login|api/auth).*)",
  ],
}
