import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vehicles - List all vehicles or search by registration
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
            id: true,
            registration_no: true,
            make: true,
            model: true,
            body_type: true
          }
        },
        _count: {
          select: {
            inspections: true
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

// POST /api/vehicles - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      registration_no,
      registration_country,
      make,
      model,
      year,
      body_type,
      capacity_kg,
      capacity_m3,
      current_odometer,
      attached_trailer_id,
      assigned_driver_id
    } = body

    if (!registration_no || !registration_country || !body_type) {
      return NextResponse.json(
        { error: 'Registration number, country, and body type are required' },
        { status: 400 }
      )
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        registration_no,
        registration_country,
        make,
        model,
        year,
        body_type,
        capacity_kg,
        capacity_m3,
        current_odometer,
        attached_trailer_id,
        assigned_driver_id
      },
      include: {
        assigned_driver: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
          }
        },
        attached_trailer: {
          select: {
            id: true,
            registration_no: true,
            make: true,
            model: true
          }
        }
      }
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}
