import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (query) {
      // Search by ID number prefix (min 5 digits)
      const workers = await db.worker.findMany({
        where: {
          idNumber: {
            startsWith: query,
          },
        },
        take: 10,
      })
      return NextResponse.json(workers)
    }

    // Get all workers
    const workers = await db.worker.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(workers)
  } catch (error) {
    console.error('Error fetching workers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { idNumber, name, phoneNumber, territory, region, team, role } = body

    const worker = await db.worker.create({
      data: {
        idNumber,
        name,
        phoneNumber,
        territory,
        region,
        team,
        role: role || 'Brand Ambassador',
      },
    })

    return NextResponse.json(worker, { status: 201 })
  } catch (error) {
    console.error('Error creating worker:', error)
    return NextResponse.json(
      { error: 'Failed to create worker' },
      { status: 500 }
    )
  }
}
