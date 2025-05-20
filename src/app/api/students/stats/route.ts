import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()

    const [total, verified, pending, rejected] = await Promise.all([
      db.collection('students').countDocuments(),
      db.collection('students').countDocuments({ verificationStatus: 'Verified' }),
      db.collection('students').countDocuments({ verificationStatus: 'Pending' }),
      db.collection('students').countDocuments({ verificationStatus: 'Rejected' })
    ])

    return NextResponse.json({
      total,
      verified,
      pending,
      rejected
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
