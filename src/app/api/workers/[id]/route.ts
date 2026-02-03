import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const worker = await db.worker.findUnique({
      where: { id: params.id },
    })

    if (!worker) {
      return NextResponse.json(
        { error: 'Worker not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(worker)
  } catch (error) {
    console.error('Error fetching worker:', error)
    return NextResponse.json(
      { error: 'Failed to fetch worker' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const worker = await db.worker.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(worker)
  } catch (error) {
    console.error('Error updating worker:', error)
    return NextResponse.json(
      { error: 'Failed to update worker' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.worker.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting worker:', error)
    return NextResponse.json(
      { error: 'Failed to delete worker' },
      { status: 500 }
    )
  }
}
