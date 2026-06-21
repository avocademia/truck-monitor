import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken } from './lib/jwt'
import { prisma } from './lib/prisma'

// Define protected routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/auth', '/']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('access_token')?.value

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If accessing protected route without token, redirect to auth
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // If accessing auth route with valid token, redirect to dashboard
  if (isPublicRoute && accessToken && pathname === '/auth') {
    try {
      const payload = verifyAccessToken(accessToken)
      const session = await prisma.session.findFirst({
        where: {
          access_token: accessToken,
          expired: false
        }
      })

      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      // Token is invalid, continue to auth page
    }
  }

  // If accessing protected route with token, validate it
  if (isProtectedRoute && accessToken) {
    try {
      const payload = verifyAccessToken(accessToken)
      
      // Verify session exists in database
      const session = await prisma.session.findFirst({
        where: {
          access_token: accessToken,
          expired: false
        }
      })

      if (!session) {
        // Session not found, redirect to auth
        const response = NextResponse.redirect(new URL('/auth', request.url))
        response.cookies.delete('access_token')
        return response
      }

      // Token is valid, allow access
      const response = NextResponse.next()
      
      // Add user info to headers for use in pages
      response.headers.set('x-user-id', payload.userId.toString())
      response.headers.set('x-user-email', payload.email)
      response.headers.set('x-user-role', payload.role)
      
      return response
    } catch (error) {
      // Token is expired or invalid, try to refresh
      try {
        const refreshResponse = await fetch(new URL('/api/auth/refresh-token', request.url), {
          method: 'POST',
          headers: {
            Cookie: request.headers.get('cookie') || ''
          }
        })

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json()
          
          // Create response with new token
          const response = NextResponse.next()
          
          // Set new access token from refresh response
          const newAccessToken = refreshData.accessToken
          response.cookies.set('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 // 1 hour
          })

          // Add user info to headers
          const payload = verifyAccessToken(newAccessToken)
          response.headers.set('x-user-id', payload.userId.toString())
          response.headers.set('x-user-email', payload.email)
          response.headers.set('x-user-role', payload.role)
          
          return response
        } else {
          // Refresh failed, redirect to auth
          const response = NextResponse.redirect(new URL('/auth', request.url))
          response.cookies.delete('access_token')
          return response
        }
      } catch (refreshError) {
        // Refresh failed, redirect to auth
        const response = NextResponse.redirect(new URL('/auth', request.url))
        response.cookies.delete('access_token')
        return response
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (we handle those in the routes themselves)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
