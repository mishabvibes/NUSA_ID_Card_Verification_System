import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true })
  res.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
  })
  return res
}