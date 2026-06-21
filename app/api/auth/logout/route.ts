import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

// POST /api/auth/logout - Logout user by invalidating session
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')?.value

    if (accessToken) {
      // Mark session as expired in database
      await prisma.session.updateMany({
        where: {
          access_token: accessToken
        },
        data: {
          expired: true
        }
      })

      // Clear access token cookie
      cookieStore.delete('access_token')
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Error logging out:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}
