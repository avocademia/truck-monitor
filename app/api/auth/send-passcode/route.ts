import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/mailgun'

// Generate a 6-character alphanumeric passcode
function generatePasscode(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let passcode = '';
  for (let i = 0; i < 6; i++) {
    passcode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return passcode;
}

// POST /api/auth/send-passcode - Send passcode to user email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate passcode
    const passcode = generatePasscode()
    const expiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now

    // Update user with passcode
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passcode,
        passcode_expiry: expiry
      }
    })

    // Send email with passcode
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Login Passcode</h2>
        <p style="color: #666;">Use the following passcode to log in to Truck Monitor:</p>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${passcode}</span>
        </div>
        <p style="color: #666; font-size: 14px;">This passcode will expire in 15 minutes.</p>
        <p style="color: #999; font-size: 12px;">If you did not request this passcode, please ignore this email.</p>
      </div>
    `

    await sendEmail(email, 'Your Truck Monitor Login Passcode', emailHtml)

    return NextResponse.json({ 
      success: true,
      message: 'Passcode sent successfully'
    })
  } catch (error) {
    console.error('Error sending passcode:', error)
    return NextResponse.json(
      { error: 'Failed to send passcode' },
      { status: 500 }
    )
  }
}
