import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vehicles/[id] - Get single vehicle with details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: id },
      include: {
        assigned_driver: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            license_exp_date: true,
            dob: true
          }
        },
        attached_trailer: {
          select: {
            id: true,
            registration_no: true,
            make: true,
            model: true,
            year: true,
            body_type: true,
            status: true
          }
        },
        attached_to_truck: {
          select: {
            id: true,
            registration_no: true,
            make: true,
            model: true
          }
        },
        inspections: {
          take: 10,
          orderBy: {
            created_at: 'desc'
          },
          include: {
            driver: {
              select: {
                id: true,
                first_name: true,
                last_name: true
              }
            },
            inspector: {
              select: {
                id: true,
                first_name: true,
                last_name: true
              }
            }
          }
        },
        _count: {
          select: {
            inspections: true
          }
        }
      }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    )
  }
}

// PUT /api/vehicles/[id] - Update vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params
    const body = await request.json()
    const {
      registration_no,
      registration_country,
      make,
      model,
      year,
      body_type,
      status,
      capacity_kg,
      capacity_m3,
      current_odometer,
      attached_trailer_id,
      assigned_driver_id
    } = body

    const vehicle = await prisma.vehicle.update({
      where: {id},
      data: {
        registration_no,
        registration_country,
        make,
        model,
        year,
        body_type,
        status,
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

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    )
  }
}

// DELETE /api/vehicles/[id] - Delete vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params
  try {
    await prisma.vehicle.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    )
  }
}
