import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/inspections - Get all inspections
export async function GET() {
  try {
    const inspections = await prisma.inspection.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
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
        vehicleRegistration: body.header.vehicleRegistration,
        vehicleMake: body.header.vehicleMake,
        edmReading: body.header.edmReading,
        trailerRegistration: body.header.trailerRegistration,
        driverName: body.header.driverName,
        driverAge: body.header.driverAge,
        licenceExpiryDate: body.header.licenceExpiryDate,
        tripFrom: body.header.tripFrom,
        tripTo: body.header.tripTo,
        consignee: body.header.consignee,
        cargoType: body.header.cargoType,
        hazmat: body.header.hazmat || false,
        loadSecured: body.loadSecured,
        driverCellPhone: body.driverCellPhone,
        driverComments: body.driverComments,
        inspectorComments: body.inspectorComments,
        inspectedBySignature: body.inspectedBySignature,
        inspectedByDate: body.inspectedByDate,
        approvedBySignature: body.approvedBySignature,
        approvedByDate: body.approvedByDate,
        approvedByTime: body.approvedByTime,
        items: {
          create: Object.entries(body.statuses || {}).map(([itemKey, status]) => ({
            itemKey,
            status: status as string | null,
          })),
        },
      },
      include: {
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
