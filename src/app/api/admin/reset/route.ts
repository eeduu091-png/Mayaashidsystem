import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as bcrypt from 'bcryptjs'

const DEFAULT_PASSWORD = 'Mayaash@@123'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, email } = body

    // Verify admin credentials
    const admin = await db.admin.findFirst({
      where: { email },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, admin.password)
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Reset to default state
    await db.admin.update({
      where: { id: admin.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLoginAt: null,
      },
    })

    console.log(`Reset admin account: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Admin account reset to default state',
    })
  } catch (error) {
    console.error('Reset admin error:', error)
    return NextResponse.json(
      { error: 'Failed to reset admin account' },
      { status: 500 }
    )
  }
}
