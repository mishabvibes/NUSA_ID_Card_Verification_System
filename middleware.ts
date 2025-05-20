import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin@124nusaonly")

  if (isAdminRoute && (!token || token.role !== "admin")) {
    return NextResponse.redirect(new URL("/admin@124nusaonly/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin@124nusaonly/:path*"],
}