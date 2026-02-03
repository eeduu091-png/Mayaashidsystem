import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const regions = await db.region.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(regions)
  } catch (error) {
    console.error('Error fetching regions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch regions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    const region = await db.region.create({
      data: { name },
    })

    return NextResponse.json(region, { status: 201 })
  } catch (error) {
    console.error('Error creating region:', error)
    return NextResponse.json(
      { error: 'Failed to create region' },
      { status: 500 }
    )
  }
}
