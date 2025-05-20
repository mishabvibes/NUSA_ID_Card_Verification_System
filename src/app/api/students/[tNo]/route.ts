import { type NextRequest, NextResponse } from "next/server"
import { connectMongo } from "@/lib/mongodb"
import Student from "@/models/Student"

export async function GET(
  req: NextRequest,
  { params }: { params: { tNo: string } }
) {
  try {
    await connectMongo()
    const tNo = parseInt(params.tNo)

    if (isNaN(tNo)) {
      return NextResponse.json({ error: "Invalid token number" }, { status: 400 })
    }

    const student = await Student.findOne({ tNo })
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ student })
  } catch (error) {
    console.error("Error fetching student:", error)
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { tNo: string } }
) {
  try {
    await connectMongo()
    const tNo = parseInt(params.tNo)
    const body = await req.json()

    if (isNaN(tNo)) {
      return NextResponse.json({ error: "Invalid token number" }, { status: 400 })
    }

    const student = await Student.findOneAndUpdate({ tNo }, body, { new: true, runValidators: true })
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { tNo: string } }
) {
  try {
    await connectMongo()
    const tNo = parseInt(params.tNo)

    if (isNaN(tNo)) {
      return NextResponse.json({ error: "Invalid token number" }, { status: 400 })
    }

    const student = await Student.findOneAndDelete({ tNo })
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
  }
} 