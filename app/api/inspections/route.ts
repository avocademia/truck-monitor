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
        vehicleRegistration: body.vehicleRegistration,
        vehicleMake: body.vehicleMake,
        edmReading: body.edmReading,
        trailerRegistration: body.trailerRegistration,
        driverName: body.driverName,
        driverAge: body.driverAge,
        licenceExpiryDate: body.licenceExpiryDate,
        tripFrom: body.tripFrom,
        tripTo: body.tripTo,
        consignee: body.consignee,
        cargoType: body.cargoType,
        hazmat: body.hazmat || false,
        loadSecured: body.loadSecured,
        driverCellPhone: body.driverCellPhone,
        driverComments: body.driverComments,
        inspectorComments: body.inspectorComments,
        inspectedBySignature: body.inspectedBySignature,
        inspectedByDate: body.inspectedByDate,
        approvedBySignature: body.approvedBySignature,
        approvedByDate: body.approvedByDate,
        approvedByTime: body.approvedByTime,
        items: body.items ? {
          create: body.items,
        } : undefined,
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(inspection, { status: 201 })
  } catch (error) {
    console.error('Error creating inspection:', error)
    return NextResponse.json(
      { error: 'Failed to create inspection' },
      { status: 500 }
    )
  }
}
