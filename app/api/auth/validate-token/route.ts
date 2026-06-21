import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

// GET /api/auth/validate-token - Validate access token and return user info
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const accessToken = authHeader?.replace('Bearer ', '')

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token provided' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const payload = verifyAccessToken(accessToken)

    // Verify session exists in database
    const session = await prisma.session.findFirst({
      where: {
        access_token: accessToken,
        expired: false
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            role: true
          }
        }
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      valid: true,
      user: session.user
    })
  } catch (error) {
    console.error('Error validating token:', error)
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
}
