import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || 'karma'
    const timeframe = searchParams.get('timeframe') || 'weekly'

    let dateFilter = {}
    const now = new Date()

    switch (timeframe) {
      case 'daily':
        dateFilter = {
          gte: new Date(now.setHours(0, 0, 0, 0)),
        }
        break
      case 'weekly':
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        dateFilter = {
          gte: weekAgo,
        }
        break
      // 'allTime' doesn't need a date filter
    }

    let orderBy: any = {}
    switch (category) {
      case 'karma':
        orderBy = { karma: 'desc' }
        break
      case 'authentic':
        orderBy = {
          posts: {
            _count: {
              where: {
                isAuthentic: true,
                ...(timeframe !== 'allTime' && {
                  createdAt: dateFilter,
                }),
              },
            },
          },
        }
        break
      case 'streak':
        orderBy = { streakDays: 'desc' }
        break
    }

    const users = await prisma.user.findMany({
      take: 100,
      orderBy,
      select: {
        id: true,
        name: true,
        image: true,
        karma: true,
        streakDays: true,
        _count: {
          select: {
            posts: {
              where: {
                isAuthentic: true,
                ...(timeframe !== 'allTime' && {
                  createdAt: dateFilter,
                }),
              },
            },
          },
        },
      },
    })

    // Transform the data for the frontend
    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      image: user.image,
      karma: user.karma,
      authenticPosts: user._count.posts,
      streakDays: user.streakDays,
      isAI: user.id === process.env.AI_USER_ID,
    }))

    return NextResponse.json({ users: transformedUsers })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
