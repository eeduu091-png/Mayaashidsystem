import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const territories = await db.territory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(territories)
  } catch (error) {
    console.error('Error fetching territories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch territories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, regionId } = body

    const territory = await db.territory.create({
      data: { name, regionId },
    })

    return NextResponse.json(territory, { status: 201 })
  } catch (error) {
    console.error('Error creating territory:', error)
    return NextResponse.json(
      { error: 'Failed to create territory' },
      { status: 500 }
    )
  }
}
