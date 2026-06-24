import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vehicles/[id]/inspections - Get inspections for a specific vehicle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const {id} = await params

    const inspections = await prisma.inspection.findMany({
      where: { vehicle_id: id},
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
        },
        approved_by: {
          select: {
            id: true,
            first_name: true,
            last_name: true
          }
        },
        items: true
      },
      orderBy: {
        created_at: 'desc'
      },
      take: limit,
      skip: offset
    })

    const totalCount = await prisma.inspection.count({
      where: { vehicle_id: id }
    })

    return NextResponse.json({
      inspections,
      totalCount,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching vehicle inspections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle inspections' },
      { status: 500 }
    )
  }
}
