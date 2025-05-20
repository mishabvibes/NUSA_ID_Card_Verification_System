import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const activities = await db.collection('students').find({
      verificationStatus: { $in: ['Verified', 'Rejected', 'Pending'] }
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray()

    return NextResponse.json(activities.map(activity => ({
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