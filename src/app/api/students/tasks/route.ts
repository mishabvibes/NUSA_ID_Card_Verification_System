import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "5")
    const skip = (page - 1) * limit

    const client = await clientPromise
    const db = client.db()

    const [tasks, total] = await Promise.all([
      db.collection('students').find({ verificationStatus: "Pending" })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .toArray(),
      db.collection('students').countDocuments({ verificationStatus: "Pending" })
    ])

    return NextResponse.json({
      tasks: tasks.map(task => ({
        id: task.tNo.toString(),
        studentName: task.name,
        studentId: task.tNo,
        dueDate: task.createdAt,
        priority: "medium"
      })),
      total
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch verification tasks" },
      { status: 500 }
    )
  }
} 