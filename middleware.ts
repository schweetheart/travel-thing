import { NextRequest, NextResponse } from "next/server"

export const middleware = (request: NextRequest) => {
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
  matcher: "/about/:path*",
}
