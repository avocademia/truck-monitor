import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyRefreshToken, generateAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

// POST /api/auth/refresh-token - Refresh access token using refresh token from database
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token provided' },
        { status: 401 }
      )
    }

    // Find the session using the access token
    const session = await prisma.session.findFirst({
      where: {
        access_token: accessToken,
        expired: false
      },
      include: {
        user: true
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 401 }
      )
    }

    // Verify the refresh token from database
    const payload = verifyRefreshToken(session.refresh_token)

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    })

    // Update session with new access token
    await prisma.session.update({
      where: { id: session.id },
      data: {
        access_token: newAccessToken
      }
    })

    // Set new access token cookie
    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 // 1 hour
    })

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken
    })
  } catch (error) {
    console.error('Error refreshing token:', error)
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 401 }
    )
  }
}
