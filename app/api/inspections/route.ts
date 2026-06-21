import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/inspections - Get all inspections
export async function GET() {
  try {
    const inspections = await prisma.inspection.findMany({
      include: {
        vehicle: {
          select: {
            id: true,
            registration_no: true,
            make: true,
            model: true,
            body_type: true,
          }
        },
        driver: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        },
        inspector: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        },
        approved_by: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        },
        items: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return NextResponse.json(inspections)
  } catch (error) {
    console.error('Error fetching inspections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inspections' },
      { status: 500 }
    )
  }
}

// POST /api/inspections - Create a new inspection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const inspection = await prisma.inspection.create({
      data: {
        type: 'PRE_TRIP',
        vehicle_id: body.vehicleId,
        driver_id: body.driverId,
        inspector_id: body.inspectorId,
        trip_from: body.header.tripFrom,
        trip_to: body.header.tripTo,
        consignee: body.header.consignee,
        hazmat: body.header.hazmat || false,
        load_secured: body.loadSecured === 'yes',
        driver_comments: body.driverComments,
        inspector_comments: body.inspectorComments,
        inspection_status: 'SUBMITTED',
        items: {
          create: Object.entries(body.statuses || {})
            .filter(([_, status]) => status !== null)
            .map(([itemKey, status]) => ({
            item_key: itemKey,
            status: (status as string).toUpperCase() as 'OK' | 'ATTENTION' | 'NOT_APPLICABLE',
          })),
        },
      },
      include: {
        vehicle: {
          select: {
            id: true,
            registration_no: true,
            make: true,
            model: true,
            body_type: true,
          }
        },
        driver: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        },
        inspector: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          }
        },
        items: true,
      },
    })

    return NextResponse.json(inspection, { status: 201 })
  } catch (error) {
    console.error('Error creating inspection:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to create inspection', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
