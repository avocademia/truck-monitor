import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vehicles - Search vehicles by registration
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')

    const vehicles = await prisma.vehicle.findMany({
      where: search
        ? {
            registration_no: {
              contains: search
            }
          }
        : undefined,
      include: {
        assigned_driver: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            license_exp_date: true
          }
        },
        attached_trailer: {
          select: {
            registration_no: true,
            make: true,
            model: true
          }
        }
      },
      orderBy: {
        registration_no: 'asc'
      }
    })

    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}
