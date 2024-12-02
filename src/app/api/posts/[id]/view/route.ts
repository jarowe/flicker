import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        views: { increment: 1 },
        lifespan: { increment: 1 }, // Each view adds 1 second
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error recording view:', error)
    return NextResponse.json(
      { error: 'Failed to record view' },
      { status: 500 }
    )
  }
}
