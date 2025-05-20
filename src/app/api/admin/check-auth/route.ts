import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

export async function GET(req: NextRequest) {
  if (!JWT_SECRET) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    )
  }

  try {
    const token = req.cookies.get("admin_token")?.value
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Verify JWT
    jwt.verify(token, JWT_SECRET)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}