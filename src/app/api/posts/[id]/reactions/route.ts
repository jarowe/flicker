import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { calculateLifespanExtension } from '@/lib/utils'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const json = await req.json()
    const { type } = json

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        reactions: {
          where: {
            userId: session.user.id,
            type,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if user already reacted
    if (post.reactions.length > 0) {
      return NextResponse.json(
        { error: 'Already reacted' },
        { status: 400 }
      )
    }

    // Create reaction and extend post lifespan
    const extension = calculateLifespanExtension('reaction', post.isAuthentic)
    const [reaction] = await prisma.$transaction([
      prisma.reaction.create({
        data: {
          type,
          postId: params.id,
          userId: session.user.id,
        },
      }),
      prisma.post.update({
        where: { id: params.id },
        data: {
          expiresAt: new Date(post.expiresAt.getTime() + extension * 1000),
        },
      }),
    ])

    return NextResponse.json(reaction)
  } catch (error) {
    console.error('Error creating reaction:', error)
    return NextResponse.json(
      { error: 'Failed to create reaction' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    if (!type) {
      return NextResponse.json(
        { error: 'Reaction type is required' },
        { status: 400 }
      )
    }

    const reaction = await prisma.reaction.findFirst({
      where: {
        postId: params.id,
        userId: session.user.id,
        type,
      },
    })

    if (!reaction) {
      return NextResponse.json(
        { error: 'Reaction not found' },
        { status: 404 }
      )
    }

    await prisma.reaction.delete({
      where: { id: reaction.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting reaction:', error)
    return NextResponse.json(
      { error: 'Failed to delete reaction' },
      { status: 500 }
    )
  }
}
