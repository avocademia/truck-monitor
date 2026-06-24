import { NextRequest, NextResponse } from 'next/server'
//import { prisma } from '@/lib/prisma'
//import { InspectionItemStatus } from '@prisma/client'

// GET /api/inspections/[id] - Get a single inspection
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    /*
    const { id } = await params
    const inspection = await prisma.inspection.findUnique({
      where: { id },
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
    */
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    //populate
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    //populate
  } catch (error) {
    console.error('Error deleting inspection:', error)
    return NextResponse.json(
      { error: 'Failed to delete inspection' },
      { status: 500 }
    )
  }
}
