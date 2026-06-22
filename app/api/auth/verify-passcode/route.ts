import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt'

// POST /api/auth/verify-passcode - Verify passcode and create session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, passcode } = body

    if (!email || !passcode) {
      return NextResponse.json(
        { error: 'Email and passcode are required' },
        { status: 400 }
      )
    }

    // Find user with matching email and passcode
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if passcode matches
    if (user.passcode !== passcode.toUpperCase()) {
      return NextResponse.json(
        { error: 'Invalid passcode' },
        { status: 401 }
      )
    }

    // Check if passcode has expired
    if (!user.passcode_expiry || new Date() > user.passcode_expiry) {
      return NextResponse.json(
        { error: 'Passcode has expired' },
        { status: 401 }
      )
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Create JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    }
    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    const session = await prisma.session.create({
      data: {
        ip,
        user_id: user.id,
        access_token: accessToken,
        refresh_token: refreshToken
      }
    })

    // Clear passcode after successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passcode: null,
        passcode_expiry: null
      }
    })

    const response = NextResponse.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    })
  
    response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
    
    return response
  } catch (error) {
    console.error('Error verifying passcode:', error)
    return NextResponse.json(
      { error: 'Failed to verify passcode' },
      { status: 500 }
    )
  }
}