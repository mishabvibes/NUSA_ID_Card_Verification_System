import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const activities = await prisma.student.findMany({
      where: {
        OR: [
          { verificationStatus: 'Verified' },
          { verificationStatus: 'Rejected' },
          { verificationStatus: 'Pending' }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        tNo: true,
        name: true,
        verificationStatus: true,
        createdAt: true,
        verifiedBy: true
      }
    })

    return NextResponse.json(activities.map((activity) => ({
      id: activity.tNo.toString(),
      type: activity.verificationStatus === 'Verified' ? 'verification' :
            activity.verificationStatus === 'Rejected' ? 'rejection' : 'registration',
      studentName: activity.name,
      studentId: activity.tNo,
      timestamp: activity.createdAt,
      performedBy: activity.verifiedBy || undefined
    })))
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent activities' },
      { status: 500 }
    )
  }
} 