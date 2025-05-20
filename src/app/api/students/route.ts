import { type NextRequest, NextResponse } from "next/server"
import { connectMongo } from "@/lib/mongodb"
import Student from "@/models/Student"

export async function GET(req: NextRequest) {
  try {
    await connectMongo()

    const url = new URL(req.url)
    const tNo = url.searchParams.get("tNo")
    const status = url.searchParams.get("status")
    const page = url.searchParams.get("page")
    const limit = url.searchParams.get("limit")

    const query: any = {}

    if (tNo) {
      query.tNo = Number.parseInt(tNo)
    }

    if (status && status !== "all") {
      query.verificationStatus = status
    }

    let students
    let pagination

    if (page && limit) {
      // If pagination parameters are provided, use pagination
      const pageNum = Number.parseInt(page)
      const limitNum = Number.parseInt(limit)
      const skip = (pageNum - 1) * limitNum

      students = await Student.find(query).sort({ tNo: 1 }).skip(skip).limit(limitNum)
      const total = await Student.countDocuments(query)
      
      pagination = {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      }
    } else {
      // If no pagination parameters, fetch all students
      students = await Student.find(query).sort({ tNo: 1 })
      pagination = {
        total: students.length,
        page: 1,
        limit: students.length,
        totalPages: 1,
      }
    }

    return NextResponse.json({
      students,
      pagination,
    })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongo()

    const body = await req.json()
    const { tNo, name } = body

    if (!tNo || !name) {
      return NextResponse.json({ error: "Token number and name are required" }, { status: 400 })
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ tNo })
    if (existingStudent) {
      return NextResponse.json({ error: "Student with this token number already exists" }, { status: 409 })
    }

    const student = await Student.create({
      tNo,
      name,
      verificationStatus: "Pending",
    })

    return NextResponse.json(student)
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}

export async function GETAll() {
  try {
    await connectMongo()
    const students = await Student.find().sort({ tokenNumber: 1 })
    return NextResponse.json({ students })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectMongo()
    const url = new URL(req.url)
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

export async function PUT(req: NextRequest) {
  try {
    await connectMongo()
    const body = await req.json()
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
