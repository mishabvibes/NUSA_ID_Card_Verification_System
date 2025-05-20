import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Task = {
  tNo: number
  name: string
  createdAt: Date
  verificationStatus: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "5")
    const skip = (page - 1) * limit

    const [tasks, total] = await Promise.all([
      prisma.student.findMany({
        where: { verificationStatus: "Pending" },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          tNo: true,
          name: true,
          createdAt: true,
          verificationStatus: true
        }
      }),
      prisma.student.count({ where: { verificationStatus: "Pending" } })
    ])

    return NextResponse.json({
      tasks: tasks.map((task: Task) => ({
        id: task.tNo.toString(), // Using tNo as id since it's unique
        studentName: task.name,
        studentId: task.tNo,
        dueDate: task.createdAt,
        priority: "medium" // Default priority since it's not in the schema
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