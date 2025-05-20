import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [total, verified, pending, rejected] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { verificationStatus: 'Verified' } }),
      prisma.student.count({ where: { verificationStatus: 'Pending' } }),
      prisma.student.count({ where: { verificationStatus: 'Rejected' } })
    ])

    return NextResponse.json({
      total,
      verified,
      pending,
      rejected,
      verificationRate: total > 0 ? (verified / total) * 100 : 0
    })
  } catch (error) {
    console.error('Error fetching student stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student statistics' },
      { status: 500 }
    )
  }
}
