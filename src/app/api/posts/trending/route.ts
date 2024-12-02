import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get posts from the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const trendingPosts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: oneDayAgo,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },
      orderBy: [
        {
          reactions: {
            _count: 'desc',
          },
        },
        {
          comments: {
            _count: 'desc',
          },
        },
      ],
      take: 20,
    })

    // Calculate engagement score for each post
    const postsWithScore = trendingPosts.map((post) => {
      const timeAlive = Date.now() - post.createdAt.getTime()
      const hoursAlive = timeAlive / (1000 * 60 * 60)
      
      // Engagement score formula:
      // (reactions * 1 + comments * 2) / hours_alive^1.5
      const engagementScore =
        (post._count.reactions + post._count.comments * 2) /
        Math.pow(Math.max(hoursAlive, 1), 1.5)

      return {
        ...post,
        engagementScore,
      }
    })

    // Sort by engagement score
    postsWithScore.sort((a, b) => b.engagementScore - a.engagementScore)

    return NextResponse.json({ posts: postsWithScore })
  } catch (error) {
    console.error('Error fetching trending posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending posts' },
      { status: 500 }
    )
  }
}
