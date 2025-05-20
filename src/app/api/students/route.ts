import { type NextRequest, NextResponse } from "next/server"
import { connectMongo } from "@/lib/mongodb"
import Student from "@/models/Student"

export async function GET(request: NextRequest) {
  try {
    await connectMongo()
    const url = new URL(request.url)
    const tNo = url.searchParams.get("tNo")

    let query = {}
    if (tNo) {
      query = { tNo: Number.parseInt(tNo) }
    }

    const students = await Student.find(query).sort({ tNo: 1 })
    return NextResponse.json({ students })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectMongo()
    const body = await request.json()
    const student = await Student.create(body)
    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectMongo()
    const url = new URL(request.url)
    const tNo = url.searchParams.get("tNo")

    if (!tNo) {
      return NextResponse.json({ error: "Token number is required" }, { status: 400 })
    }

    const student = await Student.findOneAndDelete({ tNo: Number.parseInt(tNo) })
    
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectMongo()
    const body = await request.json()
    const { tNo, name, verificationStatus } = body

    if (!tNo || !name || !verificationStatus) {
      return NextResponse.json(
        { error: "Token number, name, and verification status are required" },
        { status: 400 }
      )
    }

    const student = await Student.findOneAndUpdate(
      { tNo: Number.parseInt(tNo) },
      { name, verificationStatus },
      { new: true }
    )

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
  }
}
