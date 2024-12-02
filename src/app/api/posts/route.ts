import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'

const GLOBAL_POST_CAP = 10000

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get('cursor')
  const limit = parseInt(searchParams.get('limit') || '10')
  const following = searchParams.get('following') === 'true'

  try {
    const session = await getServerSession()

    const posts = await db.post.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        createdAt: 'desc',
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

    // Calculate expiry time and likes for each post
    const postsWithMetadata = posts.map(post => {
      const createdAt = new Date(post.createdAt)
      const lifespan = post.lifespan + (post.likes * 5) + (post.views)
      const expiresAt = new Date(createdAt.getTime() + (lifespan * 1000))

      return {
        ...post,
        expiresAt: expiresAt.toISOString(),
        likedByMe: false, // We'll implement this later
      }
    })

    // Filter out expired posts
    const now = new Date()
    const validPosts = postsWithMetadata.filter(post => {
      const expiresAt = new Date(post.expiresAt)
      return expiresAt > now
    })

    const nextCursor = validPosts.length === limit ? validPosts[validPosts.length - 1].id : null

    return NextResponse.json({ posts: validPosts, nextCursor })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const json = await req.json()
    const { content } = json

    // Check global post cap
    const totalPosts = await db.post.count()
    if (totalPosts >= GLOBAL_POST_CAP) {
      // Remove oldest post with least engagement
      const oldestPost = await db.post.findFirst({
        orderBy: [
          {
            likes: 'asc',
          },
          {
            createdAt: 'asc',
          },
        ],
      })

      if (oldestPost) {
        await db.post.delete({
          where: { id: oldestPost.id },
        })
      }
    }

    // Create new post
    const post = await db.post.create({
      data: {
        content,
        authorId: session.user.id,
        lifespan: 10, // 10 seconds initial lifespan
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

    // Add expiry time
    const expiresAt = new Date(post.createdAt.getTime() + (post.lifespan * 1000))
    const postWithMetadata = {
      ...post,
      expiresAt: expiresAt.toISOString(),
      likedByMe: false,
    }

    return NextResponse.json(postWithMetadata)
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
