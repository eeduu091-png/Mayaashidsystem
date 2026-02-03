import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('admin_session')?.value

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const admin = await db.admin.findUnique({
      where: { id: sessionId },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: admin.id,
      email: admin.email,
      lastLoginAt: admin.lastLoginAt,
    })
  } catch (error) {
    console.error('Error fetching current admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin' },
      { status: 500 }
    )
  }
}
