import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'

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

    // First check if post exists and hasn't expired
    const existingPost = await db.post.findUnique({
      where: { id: params.id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Calculate if post has expired
    const createdAt = new Date(existingPost.createdAt)
    const lifespan = existingPost.lifespan + (existingPost.likes * 5) + existingPost.views
    const expiresAt = new Date(createdAt.getTime() + (lifespan * 1000))

    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Post has expired' },
        { status: 410 }
      )
    }

    // Update post with new like
    const post = await db.post.update({
      where: { id: params.id },
      data: {
        likes: { increment: 1 },
        lifespan: { increment: 5 }, // Each like adds 5 seconds
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Calculate new expiry time
    const newLifespan = post.lifespan + (post.likes * 5) + post.views
    const newExpiresAt = new Date(post.createdAt.getTime() + (newLifespan * 1000))

    return NextResponse.json({
      ...post,
      expiresAt: newExpiresAt.toISOString(),
      likedByMe: true,
    })
  } catch (error) {
    console.error('Error liking post:', error)
    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    )
  }
}
