import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const LOCKOUT_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Find admin by email
    const admin = await db.admin.findFirst({
      where: {
        email: {
          equals: email,
        },
      },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if account is locked
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const remainingTime = Math.ceil(
        (admin.lockedUntil.getTime() - Date.now()) / 60000
      )
      return NextResponse.json(
        {
          error: `Account locked. Try again in ${remainingTime} minutes.`,
        },
        { status: 423 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password)

    if (!isValidPassword) {
      // Increment failed attempts
      const failedAttempts = admin.failedAttempts + 1
      const updateData: any = { failedAttempts }

      // Lock account if max attempts reached
      if (failedAttempts >= LOCKOUT_ATTEMPTS) {
        updateData.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION)
      }

      await db.admin.update({
        where: { id: admin.id },
        data: updateData,
      })

      const remainingAttempts = LOCKOUT_ATTEMPTS - failedAttempts
      if (failedAttempts >= LOCKOUT_ATTEMPTS) {
        return NextResponse.json(
          { error: 'Account locked for 15 minutes' },
          { status: 423 }
        )
      }

      return NextResponse.json(
        {
          error: `Invalid credentials. ${remainingAttempts} attempts remaining.`,
        },
        { status: 401 }
      )
    }

    // Reset failed attempts and update last login
    await db.admin.update({
      where: { id: admin.id },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    })

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    // Check if password change required (default password)
    const isDefaultPassword = await bcrypt.compare(
      'Mayaash@@123',
      admin.password
    )

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        lastLoginAt: admin.lastLoginAt,
      },
      requiresPasswordChange: isDefaultPassword,
    })
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
