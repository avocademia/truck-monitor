import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/inspections/[id] - Get a single inspection
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inspection = await prisma.inspection.findUnique({
      where: { id: params.id },
      include: {
        items: true,
      },
    })

    if (!inspection) {
      return NextResponse.json(
        { error: 'Inspection not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(inspection)
  } catch (error) {
    console.error('Error fetching inspection:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inspection' },
      { status: 500 }
    )
  }
}

// PUT /api/inspections/[id] - Update an inspection
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const inspection = await prisma.inspection.update({
      where: { id: params.id },
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
        hazmat: body.header.hazmat,
        loadSecured: body.loadSecured,
        driverCellPhone: body.driverCellPhone,
        driverComments: body.driverComments,
        inspectorComments: body.inspectorComments,
        inspectedBySignature: body.inspectedBySignature,
        inspectedByDate: body.inspectedByDate,
        approvedBySignature: body.approvedBySignature,
        approvedByDate: body.approvedByDate,
        approvedByTime: body.approvedByTime,
        items: body.statuses ? {
          deleteMany: {},
          create: Object.entries(body.statuses).map(([itemKey, status]) => ({
            itemKey,
            status: status as string | null,
          })),
        } : undefined,
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(inspection)
  } catch (error) {
    console.error('Error updating inspection:', error)
    return NextResponse.json(
      { error: 'Failed to update inspection' },
      { status: 500 }
    )
  }
}

// DELETE /api/inspections/[id] - Delete an inspection
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.inspection.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting inspection:', error)
    return NextResponse.json(
      { error: 'Failed to delete inspection' },
      { status: 500 }
    )
  }
}
