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
        hazmat: body.hazmat,
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
          deleteMany: {},
          create: body.items,
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
