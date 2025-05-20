import { type NextRequest, NextResponse } from "next/server"
import { connectMongo } from "@/lib/mongodb"
import Student from "@/models/Student"

export async function POST(req: NextRequest) {
  try {
    await connectMongo()

    const body = await req.json()
    const { tokenNumber, status } = body

    if (!tokenNumber || !status) {
      return NextResponse.json({ error: "Token number and status are required" }, { status: 400 })
    }

    if (!["Verified", "Reported"].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be "Verified" or "Reported"' }, { status: 400 })
    }

    const student = await Student.findOneAndUpdate({ tokenNumber }, { verificationStatus: status }, { new: true })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error("Error updating verification status:", error)
    return NextResponse.json({ error: "Failed to update verification status" }, { status: 500 })
  }
}
